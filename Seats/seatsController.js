// controllers/seatController.js
const Seat = require('./seatsModal');
const Bus = require('../Bus/busModal');
const Schedule = require('../Schedule/scheduleModal');
const Booking = require('../Booking/bookingModal');

let io;

function init(socketIO) {
    io = socketIO;
  
    // Your Socket.io logic for seat selection
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);
  
      // Add the connected user to the controller
      addUser(socket);
  
      // Handle seat selection events
      socket.on('selectSeat', async (seatId) => {
        try {
          // Fetch seat information
          const seat = await Seat.findById(seatId);
  
          if (seat && !seat.booked) {
            seat.booked = true;
            await seat.save();
  
            // Notify booking controller to start the booking process
            const booking = await bookingController.startBookingProcess(socket, seatId);
  
            // Broadcast the updated seat selection and booking information to all clients
            io.emit('seatSelected', { seatId, userId: socket.id, booking });
  
            res.json({ success: true, message: 'Seat selected successfully', booking });
          } else {
            res.json({ success: false, message: 'Seat not available or already booked' });
          }
        } catch (error) {
          console.error('Error selecting seat:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
      });
  
      // Add more socket.io event handlers if needed
    });
  }

const addUser = (socket) => {
  // Your logic to handle adding a user to the system
  // For example, you might want to store user information or perform other actions
};


const removeUser = (socket) => {
    // Your logic to handle adding a user to the system
    // For example, you might want to store user information or perform other actions
  };



const getUnavailableSeats = async (busId) => {
  try {
    // Find the bus and its schedule
    const bus = await Bus.findById(busId);
    if (!bus) {
      return { success: false, message: 'Bus not found' };
    }

    const schedule = await Schedule.findOne({ bus: busId });
    if (!schedule) {
      return { success: false, message: 'Schedule not found for the bus' };
    }

    // Find booked seats for the given schedule
    const bookedSeats = await Booking.find({ schedule: schedule._id }).distinct('seat');

    // You may need to adjust the Seat model and the structure of your data accordingly
    const unavailableSeatsData = await Seat.find({ seatNumber: { $in: bookedSeats }, booked: true });

    return { success: true, seats: unavailableSeatsData };
  } catch (error) {
    console.error('Error fetching unavailable seats:', error);
    return { success: false, message: 'Internal Server Error' };
  }
};

const selectSeat = async (req, res) => {
  const { busId } = req.params;
  const { seatId } = req.body;

  if (!seatId) {
    return res.status(400).json({ success: false, message: 'Invalid seatId' });
  }

  try {
    const seat = await Seat.findById(seatId);

    if (seat && !seat.booked) {
      seat.booked = true;
      await seat.save();

      // Create a new booking with a pending status
      const booking = new Booking({
        seat: seatId,
        booked: false,
        status: 'pending',
      });

      await booking.save();

      // Set a timeout for the booking process (e.g., 5 minutes)
      const bookingTimeout = 5 * 60 * 1000; // 5 minutes

      setTimeout(async () => {
        // Check if the booking was confirmed within the timeout period
        const confirmedBooking = await Booking.findById(booking._id);

        if (confirmedBooking && confirmedBooking.status === 'pending') {
          // If not confirmed, release the seat
          seat.booked = false;
          await seat.save();

          // Update the booking status to cancelled
          confirmedBooking.status = 'cancelled';
          await confirmedBooking.save();
        }
      }, bookingTimeout);

      res.json({ success: true, message: 'Seat selected successfully', booking });
    } else {
      res.json({ success: false, message: 'Seat not available or already booked' });
    }
  } catch (error) {
    console.error('Error selecting seat:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getSeatById = async (req, res) => {
  const seatId = parseInt(req.params.id);

  if (isNaN(seatId)) {
    return res.status(400).json({ success: false, message: 'Invalid seatId' });
  }

  try {
    const seat = await Seat.findById(seatId);

    if (seat) {
      res.json({ seat });
    } else {
      res.status(404).json({ success: false, message: 'Seat not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  init,
  addUser,
  removeUser,
  getUnavailableSeats,
  selectSeat,
  getSeatById,
};

// controllers/seatController.js
const Seat = require('./seatsModal');
const Bus = require('../Bus/busModal'); 
const Schedule = require('../Schedule/scheduleModal'); 
const Booking = require('../Booking/bookingModal'); 


const getAvailableSeats = async (req, res) => {
    const { busId } = req.params;
  
    try {
      // Find the bus and its schedule
      const bus = await Bus.findById(busId);
      if (!bus) {
        return res.status(404).json({ success: false, message: 'Bus not found' });
      }
  
      const schedule = await Schedule.findOne({ bus: busId });
      if (!schedule) {
        return res.status(404).json({ success: false, message: 'Schedule not found for the bus' });
      }
  
      // Find booked seats for the given schedule
      const bookedSeats = await Booking.find({ schedule: schedule._id }).distinct('seat');
  
      // Get all seat numbers for the bus
      const allSeatNumbers = Array.from({ length: bus.numberOfSeats }, (_, index) => (index + 1).toString());
  
      // Identify available seats by filtering out booked seats
      const availableSeats = allSeatNumbers.filter(seatNumber => !bookedSeats.includes(seatNumber));
  
      // You may need to adjust the Seat model and the structure of your data accordingly
      const availableSeatsData = await Seat.find({ seatNumber: { $in: availableSeats }, booked: false });
  
      res.json({ success: true, seats: availableSeatsData });
    } catch (error) {
      console.error('Error fetching available seats:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

const selectSeat = async (req, res) => {
  const { seatId } = req.body;

  if (!seatId) {
    return res.status(400).json({ success: false, message: 'Invalid seatId' });
  }

  try {
    const seat = await Seat.findById(seatId);

    if (seat && !seat.booked) {
      seat.booked = true;
      await seat.save();
      res.json({ success: true, message: 'Seat selected successfully' });
    } else {
      res.json({ success: false, message: 'Seat not available or already booked' });
    }
  } catch (error) {
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
  getAvailableSeats,
  selectSeat,
  getSeatById,
};

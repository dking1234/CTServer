const Booking = require('./bookingModal');
const Schedule = require('../Schedule/scheduleModal');
// Function to create a new booking
const bookSeat = async (req, res) => {
  try {
    const { scheduleId, seatNumber, userId } = req.body;

    // Check if the schedule exists
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    // Check if the seat is available
    const existingBooking = await Booking.findOne({ schedule: scheduleId, seatNumber });

    if (!existingBooking || !existingBooking.booked) {
      // If the seat is not booked, create and save a new seat
      const seat = new Seat({
        schedule: scheduleId,
        seatNumber,
        booked: false, // Assuming the seat is initially not booked
      });

      await seat.save();

      // Update the seatsBooked count
      schedule.seatsBooked += 1;
      await schedule.save();

      // Book the seat with a pending status
      const booking = new Booking({
        schedule: scheduleId,
        seatNumber,
        userId,
        booked: false,
        status: 'pending',
      });

      await booking.save();

      // Set a timeout for payment confirmation
      const paymentTimeout = 5 * 60 * 1000; // 5 minutes
      setTimeout(async () => {
        // Check if the payment was confirmed within the timeout period
        const confirmedBooking = await Booking.findById(booking._id);
        if (confirmedBooking && confirmedBooking.status === 'pending') {
          // If not confirmed, release the seat
          schedule.seatsBooked -= 1;
          await schedule.save();

          // Update the booking status to cancelled
          confirmedBooking.status = 'cancelled';
          await confirmedBooking.save();
        }
      }, paymentTimeout);

      res.json({ success: true, message: 'Seat booked with pending status', booking });
    } else {
      // Seat is already booked
      // You can update the existing booking information here
      existingBooking.status = 'pending'; // Update the status or any other fields as needed
      await existingBooking.save();

      return res.json({ success: true, message: 'Seat already booked', booking: existingBooking });
    }
  } catch (error) {
    console.error('Error booking seat:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

  
// Function to get a list of all bookings
const getAllBookings = async (req, res) => {
  try {
    // Retrieve all bookings from the database
    const bookings = await Booking.find();

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Function to get a single booking by ID
const getBookingsByUser = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user').populate('busSchedule');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to update the booking status (confirm, cancel, etc.)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Check if the booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if the booking is in pending status
    if (booking.status === 'pending') {
      // Update the booking status to booked
      booking.status = 'booked';
      await booking.save();

      res.json({ success: true, message: 'Payment confirmed successfully', booking });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by ID and update the status to 'cancelled'
    const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'cancelled' }, { new: true });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


module.exports = {
  bookSeat,
  getAllBookings,
  getBookingsByUser,
  updateBookingStatus,
  confirmPayment,
  cancelBooking,
};

const Booking = require('./bookingModal');
const BusSchedule = require('../Schedule/scheduleModal');
// Function to create a new booking
const createBooking = async (req, res) => {
  try {
    const { user, busSchedule, seats } = req.body;

    // Check if the selected seats are available
    const isAvailable = await areSeatsAvailable(busSchedule, seats);

    if (!isAvailable) {
      return res.status(400).json({ message: 'Selected seats are not available' });
    }

    // Create a new booking instance with a timestamp
    const booking = new Booking({
      user,
      busSchedule,
      seats,
      createdAt: new Date(),
    });

    // Save the booking to the database
    await booking.save();

    // Update seat availability status
    await updateSeatAvailability(busSchedule, seats, false);

    // Schedule a timeout to release the booking after 5 minutes
    setTimeout(async () => {
      // Check if the booking still exists and hasn't been processed
      const existingBooking = await Booking.findById(booking._id);

      if (existingBooking) {
        // If the booking is still present, release it
        await existingBooking.deleteOne();
        
        // Update seat availability status
        await updateSeatAvailability(busSchedule, seats, true);

        res.status(200).json({ message: 'Booking released due to timeout' });
      }
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to check if selected seats are available
const areSeatsAvailable = async (busSchedule, selectedSeats) => {
  // Retrieve the bus schedule information, including seat availability
  const schedule = await BusSchedule.findById(busSchedule).populate('bus');

  // Check if all selected seats are available
  return selectedSeats.every((seat) => {
    return !schedule.bus.seatsBooked.includes(seat);
  });
};

// Function to update seat availability status
const updateSeatAvailability = async (busSchedule, selectedSeats, releaseSeats) => {
  try {
    const schedule = await BusSchedule.findById(busSchedule);
    
    // Update the seatsBooked array based on the action (book or release)
    if (releaseSeats) {
      schedule.bus.seatsBooked = schedule.bus.seatsBooked.filter(seat => !selectedSeats.includes(seat));
    } else {
      schedule.bus.seatsBooked = [...schedule.bus.seatsBooked, ...selectedSeats];
    }

    await schedule.save();
  } catch (error) {
    console.error('Error updating seat availability:', error);
    throw new Error('Failed to update seat availability');
  }
};
  
// Function to get a list of all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').populate('busSchedule');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to get a single booking by ID
const getBookingById = async (req, res) => {
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

// Function to delete a booking by ID
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  updateSeatAvailability,
  areSeatsAvailable
};

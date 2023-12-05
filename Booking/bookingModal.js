const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who made the booking
    required: true,
  },
  busSchedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusSchedule', // Reference to the bus schedule that was booked
    required: true,
  },
  seats: [String], // An array of seat numbers that were booked
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'], // Booking status
    default: 'pending',
  },
  bookingDate: {
    type: Date,
    default: Date.now, // Date and time when the booking was made
  },
  // Additional fields can be added, such as payment details, price, etc.
});

module.exports = mongoose.model('Booking', bookingSchema);

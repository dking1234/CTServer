const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  busSchedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusSchedule', // Reference to the BusSchedule model
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'completed'], // Ticket status options
    default: 'booked',
  },
  // You can add additional fields for further details
});

module.exports = mongoose.model('Ticket', ticketSchema);

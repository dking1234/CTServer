// TicketModal.js
const mongoose = require('mongoose');

// Define the Ticket schema
const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Replace 'User' with the actual model name for your user schema
    required: true,
  },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule', // Replace 'Schedule' with the actual model name for your schedule schema
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String, // Change the type to match your requirements (e.g., Date, String)
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  boardingPoint: {
    type: String, // Add a field for boarding point
    required: true,
  },
  droppingPoint: {
    type: String, // Add a field for dropping point
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

// Create the Ticket model
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;

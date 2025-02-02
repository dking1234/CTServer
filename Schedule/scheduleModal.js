const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
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
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seatsBooked: {
    type: Number,
    required: true,
    default: 0,
  },
  boardingPoints: [
    {
      type: String,
      required: true,
    },
  ],
  droppingPoints: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model('BusSchedule', scheduleSchema);

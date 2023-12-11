
const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  booked: { type: Boolean, default: false },
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;

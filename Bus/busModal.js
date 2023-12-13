const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true, // Bus numbers are typically unique identifiers
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company', // Reference to a Company document
    required: true,
  },
  numberOfSeats: {
    type: Number,
    required: true,
  },
  seatArrangement: {
    type: String, // Could be '2-2', '2-1', etc., or an array if more detail is needed
    required: true,
  },
  busCondition: {
    wifi: {
      type: Boolean,
      default: false,
    },
    charger: {
      type: Boolean,
      default: false,
    },
    drinks: {
      type: Boolean,
      default: false,
    },
    snacks: {
      type: Boolean,
      default: false,
    },
    // Add additional amenities as needed
  },
  classType: {
    type: String,
    required: true,
    enum: ['Economy', 'Luxury', 'First'], // Enum to restrict to certain values
  },
  // Add additional fields as needed
});

module.exports = mongoose.model('Bus', busSchema);

const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Ensure the phone number matches the desired pattern
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  ageGroup: {
    type: String,
    required: [true, 'Age group is required'],
    enum: ['child', 'adult'],
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking', // replace 'Booking' with your booking model name
  }],
});

module.exports = mongoose.model('Passenger', passengerSchema);

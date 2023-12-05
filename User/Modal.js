const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true, // Assumes phone numbers are unique for each user
    trim: true, // Trims whitespace
  },
  username: {
    type: String,
    required: false, // Initially false because the username is added after the phone number
    unique: true, // If you want the usernames to be unique
    trim: true, // Trims whitespace
    minlength: 3, // Sets a minimum length if you require
    maxlength: 30 // Sets a maximum length if you require
  },
  expoPushToken: {
    type: String,
    required: false, // Not every user might have an Expo push token immediately
  },
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phoneNumber: String,
    otp: String,
    expirationTime: Date
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;

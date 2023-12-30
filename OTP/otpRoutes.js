const express = require('express');
const OTP = require('./otpModel'); // Import your OTP model
const router = express.Router(); // Create an instance of the express router

router.post('/verify-otp', async (req, res) => {
    let { otp, phoneNumber } = req.body;

    try {
        const existingOTP = await OTP.findOne({
            otp: otp,
            phoneNumber: phoneNumber,
            expirationTime: { $gt: new Date() }
        });

        console.log('existingOTP:', existingOTP);

        if (existingOTP) {
            // OTP is valid
            res.json({ success: true, message: 'OTP is valid' });
            console.log('OTP is valid:');
        } else {
            // OTP is invalid or expired
            throw new Error('Invalid or expired OTP');
        }
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error('Error:', error);

        // Send a simplified error response
        res.status(400).json({ success: false, error: error.message || 'Internal server error' });
    }
});

module.exports = router; // Export the router instance

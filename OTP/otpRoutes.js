const express = require('express');
const OTP = require('./otpModel'); // Import your OTP model
const router = express.Router(); // Create an instance of the express router

router.post('/verify-otp', async (req, res) => {
    let { otp, phoneNumber } = req.body;

    // Ensure phoneNumber starts with '+255'
    if (!phoneNumber.startsWith('+255')) {
        // Add '+255' to the beginning of the phoneNumber
        phoneNumber = '+255' + phoneNumber;
    }

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
            res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});




module.exports = router; // Export the router instance

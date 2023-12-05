const crypto = require('crypto');
const OTP = require('./otpModel'); // Assuming you have an OTP mongoose model

const generateOTP = () => {
  // Generate a random 4-digit OTP
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const saveOTP = async (phoneNumber, otp) => {
    console.log(phoneNumber, otp);
    try {
        // Save the OTP along with expiration time to the database
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 2); // OTP expires in 2 minutes

        const newOTP = new OTP({
            phoneNumber,
            otp,
            expirationTime
        });

        await newOTP.save();

        // Schedule a cleanup to remove the OTP after 2 minutes
        setTimeout(async () => {
            await OTP.deleteOne({ phoneNumber, otp });
        }, 2 * 60 * 1000); // 2 minutes in milliseconds

    } catch (error) {
        console.error('Error saving OTP:', error);
        throw new Error('An error occurred while saving OTP');
    }
};

module.exports = {
  generateOTP,
  saveOTP,
};

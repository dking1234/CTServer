const otpController = require('../OTP/otpController');
const twilio = require('twilio');

// Set your Twilio account SID, authentication token, and phone number
const twilioAccountSid = 'AC2cdf319ea5250445b31f24e63cfcb5a2';
const twilioAuthToken = '8bdc39f5a160baf4c4bd892c70f1002a';
const twilioPhoneNumber = '+19122920125';

// Initialize the Twilio client
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

const sendNotification = async (phoneNumber, req, res) => {
  try {
    // Generate OTP and save it
    const otp = otpController.generateOTP();
    await otpController.saveOTP(phoneNumber, otp);

    // Compose the message body
    const messageBody = `Your OTP is: ${otp}`;

    // Send the SMS using Twilio
    const message = await twilioClient.messages.create({
      body: messageBody,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    // Log success and Twilio API response
    console.log(`OTP sent successfully to ${phoneNumber}. Response: ${JSON.stringify(message)}`);

    return res.json({ message: 'OTP sent successfully' });

  } catch (error) {
    // Handle errors
    console.error(`Error sending OTP via Twilio: ${error.message}`);
    
    if (error.code) {
      console.error('Twilio error code:', error.code);
    }

    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

module.exports = { sendNotification };

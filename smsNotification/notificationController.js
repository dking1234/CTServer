const axios = require('axios');
const otpController = require('../OTP/otpController');

// Set your Infobip API key and sender ID
const infobipApiKey = '63bcc8ee6d2aca8ad251fb3b42f29e72-7e5e4e85-9347-400e-8113-4dca245e1fa5';
const infobipSenderId = 'InfoSMS';

// Infobip API endpoint URL for advanced SMS
const infobipApiUrl = 'https://z1r8r6.api.infobip.com/sms/2/text/advanced';

const sendNotification = async (phoneNumber, req, res) => { // add req and res here
  try {
    // Generate OTP and save it
    const otp = otpController.generateOTP();
    await otpController.saveOTP(phoneNumber, otp);

    // Compose the message body and encode HTML entities
    const messageBody = `Your OTP is: ${otp}`;

    // Compose Infobip request payload
    const infobipPayload = {
      messages: [
        {
          from: infobipSenderId,
          destinations: [{ to: phoneNumber }],
          text: messageBody,
        },
      ],
    };

    // Send the SMS using Infobip advanced endpoint
    const response = await axios.post(infobipApiUrl, infobipPayload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `App ${infobipApiKey}`,
      },
    });

    // Log success and Infobip API response
    console.log(`OTP sent successfully to ${phoneNumber}. Response: ${JSON.stringify(response.data)}`);

    return res.json({ message: 'OTP sent successfully' }); // send a response

  } catch (error) {
    // Handle errors
    console.error(`Error sending OTP via Infobip: ${error.message}`);
    if (axios.isAxiosError(error)) {
      console.error('Network error:', error.message);
    } else if (error.response) {
      console.error('Infobip API error:', error.response.data);
    }

    return res.status(500).json({ error: 'An unexpected error occurred' }); // send an error response
  }
};

module.exports = { sendNotification };

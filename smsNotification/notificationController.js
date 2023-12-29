const axios = require('axios');
const otpController = require('../OTP/otpController');

// Set your Infobip API key and sender ID
const infobipApiKey = 'f714b38c490a6cbf001432ab7ac7e3a0-ec1062d3-8bea-404d-a649-f583a7f1f2e3';
const infobipSenderId = 'InfoSMS';

// Corrected Infobip API endpoint URL
const infobipApiUrl = 'https://api.infobip.com/sms/1/text/single';

const sendNotification = async (phoneNumber) => {
  try {
    // Generate OTP and save it
    const otp = otpController.generateOTP();
    await otpController.saveOTP(phoneNumber, otp);

    // Compose the message body
    const messageBody = `Your OTP is: ${otp}`;

    // Send the SMS using Infobip
    const response = await axios.post(
      infobipApiUrl,
      {
        from: infobipSenderId,
        to: phoneNumber,
        text: messageBody,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `App ${infobipApiKey}`,
        },
      }
    );

    // Log success and Infobip API response
    console.log(`OTP sent successfully to ${phoneNumber}. Response: ${JSON.stringify(response.data)}`);
    
    return true;
  } catch (error) {
    // Handle errors
    console.error(`Error sending OTP via Infobip: ${error.message}`);
    if (axios.isAxiosError(error)) {
      console.error('Network error:', error.message);
    } else if (error.response) {
      console.error('Infobip API error:', error.response.data);
    }

    return false;
  }
};

module.exports = { sendNotification };

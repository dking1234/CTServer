const axios = require('axios');
const otpController = require('../OTP/otpController');

// Set your Infobip API key and sender ID
const infobipApiKey = 'f714b38c490a6cbf001432ab7ac7e3a0-ec1062d3-8bea-404d-a649-f583a7f1f2e3';
const infobipSenderId = 'InfoSMS';

// Corrected Infobip API endpoint URL
const infobipApiUrl = 'https://api.infobip.com/sms/1/text/single';

const sendNotification = async (phoneNumber) => {
  try {
    const otp = otpController.generateOTP();
    await otpController.saveOTP(phoneNumber, otp);

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

    console.log(`OTP sent successfully to ${phoneNumber}. Response: ${JSON.stringify(response.data)}`);
    
    // Additional logging for debugging
    console.log('Infobip API Response:', response.data);
    
    return true;
  } catch (error) {
    console.error(`Error sending OTP via Infobip: ${error.message}`);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
};

module.exports = { sendNotification };

const axios = require('axios');
const otpController = require('../OTP/otpController');

// Set your Infobip API key and sender ID
const infobipApiKey = '63bcc8ee6d2aca8ad251fb3b42f29e72-7e5e4e85-9347-400e-8113-4dca245e1fa5';
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

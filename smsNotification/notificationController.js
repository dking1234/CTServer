const twilio = require('twilio');
const otpController = require('../OTP/otpController');

// Your Twilio credentials
const accountSid = 'AC2cdf319ea5250445b31f24e63cfcb5a2';
const authToken = '8bdc39f5a160baf4c4bd892c70f1002a';
const twilioPhoneNumber = '+19122920125';

const client = twilio(accountSid, authToken);

const sendNotification = async (phoneNumber) => {
  try {
    const otp = otpController.generateOTP();
    await otpController.saveOTP(phoneNumber, otp);

    const messageBody = `Your OTP is: ${otp}`;

    const message = await client.messages.create({
      body: messageBody,
      from: twilioPhoneNumber,
      to: phoneNumber
    });

    console.log(`OTP sent successfully to ${phoneNumber}. Message SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error(`Error sending OTP via Twilio: ${error.message}`);
    return false;
  }
};

module.exports = { sendNotification };
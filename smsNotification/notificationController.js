const https = require('follow-redirects').https;
const otpController = require('../OTP/otpController');

const infobipApiKey = 'f714b38c490a6cbf001432ab7ac7e3a0-ec1062d3-8bea-404d-a649-f583a7f1f2e3';
const infobipSenderId = 'InfoSMS';
const infobipApiHost = 'z1r8r6.api.infobip.com';
const infobipApiPath = '/sms/2/text/advanced';

const sendNotification = async (phoneNumber) => {
  try {
    // Generate OTP and save it
    const otp = otpController.generateOTP();
    await otpController.saveOTP(phoneNumber, otp);

    // Compose the message body
    const messageBody = `Your OTP is: ${otp}`;

    // Send the SMS using Infobip
    const postData = JSON.stringify({
      messages: [
        {
          destinations: [
            {
              to: phoneNumber,
            },
          ],
          from: infobipSenderId,
          text: messageBody,
        },
      ],
    });

    const options = {
      method: 'POST',
      hostname: infobipApiHost,
      path: infobipApiPath,
      headers: {
        Authorization: `App ${infobipApiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let chunks = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks);
          resolve(JSON.parse(body.toString()));
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });

    // Log success and Infobip API response
    console.log(`OTP sent successfully to ${phoneNumber}. Response: ${JSON.stringify(response)}`);

    return true;
  } catch (error) {
    // Handle errors
    console.error(`Error sending OTP via Infobip: ${error.message}`);
    return false;
  }
};

module.exports = { sendNotification };

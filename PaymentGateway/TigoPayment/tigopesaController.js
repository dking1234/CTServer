const express = require('express');
const router = express.Router();
const axios = require('axios');


const billerPaymentUrl = 'http://10.222.130.104:8095/API/BillerPayment/BillerPay';

const username = 'your_username';
const password = 'your_password';
const token = 'your_token';

const billerPaymentController = async (req, res) => {
  try {

    const { CustomerMSISDN, BillerMSISDN, Amount, Remarks, ReferenceID } = req.body;

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Username: username,
      Password: password,
    };

    const requestBody = {
      CustomerMSISDN,
      BillerMSISDN,
      Amount,
      Remarks,
      ReferenceID,
    };

    const response = await axios.post(billerPaymentUrl, requestBody, { headers });

    const responseData = {
      ResponseCode: response.data.ResponseCode,
      ResponseStatus: response.data.ResponseStatus,
      ResponseDescription: response.data.ResponseDescription,
      ReferenceID: response.data.ReferenceID,
    };

    res.status(200).json(responseData);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      res.status(401).json({ Message: 'Authorization has been denied for this request.' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

router.post('/billerPayment', billerPaymentController);

module.exports = router;

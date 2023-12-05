const express = require('express');
const router = express.Router();
const notificationController = require('./notificationController');

// Define a route for sending notifications
router.post('/send-notification', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    await notificationController.sendNotification(phoneNumber, req, res);

  } catch (error) {
    console.error(`Error in send-notification route: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

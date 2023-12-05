// models/notificationModel.js
const axios = require('axios');

class NotificationModel {
  async sendNotification(data) {
    const url = 'https://test.wese.co.tz:8585/send-notification';
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await axios.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new NotificationModel();

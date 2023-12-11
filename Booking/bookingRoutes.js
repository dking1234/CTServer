// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
  bookSeat,
  cancelBooking,
  updateBookingStatus,
  getBookingsByUser,
  confirmPayment,
  getAllBookings,
} = require('./bookingController');

// Endpoint to create a booking
router.post('/bookings', bookSeat);

// Endpoint to cancel a booking
router.delete('/bookings/:bookingId', cancelBooking);

// Endpoint to update a booking
router.put('/bookings/:bookingId', updateBookingStatus);

// Endpoint to get bookings for a specific user
router.get('/bookings/user/:userId', getBookingsByUser);

// Endpoint to confirm payment for a booking
router.put('/bookings/confirm-payment/:bookingId', confirmPayment);

// Endpoint to get all bookings
router.get('/bookings', getAllBookings);

module.exports = router;

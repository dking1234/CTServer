const express = require('express');
const bookingController = require('../Booking/bookingController');
const roleMiddleware = require('../Middleware/roleMiddleware'); // You may need to adjust the path

const router = express.Router();

// Create a new booking (requires authentication)
router.post('/bookings', bookingController.createBooking);

// Check if selected seats are available
router.post('/bookings/seatsAvailable', bookingController.areSeatsAvailable);

// Update seat availability status
router.post('/bookings/updateSeatAvailability', bookingController.updateSeatAvailability);

// Get a list of all bookings (requires admin or super_admin role)
router.get('/bookings', roleMiddleware(['admin', 'super_admin']), bookingController.getAllBookings);

// Get a single booking by ID (requires admin or super_admin role)
router.get('/bookings/:id', roleMiddleware(['admin', 'super_admin']), bookingController.getBookingById);

// Update the booking status (requires admin or super_admin role)
router.patch('/bookings/:id', roleMiddleware(['admin', 'super_admin']), bookingController.updateBookingStatus);

// Delete a booking by ID (requires admin or super_admin role)
router.delete('/bookings/:id', roleMiddleware(['admin', 'super_admin']), bookingController.deleteBooking);

module.exports = router;

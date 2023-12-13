const express = require('express');
const router = express.Router();
const seatController = require('./seatsController');

router.get('/buses/:busId/available-seats', seatController.getUnavailableSeats);
router.post('/buses/:busId/select', seatController.selectSeat); // Updated route
router.get('/seats/:seatId', seatController.getSeatById);

module.exports = router;

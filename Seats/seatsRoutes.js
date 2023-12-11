// routes/seatRoutes.js
const express = require('express');
const router = express.Router();
const seatController = require('./seatsController');

router.get('/buses/:busId/available-seats', seatController.getAvailableSeats);
router.post('/seats/select', seatController.selectSeat);
router.get('/seats/:seatId', seatController.getSeatById);

module.exports = router;

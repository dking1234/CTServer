const express = require('express');
const {
  createPassenger,
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  deletePassenger
} = require('./passengerController');

const router = express.Router();

router.post('/', createPassenger);
router.get('/', getAllPassengers);
router.get('/:id', getPassengerById);
router.put('/:id', updatePassenger);
router.delete('/:id', deletePassenger);

module.exports = router;

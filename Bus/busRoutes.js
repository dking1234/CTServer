const express = require('express');
const router = express.Router();
const busController = require('./busController');

router.post('/buses', busController.createBus);
router.get('/buses', busController.getAllBuses);
router.get('/buses/:busId', busController.getBusById);
router.put('/buses/:busId', busController.updateBus);
router.delete('/buses/:busId', busController.deleteBus);

module.exports = router;

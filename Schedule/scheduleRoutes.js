const express = require('express');
const router = express.Router();
const {
  createBusSchedule,
  getAllBusSchedules,
  getBusScheduleById,
  updateBusSchedule,
  deleteBusSchedule,
  searchBusSchedules
} = require('./scheduleController');


router.post('/bus-schedules', createBusSchedule);
router.get('/bus-schedules', getAllBusSchedules);
router.get('/bus-schedules/:id', getBusScheduleById);
router.put('/bus-schedules/:id', updateBusSchedule);
router.delete('/bus-schedules/:id', deleteBusSchedule);
router.post('/bus-schedules/search', searchBusSchedules);


module.exports = router;

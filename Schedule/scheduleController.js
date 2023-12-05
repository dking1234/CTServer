const BusSchedule = require('./scheduleModal');
const Bus = require('../Bus/busModal');

// Create a new bus schedule
const createBusSchedule = async (req, res) => {
  try {
    // Assume busId is passed in the request to link the schedule to a bus
    const { busId, origin, destination, departureTime, arrivalTime, departureDate, price } = req.body;

    // You can perform additional checks here, like if the busId exists, etc.
    const newBusSchedule = new BusSchedule({
      bus: busId,
      origin,
      destination,
      departureTime,
      arrivalTime,
      departureDate,
      price,
      seatsBooked: 0 // Initialize with 0 booked seats
    });

    const savedSchedule = await newBusSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bus schedules
const getAllBusSchedules = async (req, res) => {
  try {
    const schedules = await BusSchedule.find().populate('bus');
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a bus schedule by ID
const getBusScheduleById = async (req, res) => {
  try {
    const schedule = await BusSchedule.findById(req.params.id).populate('bus');
    if (!schedule) {
      return res.status(404).json({ error: 'Bus schedule not found' });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a bus schedule
const updateBusSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { origin, destination, departureTime, arrivalTime, departureDate, price } = req.body;

    const updatedSchedule = await BusSchedule.findByIdAndUpdate(id, {
      origin,
      destination,
      departureTime,
      arrivalTime,
      departureDate,
      price
    }, { new: true }).populate('bus');

    if (!updatedSchedule) {
      return res.status(404).json({ error: 'Bus schedule not found' });
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a bus schedule
const deleteBusSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    await BusSchedule.findByIdAndDelete(id);
    res.status(200).json({ message: 'Bus schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchBusSchedules = async (req, res) => {
  try {
    console.log('Received search request:', req.body);

    const { origin, destination, date } = req.body;

    console.log('Searching for bus schedules with criteria:', {
      origin,
      destination,
      date,
    });

    const schedules = await BusSchedule.find({
      origin,
      destination,
      departureDate: date,
    });

    console.log('Mongoose Query:', schedules._conditions);

    console.log('Found schedules before populate:', schedules);

    const populatedSchedules = await BusSchedule.find({ origin, destination, departureDate: date })
      .populate({
        path: 'bus',
        populate: { path: 'company' },
      })
      .exec();

    console.log('Found matching schedules:', populatedSchedules);

    populatedSchedules.forEach((schedule, index) => {
      if (schedule.bus && schedule.bus.company && schedule.bus.company.name) {
        console.log(`Match ${index + 1}:`, {
          seatArrangement: schedule.bus.seatArrangement,
          companyName: schedule.bus.company.name,
          classType: schedule.bus.classType,
          origin: schedule.origin,
          destination: schedule.destination,
          departureDate: schedule.departureDate,
          arrivalTime: schedule.arrivalTime,
          price: schedule.price,
        });
      } else {
        console.error(`Error in Match ${index + 1}: Bus information is incomplete or missing.`);
      }
    });

    res.status(200).json(populatedSchedules);
  } catch (error) {
    console.error('Error in searchBusSchedules:', error);
    res.status(500).json({ error: error.message });
  }
};





module.exports = {
  createBusSchedule,
  getAllBusSchedules,
  getBusScheduleById,
  updateBusSchedule,
  deleteBusSchedule,
  searchBusSchedules
};

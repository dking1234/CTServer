const Bus = require('./busModal');

// Add a new bus
const createBus = async (req, res) => {
  try {
    const newBus = new Bus(req.body);
    const savedBus = await newBus.save();
    res.status(201).json({ message: 'Bus successfully added!', bus: savedBus });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all buses
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate('company'); // Include company details
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBusById = async (req, res) => {
    try {
      const bus = await Bus.findById(req.params.busId).populate('company');
      if (!bus) {
        return res.status(404).json({ error: 'Bus not found' });
      }
      res.status(200).json(bus);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update a bus
const updateBus = async (req, res) => {
  const { busId } = req.params;
  const updates = req.body;

  try {
    const bus = await Bus.findByIdAndUpdate(busId, updates, { new: true });
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.status(200).json({ message: 'Bus updated successfully', bus });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a bus
const deleteBus = async (req, res) => {
  const { busId } = req.params;

  try {
    const bus = await Bus.findByIdAndDelete(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.status(200).json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
};

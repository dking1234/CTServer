const Passenger = require('./passengerModal');

// Function to add a new passenger
const createPassenger = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, dateOfBirth, ageGroup } = req.body;
    
    // Calculate age group based on dateOfBirth if not provided
    // This is a simplified example and might need more accurate age calculation
    let calculatedAgeGroup = ageGroup;
    if (!ageGroup) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      calculatedAgeGroup = age < 18 ? 'child' : 'adult';
    }

    const passenger = new Passenger({
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      ageGroup: calculatedAgeGroup
    });

    await passenger.save();
    res.status(201).json({ message: 'Passenger created successfully', passenger });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to get a list of all passengers
const getAllPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.find();
    res.status(200).json(passengers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to get a single passenger by ID
const getPassengerById = async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.status(200).json(passenger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to update a passenger's information
const updatePassenger = async (req, res) => {
  try {
    const update = req.body;
    const passenger = await Passenger.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.status(200).json({ message: 'Passenger updated successfully', passenger });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to delete a passenger

const deletePassenger = async (req, res) => {
  try {
    const passenger = await Passenger.findByIdAndDelete(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.status(200).json({ message: 'Passenger deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPassenger,
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  deletePassenger
};

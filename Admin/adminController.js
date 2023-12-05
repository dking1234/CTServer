const bcrypt = require('bcryptjs');
const Admin = require('./adminModal');

// Create Admin
const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    admin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await admin.save();

    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    res.status(200).json({ message: 'Admin logged in successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Admin
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const admin = await Admin.findByIdAndUpdate(id, updates, { new: true });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin updated successfully', admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await Admin.findByIdAndDelete(id);

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Admin by ID
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createAdmin,
  adminLogin,
  updateAdmin,
  deleteAdmin,
  getAdminById,
  getAllAdmins
};

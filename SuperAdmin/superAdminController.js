const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SuperAdmin = require('./superAdminModal');

// SuperAdmin registration
const registerSuperAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    let superAdmin = await SuperAdmin.findOne({ email });
    if (superAdmin) {
      return res.status(409).json({ message: 'Email is already in use' });
    }

    superAdmin = new SuperAdmin({
      firstName,
      lastName,
      email,
      password,
    });

    await superAdmin.save();

    res.status(201).json({
      message: 'Super Admin created successfully',
      superAdminId: superAdmin.id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating super admin', error: error.message });
  }
};

// SuperAdmin login
const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ email }).select('+password');
    if (!superAdmin || !(await superAdmin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: superAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).json({
      message: 'Logged in successfully',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Update SuperAdmin Profile
const updateSuperAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const superAdminId = req.superAdmin.id;

    let superAdmin = await SuperAdmin.findById(superAdminId);

    if (!superAdmin) {
      return res.status(404).json({ message: 'Super Admin not found' });
    }

    // Optional: check if email is changed and already exists
    if (email && email !== superAdmin.email) {
      const existingAdmin = await SuperAdmin.findOne({ email });
      if (existingAdmin) {
        return res.status(409).json({ message: 'Email already in use by another account' });
      }
    }

    // If password change is requested, hash the new password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      superAdmin.password = await bcrypt.hash(password, salt);
    }

    // Update the super admin details
    superAdmin.firstName = firstName || superAdmin.firstName;
    superAdmin.lastName = lastName || superAdmin.lastName;
    superAdmin.email = email || superAdmin.email;

    await superAdmin.save();

    res.status(200).json({
      message: 'Super Admin updated successfully',
      superAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating super admin', error: error.message });
  }
};

module.exports = {
  registerSuperAdmin,
  loginSuperAdmin,
  updateSuperAdmin,
};

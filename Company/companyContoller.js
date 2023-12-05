const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('./companyModal');

const createCompany = async (req, res) => {
  try {
    const { name, address, contactInfo, password, image } = req.body;

    // Check if the company already exists
    const existingCompany = await Company.findOne({ 'contactInfo.email': contactInfo.email });
    if (existingCompany) {
      return res.status(409).json({ message: 'Company already exists with this email.' });
    }

    // Create a new company instance
    const company = new Company({
      name,
      address,
      contactInfo,
      password,
      image
    });

    // Save the new company
    await company.save();

    res.status(201).json({ message: 'Company created successfully!', company });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create company', error: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If the password is being updated, hash the new password
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // Find the company by ID and update it
    const company = await Company.findByIdAndUpdate(id, updates, { new: true });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: 'Company updated successfully!', company });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update company', error: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await Company.findByIdAndDelete(id);
    res.status(200).json({ message: 'Company deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete company', error: error.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get company', error: error.message });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get companies', error: error.message });
  }
};

const companyLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the company by email
      const company = await Company.findOne({ 'contactInfo.email': email });
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, company.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // If the password matches, create and assign a token
      const token = jwt.sign(
        { companyId: company._id },
        process.env.JWT_SECRET, // Make sure to have a JWT_SECRET in your .env file
        { expiresIn: '1h' } // Token expires in 1 hour
      );
  
      res.status(200).json({
        message: 'Logged in successfully!',
        token,
        company
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  };

module.exports = {
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyById,
  getAllCompanies,
  companyLogin
};

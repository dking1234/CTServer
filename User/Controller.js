const notificationController = require('../smsNotification/notificationController');
const User = require('./Modal');


const postPhoneNumber = async (req, res) => {
  try {
    let { phoneNumber } = req.body;

    // Ensure phoneNumber starts with '+255'
    if (!phoneNumber.startsWith('+255')) {
      // Add '+255' to the beginning of the phoneNumber
      phoneNumber = '+255' + phoneNumber;
    }

    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return res.status(409).json({ error: 'Phone number already exists' });
    }

    const user = new User({ phoneNumber });
    await user.save();

    const success = await notificationController.sendNotification(phoneNumber);

    if (success) {
      res.json({ message: 'Phone number saved, and OTP sent successfully' });
    } else {
      res.status(500).json({ error: 'An error occurred during OTP generation' });
    }
  } catch (error) {
    console.error('Error in postPhoneNumber:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};


const postUsername = async (req, res) => {
  try {
    let { phoneNumber, firstName, lastName } = req.body;

    // Ensure phoneNumber starts with '+255'
    if (!phoneNumber.startsWith('+255')) {
      // Add '+255' to the beginning of the phoneNumber
      phoneNumber = '+255' + phoneNumber;
    }

    // Find the user by their phone number
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      // If the user does not exist, send an error response
      return res.status(404).json({ error: 'User not found' });
    }

    // Combine first name and last name to form a username
    // Assuming the space between first name and last name is not desired in the username
    const combinedUsername = `${firstName} ${lastName}`;

    // Update the user's profile with the new username
    user.username = combinedUsername;
    await user.save();

    // Send a success message
    res.json({ success: true, message: 'Username updated successfully' });
  } catch (error) {
    console.error('Error in postUsername:', error);
    res.status(500).json({ error: 'An error occurred during username update' });
  }
};


const getUserByPhoneNumber = async (req, res) => {
  try {
    let { phoneNumber } = req.params;

    // Ensure phoneNumber starts with '+255'
    if (!phoneNumber.startsWith('+255')) {
      // Add '+255' to the beginning of the phoneNumber
      phoneNumber = '+255' + phoneNumber;
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getUserByPhoneNumber:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user details' });
  }
};


const updateUserByPhoneNumber = async (req, res) => {
  try {
    let { phoneNumber } = req.params;

    // Ensure phoneNumber starts with '+255'
    if (!phoneNumber.startsWith('+255')) {
      // Add '+255' to the beginning of the phoneNumber
      phoneNumber = '+255' + phoneNumber;
    }

    const updateData = req.body; // Data to update

    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error in updateUserByPhoneNumber:', error);
    res.status(500).json({ error: 'An error occurred during user update' });
  }
};


const deleteUserByPhoneNumber = async (req, res) => {
  try {
    let { phoneNumber } = req.params;

    // Ensure phoneNumber starts with '+255'
    if (!phoneNumber.startsWith('+255')) {
      // Add '+255' to the beginning of the phoneNumber
      phoneNumber = '+255' + phoneNumber;
    }

    const result = await User.deleteOne({ phoneNumber });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUserByPhoneNumber:', error);
    res.status(500).json({ error: 'An error occurred during user deletion' });
  }
};


module.exports = {
  postPhoneNumber,
  postUsername,
  getUserByPhoneNumber,
  updateUserByPhoneNumber,
  deleteUserByPhoneNumber,
};
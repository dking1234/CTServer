const notificationController = require('../smsNotification/notificationController');
const User = require('./Modal');


const postPhoneNumberAndUsername = async (req, res) => {
  try {
    let { phoneNumber, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return res.status(409).json({ error: 'Phone number already in use. Please choose a different one.' });
    }

    const combinedUsername = `${firstName} ${lastName}`;

    const user = new User({ phoneNumber, username: combinedUsername });
    await user.save();

    res.json({ success: true, message: 'Phone number and username saved successfully' });
  } catch (error) {
    console.error('Error in postPhoneNumberAndUsername:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

const getUserByPhoneNumber = async (req, res) => {
  try {
    let { phoneNumber } = req.params;

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

const getUserIdFromPhoneNumber = async (req, res) => {
  try {
    let { phoneNumber } = req.params;

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return only the user's ID
    res.json({ userId: user._id });
  } catch (error) {
    console.error('Error in getUserIdFromPhoneNumber:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user details' });
  }
};

const getUserFromUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getUserFromUserId:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user details' });
  }
};


const updateUserByPhoneNumber = async (req, res) => {
  try {
    let { phoneNumber } = req.params;

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
  postPhoneNumberAndUsername,
  getUserByPhoneNumber,
  updateUserByPhoneNumber,
  deleteUserByPhoneNumber,
  getUserIdFromPhoneNumber,
  getUserFromUserId
};
const express = require('express');
const router = express.Router();
const { 
  postPhoneNumberAndUsername,
  getUserByPhoneNumber,
  getUserIdFromPhoneNumber,
  updateUserByPhoneNumber,
  deleteUserByPhoneNumber,
  getUserFromUserId // Add this line
} = require('./Controller');

// Define routes for each step
router.post('/save-user', postPhoneNumberAndUsername); 
router.get('/username/:phoneNumber', getUserByPhoneNumber);
router.get('/userId/:phoneNumber', getUserIdFromPhoneNumber);
router.get('/user/:userId', getUserFromUserId); // Add this line
router.put('/:phoneNumber', updateUserByPhoneNumber);
router.delete('/:phoneNumber', deleteUserByPhoneNumber);       

module.exports = router;

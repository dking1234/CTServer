const express = require('express');
const router = express.Router();
const { 
  postPhoneNumber, 
  postUsername,
  getUserByPhoneNumber,
  getUserIdFromPhoneNumber,
  updateUserByPhoneNumber,
  deleteUserByPhoneNumber,
  getUserFromUserId // Add this line
} = require('./Controller');

// Define routes for each step
router.post('/phone-number', postPhoneNumber); 
router.post('/user-name', postUsername);
router.get('/username/:phoneNumber', getUserByPhoneNumber);
router.get('/userId/:phoneNumber', getUserIdFromPhoneNumber);
router.get('/user/:userId', getUserFromUserId); // Add this line
router.put('/:phoneNumber', updateUserByPhoneNumber);
router.delete('/:phoneNumber', deleteUserByPhoneNumber);       

module.exports = router;

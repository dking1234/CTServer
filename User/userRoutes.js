const express = require('express');
const router = express.Router();
const { postPhoneNumber, 
        postUsername,
        getUserByPhoneNumber,
        updateUserByPhoneNumber,
        deleteUserByPhoneNumber
      } = require('./Controller');

// Define routes for each step
router.post('/phone-number', postPhoneNumber); 
router.post('/user-name', postUsername);
router.get('/:phoneNumber', getUserByPhoneNumber);
router.put('/:phoneNumber', updateUserByPhoneNumber);
router.delete('/:phoneNumber', deleteUserByPhoneNumber);       

module.exports = router;

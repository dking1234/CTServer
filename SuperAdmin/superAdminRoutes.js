const express = require('express');
const router = express.Router();
const superAdminController = require('./superAdminController');


router.post('/register', superAdminController.registerSuperAdmin);
router.post('/login', superAdminController.loginSuperAdmin);
router.patch('/update/:id', superAdminController.updateSuperAdmin);

// Export the router
module.exports = router;

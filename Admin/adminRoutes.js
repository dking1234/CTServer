const express = require('express');
const router = express.Router();
const {
  createAdmin,
  adminLogin,
  updateAdmin,
  deleteAdmin,
  getAdminById,
  getAllAdmins
} = require('./adminController');


router.post('/', createAdmin);
router.post('/login', adminLogin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
router.get('/:id', getAdminById);
router.get('/', getAllAdmins);

module.exports = router;

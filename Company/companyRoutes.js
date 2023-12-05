const express = require('express');
const {
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyById,
  getAllCompanies,
  companyLogin
} = require('./companyContoller');

const router = express.Router();

router.post('/', createCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);
router.get('/:id', getCompanyById);
router.get('/', getAllCompanies);
router.post('/login', companyLogin);

module.exports = router;

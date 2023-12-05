const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/admin', roleMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Admin route' });
});

router.get('/superadmin', roleMiddleware(['super_admin']), (req, res) => {
  res.json({ message: 'Super Admin route' });
});

router.get('/companies', roleMiddleware(['companies']), (req, res) => {
  res.json({ message: 'Companies route' });
});

module.exports = router;

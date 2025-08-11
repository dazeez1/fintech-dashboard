// routes/testRoute.js

const express = require('express');
const router = express.Router();

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public health check
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'api', route: '/api/test' });
});
 
router.get('/admin-only', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

module.exports = router; 

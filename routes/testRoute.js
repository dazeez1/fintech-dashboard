// routes/testRoute.js

const express = require('express');
const router = express.Router();

const { protect, authorizeRoles } = require('../middleware/authMiddleware');
 
router.get('/admin-only', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

module.exports = router; 

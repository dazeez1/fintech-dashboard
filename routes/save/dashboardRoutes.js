// routes/authRoutes.js 

const express = require('express'); 
const router = express.Router(); 
const { getDashboard, getTransactions } = require('../controllers/dashboardController'); 
const { protect } = require('../middleware/authMiddleware');

//All routes protected = user must be logged in
router.get('/', protect, getDashboard); 
router.post('/transactions', protect, getTransactions); 

module.exports = router;

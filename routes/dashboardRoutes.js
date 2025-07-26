//routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const { getDashboard, getTransactions } =
require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { makeTransaction } = require('../controllers/transactionController');

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: get user's dashboard summary (requires JWT)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns username, role, and balance
 */

// All routes protected - user must be logged in  
router.get('/dashboard', protect, getDashboard);            
router.get('/transactions', protect, getTransactions);
router.post('/transactions', protect, makeTransaction);

   

module.exports = router;



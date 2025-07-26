// routes/transactionRoutes.js 

const express = require('express'); 
const router = express.Router(); 

const { makeTransaction } = require('../controllers/transactionController'); 
const { protect } = require('../middleware/authMiddleware');

//All routes protected = user must be logged in
router.post('/', protect, makeTransaction); 

module.exports = router;

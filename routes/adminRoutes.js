//routes/admin.js

const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transactions');
const { protect, authorizeRoles } = require ('../middleware/authMiddleware');

// PUT /api/admin/transactions/:id
router.put(
	'/Transactions/:id',
	protect,
	authorizeRoles('admin'),
	async (req, res) => {
		const { type, amount } = req.body;
		try{ 
			const transaction = await Transaction.findById(req.params.id);
			if (!transaction) {
				return res.status(404).json({ message: 'Transaction not found'});
			}
			transaction.type = type || transaction.type;
			transaction.amount = amount || transaction.amount;

			const updated = await transaction.save();
			res.status(200).json({ message: 'Transaction overridden', transaction: updated});
		} catch (err) {
			res.status(500).json({message: 'Server Error'});
		}
	}
);

module.exports = router
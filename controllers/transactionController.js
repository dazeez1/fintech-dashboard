// controllers/transactionController.js

const Transaction = require('../models/Transactions');
const User = require('../models/User');

// POST /api/transactions
exports.makeTransaction = async (req, res, next) => {
  try {
	    const { type, amount, transact } = req.body;
	    const user = req.user;

	    // Validate input
	    if (!type || !['credit', 'debit'].includes(type)) {
	      return res.status(400).json({ message: 'Invalid Transaction Type' });
	    }

	    if (typeof amount !== 'number' || amount <= 0) {
	      return res.status(400).json({ message: 'Amount must be a positive number' });
	    }

	    // Fetch user data
	    const dbUser = await User.findById(user._id);
	    if (!dbUser) {
	      return res.status(404).json({ message: 'User not found' });
	    }

	    // Determine new balance
	    let newBalance;
	    if (type === 'debit') {
	      if (amount > dbUser.balance) {
	        return res.status(400).json({ message: 'Insufficient Balance' });
	      }
	      newBalance = dbUser.balance - amount;
	    } else {
	      newBalance = dbUser.balance + amount;
	    }

	    // Update user balance
	    dbUser.balance = newBalance;
	    await dbUser.save();

	    // Log transaction
	    const transaction = await Transaction.create({
	      user: dbUser._id,
	      type,
	      amount,
	      transact,
	      balanceAfter: newBalance,
	    });

	    res.status(201).json({
	      message: 'Transaction Successful',
	      transaction,
	    });

	} catch (err) {
	    next(err); // Pass to custom error handler
    res.status(500).json({ message: 'Internal server error' });
	 }
};

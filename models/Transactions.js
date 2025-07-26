// Model/Transaction.js

const mongoose = require ('mongoose');

// Schema 
const transactionSchema = new mongoose.Schema ({
	user: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'User',
	    required: true,
  },
	type: {
		type: String,
		enum: ['credit', 'debit'],
		required: true,
	},

	amount: {
		type: Number,
		required: true,
		min: [0, 'Amount must be positive'],
	},
	balanceAfter: {
		type: Number,
		trim: true,
	},
	 
	timestamp: {
	    type: Date,
	    default: Date.now,
  }
});

// module.exports = mongoose.model('Transaction', transactionSchema);

// ✅ Prevent OverwriteModelError in test environments
module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
// Model/transaction.js

const mongoose = require ('mongoose');

// Schema 
const transactionSchema = new mongoose.Schema ({
	type: {             // i changed transact to type because of test
		type: String,
		enum: ['credit', 'debit'],
		required: false,
	},

	amount: {
		type: Number,
		required: true,
		min: 1
	},
	description: {
		type: String,
		trim: true
	},
	 user: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'User',
	    required: true
  },
  createdAt: {
	    type: Date,
	    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);


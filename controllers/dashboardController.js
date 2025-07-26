// controllers/dashboardController.js

const Transaction = require ('../models/transactionDashboard');
const User = require('../models/User');


exports.getDashboard = async (req, res) => {
	try {

		//request all the transactions login 

		const userId = req.user.id;
		
		const transactions = await Transaction.find({ user: userId});

		//callculate balance
		const balance = transactions.reduce((total, txn) => {
		  return txn.transact === 'credit'
		    ? total + txn.amount
		    : total - txn.amount;
		}, 0);


	    //get user details
		 const user = await User.findById(userId).select('username role');

	    res.status(201).json({ 
	    	username: req.user.username, 
	    	role: req.user.role,
	    	balance,
	    	totalTransaction: transactions.length,
	    	profileImage: req.user.profileImage 
		}); 


	} catch (error) {
		return res.status(500).json({message: 'Server Error'});
	}
}


exports.getTransactions = async (req, res) => {
    const userId = req.user._id;

    // Find and sort user's transactions (most recent first)
    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(transactions);
 };



		/* let balance = 0;
	    getAllTransactions.forEach(record => {
	      if (record.type === 'credit') {
	        balance += record.amount;
	      } else if (record.type === 'debit') {
	        balance -= record.amount;
	      }
	    });  */


 
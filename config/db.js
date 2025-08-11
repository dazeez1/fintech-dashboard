// config/db.js 
const mongoose = require('mongoose'); 
const connectDB = async () => { 

	
try { 
	const conn = await mongoose.connect(process.env.MONGO_URI); 
	console.log(`MongoDB Connected: ${conn.connection.host}`); 
} catch (err) { 
	console.error(`Error: ${err.message}`); 
	// Don't exit process during testing
	if (process.env.NODE_ENV !== 'test') {
		process.exit(1); // Stop process if DB fails 
	}
}                                       
}; 
module.exports = connectDB;


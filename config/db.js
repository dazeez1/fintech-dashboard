// config/db.js 
const mongoose = require('mongoose'); 
const connectDB = async () => { 

	
try { 
	const conn = await mongoose.connect(process.env.MONGO_URI); 
	console.log(`MongoDB Connected: ${conn.connection.host}`); 
} catch (err) { 
	console.error(`Error: ${err.message}`); 
	process.exit(1); // Stop process if DB fails 
}                                       //Commenting this not to working because of jest (test)
}; 
module.exports = connectDB;


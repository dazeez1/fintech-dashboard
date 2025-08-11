// config/db.js 
const mongoose = require('mongoose'); 
const connectDB = async () => { 
  try { 
    const uri = process.env.MONGO_URI; 
    if (!uri) {
      throw new Error('MONGO_URI not set');
    }
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    }); 
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


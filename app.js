//app.js
const express = require('express'); 
const app = express(); 
const helmet = require('helmet'); 
const rateLimit = require('express-rate-limit'); 
const xss = require('xss-clean'); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 
const connectDB = require("./config/db")

// Load environment variables 
dotenv.config(); 

// Connect DB first 
connectDB(); 

// Middleware to parse JSON 
app.use(express.json()); 

// Security Headers 
app.use(helmet());

// Limit repeated requests 
const limiter = rateLimit({ 
windowMs: 15 * 60 * 1000, // 15 minutes 
max: 100, // max 100 requests per IP 
message: 'Too many requests from this IP, please try again later.' 
}); 
app.use('/api', limiter);

app.use(xss());

app.use(cors());
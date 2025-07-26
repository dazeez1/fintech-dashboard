// controllers/authController.js

const User = require('../models/User'); 
const jwt = require('jsonwebtoken'); 

// Generate JWT Token 
const createToken = (user) => { 
return jwt.sign( 
{ id: user._id, role: user.role }, 
process.env.JWT_SECRET, 
{ expiresIn: '1h' } 
); 
};

// @desc    Register a new user 
exports.register = async (req, res) => { 
const { username, password, role } = req.body; 
if (!username || !password) 
return res.status(400).json({ message: 'Username and password required' 
}); 
const userExists = await User.findOne({ username }); 
if (userExists) 
return res.status(400).json({ message: 'Username already taken' }); 
const user = await User.create({ username, password,  role: role === 'admin' ? 'admin' : 'user' });
res.status(201).json({ 
_id: user._id, 
username: user.username, 
role: user.role, 
token: createToken(user) 
}); 
}; 

// @desc    Login user 
exports.login = async (req, res) => { 
const { username, password } = req.body; 
const user = await User.findOne({ username }); 
if (!user || !(await user.matchPassword(password))) 
return res.status(401).json({ message: 'Invalid credentials' }); 
res.json({ 
_id: user._id, 
username: user.username, 
role: user.role, 
token: createToken(user) 
}); 
};
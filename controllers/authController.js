// controllers/authController.js

const User = require('../models/User'); 
const jwt = require('jsonwebtoken'); 

// Generate JWT Token 
const createToken = (user) => { 
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign( 
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' } 
  ); 
};

// @desc    Register a new user 
exports.register = async (req, res) => { 
  try {
    const { username, password, role } = req.body; 
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' }); 
    }

    const userExists = await User.findOne({ username }); 
    if (userExists) {
      return res.status(400).json({ message: 'Username already taken' }); 
    }

    const user = await User.create({ username, password, role: role === 'admin' ? 'admin' : 'user' });

    const token = createToken(user);

    res.status(201).json({ 
      _id: user._id, 
      username: user.username, 
      role: user.role, 
      token 
    }); 
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
}; 

// @desc    Login user 
exports.login = async (req, res) => { 
  try {
    const { username, password } = req.body; 
    const user = await User.findOne({ username }); 
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' }); 
    }

    const token = createToken(user);

    res.json({ 
      _id: user._id, 
      username: user.username, 
      role: user.role, 
      token 
    }); 
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};
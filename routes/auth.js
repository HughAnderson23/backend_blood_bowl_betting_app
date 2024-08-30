const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  console.log("Received token:", token); // Check what you receive
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// 


// Register a new user
router.post('/register', async (req, res) => {
    console.log('Request Body:', req.body); // Add this line
    const { username, password } = req.body;
  
    try {
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      user = new User({ username, password });
      await user.save();
  
      const payload = { userId: user.id };
      const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
  

// Login a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = { router, authMiddleware };

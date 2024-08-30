const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth'); // Importing authMiddleware from auth.js
const User = require('../models/User');
const Team = require('../models/Team');

// Route to get user's skulls
router.get('/skulls', authMiddleware, async (req, res) => {
    try {
        // Ensure the user ID is being correctly passed down by the auth middleware
        if (!req.user || !req.user.id) {
            console.log('Invalid or missing user information in request:', req.user);
            return res.status(400).json({ msg: 'Invalid user information. Cannot proceed.' });
        }

        const user = await User.findById(req.user.id);

        // Check if the user exists in the database
        if (!user) {
            console.log('No user found with ID:', req.user.id);
            return res.status(404).json({ msg: 'User not found' });
        }

        // Ensure that the user object actually has the 'skulls' property
        if (user.skulls === undefined) {
            console.log('Skulls data not found for user:', req.user.id);
            return res.status(404).json({ msg: 'Skulls data not available for this user' });
        }

        res.json({ skulls: user.skulls });
    } catch (error) {
        console.error('Server error while fetching skulls for user ID:', req.user.id, error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

  

// Route to get available teams
router.get('/teams', async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Route to place a bet
router.post('/bets', authMiddleware, async (req, res) => {
  const { team, amount } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Check if the user has enough skulls
    if (user.skulls < amount) {
      return res.status(400).json({ msg: 'Not enough skulls' });
    }

    // Deduct the amount from user's skulls
    user.skulls -= amount;
    await user.save();

    // Here, you would normally save the bet in a separate Bet model

    res.json({ updatedSkulls: user.skulls });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;

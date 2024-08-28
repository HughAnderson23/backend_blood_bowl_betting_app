const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth'); // Importing authMiddleware from auth.js
const User = require('../models/User');
const Team = require('../models/Team');

// Route to get user's skulls
router.get('/skulls', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ skulls: user.skulls });
  } catch (error) {
    res.status(500).send('Server error');
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

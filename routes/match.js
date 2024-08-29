const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

// Get all matches for the current week
router.get('/current-week', async (req, res) => {
  const currentWeek = 1; // You would calculate the current week based on the date
  const matches = await Match.find({ week: currentWeek }).populate('team1 team2');
  res.json(matches);
});

// Create a new match (you'll use this when updating the match lineups)
router.post('/add', async (req, res) => {
  const { team1, team2, date, week } = req.body;
  const match = new Match({ team1, team2, date, week });
  await match.save();
  res.json(match);
});

module.exports = router;

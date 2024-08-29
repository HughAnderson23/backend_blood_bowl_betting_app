const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Team = require('../models/Team'); // Import Team model if needed for fetching stats
const calculateOdds = require('../utils/oddsCalculator'); // Import the odds calculator

// GET existing matches and populate team details
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().populate('team1').populate('team2');
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new match with odds calculation
router.post('/matches', async (req, res) => {
  const { team1Id, team2Id, date, week } = req.body;
  try {
    const team1 = await Team.findById(team1Id);
    const team2 = await Team.findById(team2Id);
    const { oddsTeamA, oddsTeamB } = calculateOdds(team1.wins, team1.losses, team2.wins, team2.losses);

    const newMatch = new Match({
      team1: team1Id,
      team2: team2Id,
      date,
      week,
      oddsTeam1: oddsTeamA,
      oddsTeam2: oddsTeamB
    });
    await newMatch.save();
    res.status(201).json(newMatch);
  } catch (error) {
    console.error('Error creating new match:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT to update an existing match (for example, to lock it or update teams)
router.put('/:matchId', async (req, res) => {
  const { team1Id, team2Id, date, week } = req.body;
  try {
    const team1 = await Team.findById(team1Id);
    const team2 = await Team.findById(team2Id);
    const { oddsTeamA, oddsTeamB } = calculateOdds(team1.wins, team1.losses, team2.wins, team2.losses);

    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.matchId,
      { team1: team1Id, team2: team2Id, date, week, oddsTeam1: oddsTeamA, oddsTeam2: oddsTeamB },
      { new: true }
    );
    res.status(200).json(updatedMatch);
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;

const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Team = require('../models/Team'); // Import Team model if needed for fetching stats
const calculateOdds = require('../utils/oddsCalculator'); // Import the odds calculator
const Bet = require('../models/Bet'); // Adjust the path as necessary depending on your directory structure


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
router.post('/', async (req, res) => {
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

// Route to lock bets for a match
router.post('/lock/:matchId', async (req, res) => {
    try {
      const match = await Match.findById(req.params.matchId);
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      if (match.isLocked) {
        return res.status(400).json({ message: 'Bets are already locked for this match' });
      }
      match.isLocked = true;
      await match.save();
      res.status(200).json({ message: 'Bets locked successfully', match });
    } catch (error) {
      console.error('Error locking bets:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Route to resolve a match and calculate winnings
// POST route to resolve a match
router.post('/resolve/:matchId', async (req, res) => {
    const { matchId } = req.params;
    const { winningTeamId } = req.body;

    try {
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        if (match.isResolved) {
            return res.status(400).json({ message: 'Match already resolved' });
        }

        match.winningTeam = winningTeamId;
        match.isResolved = true;
        await match.save();

        const bets = await Bet.find({ match: matchId }).populate('user');
        await Promise.all(bets.map(async (bet) => {
            if (bet.team.toString() === winningTeamId.toString()) {
                bet.isWin = true;
                const winnings = bet.amount * bet.odds; // Calculate winnings
                bet.user.skulls += winnings; // Add winnings to user's skulls
                await bet.user.save(); // Save the updated user
            }
            await bet.save(); // Save the updated bet
        }));

        res.status(200).json({ message: 'Match resolved and winnings calculated', match });
    } catch (error) {
        console.error('Error resolving match:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;

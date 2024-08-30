const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  week: {
    type: Number,
    required: true,
  },
  oddsTeam1: {
    type: Number,
    required: true,
  },
  oddsTeam2: { 
    type: Number,
    required: true,
  },
  isLocked: { 
    type: Boolean,
    default: false,
  },
  winningTeam: { // Stores the ID of the winning team
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  isResolved: {
    type: Boolean,
    default: false,
  }

});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;

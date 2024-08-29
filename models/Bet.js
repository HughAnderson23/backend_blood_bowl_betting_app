const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  odds: { // Optional, depending on whether you want to track odds at the time of the bet
    type: Number,
    required: true
  },
  isWin: { // To mark if the bet was a winning bet after match resolution
    type: Boolean,
    default: false
  }
});

const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;

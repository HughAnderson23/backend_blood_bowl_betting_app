const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // You can add more fields here, like 'city', 'league', etc., if needed.
});

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;

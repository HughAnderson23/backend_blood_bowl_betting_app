const mongoose = require('mongoose');

// Define the schema
const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 }
});

// Create the model using the schema
const Team = mongoose.model('Team', teamSchema);

module.exports = Team;


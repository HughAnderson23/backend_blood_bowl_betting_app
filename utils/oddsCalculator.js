// Utility function to calculate odds based on team statistics
function calculateOdds(teamAWins, teamALosses, teamBWins, teamBLosses) {
    const teamAWinningPercentage = teamAWins / (teamAWins + teamALosses);
    const teamBWinningPercentage = teamBWins / (teamBWins + teamBLosses);
  
    const oddsTeamA = 1 + (teamBWinningPercentage / teamAWinningPercentage);
    const oddsTeamB = 1 + (teamAWinningPercentage / teamBWinningPercentage);
  
    return { oddsTeamA, oddsTeamB };
  }
  
  module.exports = calculateOdds;
  
import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ draftOrder, totalTeams }) => {
  const getPickColor = (pickNumber) => {
    if (pickNumber <= 3) {
      // Top 3 picks - Gold, Silver, Bronze
      if (pickNumber === 1) return '#FFD700'; // Gold
      if (pickNumber === 2) return '#C0C0C0'; // Silver
      if (pickNumber === 3) return '#CD7F32'; // Bronze
    } else if (pickNumber <= Math.ceil(totalTeams / 3)) {
      // Middle picks - Green
      return '#00701e';
    } else if (pickNumber <= Math.ceil((totalTeams / 3) * 2)) {
      // Middle picks - Yellow
      return '#ffc014';
    } else {
      // Bottom picks - Red
      return '#FF6B6B';
    }
  };

  const getMedalEmoji = (pickNumber) => {
    if (pickNumber === 1) return "🥇";
    if (pickNumber === 2) return "🥈";
    if (pickNumber === 3) return "🥉";
    return "";
  };

  return (
    <div className="leaderboard">
      <h3>🏆 Draft Order</h3>
      <div className="leaderboard-container">
        {draftOrder.length === 0 ? (
          <div className="empty-leaderboard">
            <p>No picks yet!</p>
            <p>Spin the wheel to start!</p>
          </div>
        ) : (
          <div className="draft-list">
            {draftOrder.map((pick, index) => (
              <div 
                key={index} 
                className="draft-pick-compact"
                style={{ 
                  backgroundColor: getPickColor(pick.pick),
                  color: 'white'
                }}
              >
                <span className="pick-number-compact">#{pick.pick}</span>
                <span className="pick-team-compact">{pick.team.name}</span>
                <span className="pick-medal">{getMedalEmoji(pick.pick)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

import React from 'react';
import './WinnerDisplay.css';

const WinnerDisplay = ({ winner, image, onContinue, pickNumber, totalTeams }) => {
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

  const getPickMessage = (pickNumber) => {
    if (pickNumber <= 3) {
      if (pickNumber === 1) return "🥇 FIRST PICK! 🥇";
      if (pickNumber === 2) return "🥈 SECOND PICK! 🥈";
      if (pickNumber === 3) return "�� THIRD PICK! 🥉";
    } else if (pickNumber <= Math.ceil(totalTeams / 2)) {
      return "📊 MIDDLE OF THE PACK 📊";
    } else {
      return "😅 LATE PICK 😅";
    }
  };

  const getPickDescription = (pickNumber) => {
    const teamName = winner.name || winner;
    if (pickNumber <= 3) {
      return `Congratulations! ${teamName} gets the ${pickNumber === 1 ? 'FIRST' : pickNumber === 2 ? 'SECOND' : 'THIRD'} pick! This is a great position to build a championship team!`;
    } else if (pickNumber <= Math.ceil(totalTeams / 2)) {
      return `Not bad! ${teamName} gets pick #${pickNumber}. There's still plenty of talent available in the middle rounds.`;
    } else {
      return `Ouch! ${teamName} gets pick #${pickNumber}. Time to show off those late-round sleeper picks!`;
    }
  };

  const teamName = winner.name || winner;
  const teamContext = winner.context || '';

  return (
    <div className="winner-display">
      <div className="winner-card" style={{ borderColor: getPickColor(pickNumber) }}>
        <div className="winner-header">
          <h2 style={{ color: getPickColor(pickNumber) }}>{getPickMessage(pickNumber)}</h2>
          <h1 className="winner-name">{teamName}</h1>
          <div className="pick-number-display" style={{ backgroundColor: getPickColor(pickNumber) }}>
            Pick #{pickNumber}
          </div>
        </div>
        
        <div className="winner-image-container">
          {image ? (
            <img 
              src={image} 
              alt={`${teamName} - Pick #${pickNumber}`}
              className="winner-image"
            />
          ) : (
            <div className="image-placeholder" style={{ background: `linear-gradient(45deg, ${getPickColor(pickNumber)}, ${getPickColor(pickNumber)}80)` }}>
              <p>🏆</p>
              <p>Pick #{pickNumber}</p>
            </div>
          )}
        </div>
        
        <div className="winner-actions">
          <button 
            className="continue-button"
            onClick={onContinue}
          >
            Continue to Next Round
          </button>
        </div>
        
        <div className="winner-message">
          <p>{getPickDescription(pickNumber)}</p>
          <p>Click continue to remove this team and spin again!</p>
        </div>
      </div>
    </div>
  );
};

export default WinnerDisplay;

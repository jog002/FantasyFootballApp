import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import './App.css';
import Wheel from './components/Wheel';
import WinnerDisplay from './components/WinnerDisplay';
import Leaderboard from './components/Leaderboard';
import SavedImages from './components/SavedImages';
import DalleService from './services/dalleService';

function App() {
  const [teams, setTeams] = useState([]);
  const [remainingTeams, setRemainingTeams] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerImage, setWinnerImage] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [apiConfig, setApiConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draftOrder, setDraftOrder] = useState([]);
  const [currentPickNumber, setCurrentPickNumber] = useState(null);
  const [dalleService, setDalleService] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      console.log('Loading config from /config.yml...');
      const response = await fetch('/local_config.yml', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
      }
      
      const yamlText = await response.text();
      console.log('Config YAML loaded:', yamlText.substring(0, 200) + '...');
      
      const config = yaml.load(yamlText);
      console.log('Parsed config:', config);
      
      if (config && config.teams && Array.isArray(config.teams)) {
        // Handle both old string format and new object format
        const processedTeams = config.teams.map(team => {
          if (typeof team === 'string') {
            // Old format: just a string
            return { name: team, context: '' };
          } else if (team && team.name) {
            // New format: object with name and context
            return { name: team.name, context: team.context || '' };
          } else {
            // Fallback
            return { name: 'Unknown Team', context: '' };
          }
        });
        
        console.log('Processed teams:', processedTeams);
        setTeams(processedTeams);
        setRemainingTeams(processedTeams);
        setApiConfig(config.api);
        
        // Initialize DALL-E service
        const dalle = new DalleService(config);
        setDalleService(dalle);
        
        // Test API connection
        const connectionTest = await dalle.testConnection();
        if (!connectionTest.success) {
          console.warn('DALL-E API connection failed:', connectionTest.error);
        } else {
          console.log('DALL-E API connection successful');
        }
      } else {
        throw new Error('Invalid config format - teams array not found');
      }
    } catch (error) {
      console.error('Error loading config:', error);
      // Fallback teams if config fails to load
      const fallbackTeams = [
        { name: 'Team Alpha', context: '' },
        { name: 'Team Beta', context: '' },
        { name: 'Team Gamma', context: '' },
        { name: 'Team Delta', context: '' },
        { name: 'Team Echo', context: '' },
        { name: 'Team Foxtrot', context: '' },
        { name: 'Team Golf', context: '' },
        { name: 'Team Hotel', context: '' },
        { name: 'Team India', context: '' },
        { name: 'Team Juliet', context: '' }
      ];
      console.log('Using fallback teams:', fallbackTeams);
      setTeams(fallbackTeams);
      setRemainingTeams(fallbackTeams);
    } finally {
      setIsLoading(false);
    }
  };

  const spinWheel = () => {
    if (!remainingTeams || remainingTeams.length === 0) {
      alert('All teams have been selected! Reset to start over.');
      return;
    }

    setIsSpinning(true);
    setShowWinner(false);
    setWinner(null);
    setWinnerImage(null);

    // Simulate spinning animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * remainingTeams.length);
      const selectedTeam = remainingTeams[randomIndex];
      
      setWinner(selectedTeam);
      setIsSpinning(false);
      
      // Add to draft order (first selected = last pick)
      const pickNumber = teams.length - draftOrder.length;
      setCurrentPickNumber(pickNumber);
      setDraftOrder(prev => [...prev, { team: selectedTeam, pick: pickNumber }]);
      
      // Generate image for winner
      generateWinnerImage(selectedTeam, pickNumber);
    }, 3000);
  };

  const generateWinnerImage = async (team, pickNumber) => {
    try {
      let imageUrl;
      
      if (dalleService) {
        // Use DALL-E service to generate image
        try {
          imageUrl = await dalleService.generateImage(team.name, pickNumber, team.context);
          console.log('DALL-E image generated successfully:', imageUrl);
        } catch (dalleError) {
          console.error('DALL-E API error, using placeholder:', dalleError);
          // Fallback to placeholder if DALL-E fails
          imageUrl = `https://via.placeholder.com/400x400/FFD700/000000?text=${encodeURIComponent(team.name + ' - Pick #' + pickNumber + '!')}`;
        }
      } else {
        // Use placeholder if DALL-E service not available
        imageUrl = `https://via.placeholder.com/400x400/FFD700/000000?text=${encodeURIComponent(team.name + ' - Pick #' + pickNumber + '!')}`;
      }
      
      setWinnerImage(imageUrl);
      setShowWinner(true);
      
      // Save the image to local folder
      await saveImageToLocal(imageUrl, team.name, pickNumber);
    } catch (error) {
      console.error('Error generating image:', error);
      setWinnerImage(null);
      setShowWinner(true);
    }
  };

  const saveImageToLocal = async (imageUrl, teamName, pickNumber) => {
    try {
      const response = await fetch('http://localhost:3001/save-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          teamName,
          pickNumber
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Image saved successfully:', result.message);
      } else {
        console.error('Failed to save image:', result.error);
      }
    } catch (error) {
      console.error('Error saving image to local folder:', error);
    }
  };

  const removeWinner = () => {
    if (winner && remainingTeams) {
      setRemainingTeams(prev => prev ? prev.filter(team => team.name !== winner.name) : []);
      setWinner(null);
      setWinnerImage(null);
      setShowWinner(false);
    }
  };

  const resetDraft = () => {
    setRemainingTeams(teams || []);
    setWinner(null);
    setWinnerImage(null);
    setShowWinner(false);
    setIsSpinning(false);
    setDraftOrder([]);
    setCurrentPickNumber(null);
  };

  // Extract team names for the wheel component
  const getTeamNames = (teamList) => {
    return teamList.map(team => team.name);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏈 SigEp Fantasy Football Draft Pick-Em</h1>
        <p>Spin the wheel to determine draft order!</p>
      </header>

      <main className="App-main">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading teams...</p>
          </div>
        ) : !showWinner ? (
          <div className="main-content">
            <div className="wheel-section">
              <Wheel 
                teams={getTeamNames(remainingTeams)} 
                isSpinning={isSpinning}
                onSpin={spinWheel}
              />
              <button 
                className="spin-button"
                onClick={spinWheel}
                disabled={isSpinning || !remainingTeams || remainingTeams.length === 0}
              >
                {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
              </button>
              <button 
                className="reset-button"
                onClick={resetDraft}
                disabled={isSpinning}
              >
                Reset Draft
              </button>
            </div>
            <div className="leaderboard-section">
              <Leaderboard 
                draftOrder={draftOrder}
                totalTeams={teams.length}
              />
              <SavedImages />
            </div>
          </div>
        ) : (
          <WinnerDisplay 
            winner={winner}
            image={winnerImage}
            onContinue={removeWinner}
            pickNumber={currentPickNumber}
            totalTeams={teams.length}
          />
        )}
      </main>

      <footer className="App-footer">
        <div className="teams-info">
          <h3>Remaining Teams ({remainingTeams ? remainingTeams.length : 0})</h3>
          <div className="teams-list">
            {remainingTeams && remainingTeams.map((team, index) => (
              <span key={index} className="team-tag">{team.name}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

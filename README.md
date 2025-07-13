# Fantasy Football Draft Order App

A React-based web application for determining fantasy football draft order using a spinning wheel. Features include team management, random selection, and DALL-E image generation for winners.

## Features

- 🎡 Interactive spinning wheel with team names
- 🎯 Random team selection with removal after each round
- 🏆 Winner display with generated images
- 📝 Team list configuration via YAML file
- 🎨 Modern, responsive UI with animations
- 🔄 Reset functionality to start over

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start both the React app and the image server:**
   ```bash
   npm run dev
   ```
   
   This will start:
   - React app on `http://localhost:3000`
   - Image server on `http://localhost:3001`

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Configuration

The app reads team names and API settings from `config.yml`:

```yaml
teams:
  - "Team Alpha"
  - "Team Beta"
  - "Team Gamma"
  # Add more teams...

api:
  openai:
    base_url: "https://api.openai.com/v1"
    model: "dall-e-3"
    size: "1024x1024"
    quality: "standard"
    n: 1
```

## How to Use

1. **Load Teams:** The app automatically loads teams from `config.yml`
2. **Spin the Wheel:** Click "Spin the Wheel!" to randomly select a team
3. **View Winner:** See the selected team with a generated image
4. **Continue:** Click "Continue to Next Round" to remove the winner and continue
5. **Reset:** Use "Reset Draft" to start over with all teams

## DALL-E Integration

The app includes an abstracted DALL-E API integration. To implement actual image generation:

1. Replace the placeholder in `src/App.js` in the `generateWinnerImage` function
2. Add your OpenAI API key to environment variables
3. Make actual API calls to DALL-E with the team name as prompt

Example implementation:
```javascript
const response = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: "dall-e-3",
    prompt: `A fantasy football trophy with the text "${teamName} - Pick #${pickNumber}!" in a dramatic, celebratory style`,
    size: "1024x1024",
    quality: "standard",
    n: 1
  })
});
```

## Image Saving Feature

The app automatically saves all generated images to a local `images/` folder:

### How it works:
1. **Automatic Saving**: Every time an image is generated, it's automatically saved to the local `images/` folder
2. **File Naming**: Images are saved with format: `TeamName_PickNumber_Timestamp.jpg`
3. **View Saved Images**: The app includes a "Saved Images" section that displays all saved images
4. **Server Endpoints**:
   - `POST /save-image`: Saves an image from URL
   - `GET /images`: Lists all saved images
   - `GET /images/:filename`: Serves a specific image

### File Structure:
```
FantasyFootballApp/
├── images/                    # Saved images folder
│   ├── Team_Alpha_Pick1_2024-01-15T10-30-45-123Z.jpg
│   ├── Team_Beta_Pick2_2024-01-15T10-31-12-456Z.jpg
│   └── ...
├── server.js                  # Express server for image handling
└── ...
```

## Project Structure

```
src/
├── components/
│   ├── Wheel.js          # Spinning wheel component
│   ├── Wheel.css         # Wheel styling
│   ├── WinnerDisplay.js  # Winner display component
│   └── WinnerDisplay.css # Winner display styling
├── App.js                # Main app component
├── App.css               # Main app styling
├── index.js              # React entry point
└── index.css             # Global styles

config.yml                 # Team and API configuration
```

## Customization

- **Add Teams:** Edit the `teams` array in `config.yml`
- **Change Colors:** Modify the `getTeamColor` function in `Wheel.js`
- **Adjust Animations:** Update CSS animations in component files
- **Modify Styling:** Edit CSS files to match your preferences

## Technologies Used

- React 18
- CSS3 with animations
- SVG for wheel graphics
- YAML configuration
- Responsive design

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to modify and distribute! 
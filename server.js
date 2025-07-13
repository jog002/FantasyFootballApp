const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// Endpoint to save image from URL
app.post('/save-image', async (req, res) => {
  try {
    const { imageUrl, teamName, pickNumber } = req.body;
    
    if (!imageUrl || !teamName || !pickNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${teamName.replace(/\s+/g, '_')}_Pick${pickNumber}_${timestamp}.jpg`;
    const filepath = path.join(imagesDir, filename);

    // Download and save the image
    const protocol = imageUrl.startsWith('https:') ? https : http;
    
    const file = fs.createWriteStream(filepath);
    
    protocol.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        return res.status(500).json({ error: 'Failed to download image' });
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Image saved: ${filename}`);
        res.json({ 
          success: true, 
          filename: filename,
          message: `Image saved as ${filename}`
        });
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if download failed
      console.error('Error downloading image:', err);
      res.status(500).json({ error: 'Failed to download image' });
    });

  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get list of saved images
app.get('/images', (req, res) => {
  try {
    const files = fs.readdirSync(imagesDir);
    const imageFiles = files.filter(file => 
      file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')
    );
    
    res.json({ 
      images: imageFiles,
      count: imageFiles.length
    });
  } catch (error) {
    console.error('Error reading images directory:', error);
    res.status(500).json({ error: 'Failed to read images directory' });
  }
});

// Endpoint to serve saved images
app.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(imagesDir, filename);
  
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Images will be saved to: ${imagesDir}`);
}); 
import React, { useState, useEffect } from 'react';
import './SavedImages.css';

const SavedImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedImages();
  }, []);

  const fetchSavedImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/images');
      const data = await response.json();
      
      if (data.images) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching saved images:', error);
      setError('Failed to load saved images');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (filename) => {
    return `http://localhost:3001/images/${filename}`;
  };

  const formatFilename = (filename) => {
    // Remove timestamp and file extension for display
    return filename
      .replace(/_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.jpg$/, '')
      .replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="saved-images">
        <h3>📸 Saved Images</h3>
        <div className="loading">Loading saved images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-images">
        <h3>📸 Saved Images</h3>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="saved-images">
      <h3>📸 Saved Images ({images.length})</h3>
      {images.length === 0 ? (
        <div className="no-images">
          <p>No images saved yet!</p>
          <p>Generate some picks to see saved images here.</p>
        </div>
      ) : (
        <div className="images-grid">
          {images.map((filename, index) => (
            <div key={index} className="image-item">
              <img 
                src={getImageUrl(filename)} 
                alt={formatFilename(filename)}
                className="saved-image"
              />
              <div className="image-caption">
                {formatFilename(filename)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedImages; 
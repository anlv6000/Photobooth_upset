import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./photoLibraryStyling.css";

const PhotoLibrary = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
  };

  const closePopup = () => {
    setSelectedPhoto(null);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      if (!window.electronAPI) {
        console.error("Electron API not available");
        return;
      }
      const photoList = await window.electronAPI.loadPhotoLibrary();
      setPhotos(photoList);
    } catch (error) {
      console.error("Error loading photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => { navigate(-1); };

  if (loading) {
    return (
      <div className="photo-library-page">
        <div className="loading">Loading photos...</div>
      </div>
    );
  }

  return (
    <div className="photo-library-page">
      <button type="button" className="back-btn-small" onClick={handleBack} title="Quay lại">← Quay lại</button>

      <div className="photo-library-container">
        <h1 className="photo-library-title">Photo Library</h1>

        {photos.length === 0 ? (
          <div className="no-photos">
            <p>No photos in library yet.</p>
            <p>Photos will be saved here after printing.</p>
          </div>
        ) : (
          <div className="photo-grid">
            {photos.map((photoUrl, index) => (
              <div key={index} className="photo-item" onClick={() => handlePhotoClick(photoUrl)}>
                <img src={photoUrl} alt={`Photo ${index + 1}`} className="photo-image" />
              </div>
            ))}
          </div>

        )}
      </div>
      {selectedPhoto && (
        <div className="photo-popup">
          <div className="photo-popup-overlay" onClick={closePopup}></div>
          <div className="photo-popup-content">
            <img src={selectedPhoto} alt="Selected" className="photo-popup-image" />
            <button className="close-popup-btn" onClick={closePopup}>×</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default PhotoLibrary;
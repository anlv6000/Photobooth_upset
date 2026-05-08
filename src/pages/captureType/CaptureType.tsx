import React from "react";
import { useNavigate } from "react-router-dom";
import { useCandidContext } from "../../context/storeContext";
import "./captureTypeStyling.css";

const CaptureType = () => {
  const navigate = useNavigate();
  const { setMode, setSelectedEventPreset } = useCandidContext();

  const handleCustomClick = () => {
    setMode("custom");
    setSelectedEventPreset(null);
    navigate("/copies");
  };

  const handleEventClick = () => {
    setMode("event");
    navigate("/event-frames");
  };

  const handlePhotoLibraryClick = () => {
    navigate("/photo-library");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="capture-type-page">
      <button type="button" className="back-btn-small" onClick={handleBack} title="Quay lại">← Quay lại</button>
      <div className="capture-type-card">
        <h1>CHỌN KIỂU CHỤP</h1>
        <p>Chụp custom sẽ tiếp luồng hiện tại của bạn. Chụp sự kiện sẽ chọn khung PNG riêng và chèn ảnh vào khung.</p>
        <div className="capture-type-buttons">
          <button className="capture-type-btn custom-btn" onClick={handleCustomClick}>
            CHỤP CUSTOM
          </button>
          <button className="capture-type-btn event-btn" onClick={handleEventClick}>
            CHỤP SỰ KIỆN
          </button>
          <button className="capture-type-btn library-btn" onClick={handlePhotoLibraryClick}>
            KHO ẢNH
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptureType;

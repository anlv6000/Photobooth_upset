import React from "react";
import { useNavigate } from "react-router-dom";
import { useCandidContext } from "../../context/storeContext";
import "./shootModeStyling.css";

const ShootMode = () => {
  const navigate = useNavigate();
  const { setMode } = useCandidContext();

  const handleCustomMode = () => {
    setMode("custom");
    navigate("/copies");
  };

  const handleEventMode = () => {
    setMode("event");
    navigate("/event-frames");
  };
  const handlePhotoLibraryClick = () => {
    navigate("/photo-library");
  };

  const handleBack = () => { navigate(-1); };

  return (
    <div className="shoot-mode-page">
      <button type="button" className="back-btn-small" onClick={handleBack} title="Quay lại">← Quay lại</button>
      <div className="shoot-mode-card">
        <h1>CHỌN CHẾ ĐỘ CHỤP</h1>
        <p>Chọn chế độ chụp phù hợp với nhu cầu của bạn</p>
        <div className="shoot-mode-buttons">
          <button className="shoot-mode-btn custom-btn" onClick={handleCustomMode}>
            <h2>CHỤP CUSTOM</h2>
            <p>Chụp ảnh với khung có sẵn, có thể chọn theme và layout</p>
          </button>
          <button className="shoot-mode-btn event-btn" onClick={handleEventMode}>
            <h2>CHỤP SỰ KIỆN</h2>
            <p>Tải lên khung riêng, tạo preset và chụp với layout tùy chỉnh</p>
          </button>
          <button className="shoot-mode-btn library-btn" onClick={handlePhotoLibraryClick}>
            <h2>KHO ẢNH</h2>
            <p>Xem lại toàn bộ ảnh đã lưu trong thư viện</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShootMode;
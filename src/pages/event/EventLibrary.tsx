import React from "react";
import { useNavigate } from "react-router-dom";
import { useCandidContext } from "../../context/storeContext";
import "./eventLibraryStyling.css";

const EventLibrary = () => {
  const navigate = useNavigate();
  const { eventFrames, setSelectedEventPreset, setMode, frameComponents } = useCandidContext();

  const getComponentSrc = (id: string) => frameComponents.find(c => c.id === id)?.src || "";

  const handleUsePreset = (preset: any) => {
    setSelectedEventPreset(preset);
    setMode("event");
    navigate("/event-frame");
  };

  const handleCreateNew = () => {
    setSelectedEventPreset(null);
    setMode("event");
    navigate("/event-frames");
  };

  return (
    <div className="event-library-page">
      <div className="event-library-card">
        <div className="event-library-header">
          <h1>KHUNG SỰ KIỆN ĐÃ LƯU</h1>
          <p>Chọn một khung đã lưu hoặc tạo khung mới cho kiểu chụp sự kiện.</p>
        </div>
        <div className="preset-grid">
          {eventFrames.map((preset) => (
            <div key={preset.id} className="preset-card">
              <div className="preset-preview" style={{ backgroundImage: `url(${getComponentSrc(preset.backgroundIds?.[0])})` }}>
                {preset.headerId && <img src={getComponentSrc(preset.headerId)} alt="preset header" className="preset-header" />}
                {preset.footerId && <img src={getComponentSrc(preset.footerId)} alt="preset footer" className="preset-footer" />}
              </div>
              <div className="preset-meta">
                <h2>{preset.name}</h2>
                <p>{preset.layoutType === "6square" ? "3x2" : preset.layoutType === "2strip" ? "2 strip" : preset.layoutType === "3strip" ? "3 strip" : preset.layoutType === "4strip" ? "4 strip" : "Đơn"}</p>
              </div>
              <button className="preset-btn" onClick={() => handleUsePreset(preset)}>
                Chọn khung
              </button>
            </div>
          ))}
        </div>
        <div className="library-action-row">
          <button className="create-new-btn" onClick={handleCreateNew}>
            Tạo khung mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventLibrary;

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCandidContext, EventFramePreset } from "../../context/storeContext";
import "./eventFrameStyling.css";

const layoutOptions = [
  { value: "1", label: "Đơn" },
  { value: "2strip", label: "2 Strip" },
  { value: "3strip", label: "3 Strip" },
  { value: "4strip", label: "4 Strip" },
  { value: "6square", label: "3x2" },
];

const layoutPhotoCount: Record<string, number> = {
  "1": 1,
  "2strip": 2,
  "3strip": 3,
  "4strip": 4,
  "6square": 6,
};

const EventFrameSelection = () => {
  const navigate = useNavigate();
  const {
    frameClusters,
    frameComponents,
    eventFrames,
    selectedEventPreset,
    setSelectedEventPreset,
    setEventFrames,
    setLayoutType,
    setRequiredCount,
    setMode,
  } = useCandidContext();

  const [presetId, setPresetId] = useState<string>(selectedEventPreset?.id || `event-preset-${Date.now()}`);
  const [presetName, setPresetName] = useState<string>(selectedEventPreset?.name || "");
  const [layoutChoice, setLayoutChoice] = useState<string>(selectedEventPreset?.layoutType || "1");
  const [headerChoice, setHeaderChoice] = useState<string>(selectedEventPreset?.headerId || "");
  const [backgroundChoices, setBackgroundChoices] = useState<string[]>(
    selectedEventPreset?.backgroundIds || Array.from({ length: layoutPhotoCount[selectedEventPreset?.layoutType || "1"] }, () => "")
  );
  const [footerChoice, setFooterChoice] = useState<string>(selectedEventPreset?.footerId || "");
  const [frameChoice, setFrameChoice] = useState<string>(selectedEventPreset?.frameId || "");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setMode("event");
  }, [setMode]);

  useEffect(() => {
    if (selectedEventPreset) {
      setPresetId(selectedEventPreset.id);
      setPresetName(selectedEventPreset.name);
      setLayoutChoice(selectedEventPreset.layoutType);
      setHeaderChoice(selectedEventPreset.headerId);
      setBackgroundChoices(
        selectedEventPreset.backgroundIds.length
          ? selectedEventPreset.backgroundIds
          : Array.from({ length: layoutPhotoCount[selectedEventPreset.layoutType] }, () => "")
      );
      setFooterChoice(selectedEventPreset.footerId);
      setFrameChoice(selectedEventPreset.frameId || "");
    }
  }, [selectedEventPreset]);

  const currentCluster = frameClusters.find(c => c.id === selectedEventPreset?.clusterId);
  const availableHeaders = currentCluster?.headers || [];
  const availableFooters = currentCluster?.footers || [];
  const availableBackgrounds = currentCluster?.backgrounds || [];
  const availableFrames = currentCluster?.frames || [];

  const getComponentSrc = (id: string) => frameComponents.find(c => c.id === id)?.src || "";

  const currentPreset: EventFramePreset = useMemo(
    () => ({
      id: presetId,
      name: presetName.trim() || "Khung Sự Kiện",
      clusterId: selectedEventPreset?.clusterId || "",
      layoutType: layoutChoice,
      headerId: headerChoice,
      footerId: footerChoice,
      backgroundIds: backgroundChoices,
      frameId: frameChoice || undefined,
    }),
    [presetId, presetName, layoutChoice, headerChoice, footerChoice, backgroundChoices, frameChoice, selectedEventPreset]
  );

  const handleSavePreset = () => {
    const name = presetName.trim() || `Khung ${eventFrames.length + 1}`;
    const newPreset = { ...currentPreset, name };

    const updatedFrames = selectedEventPreset
      ? eventFrames.map((preset) => (preset.id === selectedEventPreset.id ? newPreset : preset))
      : [...eventFrames, newPreset];

    setEventFrames(updatedFrames);
    setSelectedEventPreset(newPreset);
    setPresetId(newPreset.id);
    setPresetName(name);
    setMessage("Đã lưu khung vào thư viện");
  };

  const handleContinue = () => {
    setSelectedEventPreset(currentPreset);
    setLayoutType(layoutChoice);
    setRequiredCount(layoutPhotoCount[layoutChoice]);
    navigate("/camera");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="event-frame-page">
      <button type="button" className="back-btn-small" onClick={handleBack} title="Quay lại">← Quay lại</button>
      <div className="event-frame-card">
        <div className="event-frame-content">
          <div className="event-frame-intro">
            <h1>CONFIG KHUNG SỰ KIỆN</h1>
            <p>Hiển thị loại strip đã chọn. Gán khung cho từng slot ảnh. Áp dụng header/background/footer từ khung sự kiện đã tạo.</p>
          </div>

          <div className="section-row">
            <h2>Loại strip: {layoutOptions.find(l => l.value === layoutChoice)?.label}</h2>
          </div>

        <div className="section-row">
          <h2>Chọn Header</h2>
          <div className="option-row">
            {availableHeaders.map((option) => (
              <button
                key={option.id}
                className={`option-button ${headerChoice === option.id ? "selected" : ""}`}
                onClick={() => setHeaderChoice(option.id)}
              >
                <img src={option.src} alt={option.name} />
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="section-row">
          <h2>Gán khung cho từng slot ảnh</h2>
          <div className="background-slot-grid">
            {backgroundChoices.map((backgroundId, index) => (
              <div key={index} className="background-slot-card">
                <span>Ảnh {index + 1}</span>
                <div className="option-row">
                  {availableBackgrounds.map((option) => (
                    <button
                      key={option.id}
                      className={`option-button ${backgroundId === option.id ? "selected" : ""}`}
                      onClick={() => {
                        const newChoices = [...backgroundChoices];
                        newChoices[index] = option.id;
                        setBackgroundChoices(newChoices);
                      }}
                    >
                      <img src={option.src} alt={option.name} />
                      <span>{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-row">
          <h2>Chọn Footer</h2>
          <div className="option-row">
            {availableFooters.map((option) => (
              <button
                key={option.id}
                className={`option-button ${footerChoice === option.id ? "selected" : ""}`}
                onClick={() => setFooterChoice(option.id)}
              >
                <img src={option.src} alt={option.name} />
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="section-row">
          <h2>Chọn Frame Overlay (tùy chọn)</h2>
          <div className="option-row">
            {availableFrames.map((option) => (
              <button
                key={option.id}
                className={`option-button ${frameChoice === option.id ? "selected" : ""}`}
                onClick={() => setFrameChoice(option.id)}
              >
                <img src={option.src} alt={option.name} />
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="section-row preview-row">
          <div className="preview-card">
            <span className="preview-label">Xem trước</span>
            <div className="preview-mockup">
              {headerChoice && <img src={getComponentSrc(headerChoice)} alt="preview header" className="preview-header" />}
              <div className="preview-body preview-slot-grid">
                {backgroundChoices.map((backgroundId, index) => (
                  <div key={index} className="preview-slot" style={{ backgroundImage: `url(${getComponentSrc(backgroundId)})` }}>
                    <span>Ảnh {index + 1}</span>
                  </div>
                ))}
              </div>
              {footerChoice && <img src={getComponentSrc(footerChoice)} alt="preview footer" className="preview-footer" />}
              {frameChoice && <img src={getComponentSrc(frameChoice)} alt="preview frame" className="preview-frame" />}
            </div>
          </div>

          <div className="preset-controls">
            <label>
              Tên khung
              <input
                type="text"
                value={presetName}
                onChange={(event) => setPresetName(event.target.value)}
                placeholder="Nhập tên khung để lưu"
              />
            </label>
            <button className="save-btn" onClick={handleSavePreset}>
              LƯU KHUNG
            </button>
            {message && <p className="save-message">{message}</p>}
          </div>
        </div>

        <div className="action-row">
          <button className="continue-btn" onClick={handleContinue}>
            CHỤP SỰ KIỆN
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default EventFrameSelection;
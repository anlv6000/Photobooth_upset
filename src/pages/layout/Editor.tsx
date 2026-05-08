import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Rnd } from "react-rnd";
import CandidHeading from "../../components/candidHeader";
import CircularBtn from "../../components/circularBtn";
import styles from "./editorStyling.module.css";
import { useCandidContext } from "../../context/storeContext";

const Editor = () => {
  const location = useLocation();
  const { collageUrl, layoutType } = location.state || {};
  const [overlays, setOverlays] = useState<any[]>([]);
  const [selectedOverlayIndex, setSelectedOverlayIndex] = useState<number | null>(null);
  const { setEditorSettings } = useCandidContext();
  const navigate = useNavigate();
  const componentRef = useRef<HTMLDivElement>(null);

  const addText = () => {
    setOverlays([...overlays, { type: "text", text: "Nhập chữ...", color: "#fff", font: "Michroma", x: 100, y: 100, size: 24 }]);
  };

  const addLogo = () => {
    setOverlays([...overlays, { type: "image", src: "/assets/images/png/dummyPolaroid.png", x: 200, y: 200, size: 100 }]);
  };

  const addSticker = () => {
    setOverlays([...overlays, { type: "image", src: "/assets/images/png/wait-smiley.png", x: 300, y: 300, size: 100 }]);
  };

  const updateOverlay = (index: number, newData: any) => {
    const temp = [...overlays];
    temp[index] = { ...temp[index], ...newData };
    setOverlays(temp);
  };

  const saveAndDownload = async () => {
    if (componentRef.current) {
      const canvas = await html2canvas(componentRef.current, {
        backgroundColor: null,
        useCORS: true,
        scale: 3 // nhân pixel để đạt chuẩn in
      });
      const image = canvas.toDataURL("image/png"); // PNG giữ chi tiết tốt hơn JPEG
      setEditorSettings({ overlays, finalImage: image });

      // Thay vì download, truyền ảnh vào WaitPrompt để lưu vào library
      navigate("/wait-screen", { state: { finalImage: image } });
    }
  };

  const handleBack = () => { navigate(-1); };

  return (
    <div className={styles.container}>
      <button type="button" className="back-btn-small" onClick={handleBack} title="Quay lại">← Quay lại</button>
      <CandidHeading text="TUỲ CHỈNH ẢNH" />

      <div className={styles.mainContent}>
        {/* Panel bên trái */}
        <div className={styles.editorPanel}>
          <button className={styles.actionBtn} onClick={addText}>Thêm chữ</button>
          <button className={styles.actionBtn} onClick={addLogo}>Thêm Logo</button>
          <button className={styles.actionBtn} onClick={addSticker}>Thêm Sticker</button>

          {selectedOverlayIndex !== null && (
            <div className={styles.overlayControls}>
              <h4>Chỉnh Overlay {selectedOverlayIndex}</h4>
              {overlays[selectedOverlayIndex].type === "text" && (
                <>
                  <input
                    type="text"
                    value={overlays[selectedOverlayIndex].text}
                    onChange={(e) => updateOverlay(selectedOverlayIndex, { text: e.target.value })}
                  />
                  <input
                    type="color"
                    value={overlays[selectedOverlayIndex].color}
                    onChange={(e) => updateOverlay(selectedOverlayIndex, { color: e.target.value })}
                  />
                  <select
                    value={overlays[selectedOverlayIndex].font}
                    onChange={(e) => updateOverlay(selectedOverlayIndex, { font: e.target.value })}
                  >
                    <option value="Michroma">Michroma</option>
                    <option value="Kanit">Kanit</option>
                    <option value="Libre Barcode">Libre Barcode</option>
                  </select>
                  <label>Kích thước chữ:</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={overlays[selectedOverlayIndex].size}
                    onChange={(e) => updateOverlay(selectedOverlayIndex, { size: Number(e.target.value) })}
                  />
                </>
              )}
              {overlays[selectedOverlayIndex].type === "image" && (
                <>
                  <label>Kích thước ảnh:</label>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={overlays[selectedOverlayIndex].size}
                    onChange={(e) => updateOverlay(selectedOverlayIndex, { size: Number(e.target.value) })}
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* Preview bên phải */}
        <div className={styles.previewArea}>
          <div
            className={`${styles.previewWrapper} ${styles[`preview-${layoutType}`]}`}
            ref={componentRef}
          >
            {/* Render ảnh ghép trực tiếp */}
            {collageUrl && (
              <img
                src={collageUrl}
                alt="Collage Preview"
                className={styles.previewImage}
              />
            )}

            {/* Overlay */}
            {overlays.map((overlay, i) => (
              <Rnd
                key={i}
                size={{
                  width: overlay.size,
                  height: overlay.type === "text" ? overlay.size : overlay.size,
                }}
                position={{ x: overlay.x, y: overlay.y }}
                onDragStop={(e, d) => updateOverlay(i, { x: d.x, y: d.y })}
                enableResizing={false}
                bounds="parent"
                onClick={() => setSelectedOverlayIndex(i)}
              >
                {overlay.type === "text" ? (
                  <div
                    style={{
                      color: overlay.color,
                      fontFamily: overlay.font,
                      fontSize: `${overlay.size}px`,
                      background: "transparent",
                      textAlign: "center",
                    }}
                  >
                    {overlay.text}
                  </div>
                ) : (
                  <img
                    src={overlay.src}
                    alt="Overlay"
                    style={{ width: `${overlay.size}px`, height: "auto" }}
                  />
                )}
              </Rnd>
            ))}
          </div>
        </div>
        {/* Nút Print/Lưu */}
        <div className={styles.printBtnPlacement}>
          <CircularBtn
            onClick={saveAndDownload}
            buttonText="SAVE & PRINT"
            iconUrl="/assets/images/png/printer_icon.png"
          />
        </div>
      </div>


    </div>
  );
};

export default Editor;

import { useNavigate } from "react-router-dom";
import CandidHeading from "../../components/candidHeader";
import CircularBtn from "../../components/circularBtn";
import styles from "./layoutStyling.module.css";
import { useCandidContext } from "../../context/storeContext";
import React, { useState } from "react";

const LayoutSelection = () => {
  const navigate = useNavigate();

  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);

  const handleLayoutClick = (layoutType: string) => {
    setSelectedLayout(layoutType);
  };
  const { setLayoutType, setRequiredCount } = useCandidContext();

  const layoutPhotoCount: Record<string, number> = {
    "1": 3,
    "2strip": 4,
    "3strip": 5,
    "4strip": 6,
    "6square": 8,
  };


  const navigateToNextPage = () => {
    if (selectedLayout) {
      setLayoutType(selectedLayout);
      setRequiredCount(layoutPhotoCount[selectedLayout]); // lưu số ảnh cần chụp
      navigate("/theme");
    }
  };

  const handleBack = () => { navigate(-1); };

  return (
    <div className={styles.container}>
      <button type="button" className="back-btn-small" onClick={handleBack} title="Quay lại">← Quay lại</button>
      <CandidHeading text="CHỌN LAYOUT" />
      <div className={styles.layoutRow}>
        <button className={styles.layoutButton} onClick={() => handleLayoutClick("1")}>1 Strip</button>
        <button className={styles.layoutButton} onClick={() => handleLayoutClick("2strip")}>2 Strip</button>
        <button className={styles.layoutButton} onClick={() => handleLayoutClick("3strip")}>3 Strip</button>
        <button className={styles.layoutButton} onClick={() => handleLayoutClick("4strip")}>4 Strip</button>
        <button className={styles.layoutButton} onClick={() => handleLayoutClick("6square")}>6 Square</button>
      </div>

      {/* Preview layout */}
      {selectedLayout && (
        <div className={styles.previewArea}>
          <img
            src={`/assets/images/layouts/${selectedLayout}.png`}
            alt="Layout Preview"
            className={styles.previewImage}
          />
        </div>
      )}

      {/* Next button */}
      <div className={styles.nextIconPlacement}>
        <CircularBtn
          onClick={navigateToNextPage}
          buttonText="READY TO BE CANDID"
          iconUrl="/assets/images/png/next_icon.png"
        />
      </div>
    </div>
  );
};

export default LayoutSelection;

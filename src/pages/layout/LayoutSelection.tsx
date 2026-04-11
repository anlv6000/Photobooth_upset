import { useNavigate } from "react-router-dom";
import CandidHeading from "../../components/candidHeader";
import CircularBtn from "../../components/circularBtn";
import styles from "./layoutStyling.module.css";
import { useCandidContext } from "../../context/storeContext";
import React, { useState } from "react";

const LayoutSelection = () => {
  const navigate = useNavigate();
  const { setLayoutType } = useCandidContext();

  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);

  const handleLayoutClick = (layoutType: string) => {
    setSelectedLayout(layoutType);
  };

  const navigateToNextPage = () => {
    if (selectedLayout) {
      setLayoutType(selectedLayout);
      navigate("/theme");
    }
  };

  return (
    <div className={styles.container}>
      <CandidHeading text="CHỌN LAYOUT" />
      <div className={styles.layoutRow}>
        <button className={styles.layoutButton} onClick={() => handleLayoutClick("1")}>1 Strip</button>
        <button className={styles.layoutButton} onClick={() => handleLayoutClick("2plus1")}>2 Strip</button>
        <button className={styles.layoutButton} onClick={() => handleLayoutClick("3strip")}>3 Strip</button>
        <button className={styles.layoutButton} onClick={() => handleLayoutClick("4strip")}>4 Strip</button>
        <button className={styles.layoutButton} onClick={() => handleLayoutClick("4square")}>4 Square</button>
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

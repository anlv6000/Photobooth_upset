import { useNavigate } from "react-router-dom";
import CandidHeading from "../../components/candidHeader";
import CircularBtn from "../../components/circularBtn";
import styles from "./themeStyling.module.css";
import { useCandidContext } from "../../context/storeContext";
import React, { useState } from "react";
import { themes, ThemeKey } from "../../context/themes";
const ThemeSelection = () => {
  const navigate = useNavigate();
  const { setTheme } = useCandidContext();

  const [selectedTheme, setSelectedTheme] = useState<ThemeKey | null>(null);

  const handleThemeClick = (themeKey: ThemeKey) => {
    console.log("ThemeSelection: clicked themeKey =", themeKey);
    setSelectedTheme(themeKey);
  };

  const navigateToNextPage = () => {
    if (selectedTheme) {
      console.log("ThemeSelection: setting theme =", themes[selectedTheme]);
      setTheme(themes[selectedTheme]);
      setTimeout(() => {
        console.log("ThemeSelection: navigating to /camera with theme =", themes[selectedTheme]);
        navigate("/camera");
      }, 0);
    }
  };

  const handleBack = () => { navigate(-1); };

  return (
    <div className={styles.container}>
      <button type="button" className="back-btn-small" onClick={handleBack} title="Quay lại">← Quay lại</button>
      <CandidHeading text="CHỌN CHỦ ĐỀ" />
      <div className={styles.themeRow}>
        <button className={styles.themeButton} onClick={() => handleThemeClick("wedding")}>Đám cưới</button>
        <button className={styles.themeButton} onClick={() => handleThemeClick("birthday")}>Sinh nhật</button>
        <button className={styles.themeButton} onClick={() => handleThemeClick("corporate")}>Doanh nghiệp</button>
        <button className={styles.themeButton} onClick={() => handleThemeClick("festival")}>Lễ hội</button>
      </div>

      {/* Preview theme */}
      {selectedTheme && (
        <div className={styles.previewArea}>
          <img
            src={themes[selectedTheme].background}
            alt="Theme Preview"
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

export default ThemeSelection;

import { useNavigate } from "react-router-dom";
import CandidHeading from "../../components/candidHeader";
import CircularBtn from "../../components/circularBtn";
import styles from "./themeStyling.module.css";
import { useCandidContext } from "../../context/storeContext";
import React, { useState } from "react";

const ThemeSelection = () => {
  const navigate = useNavigate();
  const { setTheme } = useCandidContext();

  const [selectedTheme, setSelectedTheme] = React.useState<string | null>(null);

  const handleThemeClick = (theme: string) => {
    setSelectedTheme(theme);
  };

  const navigateToNextPage = () => {
    if (selectedTheme) {
      setTheme(selectedTheme);
      navigate("/camera");
    }
  };

  return (
    <div className={styles.container}>
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
            src={`/assets/themes/${selectedTheme}.png`}
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

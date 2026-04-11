import React, { RefObject } from "react";
import ImageGrid from "./imageGrid";
import { getTodayDateInRomanNumeral } from "../utils/helper";

interface PolaroidProps {
  photoUrls: string[];
  componentRef: RefObject<HTMLDivElement>;
  frameSrc?: string; // thêm prop khung
}

const CandidPolaroid: React.FC<PolaroidProps> = ({ photoUrls, componentRef, frameSrc }) => {
  return (
    <div className="polaroid" ref={componentRef}>
      <p className="polaroid-text">CANDID</p>
      <div className="polaroid-inner">
        <ImageGrid imageUrls={photoUrls} />
        {frameSrc && <img src={frameSrc} className="frame-overlay" alt="frame" />}
      </div>
      <p className="polaroid-text">{getTodayDateInRomanNumeral()}</p>
    </div>
  );
};


export default CandidPolaroid;

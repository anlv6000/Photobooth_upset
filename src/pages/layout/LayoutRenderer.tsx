import React, { RefObject } from "react";
import "./layoutRenderer.css";   

interface LayoutRendererProps {
  layoutType: string;
  photos: string[];
  componentRef: RefObject<HTMLDivElement>;
  frameSrc?: string;
}

const LayoutRenderer: React.FC<LayoutRendererProps> = ({ layoutType, photos, componentRef, frameSrc }) => {
  return (
    <div className={`polaroid polaroid-${layoutType}`} ref={componentRef}>
      <p className="polaroid-text">CANDID</p>
      <div className="polaroid-inner">
        {layoutType === "1" && (
          <div className="layout-1">
            <img src={photos[0]} alt="layout image" />
          </div>
        )}
        {layoutType === "2plus1" && (
          <div className="layout-2plus1">
            <div className="top-row">
              <img src={photos[0]} alt="layout image" />
              <img src={photos[1]} alt="layout image" />
            </div>
            <div className="bottom-row">
              <img src={photos[2]} alt="layout image" />
            </div>
          </div>
        )}
        {layoutType === "3strip" && (
          <div className="layout-3strip">
            {photos.slice(0,3).map((p,i)=><img key={i} src={p} alt="layout image" />)}
          </div>
        )}
        {layoutType === "4strip" && (
          <div className="layout-4strip">
            {photos.slice(0,4).map((p,i)=><img key={i} src={p} alt="layout image" />)}
          </div>
        )}
        {layoutType === "4square" && (
          <div className="layout-4square">
            {photos.slice(0,4).map((p,i)=><img key={i} src={p} alt="layout image" />)}
          </div>
        )}
        {frameSrc && <img src={frameSrc} className="frame-overlay" alt="frame" />}
      </div>
      <p className="polaroid-text">{new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default LayoutRenderer;

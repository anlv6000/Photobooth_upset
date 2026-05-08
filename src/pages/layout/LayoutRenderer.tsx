import React, { RefObject } from "react";
import "./layoutRenderer.css";
import { useCandidContext } from "../../context/storeContext";

interface LayoutRendererProps {
  layoutType: string;
  photos: string[];
  componentRef: RefObject<HTMLDivElement>;
}

const LayoutRenderer: React.FC<LayoutRendererProps> = ({ layoutType, photos, componentRef }) => {
  const { theme, mode, selectedEventPreset, frameComponents } = useCandidContext();

  const getComponentSrc = (id: string) => frameComponents.find(c => c.id === id)?.src || "";

  const getSlotBackground = (index: number) => {
    if (mode === "event" && selectedEventPreset) {
      const backgroundId = selectedEventPreset.backgroundIds?.[index];
      return backgroundId ? getComponentSrc(backgroundId) : "";
    }
    return theme?.background || "";
  };

  const headerImg = mode === "event" && selectedEventPreset ? getComponentSrc(selectedEventPreset.headerId) : theme?.header;
  const footerImg = mode === "event" && selectedEventPreset ? getComponentSrc(selectedEventPreset.footerId) : theme?.footer;
  const frameImg = mode === "event" && selectedEventPreset?.frameId ? getComponentSrc(selectedEventPreset.frameId) : null;

  return (
    <div className={`polaroid polaroid-${layoutType}`} ref={componentRef}>
      {/* Layout 1 */}
      {layoutType === "1" && (
        <div className="layout-1-container">
          {headerImg && <img src={headerImg} className="layout-1-top" alt="frame top" />}
          <div className="layout-1">
            {photos[0] && <img src={photos[0]} alt="layout image" className="photo-img" />}
            {getSlotBackground(0) && <img src={getSlotBackground(0)} className="frame-overlay" alt="frame bg" />}
          </div>
          {footerImg && <img src={footerImg} className="layout-1-bottom" alt="frame bottom" />}
          {frameImg && <img src={frameImg} className="frame-overlay-full" alt="frame overlay" />}
        </div>
      )}

      {/* Layout 2strip */}
      {layoutType === "2strip" && (
        <div className="layout-2strip-container">
          {headerImg && <img src={headerImg} className="layout-2strip-top" alt="frame top" />}
          <div className="layout-2strip">
            {photos.slice(0, 2).map((p, i) => (
              <div key={i} className="photo-slot">
                {p && <img src={p} alt="layout image" className="photo-img" />}
                {getSlotBackground(i) && <img src={getSlotBackground(i)} className="frame-overlay" alt="frame strip" />}
              </div>
            ))}
          </div>
          {footerImg && <img src={footerImg} className="layout-2strip-bottom" alt="frame bottom" />}
          {frameImg && <img src={frameImg} className="frame-overlay-full" alt="frame overlay" />}
        </div>
      )}



      {/* Layout 3strip */}
      {layoutType === "3strip" && (
        <div className="layout-3strip-container">
          {headerImg && <img src={headerImg} className="layout-3strip-top" alt="frame top" />}
          <div className="layout-3strip">
            {photos.slice(0, 3).map((p, i) => (
              <div key={i} className="photo-slot">
                {p && <img src={p} alt="layout image" className="photo-img" />}
                {getSlotBackground(i) && <img src={getSlotBackground(i)} className="frame-overlay" alt="frame strip" />}
              </div>
            ))}
          </div>
          {footerImg && <img src={footerImg} className="layout-3strip-bottom" alt="frame bottom" />}
          {frameImg && <img src={frameImg} className="frame-overlay-full" alt="frame overlay" />}
        </div>
      )}

      {/* Layout 4strip */}
      {layoutType === "4strip" && (
        <div className="layout-4strip-container">
          {headerImg && <img src={headerImg} className="layout-4strip-top" alt="frame top" />}
          <div className="layout-4strip">
            {photos.slice(0, 4).map((p, i) => (
              <div key={i} className="photo-slot">
                {p && <img src={p} alt="layout image" className="photo-img" />}
                {getSlotBackground(i) && <img src={getSlotBackground(i)} className="frame-overlay" alt="frame strip" />}
              </div>
            ))}
          </div>
          {footerImg && <img src={footerImg} className="layout-4strip-bottom" alt="frame bottom" />}
          {frameImg && <img src={frameImg} className="frame-overlay-full" alt="frame overlay" />}
        </div>
      )}



      {/* Layout 6square */}
      {layoutType === "6square" && (
        <div className="layout-6square-container">
          {headerImg && <img src={headerImg} className="layout-6square-top" alt="frame top" />}
          <div className="layout-6square">
            {photos.slice(0, 6).map((p, i) => (
              <div key={i} className="photo-slot">
                {p && <img src={p} alt="layout image" className="photo-img" />}
                {getSlotBackground(i) && <img src={getSlotBackground(i)} className="frame-overlay" alt="frame square" />}
              </div>
            ))}
          </div>
          {footerImg && <img src={footerImg} className="layout-6square-bottom" alt="frame bottom" />}
          {frameImg && <img src={frameImg} className="frame-overlay-full" alt="frame overlay" />}
        </div>
      )}
    </div>
  );
};

export default LayoutRenderer;

/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import CircularBtn from "../../components/circularBtn";
import CandidHeading from "../../components/candidHeader";
import "./polaroidStyling.css";
import { useCandidContext } from "../../context/storeContext";
import LayoutRenderer from "./../layout/LayoutRenderer";

const PhotoSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const originalPhotos: string[] = location.state?.images || [];

  const layoutPhotoCount: Record<string, number> = {
    "1": 1,
    "2strip": 2,
    "3strip": 3,
    "4strip": 4,
    "6square": 6,
  };

  const { layoutType, orientation, theme } = useCandidContext();
  const requiredCount = layoutPhotoCount[layoutType] || 4;

  const [editedPhotos, setEditedPhotos] = useState<string[]>(originalPhotos);
  const [selectedPhotosIndexes, setSelectedPhotosIndexes] = useState<number[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>(Array(requiredCount).fill(""));

  // ref cho container ẩn phóng to
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedPhotos(location.state?.editedPhotos || originalPhotos);
    if (location.state?.selectedPhotosIndexes) {
      setSelectedPhotosIndexes(location.state.selectedPhotosIndexes);
      const updated = Array(requiredCount).fill("");
      const selected = location.state?.editedPhotos || originalPhotos;
      (location.state.selectedPhotosIndexes || []).forEach((index: number, slot: number) => {
        updated[slot] = selected[index] || "";
      });
      setPhotoUrls(updated);
    }
  }, [location.state, originalPhotos, requiredCount]);

  const displayPhotos = editedPhotos.length ? editedPhotos : originalPhotos;

  // chụp container ẩn phóng to
  const captureComponent = async () => {
    if (componentRef.current) {
      const canvas = await html2canvas(componentRef.current, {
        backgroundColor: null,
        useCORS: true,
        scale: 3 // vì đã scale bằng CSS
      });
      return canvas.toDataURL("image/png");
    }
    return "";
  };

  const goToEditor = async () => {
    const image = await captureComponent();
    navigate("/editor", {
      state: {
        collageUrl: image,
        layoutType,
        orientation,
        theme
      }
    });
  };

  const goToPhotoEditor = () => {
    navigate("/photo-editor", {
      state: {
        photos: displayPhotos,
        selectedPhotosIndexes,
      },
    });
  };

  const handlePictureToggle = (image: string, imageIndex: number) => {
    const updatedPhotos = [...photoUrls];
    if (selectedPhotosIndexes.includes(imageIndex)) {
      const newIndexes = selectedPhotosIndexes.filter(i => i !== imageIndex);
      setSelectedPhotosIndexes(newIndexes);
      const removeSlot = updatedPhotos.findIndex((url) => url === image);
      if (removeSlot !== -1) updatedPhotos[removeSlot] = "";
      setPhotoUrls(updatedPhotos);
    } else {
      if (selectedPhotosIndexes.length < requiredCount) {
        setSelectedPhotosIndexes([...selectedPhotosIndexes, imageIndex]);
        const emptyPos = updatedPhotos.findIndex((url) => url === "");
        if (emptyPos !== -1) {
          updatedPhotos[emptyPos] = image;
          setPhotoUrls(updatedPhotos);
        }
      }
    }
  };

  const handleBack = () => { navigate(-1); };

  return (
    <div className="container">
      <button type="button" className="back-btn-small" onClick={handleBack} title="Quay lại">← Quay lại</button>
      <CandidHeading text="SELECT YOUR PICTURES" />
      <div className="page-content">
        <div className="edit-option-panel">
          <h3>Chỉnh sửa ảnh</h3>
          <div className="selected-photo-preview-row">
            {displayPhotos.map((url: string, index: number) =>
              url ? (
                <img key={index} src={url} alt={`Photo ${index + 1}`} className="selected-thumb" />
              ) : null
            )}
          </div>
          <button
            className="edit-option-btn"
            onClick={goToPhotoEditor}
            disabled={!displayPhotos.length}
          >
            Chỉnh ảnh đã chụp
          </button>
        </div>

        {/* Preview nhỏ */}
        <LayoutRenderer
          layoutType={layoutType}
          photos={photoUrls}
          componentRef={null as any}
        />

        {/* Container ẩn phóng to để chụp, có componentRef */}
        <div style={{ position: "absolute", top: -9999, left: -9999 }}>
          <div
            ref={componentRef}
            style={{ transform: "scale(3)", transformOrigin: "top left" }}
          >
            <LayoutRenderer
              layoutType={layoutType}
              photos={photoUrls}
              componentRef={componentRef}
            />
          </div>
        </div>

        <div className="selection-container">
          <div className="selection-row">
            {displayPhotos.map((photo: string, index: number) => (
              <button
                key={`${photo}-${index}`}
                className="image-button"
                onClick={() => handlePictureToggle(photo, index)}
              >
                <img
                  className={`candid-image ${selectedPhotosIndexes.includes(index) ? "highlight-image" : ""}`}
                  src={photo}
                  alt="Candid Image"
                />
              </button>
            ))}
          </div>
          <div className="selection-row edit-btn-placement">
            <CircularBtn
              onClick={goToEditor}
              buttonText="EDIT YOUR PICTURE"
              iconUrl="/assets/images/png/edit_icon.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoSelection;

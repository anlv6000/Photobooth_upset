/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import CircularBtn from "../../components/circularBtn";
import CandidHeading from "../../components/candidHeader";
import "./polaroidStyling.css";
import { useCandidContext } from "../../context/storeContext";
import LayoutRenderer from './../layout/LayoutRenderer';

const PhotoSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const componentRef = useRef(null);
  const photos = location.state?.images;
  const [url, setUrl] = useState<string>("");

  const layoutPhotoCount: Record<string, number> = {
    "1": 1,
    "2plus1": 3,
    "3strip": 3,
    "4strip": 4,
    "4square": 4,
  };
  const { layoutType, orientation, theme } = useCandidContext();
  const requiredCount = layoutPhotoCount[layoutType] || 4;

  // danh sách index ảnh đã chọn
  const [selectedPhotosIndexes, setSelectedPhotosIndexes] = useState<number[]>([]);
  // danh sách url ảnh đã chọn
  const [photoUrls, setPhotoUrls] = useState<string[]>(Array(requiredCount).fill(""));

  useEffect(() => {
    captureComponent();
  }, [photoUrls]);

  const captureComponent = async () => {
    if (componentRef.current !== null) {
      const canvas = await html2canvas(componentRef.current);
      const image = canvas.toDataURL("image/jpeg");
      setUrl(image);
    }
  };

  const editClick = async () => {
    await captureComponent();
    navigate("/editor", { state: { collageUrl: url, layoutType, orientation, theme } });
  };

  const handlePictureToggle = (image: string, imageIndex: number) => {
    if (selectedPhotosIndexes.includes(imageIndex)) {
      // bỏ chọn
      const newIndexes = selectedPhotosIndexes.filter(i => i !== imageIndex);
      setSelectedPhotosIndexes(newIndexes);

      const newUrls = [...photoUrls];
      const pos = newUrls.findIndex(u => u === image);
      if (pos !== -1) newUrls[pos] = "";
      setPhotoUrls(newUrls);
    } else {
      // chưa chọn, kiểm tra số lượng
      if (selectedPhotosIndexes.length < requiredCount) {
        setSelectedPhotosIndexes([...selectedPhotosIndexes, imageIndex]);

        const newUrls = [...photoUrls];
        const emptyPos = newUrls.findIndex(u => u === "");
        if (emptyPos !== -1) newUrls[emptyPos] = image;
        setPhotoUrls(newUrls);
      }
    }
  };

  return (
    <div className="container">
      <CandidHeading text="SELECT YOUR PICTURES" />
      <div className="page-content">
        <LayoutRenderer layoutType={layoutType} photos={photoUrls} componentRef={componentRef} />
        <div className="selection-container">
          <div className="selection-row">
            {photos.map((photo: string, index: number) => (
              <button
                key={photo}
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
              onClick={editClick}
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

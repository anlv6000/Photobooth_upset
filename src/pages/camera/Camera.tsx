import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";
import CameraButton from "../../components/cameraBtn";
import CandidHeading from "../../components/candidHeader";
import "./cameraStyling.css";
import { useCandidContext } from "../../context/storeContext";

export const Camera = () => {
  const navigate = useNavigate();

  const componentRef = useRef(null);
  const webcamRef = useRef<Webcam>(null);

  const [countdown, setCountdown] = useState<number>(0);
  const [pictureCount, setPictureCount] = useState<number>(0);
  const [showCheeseText, setShowCheeseText] = useState<boolean>(false);
  const [triggerCountDown, setTriggerCountDown] = useState<boolean>(false);
  const [captureMode, setCaptureMode] = useState<'auto' | 'manual'>('auto');
  const { layoutType, requiredCount, mode } = useCandidContext();
  const photoUrlsRef = useRef<any[]>(Array(requiredCount).fill(""));

  let countdownInterval: string | number | NodeJS.Timer | undefined;
  const videoConstraints = {
    width: 600,   // tăng chiều rộng
    height: 500,   // tăng chiều cao
    facingMode: "user",
  };

  useEffect(() => {
    const captureComponent = async () => {
      if (componentRef.current !== null) {
        await html2canvas(componentRef.current);
      }
    };
    captureComponent();
    if (pictureCount === requiredCount) {
      clearInterval(countdownInterval);
      setTriggerCountDown(false);
      setCountdown(0);
      navigate("/polaroid", {
        state: { images: photoUrlsRef.current },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pictureCount, navigate]);

  useEffect(() => {
    if (triggerCountDown && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowCheeseText(true);
            setTimeout(() => {
              setShowCheeseText(false);
              capturePhoto();
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [triggerCountDown, countdown]);


  const capturePhoto = () => {
    const image = webcamRef.current?.getScreenshot();
    if (image !== null && pictureCount < requiredCount) {
      photoUrlsRef.current[pictureCount] = image;
      setPictureCount(prev => prev + 1);
    }

    if (captureMode === 'auto' && pictureCount + 1 < requiredCount) {
      setCountdown(3);
      setTriggerCountDown(true);
    } else {
      // manual: dừng lại sau một lần
      setTriggerCountDown(false);
      setCountdown(0);
    }
  };


  const handleDeleteLastPhoto = () => {
    if (pictureCount > 0) {
      const lastIndex = pictureCount - 1;
      photoUrlsRef.current[lastIndex] = "";
      setPictureCount(prev => prev - 1);
    }
  };

  const handleManualCapture = () => {
    if (pictureCount < requiredCount) {
      setCountdown(3);
      setTriggerCountDown(true);
    }
  };


  const handleBack = () => {
    navigate(-1);
  };

  const handleClick = () => {
    if (captureMode === 'auto') {
      setCountdown(3);
      setTriggerCountDown(true);
    } else {
      handleManualCapture();
    }
  };


  return (
    <div className="container">
      <div className="camera-header">
        <button type="button" className="back-btn-camera" onClick={handleBack} title="Quay lại">← Quay lại</button>
        <div className="camera-mode-selector">
          <button
            type="button"
            className={`mode-btn ${captureMode === 'auto' ? 'active' : ''}`}
            onClick={() => setCaptureMode('auto')}
          >
            Tự động
          </button>
          <button
            type="button"
            className={`mode-btn ${captureMode === 'manual' ? 'active' : ''}`}
            onClick={() => setCaptureMode('manual')}
          >
            Thủ công
          </button>
        </div>
      </div>
      <CandidHeading text="CANDID PHOTOBOOTH" />
      <div className="camera-container">
        {/* Webcam */}
        <div className="camera-screen">
          <Webcam
            mirrored={true}
            audio={false}
            width={600}
            height={500}  // thêm chiều cao để khung đúng tỉ lệ ngang
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="camera"
          />
          {/* Countdown */}
          {countdown !== 0 ? <p className="countdown-text">{countdown}</p> : ""}
          {showCheeseText ? <p className="countdown-text">CHEESE</p> : ""}
        </div>
        {/* Camera Button */}
        <div className="camera-btn-placement">
          <CameraButton
            captureCount={pictureCount}
            onClick={() => {
              handleClick();
            }}
          />
          {captureMode === 'manual' && pictureCount > 0 && (
            <button type="button" className="undo-btn" onClick={handleDeleteLastPhoto} title="Xóa ảnh cuối cùng">
              ↶ Xóa
            </button>
          )}
        </div>
        <div className="sidebar-preview">
          {photoUrlsRef.current.map((photo, index) => (
            photo && (
              <div key={index} className="preview-item">
                <img src={photo} alt={`preview ${index}`} />
                {(mode === "semi" || captureMode === 'manual') && (
                  <button
                    onClick={() => {
                      photoUrlsRef.current[index] = "";
                      setPictureCount(prev => prev - 1);
                    }}
                  >
                    Xóa
                  </button>
                )}
              </div>
            )
          ))}
        </div>
      </div>

    </div>
  );
};

export default Camera;

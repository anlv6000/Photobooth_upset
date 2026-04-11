import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";
import CameraButton from "../../components/cameraBtn";
import CandidHeading from "../../components/candidHeader";
import "./cameraStyling.css";

export const Camera = () => {
  const navigate = useNavigate();

  const componentRef = useRef(null);
  const webcamRef = useRef<Webcam>(null);
  const photoUrlsRef = useRef<any[]>(Array(6).fill(""));

  const [countdown, setCountdown] = useState<number>(0);
  const [pictureCount, setPictureCount] = useState<number>(0);
  const [showCheeseText, setShowCheeseText] = useState<boolean>(false);
  const [triggerCountDown, setTriggerCountDown] = useState<boolean>(false);

  let countdownInterval: string | number | NodeJS.Timer | undefined;
  const videoConstraints = {
    width: 880,   // tăng chiều rộng
    height: 520,   // tăng chiều cao
    facingMode: "user",
  };

  useEffect(() => {
    const captureComponent = async () => {
      if (componentRef.current !== null) {
        await html2canvas(componentRef.current);
      }
    };
    captureComponent();
    if (pictureCount === 6) {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      countdownInterval = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    } else if (countdown === 0 && triggerCountDown) {
      clearInterval(countdownInterval);
      setShowCheeseText(true);
      setTimeout(() => {
        setShowCheeseText(false);
        capturePhoto();
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdown, pictureCount, triggerCountDown]);

  const capturePhoto = () => {
    setCountdown(3);
    if (pictureCount < 6) {
      const image = webcamRef.current?.getScreenshot();
      if (image !== null) {
        setPictureCount((prevCaptureCount) => prevCaptureCount + 1);
        photoUrlsRef.current[pictureCount] = image;
      }
      setTimeout(() => {
        setTriggerCountDown(true);
      }, 3000);
    } else {
      clearInterval(countdownInterval);
      setTriggerCountDown(false);
      setCountdown(0);
    }
  };

  const handleClick = () => {
    setCountdown(3);
    setTriggerCountDown(true);
  };

  return (
    <div className="container">
      <CandidHeading text="CANDID PHOTOBOOTH" />
      <div className="camera-container">
        {/* Webcam */}
        <div className="camera-screen">
          <Webcam
            mirrored={true}
            audio={false}
            width={880}
            height={520}  // thêm chiều cao để khung đúng tỉ lệ ngang
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
        </div>
      </div>
    </div>
  );
};

export default Camera;

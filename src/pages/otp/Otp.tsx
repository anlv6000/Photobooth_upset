import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './otpStyling.css';

const Otp = () => {
  const navigate = useNavigate();
  const [otp_val, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const numKeysColors = [
    '#FFFFFF',
    '#5E50FC',
    '#55A2FD',
    '#55A2FD',
    '#5E50FC',
    '#5E50FC',
    '#FFFFFF',
    '#96CDFF',
    '#FFFFFF',
    '#FA5C5C',
    '#5E50FC',
    '#FFF739',
  ];

  useEffect(() => {
    setTimeout(()=>{
      setError('');
    }, 10000)
  }, [error])

  const handleNumBtnClick = (keyEvent: string) => {
    if(keyEvent === 'del') {
      setOtp(prevOtp => prevOtp.slice(0, -1));
    }
    else if(keyEvent === 'enter') {
      if (otp_val.length < 4){
        setError('The OTP should be of 4 digits')
      } else if(otp_val !== '9999')
        setError('Oops, the OTP you entered is wrong')
      else
        navigate("/shoot-mode");
    }
    else {
      if (otp_val.length === 4){
        setError('The OTP can be of maximum 4 digits')
      } else setOtp(prevOtp => prevOtp + keyEvent);
    }
  };

  return (
    <div className='otp-page'>
      <div className='input-container'>
        <h1 className='otp-input-label'>ENTER THE OTP</h1>
        <div className='candid-input-field bungee-text'>
          {otp_val}
        </div>
        {error ? (<p className='error'>{error}</p>) : ""}
      </div>
      <div className='keyboard-area'>
        <div className='keyboard'>
          {[...Array(3)].map((_, rowIndex) => (
            <div className='num-key-row' key={rowIndex}>
              {[...Array(3)].map((_, colIndex) => {
                const number = rowIndex * 3 + colIndex + 1;
                return (
                  <button
                    key={colIndex}
                    className='numKey bungee-text num-text'
                    onClick={() => handleNumBtnClick(number.toString())}
                    style={{backgroundColor: numKeysColors[number - 1]}}
                  >
                    {number}
                  </button>
                );
              })}
            </div>
          ))}
          <div className='num-key-row'>
            {/* Delete Button */}
            <button
              className='numKey'
              onClick={() => handleNumBtnClick('del')}
              style={{backgroundColor: numKeysColors[9]}}
            >
              Delete
            </button>
            {/* 0 Button */}
            <button
              className='numKey bungee-text num-text'
              onClick={() => handleNumBtnClick('0')}
              style={{backgroundColor: numKeysColors[10]}}
            >
              0
            </button>
            {/* 0 Button */}
            <button
              className='numKey'
              onClick={() => handleNumBtnClick('enter')}
              style={{backgroundColor: numKeysColors[11]}}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Otp

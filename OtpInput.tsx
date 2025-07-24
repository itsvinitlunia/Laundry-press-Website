
import React, { useState, useRef, useEffect, RefObject } from 'react';

interface OtpInputProps {
  length?: number;
  onOtpSubmit?: (otp: string) => void;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 4, onOtpSubmit = () => {}, disabled = false }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  useEffect(() => {
    if (!disabled) {
      setOtp(new Array(length).fill(""));
    }
  }, [disabled, length]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length && onOtpSubmit) {
      onOtpSubmit(combinedOtp);
    }

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    inputRefs.current[index]?.setSelectionRange(1, 1);
    if (index > 0 && !otp[index - 1]) {
      const firstEmptyIndex = otp.indexOf("");
      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const pasteNumbers = pasteData.replace(/\D/g, '').slice(0, length);
    
    if (pasteNumbers.length > 0) {
      const newOtp = new Array(length).fill("");
      for (let i = 0; i < Math.min(pasteNumbers.length, length); i++) {
        newOtp[i] = pasteNumbers[i];
      }
      setOtp(newOtp);
      
      const nextFocusIndex = Math.min(pasteNumbers.length, length - 1);
      if (inputRefs.current[nextFocusIndex]) {
        inputRefs.current[nextFocusIndex]?.focus();
      }
      
      if (pasteNumbers.length === length && onOtpSubmit) {
        onOtpSubmit(pasteNumbers);
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          ref={(input) => { inputRefs.current[index] = input; }}
          value={value}
          onChange={(e) => handleChange(index, e)}
          onClick={() => handleClick(index)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          style={{
            width: '50px',
            height: '50px',
            textAlign: 'center',
            fontSize: '18px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            outline: 'none',
            backgroundColor: disabled ? '#f5f5f5' : 'white',
            cursor: disabled ? 'not-allowed' : 'text'
          }}
          maxLength={1}
        />
      ))}
    </div>
  );
};

export default OtpInput;
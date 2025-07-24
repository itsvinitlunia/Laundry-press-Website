import React, { useState, useEffect } from 'react';
import OtpInput from './OtpInput';

const PhoneOtpForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  useEffect(() => {
    let interval: number | undefined;
    if (resendTimer > 0) {
      interval = window.setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    }
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [resendTimer]);

  const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handlePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError("");
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneSubmit = async (event: React.FormEvent | React.MouseEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!validatePhoneNumber(phoneNumber)) {
        throw new Error("Please enter a valid 10-digit phone number starting with 6-9");
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      const otp = generateOTP();
      setGeneratedOtp(otp);
      setShowOtpInput(true);
      setResendTimer(30);
      setAttempts(0);
      setSuccess("");
      console.log(`OTP sent to ${phoneNumber}: ${otp}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const otp = generateOTP();
      setGeneratedOtp(otp);
      setResendTimer(30);
      setAttempts(0);
      setSuccess("");
      console.log(`OTP resent to ${phoneNumber}: ${otp}`);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // TODO: Update OtpInput to TypeScript and type onOtpSubmit as (otp: string) => void
  const onOtpSubmit = async (otp: string) => {
    if (attempts >= maxAttempts) {
      setError("Maximum attempts exceeded. Please request a new OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (otp === generatedOtp) {
        setSuccess("Login successful! Welcome!");
        console.log("Login Successful", otp);
        setTimeout(() => {
          alert("Redirecting to dashboard...");
          handleBackToPhone();
        }, 2000);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= maxAttempts) {
          setError("Maximum attempts exceeded. Please request a new OTP.");
          setShowOtpInput(false);
          setPhoneNumber("");
        } else {
          setError(`Invalid OTP. ${maxAttempts - newAttempts} attempts remaining.`);
        }
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setShowOtpInput(false);
    setPhoneNumber("");
    setError("");
    setSuccess("");
    setGeneratedOtp("");
    setResendTimer(0);
    setAttempts(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      {!showOtpInput ? (
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Enter Phone Number</h2>
          <div>
            <div style={{ marginBottom: '20px' }}>
              <input type="text" value={phoneNumber} onChange={handlePhoneNumber} placeholder="Enter 10-digit phone number" disabled={loading} onKeyPress={(e) => { if (e.key === 'Enter') { handlePhoneSubmit(e); } }} style={{ width: '100%', padding: '12px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {error && (<div style={{ color: '#e74c3c', marginBottom: '15px', padding: '10px', backgroundColor: '#ffeaea', borderRadius: '4px', fontSize: '14px' }}>{error}</div>)}
            <button onClick={handlePhoneSubmit} disabled={loading || phoneNumber.length !== 10} style={{ width: '100%', padding: '12px', fontSize: '16px', backgroundColor: loading || phoneNumber.length !== 10 ? '#ccc' : '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: loading || phoneNumber.length !== 10 ? 'not-allowed' : 'pointer', transition: 'background-color 0.3s' }}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Verify OTP</h2>
          <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666', fontSize: '14px' }}>Enter the 4-digit OTP sent to<br /><strong>+91 {phoneNumber}</strong></p>
          <div style={{ backgroundColor: '#e8f5e8', border: '2px solid #4caf50', borderRadius: '8px', padding: '15px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Demo Mode - Your OTP is:</p>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#4caf50', letterSpacing: '4px' }}>{generatedOtp}</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            {/* Use a wrapper to match OtpInput expected signature until OtpInput is TS */}
            <OtpInput length={4} onOtpSubmit={(otp: string) => { onOtpSubmit(otp); }} disabled={loading || !!success} />
          </div>
          {error && (<div style={{ color: '#e74c3c', marginBottom: '15px', padding: '10px', backgroundColor: '#ffeaea', borderRadius: '4px', fontSize: '14px', textAlign: 'center' }}>{error}</div>)}
          {success && (<div style={{ color: '#27ae60', marginBottom: '15px', padding: '10px', backgroundColor: '#eafaf1', borderRadius: '4px', fontSize: '14px', textAlign: 'center' }}>{success}</div>)}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            {resendTimer > 0 ? (<p style={{ color: '#666', fontSize: '14px' }}>Resend OTP in {formatTime(resendTimer)}</p>) : (<button onClick={handleResendOtp} disabled={loading} style={{ background: 'none', border: 'none', color: '#3498db', textDecoration: 'underline', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px' }}>{loading ? 'Sending...' : 'Resend OTP'}</button>)}
          </div>
          <button onClick={handleBackToPhone} disabled={loading} style={{ width: '100%', padding: '10px', fontSize: '14px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer' }}>Change Phone Number</button>
        </div>
      )}
    </div>
  );
};

export default PhoneOtpForm;
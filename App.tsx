import React from 'react';
import PhoneOtpForm from './PhoneOtpForm';

const App = () => {
  return (
    <div style={{
      fontFamily: 'sans-serif',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <PhoneOtpForm />
    </div>
  );
};

export default App;
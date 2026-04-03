import React, { useState } from 'react';
import axios from 'axios';

const SOSButton = () => {
  const [isSending, setIsSending] = useState(false);

  const triggerSOS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsSending(true);

    // Grab the user's real-time GPS coordinates
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Send coordinates to our new backend route
         await axios.post('http://localhost:5000/api/sos/sendSOS', {
            lat: latitude,
            lng: longitude
          });

          alert("🚨 SOS SENT! Help has been notified with your live location.");
        } catch (error) {
          console.error("Error sending SOS:", error);
          alert("Failed to send SOS. Check console for details.");
        } finally {
          setIsSending(false);
        }
      },
      (error) => {
        console.error("GPS Error:", error);
        alert("Please enable location services to use the SOS feature.");
        setIsSending(false);
      }
    );
  };

  return (
    <button 
      onClick={triggerSOS}
      disabled={isSending}
      style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        fontSize: '24px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: isSending ? 'none' : 'pulse 2s infinite'
      }}
    >
      {isSending ? '...' : 'SOS'}
    </button>
  );
};

export default SOSButton;
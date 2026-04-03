import React from 'react';
import { ShieldExclamationIcon } from '@heroicons/react/24/solid';

const SOSButton = () => {
  const triggerSOS = () => {
    alert("SOS ALERT: Your live location has been sent to your trusted contacts and nearby police stations."); //
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
      <span style={{ fontSize: '9px', fontWeight: '900', color: '#dc2626', backgroundColor: '#fff', padding: '2px 8px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>EMERGENCY</span>
      <button onClick={triggerSOS} style={{
        width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#dc2626',
        border: '4px solid #fff', cursor: 'pointer', boxShadow: '0 8px 20px rgba(220,38,38,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <ShieldExclamationIcon style={{ height: '30px', width: '30px', color: '#fff' }} />
      </button>
    </div>
  );
};
export default SOSButton;
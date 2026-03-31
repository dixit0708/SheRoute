import axios from 'axios';
import React, { useState } from 'react';

function SOSButton() {
  const [confirm, setConfirm] = useState(false);
  const [status, setStatus] = useState(null);
  

  const handleSendSOS = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/sos/send', {
        location: 'Moradabad',
        user: 'Aradhya',
      });
      setStatus(`✅ ${res.data.message}`);
    } catch (err) {
      setStatus('❌ Failed to Send SOS. Try again.');
    }
    setConfirm(false);
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={() => setConfirm(true)}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        ⚠️ SOS
      </button>

      {confirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
            <h3 className="text-xl font-bold text-red-600">Confirm SOS Alert?</h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSendSOS}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Send
              </button>
              <button
                onClick={() => setConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {status && (
        <p className="mt-4 font-semibold text-gray-700">{status}</p>
      )}
    </div>
  );
}

export default SOSButton;

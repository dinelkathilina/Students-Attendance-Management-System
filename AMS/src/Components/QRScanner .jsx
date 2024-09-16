import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import authservice from '../../services/authservice';

export const QRScanner = ({ onClose, onCheckIn }) => {
  const [scanning, setScanning] = useState(true);

  const handleScan = async (data) => {
    if (data) {
      setScanning(false);
      try {
        const response = await authservice.checkIn(data.text);
        onCheckIn(response.message);
        onClose();
      } catch (error) {
        onCheckIn(error.response?.data?.message || 'Failed to check in', true);
        setScanning(true);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    onCheckIn('Error scanning QR code', true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
        {scanning && (
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Close Scanner
        </button>
      </div>
    </div>
  );
};
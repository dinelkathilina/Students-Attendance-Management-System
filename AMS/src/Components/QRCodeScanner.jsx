import React, { useState } from 'react';
import { useZxing } from "react-zxing";
import authService from '../../services/authservice';

const QRCodeScanner = ({ onScanSuccess, onScanError }) => {
  const [result, setResult] = useState("");
  const [scanStatus, setScanStatus] = useState(null);

  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
      handleScan(result.getText());
    },
  });

  const handleScan = async (scannedData) => {
    if (scannedData) {
      console.log('Scanned session code:', scannedData);
      try {
        const response = await authService.checkInToSession(scannedData);
        console.log('Check-in response:', response);
        setScanStatus({ success: true, message: response.message });
        onScanSuccess(response);
      } catch (error) {
        console.error('Check-in error:', error);
        const errorMessage = error.response?.data?.message || error.message;
        setScanStatus({ success: false, message: errorMessage });
        onScanError(errorMessage);
      }
    }
  };

  return (
    <div className="qr-reader-container flex flex-col items-center">
      <video ref={ref} className="w-full max-w-sm mx-auto rounded-lg shadow-lg" />
      {result && <p className="mt-2 text-sm text-gray-500">Last scanned: {result}</p>}
      {scanStatus && (
        <div className={`mt-4 p-4 rounded-lg w-full max-w-sm ${
          scanStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <div className="flex items-center">
            {scanStatus.success ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <p className="font-medium">{scanStatus.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
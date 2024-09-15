import React, { useState, useEffect } from 'react';
import { useZxing } from "react-zxing";
import authservice from '../../services/authservice';

const QRCodeScanner = ({ onScanSuccess, onScanError }) => {
  const [result, setResult] = useState("");
  const [scanStatus, setScanStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [shouldScan, setShouldScan] = useState(true);

  const { ref } = useZxing({
    onDecodeResult(result) {
      if (shouldScan) {
        setResult(result.getText());
        setShouldScan(false); // Stop scanning after first successful read
        handleScan(result.getText());
      }
    },
  });

  const handleScan = async (scannedData) => {
    if (scannedData) {
      console.log('Scanned session code:', scannedData);
      setIsChecking(true);
      setScanStatus(null);
      try {
        const response = await authservice.checkInToSession(scannedData);
        console.log('Check-in response:', response);
        setScanStatus({ success: true, message: response.message });
        onScanSuccess(response);
      } catch (error) {
        console.error('Check-in error:', error);
        const errorMessage = error.response?.data?.message || error.message;
        setScanStatus({ success: false, message: errorMessage });
        onScanError(errorMessage);
      } finally {
        setIsChecking(false);
      }
    }
  };

  const resetScanner = () => {
    setResult("");
    setScanStatus(null);
    setShouldScan(true);
  };

  return (
    <div className="qr-reader-container flex flex-col items-center">
      {shouldScan ? (
        <video ref={ref} className="w-full max-w-sm mx-auto rounded-lg shadow-lg" />
      ) : (
        <div className="w-full max-w-sm mx-auto rounded-lg shadow-lg bg-gray-200 h-64 flex items-center justify-center">
          <p className="text-gray-600">Scan complete</p>
        </div>
      )}
      {result && <p className="mt-2 text-sm text-gray-500">Last scanned: {result}</p>}
      {isChecking && (
        <div className="mt-4 p-4 rounded-lg w-full max-w-sm bg-blue-100 text-blue-700">
          <div className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="font-medium">Checking in...</p>
          </div>
        </div>
      )}
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
      <button
        onClick={resetScanner}
        className="mt-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Scan Again
      </button>
    </div>
  );
};

export default QRCodeScanner;
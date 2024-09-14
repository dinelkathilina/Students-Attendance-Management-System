import React, { useState } from 'react';
import { useZxing } from "react-zxing";
import authService from '../../services/authservice';

const QRCodeScanner = ({ onScanSuccess, onScanError }) => {
  const [result, setResult] = useState("");

  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
      handleScan(result.getText());
    },
  });

  const handleScan = async (scannedData) => {
    if (scannedData) {
      try {
        const response = await authService.checkInToSession(scannedData);
        onScanSuccess(response);
      } catch (error) {
        onScanError(error.message);
      }
    }
  };

  return (
    <div className="qr-reader-container">
      <video ref={ref} className="w-full max-w-sm mx-auto" />
      {result && <p className="mt-2 text-sm text-gray-500">Last scanned: {result}</p>}
    </div>
  );
};

export default QRCodeScanner;
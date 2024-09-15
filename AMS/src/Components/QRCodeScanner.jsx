import React, { useEffect, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScanner = ({ onScanSuccess, onScanError }) => {
  const success = useCallback((result) => {
    onScanSuccess(result);
  }, [onScanSuccess]);

  const error = useCallback((err) => {
    console.error(err);
    onScanError(err);
  }, [onScanError]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    }, /* verbose= */ false);

    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, [success, error]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div id="reader" className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"></div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">Position the QR code within the frame to scan</p>
    </div>
  );
};

export default QRCodeScanner;
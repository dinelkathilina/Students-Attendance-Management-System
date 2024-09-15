import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScanner = ({ onScanSuccess, onScanError }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      onScanSuccess(result);
    }

    function error(err) {
      console.error(err);
      onScanError(err);
    }

    return () => {
      scanner.clear();
    };
  }, [onScanSuccess, onScanError]);

  return <div id="reader"></div>;
};

export default QRCodeScanner;
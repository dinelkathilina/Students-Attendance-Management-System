// QRScannerModal.jsx
import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const qrRef = useRef(null);

  useEffect(() => {
    let scanner = null;
    if (isOpen && qrRef.current) {
      scanner = new Html5Qrcode("qr-reader");
      scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          scanner.stop().then(() => onClose());
        },
        (error) => {
          // Ignore specific errors that occur during scanning
          if (error !== "QR code parse error, error = No barcode or QR code detected." &&
              error !== "No MultiFormat Readers were able to detect the code.") {
            console.error(error);
          }
        }
      )
      .catch((err) => console.error(err));
    }

    return () => {
      if (scanner) {
        scanner.stop().catch((err) => console.error(err));
      }
    };
  }, [isOpen, onClose, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Scan QR Code</h2>
        <div id="qr-reader" ref={qrRef} className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"></div>
        <button
          onClick={onClose}
          className="mt-4 w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QRScannerModal;
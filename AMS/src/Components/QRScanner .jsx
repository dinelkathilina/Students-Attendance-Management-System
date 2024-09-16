// QRScanner.jsx
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { toast } from 'react-toastify';

export const QRScanner = ({ onClose, onCheckIn }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let mounted = true;

    const startScanning = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        console.log('Available cameras:', videoInputDevices);

        // Try to find a rear-facing camera
        const rearCamera = videoInputDevices.find(device => 
          /(back|rear)/i.test(device.label)
        );

        const selectedCamera = rearCamera || videoInputDevices[0];

        if (!selectedCamera) {
          throw new Error('No camera found');
        }

        console.log('Selected camera:', selectedCamera.label);

        await codeReader.decodeFromVideoDevice(selectedCamera.deviceId, videoRef.current, (result, err) => {
          if (!mounted) return;

          if (result && isScanning) {
            setIsScanning(false);
            onCheckIn(result.getText());
          }

          if (err && !(err instanceof TypeError)) {
            console.debug('QR scan attempt failed', err);
          }
        });

        // Start scanning after a delay
        setTimeout(() => setIsScanning(true), 2000);

      } catch (err) {
        console.error('Error accessing the camera', err);
        setError('Failed to access camera: ' + err.message);
        toast.error('Failed to access camera. Please check your camera permissions.');
      }
    };

    // Delay starting the scanner to allow component to mount fully
    setTimeout(startScanning, 1000);

    return () => {
      mounted = false;
      codeReader.reset();
    };
  }, [onCheckIn]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <video ref={videoRef} className="w-full mb-4" />
        <p className="text-sm text-gray-600 mb-4">
          {isScanning ? "Scanner is active. Point your camera at a QR code." : "Preparing scanner..."}
        </p>
        <button
          onClick={onClose}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Close Scanner
        </button>
      </div>
    </div>
  );
};
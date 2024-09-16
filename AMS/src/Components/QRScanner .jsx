// QRScanner.jsx
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { toast } from 'react-toastify';

export const QRScanner = ({ onClose, onCheckIn }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let mounted = true;
    let cooldown = false;

    const startScanning = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        const rearCamera = videoInputDevices.find(device => 
          /(back|rear)/i.test(device.label)
        ) || videoInputDevices[0];

        if (!rearCamera) {
          throw new Error('No camera found');
        }

        await codeReader.decodeFromVideoDevice(rearCamera.deviceId, videoRef.current, (result, err) => {
          if (result && mounted && isScanning && !cooldown) {
            setIsScanning(false);
            onCheckIn(result.getText());
            cooldown = true;
            setTimeout(() => {
              cooldown = false;
              if (mounted) setIsScanning(true);
            }, 5000); // 5 second cooldown
          }
          if (err && !(err instanceof TypeError) && mounted) {
            // Only log the error, don't set it to state to avoid continuous re-renders
            console.error('Failed to decode', err);
          }
        });
      } catch (err) {
        console.error('Error accessing the camera', err);
        if (mounted) {
          setError('Failed to access camera: ' + err.message);
          toast.error('Failed to access camera. Please check your camera permissions.');
        }
      }
    };

    startScanning();

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
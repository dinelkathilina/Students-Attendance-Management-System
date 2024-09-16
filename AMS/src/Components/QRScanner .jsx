import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';

export const QRScanner = ({ onClose, onCheckIn }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();

    const setupScanner = async () => {
      try {
        const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
        setCameras(videoInputDevices);
        if (videoInputDevices.length > 0) {
          setSelectedCamera(videoInputDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Failed to list video devices', err);
        setError('Failed to access camera');
      }
    };

    setupScanner();

    return () => {
      codeReader.reset();
    };
  }, []);

  useEffect(() => {
    if (selectedCamera && videoRef.current) {
      const codeReader = new BrowserQRCodeReader();
      codeReader.decodeFromVideoDevice(selectedCamera, videoRef.current, (result, err) => {
        if (result) {
          onCheckIn(result.getText());
        }
        if (err && !(err instanceof TypeError)) {
          // Ignoring TypeError as it's thrown continuously when no QR code is detected
          console.error('Failed to decode', err);
          setError('Failed to decode QR code');
        }
      });

      return () => {
        codeReader.reset();
      };
    }
  }, [selectedCamera, onCheckIn]);

  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <video ref={videoRef} className="w-full mb-4" />
        {cameras.length > 1 && (
          <select 
            value={selectedCamera} 
            onChange={handleCameraChange}
            className="mb-4 w-full p-2 border rounded"
          >
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${camera.deviceId}`}
              </option>
            ))}
          </select>
        )}
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
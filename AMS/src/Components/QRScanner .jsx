import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';

export const QRScanner = ({ onClose, onCheckIn }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Failed to list video devices', err);
        setError('Failed to access camera');
      }
    };

    getCameras();
  }, []);

  useEffect(() => {
    if (selectedCamera && videoRef.current) {
      const codeReader = new BrowserQRCodeReader();
      
      const startScanning = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: selectedCamera }
          });
          videoRef.current.srcObject = stream;
          
          codeReader.decodeFromVideoDevice(selectedCamera, videoRef.current, (result, err) => {
            if (result) {
              onCheckIn(result.getText());
            }
            if (err && !(err instanceof TypeError)) {
              console.error('Failed to decode', err);
              setError('Failed to decode QR code');
            }
          });
        } catch (err) {
          console.error('Error accessing the camera', err);
          setError('Failed to access camera');
        }
      };

      startScanning();

      return () => {
        codeReader.reset();
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
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
        <video ref={videoRef} className="w-full mb-4" autoPlay playsInline />
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
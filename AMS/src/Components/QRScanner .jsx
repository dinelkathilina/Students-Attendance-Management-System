import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import authservice from '../../services/authservice';

export const QRScanner = ({ onClose, onCheckIn }) => {
  const [cameras, setCameras] = useState([]);
  const [currentCamera, setCurrentCamera] = useState(null);

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
        // Set the default camera to the rear camera if available, otherwise use the first camera
        const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back'));
        setCurrentCamera(rearCamera || videoDevices[0]);
      } catch (error) {
        console.error('Error getting cameras:', error);
        onCheckIn('Error accessing camera', true);
      }
    };

    getCameras();
  }, [onCheckIn]);

  const handleScan = async (data) => {
    if (data) {
      try {
        const response = await authservice.checkIn(data.text);
        onCheckIn(response.message);
        onClose();
      } catch (error) {
        onCheckIn(error.response?.data?.message || 'Failed to check in', true);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    onCheckIn('Error scanning QR code', true);
  };

  const toggleCamera = () => {
    const currentIndex = cameras.findIndex(camera => camera.deviceId === currentCamera.deviceId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    setCurrentCamera(cameras[nextIndex]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
        {currentCamera && (
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            constraints={{ deviceId: currentCamera.deviceId }}
            style={{ width: '100%' }}
          />
        )}
        <div className="flex justify-between mt-4">
          <button
            onClick={toggleCamera}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Switch Camera
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
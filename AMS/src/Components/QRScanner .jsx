import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { toast } from "react-toastify";

export const QRScanner = ({ onClose, onCheckIn }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let mounted = true;

    const startScanning = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        const rearCamera = videoInputDevices.find((device) =>
          /(back|rear)/i.test(device.label)
        );
        const selectedCamera = rearCamera || videoInputDevices[0];

        if (!selectedCamera) {
          throw new Error("No camera found");
        }

        await codeReader.decodeFromVideoDevice(
          selectedCamera.deviceId,
          videoRef.current,
          (result, err) => {
            if (!mounted) return;

            if (result) {
              setLastScannedCode(result.getText());
              if (isScanning) {
                setIsScanning(false);
                onCheckIn(result.getText());
              }
            }

            if (err && !(err instanceof TypeError)) {
              console.debug("QR scan attempt failed", err);
            }
          }
        );

        setTimeout(() => {
          setIsLoading(false);
          setIsScanning(true);
        }, 2000);
      } catch (err) {
        console.error("Error accessing the camera", err);
        setError("Failed to access camera: " + err.message);
        toast.error(
          "Failed to access camera. Please check your camera permissions."
        );
        onClose();
      }
    };

    setTimeout(startScanning, 1000);

    return () => {
      mounted = false;
      codeReader.reset();
    };
  }, [onCheckIn, onClose]);

  const handleManualCheckIn = () => {
    if (lastScannedCode) {
      onCheckIn(lastScannedCode);
    } else {
      toast.error("No QR code has been scanned yet");
    }
  };

  return (
<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
  <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
    <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Scan QR Code</h2>
    
    {error && (
      <div className="text-red-500 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 11-12.728 12.728 9 9 0 0112.728-12.728zM12 8v4m0 4h.01" />
        </svg>
        <p>{error}</p>
      </div>
    )}

    <div className="relative mb-4">
      <video ref={videoRef} className="w-full h-64 rounded-lg object-cover" />
      <div className="absolute inset-0 border-4 border-dashed border-blue-500 rounded-lg animate-pulse"></div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
        </div>
      )}
    </div>

    <p className="text-sm text-gray-500 text-center mb-6">
      {isScanning
        ? "Point your camera at a QR code to scan."
        : "Initializing scanner, please wait..."}
    </p>

    {lastScannedCode && (
      <p className="text-sm text-gray-700 text-center mb-6">
        Scanned Code: <span className="font-medium">{lastScannedCode}</span>
      </p>
    )}

    <button
      onClick={handleManualCheckIn}
      className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg transition hover:bg-blue-700 flex items-center justify-center ${!lastScannedCode ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={!lastScannedCode}
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      Use Scanned Code
    </button>

    <button
      onClick={onClose}
      className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg mt-4 hover:bg-gray-300 transition"
    >
      Close Scanner
    </button>
  </div>
</div>

  );
};

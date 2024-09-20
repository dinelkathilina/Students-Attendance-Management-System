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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg transition-transform transform-gpu">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Scan QR Code
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="relative mb-6">
          <video ref={videoRef} className="w-full rounded-lg" />
          <div className="absolute inset-0 border-2 border-dashed border-blue-500 rounded-lg animate-pulse"></div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-6 text-center">
          {isScanning
            ? "Scanner is active. Point your camera at a QR code."
            : "Preparing scanner..."}
        </p>
        {lastScannedCode && (
          <p className="text-sm text-gray-600 mb-6 text-center">
            Scanned code: {lastScannedCode}
          </p>
        )}
        <button
          onClick={handleManualCheckIn}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 mb-4 flex items-center justify-center"
          disabled={!lastScannedCode}
          aria-label="Use Scanned Code"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          Use Scanned Code
        </button>
        <button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
          aria-label="Close Scanner"
        >
          Close Scanner
        </button>
      </div>
    </div>
  );
};

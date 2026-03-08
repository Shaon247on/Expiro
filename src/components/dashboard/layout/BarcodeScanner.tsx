"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, ScanLine, X } from "lucide-react";

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    BarcodeDetector?: new (options: { formats: string[] }) => {
      detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]>;
    };
  }
}

export default function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<InstanceType<NonNullable<Window["BarcodeDetector"]>> | null>(null);

  const [isStarted, setIsStarted] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanned, setScanned] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "BarcodeDetector" in window);
  }, []);

  const stopCamera = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsStarted(false);
    setScanning(false);
  }, []);

  useEffect(() => () => { stopCamera(); }, [stopCamera]);

  const startDetectionLoop = useCallback(() => {
    const detect = async () => {
      if (!detectorRef.current || !videoRef.current || videoRef.current.readyState < 2) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }
      try {
        const results = await detectorRef.current.detect(videoRef.current);
        if (results.length > 0) {
          const code = results[0].rawValue;
          setScanned(code);
          setScanning(false);
          stopCamera();
          setTimeout(() => onDetected(code), 500);
          return;
        }
      } catch { /* continue */ }
      rafRef.current = requestAnimationFrame(detect);
    };
    rafRef.current = requestAnimationFrame(detect);
  }, [onDetected, stopCamera]);

  const startCamera = async () => {
    setError(null); setScanned(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setIsStarted(true);
      if (window.BarcodeDetector) {
        detectorRef.current = new window.BarcodeDetector({
          formats: ["ean_13", "ean_8", "code_128", "qr_code", "code_39", "upc_a"],
        });
        setScanning(true);
        startDetectionLoop();
      }
    } catch (err) {
      setError(`Could not access camera: ${err instanceof Error ? err.message : "Permission denied."}`);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScanLine size={16} style={{ color: "#3A7326" }} />
          <span className="font-semibold text-xs" style={{ color: "#1A3340" }}>Barcode Scanner</span>
        </div>
        <button onClick={() => { stopCamera(); onClose(); }} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100" aria-label="Close scanner">
          <X size={13} className="text-gray-400" />
        </button>
      </div>

      {isSupported === false && (
        <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA", color: "#92400E" }}>
          <strong>Barcode scanning is not supported in this browser.</strong> Please upload an image or enter the code manually.
        </div>
      )}

      {isSupported !== false && (
        <div className="relative rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "16/9", border: "2px solid #D4EAC8" }}>
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted aria-label="Camera preview" />
          {scanning && (
            <>
              <style>{`@keyframes scanpulse{0%,100%{top:30%}50%{top:60%}}.scan-line{animation:scanpulse 2s ease-in-out infinite}`}</style>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-44 h-28 rounded-lg" style={{ border: "2px solid #A6DC94", boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)" }} />
              </div>
              <div className="scan-line absolute left-[calc(50%-88px)] w-44 h-0.5 rounded-full" style={{ backgroundColor: "#A6DC94", position: "absolute" }} />
            </>
          )}
          {!isStarted && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
              <Camera size={32} className="text-gray-500 mb-1" />
              <p className="text-gray-400 text-xs">Camera will appear here</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 px-3 text-center">
              <CameraOff size={28} className="text-red-400 mb-1" />
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          )}
        </div>
      )}

      {scanned && (
        <div className="rounded-lg px-3 py-2 flex items-center gap-2" style={{ backgroundColor: "#F0FDF4", border: "1px solid #86EFAC" }}>
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-gray-500">Detected</p>
            <p className="font-mono font-semibold text-xs" style={{ color: "#166534" }}>{scanned}</p>
          </div>
        </div>
      )}

      {isSupported !== false && (
        !isStarted
          ? <Button type="button" onClick={startCamera} className="h-9 rounded-xl text-xs font-medium" style={{ backgroundColor: "#3A7326", color: "white" }}>
              <Camera size={14} className="mr-1.5" /> Start Scanning
            </Button>
          : <Button type="button" variant="secondary" onClick={stopCamera} className="h-9 rounded-xl text-xs">
              <CameraOff size={14} className="mr-1.5" /> Stop Camera
            </Button>
      )}
    </div>
  );
}
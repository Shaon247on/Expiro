"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { X, Camera, RefreshCw, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  open: boolean;
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ open, onCapture, onClose }: CameraCaptureProps) {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const streamRef  = useRef<MediaStream | null>(null);

  const [phase, setPhase]     = useState<"starting" | "live" | "preview" | "error">("starting");
  const [preview, setPreview] = useState<string | null>(null);
  const [errMsg, setErrMsg]   = useState("");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const startCamera = useCallback(async () => {
    setPhase("starting");
    setPreview(null);
    setErrMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase("live");
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : "Camera access denied.");
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    if (open) startCamera();
    else      stopStream();
    return () => stopStream();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleCapture() {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    stopStream();
    setPreview(dataUrl);
    setPhase("preview");
  }

  function handleRetake() {
    setPreview(null);
    startCamera();
  }

  function handleConfirm() {
    if (preview) {
      onCapture(preview);
      setPreview(null);
      setPhase("starting");
    }
  }

  function handleClose() {
    stopStream();
    setPreview(null);
    setPhase("starting");
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ backgroundColor: "#0D0D0D" }}
      role="dialog"
      aria-modal="true"
      aria-label="Camera capture"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(58,115,38,0.3)" }}>
            <Camera size={16} style={{ color: "#86EFAC" }} />
          </div>
          <div>
            <p className="text-white text-[14px] font-bold leading-tight">Capture Photo</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              {phase === "preview" ? "Review your photo" : "Take a photo of the opened product"}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          aria-label="Close camera"
        >
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* Viewport */}
      <div className="flex-1 relative overflow-hidden mx-4 rounded-3xl" style={{ maxHeight: "65vh" }}>
        {/* Live video */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ display: phase === "live" ? "block" : "none" }}
          playsInline muted autoPlay
        />

        {/* Preview image */}
        {phase === "preview" && preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Captured" className="w-full h-full object-cover" />
        )}

        {/* Starting overlay */}
        {phase === "starting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
            <Loader2 size={30} className="animate-spin" style={{ color: "#86EFAC" }} />
            <p className="text-white text-[13px]">Starting camera…</p>
          </div>
        )}

        {/* Error overlay */}
        {phase === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 px-8 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(225,29,72,0.2)" }}>
              <Camera size={24} style={{ color: "#FB7185" }} />
            </div>
            <div>
              <p className="text-white font-semibold text-[14px]">Camera Unavailable</p>
              <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{errMsg}</p>
            </div>
            <button
              onClick={startCamera}
              className="px-5 py-2 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "#3A7326", color: "white" }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Live viewfinder guide */}
        {phase === "live" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72">
              {["top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl",
                "top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl",
                "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl",
                "bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl",
              ].map((cls, i) => (
                <div key={i} className={`absolute w-8 h-8 ${cls}`} style={{ borderColor: "#86EFAC" }} />
              ))}
            </div>
          </div>
        )}

        {/* Preview confirm/retake overlay */}
        {phase === "preview" && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
            <div
              className="px-4 py-2 rounded-full text-[12px] font-semibold"
              style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.8)" }}
            >
              Review your photo
            </div>
          </div>
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Bottom controls */}
      <div className="px-6 pt-5 pb-6 shrink-0">
        {phase === "live" && (
          <div className="flex items-center justify-center">
            <button
              onClick={handleCapture}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{ backgroundColor: "white", boxShadow: "0 0 0 4px rgba(255,255,255,0.3)" }}
              aria-label="Take photo"
            >
              <div className="w-12 h-12 rounded-full" style={{ backgroundColor: "#3A7326" }} />
            </button>
          </div>
        )}

        {phase === "preview" && (
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRetake}
              variant="outline"
              className="flex-1 h-12 rounded-2xl text-sm font-semibold"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "white", backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <RefreshCw size={15} className="mr-1.5" /> Retake
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 h-12 rounded-2xl text-sm font-semibold border-0"
              style={{ backgroundColor: "#3A7326", color: "white" }}
            >
              <Check size={15} className="mr-1.5" /> Use Photo
            </Button>
          </div>
        )}

        {phase === "starting" && (
          <p className="text-center text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            Please allow camera access when prompted.
          </p>
        )}
      </div>
    </div>
  );
}
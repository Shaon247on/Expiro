"use client";

import { useRef, useState, useEffect, useCallback, ChangeEvent } from "react";
import {
  X,
  Camera,
  RefreshCw,
  Check,
  Loader2,
  Images,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CameraCaptureProps {
  open: boolean;
  onCapture: (file: File, previewUrl: string) => void;
  onClose: () => void;
}

export default function CameraCapture({
  open,
  onCapture,
  onClose,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<"starting" | "live" | "preview" | "error">(
    "starting",
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [errMsg, setErrMsg] = useState("");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const startCamera = useCallback(async () => {
    setPhase("starting");
    setPreview(null);
    setPreviewFile(null);
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
    if (open) {
      void startCamera();
    } else {
      stopStream();
    }

    return () => stopStream();
  }, [open, startCamera, stopStream]);

  function dataUrlToFile(dataUrl: string, fileName: string) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) u8arr[n] = bstr.charCodeAt(n);

    return new File([u8arr], fileName, { type: mime });
  }

  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const file = dataUrlToFile(dataUrl, "proof_image.jpg");

    stopStream();
    setPreview(dataUrl);
    setPreviewFile(file);
    setPhase("preview");
  }

  function handleGalleryPick() {
    galleryRef.current?.click();
  }

  function handleGalleryChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      stopStream();
      setPreview(dataUrl);
      setPreviewFile(file);
      setPhase("preview");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleRetake() {
    setPreview(null);
    setPreviewFile(null);
    void startCamera();
  }

  function handleConfirm() {
    if (preview && previewFile) {
      onCapture(previewFile, preview);
      setPreview(null);
      setPreviewFile(null);
      setPhase("starting");
    }
  }

  function handleClose() {
    stopStream();
    setPreview(null);
    setPreviewFile(null);
    setPhase("starting");
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col"
      style={{ backgroundColor: "#0D0D0D" }}
      role="dialog"
      aria-modal="true"
      aria-label="Camera capture"
    >
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleGalleryChange}
      />

      <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(58,115,38,0.3)" }}
          >
            <Camera size={16} style={{ color: "#86EFAC" }} />
          </div>
          <div>
            <p className="text-white text-[14px] font-bold leading-tight">
              Capture Proof
            </p>
            <p
              className="text-[11px]"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Take or upload a proof image
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          aria-label="Close capture"
        >
          <X size={18} className="text-white" />
        </button>
      </div>

      <div
        className="flex-1 relative overflow-hidden mx-4 rounded-3xl"
        style={{ maxHeight: "62vh" }}
      >
        {(phase === "live" || phase === "starting") && (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />
        )}

        {phase === "preview" && preview && (
          <Image
            width={1920}
            height={1080}
            src={preview}
            alt="Proof preview"
            className="w-full h-full object-cover"
          />
        )}

        {phase === "starting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2
              size={32}
              className="animate-spin"
              style={{ color: "#86EFAC" }}
            />
            <p className="text-white text-[13px]">Starting camera…</p>
          </div>
        )}

        {phase === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(225,29,72,0.2)" }}
            >
              <AlertTriangle size={22} style={{ color: "#FB7185" }} />
            </div>
            <p className="text-white text-[14px] font-semibold">
              Camera unavailable
            </p>
            <p
              className="text-[12px]"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {errMsg}
            </p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="px-5 pt-5 pb-6 space-y-4 shrink-0">
        {(phase === "live" || phase === "starting") && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleGalleryPick}
              className="w-full text-center text-[12px] font-semibold py-2 rounded-xl transition-colors"
              style={{
                color: "#86EFAC",
                backgroundColor: "rgba(34,197,94,0.12)",
              }}
            >
              <span className="inline-flex items-center gap-1.5">
                <Images size={13} />
                Upload image
              </span>
            </button>

            <button
              onClick={handleCapture}
              className="w-full text-center text-[12px] font-semibold py-2 rounded-xl transition-colors"
              style={{
                color: "#E6FFFB",
                backgroundColor: "rgba(34,197,94,0.28)",
              }}
            >
              <span className="inline-flex items-center gap-1.5">
                <Camera size={13} />
                Capture proof
              </span>
            </button>
          </div>
        )}

        {phase === "preview" && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleRetake}
              className="h-10 rounded-xl text-sm font-semibold"
              style={{
                borderColor: "rgba(255,255,255,0.14)",
                color: "white",
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            >
              <RefreshCw size={14} className="mr-1.5" />
              Retake
            </Button>

            <Button
              type="button"
              onClick={handleConfirm}
              className="h-10 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "#3A7326", color: "white" }}
            >
              <Check size={14} className="mr-1.5" />
              Use Photo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

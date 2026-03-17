"use client";

import {
  useRef, useState, useEffect, useCallback,
} from "react";
import {
  X, ScanLine, Camera, Loader2, AlertTriangle,
  RefreshCw, CheckCircle2, Images,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface LookupResult {
  itemName: string;
  category: string;
  expiryDate: string;
  openExpiryDays: number;
  barcode: string;
}

interface ScanAndCaptureModalProps {
  open: boolean;
  onComplete: (imageDataUrl: string, product: LookupResult) => void;
  onClose: () => void;
  lookupProduct?: (barcode: string) => Promise<LookupResult | null>;
}

// ── Internal phases ────────────────────────────────────────────────────────────

type Phase =
  | "scan_starting"
  | "scan_live"
  | "scan_manual"
  | "scan_looking"
  | "scan_not_found"
  | "photo_starting"
  | "photo_live"
  | "photo_preview"
  | "submitting"
  | "cam_error";

// ── Component ──────────────────────────────────────────────────────────────────

export default function ScanAndCaptureModal({
  open, onComplete, onClose, lookupProduct,
}: ScanAndCaptureModalProps) {
  // Guard: if no lookup function is provided, treat every scan as not found
  const doLookup = useCallback(
    (barcode: string) =>
      typeof lookupProduct === "function"
        ? lookupProduct(barcode)
        : Promise.resolve(null),
    [lookupProduct]
  );
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const rafRef      = useRef<number>(0);
  const detectedRef = useRef(false);
  // Hidden file input for gallery selection
  const galleryRef  = useRef<HTMLInputElement>(null);

  const [phase,        setPhase]        = useState<Phase>("scan_starting");
  const [manualCode,   setManualCode]   = useState("");
  const [errMsg,       setErrMsg]       = useState("");
  const [product,      setProduct]      = useState<LookupResult | null>(null);
  const [preview,      setPreview]      = useState<string | null>(null);
  const [isNewPreview, setIsNewPreview] = useState(false);

  // ── Camera helpers ─────────────────────────────────────────────────────────

  const stopStream = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    detectedRef.current = false;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const startCamera = useCallback(async (nextPhase: "scan_live" | "photo_live") => {
    setErrMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase(nextPhase);
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : "Camera access denied.");
      setPhase("cam_error");
    }
  }, []);

  const handleBarcodeScan = useCallback(async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setManualCode(trimmed);
    setPhase("scan_looking");
    const found = await doLookup(trimmed);
    if (found) {
      setProduct(found);
      setPhase("photo_starting");
      await startCamera("photo_live");
    } else {
      setPhase("scan_not_found");
    }
  }, [doLookup, startCamera]);

  // ── BarcodeDetector scanning loop ──────────────────────────────────────────

  const startBarcodeDetection = useCallback(() => {
    if (!("BarcodeDetector" in window)) {
      setPhase("scan_manual");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detector = new (window as any).BarcodeDetector({
      formats: ["ean_13", "ean_8", "code_128", "code_39", "qr_code", "upc_a", "upc_e"],
    });
    const tick = async () => {
      if (!videoRef.current || detectedRef.current) return;
      try {
        const results = await detector.detect(videoRef.current);
        if (results.length > 0 && !detectedRef.current) {
          detectedRef.current = true;
          const code = results[0].rawValue as string;
          stopStream();
          handleBarcodeScan(code);
          return;
        }
      } catch { /* ignore frame errors */ }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopStream]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === "scan_live") startBarcodeDetection();
  }, [phase, startBarcodeDetection]);

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (open) {
      setManualCode("");
      setPreview(null);
      setProduct(null);
      detectedRef.current = false;
      setPhase("scan_starting");
      startCamera("scan_live");
    } else {
      stopStream();
    }
    return () => stopStream();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Camera photo capture ───────────────────────────────────────────────────

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
    setIsNewPreview(true);
    setPhase("photo_preview");
  }

  // ── Gallery / local file picker ────────────────────────────────────────────

  function handleGalleryPick() {
    galleryRef.current?.click();
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      stopStream();           // stop camera if active
      setPreview(dataUrl);
      setIsNewPreview(true);
      setPhase("photo_preview");
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-picked if needed
    e.target.value = "";
  }

  function handleRetakePhoto() {
    setPreview(null);
    setIsNewPreview(false);
    setPhase("photo_starting");
    startCamera("photo_live");
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  function handleSubmit() {
    if (!product || !preview) return;
    setPhase("submitting");
    setTimeout(() => {
      onComplete(preview, product);
      handleClose();
    }, 400);
  }

  // ── Close / reset ──────────────────────────────────────────────────────────

  function handleClose() {
    stopStream();
    setManualCode("");
    setPreview(null);
    setProduct(null);
    setPhase("scan_starting");
    setIsNewPreview(false);
    onClose();
  }

  function handleRescan() {
    stopStream();
    setManualCode("");
    setProduct(null);
    setPreview(null);
    setPhase("scan_starting");
    startCamera("scan_live");
  }

  if (!open) return null;

  // ── UI helpers ─────────────────────────────────────────────────────────────

  const isScanPhase  = ["scan_starting", "scan_live", "scan_manual", "scan_looking", "scan_not_found"].includes(phase);
  const isPhotoPhase = ["photo_starting", "photo_live", "photo_preview", "submitting"].includes(phase);

  const headerTitle = isScanPhase ? "Scan Barcode" : "Capture Photo";
  const headerSub   = isScanPhase
    ? "Point your camera at the product barcode"
    : product
    ? `${product.itemName} — take a photo as proof`
    : "Take a photo of the opened product";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ backgroundColor: "#0D0D0D" }}
      role="dialog"
      aria-modal
      aria-label={headerTitle}
    >
      {/* Hidden gallery file input — no `capture` attr so it opens the file picker / gallery */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleGalleryChange}
        aria-label="Choose image from gallery"
      />

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(58,115,38,0.3)" }}
          >
            {isScanPhase
              ? <ScanLine size={16} style={{ color: "#86EFAC" }} />
              : <Camera   size={16} style={{ color: "#86EFAC" }} />
            }
          </div>
          <div className="min-w-0">
            <p className="text-white text-[14px] font-bold leading-tight">{headerTitle}</p>
            <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
              {headerSub}
            </p>
          </div>
        </div>

        {/* Step dots + close */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {[0, 1].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: (isScanPhase && i === 0) || (isPhotoPhase && i === 1)
                    ? "#86EFAC" : "rgba(255,255,255,0.25)",
                  transform: (isScanPhase && i === 0) || (isPhotoPhase && i === 1) ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            aria-label="Close"
          >
            <X size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 relative overflow-hidden mx-4 rounded-3xl" style={{ maxHeight: "62vh" }}>

        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ display: (phase === "scan_live" || phase === "photo_live") ? "block" : "none" }}
          playsInline muted autoPlay
        />

        {/* Photo / gallery preview */}
        {phase === "photo_preview" && preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Captured" className="w-full h-full object-cover" />
        )}

        {/* Starting */}
        {(phase === "scan_starting" || phase === "photo_starting") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 rounded-3xl">
            <Loader2 size={30} className="animate-spin" style={{ color: "#86EFAC" }} />
            <p className="text-white text-[13px]">Starting camera…</p>
          </div>
        )}

        {/* Looking up */}
        {phase === "scan_looking" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 rounded-3xl px-6 text-center">
            <Loader2 size={30} className="animate-spin" style={{ color: "#86EFAC" }} />
            <p className="text-white text-[14px] font-semibold">Looking up product…</p>
            <p className="text-[12px] font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{manualCode}</p>
          </div>
        )}

        {/* Not found */}
        {phase === "scan_not_found" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/85 rounded-3xl px-8 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(225,29,72,0.2)" }}>
              <AlertTriangle size={24} style={{ color: "#FB7185" }} />
            </div>
            <div>
              <p className="text-white font-bold text-[15px]">Product Not Found</p>
              <p className="text-[12px] mt-1 font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{manualCode}</p>
            </div>
            <button
              onClick={handleRescan}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5"
              style={{ backgroundColor: "#3A7326", color: "white" }}
            >
              <RefreshCw size={14} /> Scan Again
            </button>
          </div>
        )}

        {/* Submitting */}
        {phase === "submitting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 rounded-3xl">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#3A7326" }}>
              <CheckCircle2 size={28} className="text-white" />
            </div>
            <p className="text-white text-[14px] font-semibold">Saving…</p>
          </div>
        )}

        {/* Camera error — show gallery fallback */}
        {phase === "cam_error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/85 rounded-3xl px-8 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(225,29,72,0.2)" }}>
              <Camera size={24} style={{ color: "#FB7185" }} />
            </div>
            <div>
              <p className="text-white font-semibold text-[14px]">Camera Unavailable</p>
              <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{errMsg}</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <button onClick={handleRescan}
                className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#3A7326", color: "white" }}>
                Try Again
              </button>
              <button onClick={handleGalleryPick}
                className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "white" }}>
                <Images size={14} /> Choose from Gallery
              </button>
            </div>
          </div>
        )}

        {/* Scan frame */}
        {phase === "scan_live" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse 55% 35% at 50% 50%, transparent, rgba(0,0,0,0.5))" }}
            />
            <div className="relative w-60 h-32 sm:w-80 sm:h-40">
              {["top-0 left-0 border-t-2 border-l-2 rounded-tl-xl",
                "top-0 right-0 border-t-2 border-r-2 rounded-tr-xl",
                "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl",
                "bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl",
              ].map((cls, i) => (
                <div key={i} className={`absolute w-7 h-7 ${cls}`} style={{ borderColor: "#86EFAC" }} />
              ))}
              <div className="absolute inset-x-2 overflow-hidden" style={{ top: "10%", bottom: "10%" }}>
                <div className="h-0.5 w-full rounded-full"
                  style={{
                    backgroundColor: "#4ADE80",
                    boxShadow: "0 0 8px 2px rgba(74,222,128,0.5)",
                    animation: "scanLine 2s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Photo viewfinder */}
        {phase === "photo_live" && (
          <>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 65% 55% at 50% 50%, transparent, rgba(0,0,0,0.45))" }}
            />
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
            {product && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2">
                <div className="px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "white" }}>
                  📦 {product.itemName}
                </div>
              </div>
            )}
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Bottom controls */}
      <div className="px-5 pt-4 pb-6 shrink-0 space-y-3">

        {/* Scan live / manual */}
        {(phase === "scan_live" || phase === "scan_manual") && (
          <>
            <p className="text-center text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              {phase === "scan_live" ? "Hold steady — scanning automatically" : "Enter barcode manually"}
            </p>

            {phase === "scan_live" && (
              <button
                onClick={() => { stopStream(); setPhase("scan_manual"); }}
                className="w-full text-center text-[12px] font-semibold py-2 rounded-xl"
                style={{ color: "#86EFAC", backgroundColor: "rgba(58,115,38,0.15)" }}
              >
                Enter barcode manually instead
              </button>
            )}

            {phase === "scan_manual" && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleBarcodeScan(manualCode)}
                    placeholder="e.g. 5901234123457"
                    className="flex-1 h-11 rounded-xl px-4 text-sm outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      color: "white",
                      border: "1.5px solid rgba(58,115,38,0.5)",
                    }}
                  />
                  <button
                    onClick={() => handleBarcodeScan(manualCode)}
                    disabled={!manualCode.trim()}
                    className="h-11 px-5 rounded-xl text-sm font-semibold disabled:opacity-40"
                    style={{ backgroundColor: "#3A7326", color: "white" }}
                  >
                    Go
                  </button>
                </div>
                <button
                  onClick={() => { setManualCode(""); setPhase("scan_starting"); startCamera("scan_live"); }}
                  className="w-full text-[12px] font-semibold py-1.5 rounded-xl flex items-center justify-center gap-1.5"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  <ScanLine size={13} /> Use camera instead
                </button>
              </div>
            )}
          </>
        )}

        {/* Photo live — shutter + gallery option */}
        {phase === "photo_live" && (
          <div className="flex flex-col items-center gap-3">
            {/* Shutter */}
            <button
              onClick={handleCapture}
              className="w-16 h-16 rounded-full flex items-center justify-center active:scale-95 transition-transform"
              style={{ backgroundColor: "white", boxShadow: "0 0 0 4px rgba(255,255,255,0.25)" }}
              aria-label="Take photo"
            >
              <div className="w-12 h-12 rounded-full" style={{ backgroundColor: "#3A7326" }} />
            </button>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              Tap to capture
            </p>
            {/* ── Gallery option ── */}
            <button
              onClick={handleGalleryPick}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-[12px] font-semibold transition-colors hover:opacity-80"
              style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
            >
              <Images size={14} />
              Choose from gallery instead
            </button>
          </div>
        )}

        {/* Photo preview — retake / gallery / confirm */}
        {phase === "photo_preview" && (
          <div className="space-y-2">
            <div className="flex gap-3">
              <Button
                onClick={handleRetakePhoto}
                variant="outline"
                className="flex-1 h-12 rounded-2xl text-sm font-semibold"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "white", backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <RefreshCw size={14} className="mr-1.5" /> Retake
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 h-12 rounded-2xl text-sm font-semibold border-0"
                style={{ backgroundColor: "#3A7326", color: "white" }}
              >
                <CheckCircle2 size={14} className="mr-1.5" /> Confirm & Save
              </Button>
            </div>
            {/* Choose a different image from gallery */}
            <button
              onClick={handleGalleryPick}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold hover:opacity-80"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              <Images size={13} /> Choose a different image from gallery
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { transform: translateY(0);    opacity: 1;   }
          50%  { transform: translateY(400%); opacity: 0.7; }
          100% { transform: translateY(0);    opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
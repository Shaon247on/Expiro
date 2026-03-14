"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, ScanLine, Loader2, AlertTriangle } from "lucide-react";

interface BarcodeScanModalProps {
  open: boolean;
  onDetected: (code: string) => void;
  onClose: () => void;
}

/**
 * Full-screen camera overlay for barcode scanning.
 * Uses BarcodeDetector API where available; falls back to a manual input.
 * Fires onDetected(code) once and auto-closes.
 */
export default function BarcodeScanModal({
  open,
  onDetected,
  onClose,
}: BarcodeScanModalProps) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const rafRef      = useRef<number>(0);
  const detectedRef = useRef(false);

  const [status, setStatus]       = useState<"starting" | "scanning" | "error">("starting");
  const [errorMsg, setErrorMsg]   = useState("");
  const [manualCode, setManualCode] = useState("");
  const [showManual, setShowManual] = useState(false);

  // ── Start camera ────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    detectedRef.current = false;
    setStatus("starting");
    setErrorMsg("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("scanning");
      startDetection();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Camera access denied.";
      setStatus("error");
      setErrorMsg(msg);
      setShowManual(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── BarcodeDetector scanning loop ───────────────────────────────────────────
  const startDetection = useCallback(() => {
    if (!("BarcodeDetector" in window)) {
      // BarcodeDetector not available — show manual fallback
      setShowManual(true);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detector = new (window as any).BarcodeDetector({
      formats: ["ean_13", "ean_8", "code_128", "code_39", "qr_code", "upc_a", "upc_e"],
    });

    const tick = async () => {
      if (!videoRef.current || detectedRef.current) return;
      try {
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes.length > 0 && !detectedRef.current) {
          detectedRef.current = true;
          const code = barcodes[0].rawValue as string;
          stopCamera();
          onDetected(code);
          return;
        }
      } catch { /* ignore frame errors */ }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [onDetected]);

  // ── Stop camera ─────────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  // ── Lifecycle ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setManualCode("");
      setShowManual(false);
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle close ────────────────────────────────────────────────────────────
  function handleClose() {
    stopCamera();
    onClose();
  }

  function handleManualSubmit() {
    const code = manualCode.trim();
    if (!code) return;
    detectedRef.current = true;
    stopCamera();
    onDetected(code);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ backgroundColor: "#0D0D0D" }}
      role="dialog"
      aria-modal="true"
      aria-label="Barcode scanner"
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-safe-top pt-5 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(109,40,217,0.3)" }}
          >
            <ScanLine size={16} style={{ color: "#A78BFA" }} />
          </div>
          <div>
            <p className="text-white text-[14px] font-bold leading-tight">Scan Barcode</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              Point camera at product barcode
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          aria-label="Close scanner"
        >
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* ── Video viewport ── */}
      <div className="flex-1 relative overflow-hidden mx-4 rounded-3xl" style={{ maxHeight: "60vh" }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />

        {/* Dark vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Scan frame */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-56 h-36 sm:w-72 sm:h-44">
            {/* Corner brackets */}
            {[
              "top-0 left-0 border-t-2 border-l-2 rounded-tl-xl",
              "top-0 right-0 border-t-2 border-r-2 rounded-tr-xl",
              "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl",
              "bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl",
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute w-7 h-7 ${cls}`}
                style={{ borderColor: "#A78BFA" }}
              />
            ))}

            {/* Animated scan line */}
            {status === "scanning" && (
              <div className="absolute inset-x-2 overflow-hidden" style={{ top: "10%", bottom: "10%" }}>
                <div
                  className="h-0.5 w-full rounded-full"
                  style={{
                    backgroundColor: "#7C3AED",
                    boxShadow: "0 0 8px 2px rgba(124,58,237,0.6)",
                    animation: "scanLine 2s ease-in-out infinite",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Starting overlay */}
        {status === "starting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin" style={{ color: "#A78BFA" }} />
            <p className="text-white text-[13px]">Starting camera…</p>
          </div>
        )}

        {/* Error overlay */}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(225,29,72,0.2)" }}
            >
              <AlertTriangle size={22} style={{ color: "#FB7185" }} />
            </div>
            <p className="text-white text-[14px] font-semibold">Camera unavailable</p>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>{errorMsg}</p>
          </div>
        )}
      </div>

      {/* ── Bottom: hint + manual fallback ── */}
      <div className="px-5 pt-5 pb-safe-bottom pb-6 space-y-4 shrink-0">
        {status === "scanning" && !showManual && (
          <p className="text-center text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
            Hold steady — scanning automatically
          </p>
        )}

        {/* Manual entry toggle */}
        {!showManual ? (
          <button
            onClick={() => setShowManual(true)}
            className="w-full text-center text-[12px] font-semibold py-2 rounded-xl transition-colors"
            style={{ color: "#A78BFA", backgroundColor: "rgba(109,40,217,0.12)" }}
          >
            Enter barcode manually
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
              Enter barcode manually
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                placeholder="e.g. 5901234123457"
                className="flex-1 h-11 rounded-xl px-4 text-sm outline-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "white",
                  border: "1.5px solid rgba(109,40,217,0.5)",
                }}
              />
              <button
                onClick={handleManualSubmit}
                disabled={!manualCode.trim()}
                className="h-11 px-5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                style={{ backgroundColor: "#6D28D9", color: "white" }}
              >
                Go
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scan line animation */}
      <style>{`
        @keyframes scanLine {
          0%   { transform: translateY(0%);    opacity: 1; }
          50%  { transform: translateY(500%);  opacity: 0.7; }
          100% { transform: translateY(0%);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
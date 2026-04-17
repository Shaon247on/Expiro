"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  X,
  ScanLine,
  Loader2,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CameraCapture from "./CameraCapture";
import type { OpenProjectLookupData } from "@/actions/dlc/open-project.action";

interface ScanAndCaptureModalProps {
  open: boolean;
  onComplete: (
    proofFile: File,
    previewUrl: string,
    product: OpenProjectLookupData
  ) => Promise<void> | void;
  onClose: () => void;
  lookupProduct?: (barcode: string) => Promise<OpenProjectLookupData | null>;
}

type Phase =
  | "scan_starting"
  | "scan_live"
  | "scan_manual"
  | "scan_looking"
  | "scan_not_found"
  | "photo_gate"
  | "submitting"
  | "cam_error";

export default function ScanAndCaptureModal({
  open,
  onComplete,
  onClose,
  lookupProduct,
}: ScanAndCaptureModalProps) {
  const doLookup = useCallback(
    (barcode: string) =>
      typeof lookupProduct === "function"
        ? lookupProduct(barcode)
        : Promise.resolve(null),
    [lookupProduct]
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const detectedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("scan_starting");
  const [manualCode, setManualCode] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [product, setProduct] = useState<OpenProjectLookupData | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const stopStream = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    detectedRef.current = false;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const startCamera = useCallback(async () => {
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

      setPhase("scan_live");
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : "Camera access denied.");
      setPhase("cam_error");
    }
  }, []);

  const handleBarcodeScan = useCallback(
    async (code: string) => {
      const trimmed = code.trim();
      if (!trimmed) return;

      setManualCode(trimmed);
      setPhase("scan_looking");

      const found = await doLookup(trimmed);

      if (found) {
        setProduct(found);
        setPhase("photo_gate");
      } else {
        setPhase("scan_not_found");
      }
    },
    [doLookup]
  );

  const startBarcodeDetection = useCallback(() => {
    if (!("BarcodeDetector" in window)) {
      setPhase("scan_manual");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detector = new (window as any).BarcodeDetector({
      formats: [
        "ean_13",
        "ean_8",
        "code_128",
        "code_39",
        "qr_code",
        "upc_a",
        "upc_e",
      ],
    });

    const tick = async () => {
      if (!videoRef.current || detectedRef.current) return;

      try {
        const results = await detector.detect(videoRef.current);

        if (results.length > 0 && !detectedRef.current) {
          detectedRef.current = true;
          const code = results[0].rawValue as string;
          stopStream();
          void handleBarcodeScan(code);
          return;
        }
      } catch {
        // ignore
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [handleBarcodeScan, stopStream]);

  useEffect(() => {
    if (phase === "scan_live") {
      startBarcodeDetection();
    }
  }, [phase, startBarcodeDetection]);

  useEffect(() => {
    if (open) {
      setManualCode("");
      setProduct(null);
      setErrMsg("");
      detectedRef.current = false;
      setPhase("scan_starting");
      void startCamera();
    } else {
      stopStream();
    }

    return () => stopStream();
  }, [open, startCamera, stopStream]);

  async function handleCameraCapture(file: File, previewUrl: string) {
    if (!product) return;

    setCameraOpen(false);
    setPhase("submitting");

    await onComplete(file, previewUrl, product);
  }

  function handleManualSubmit() {
    const code = manualCode.trim();
    if (!code) return;
    stopStream();
    void handleBarcodeScan(code);
  }

  function handleClose() {
    stopStream();
    setManualCode("");
    setProduct(null);
    setErrMsg("");
    setPhase("scan_starting");
    setCameraOpen(false);
    onClose();
  }

  function handleRescan() {
    stopStream();
    setManualCode("");
    setProduct(null);
    setErrMsg("");
    setPhase("scan_starting");
    setCameraOpen(false);
    void startCamera();
  }

  if (!open) return null;

  const isScanPhase = [
    "scan_starting",
    "scan_live",
    "scan_manual",
    "scan_looking",
    "scan_not_found",
    "cam_error",
  ].includes(phase);

  const headerTitle = isScanPhase ? "Scan Barcode" : "Open Product";
  const headerSub = isScanPhase
    ? "Scan or manually input a unit barcode"
    : product
    ? `${product.name} — take a proof image`
    : "Take a proof image";

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex flex-col"
        style={{ backgroundColor: "#0D0D0D" }}
        role="dialog"
        aria-modal
        aria-label={headerTitle}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(58,115,38,0.3)" }}
            >
              <ScanLine size={16} style={{ color: "#86EFAC" }} />
            </div>
            <div className="min-w-0">
              <p className="text-white text-[14px] font-bold leading-tight">
                {headerTitle}
              </p>
              <p
                className="text-[11px] truncate"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {headerSub}
              </p>
            </div>
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

        <div
          className="flex-1 relative overflow-hidden mx-4 rounded-3xl"
          style={{ maxHeight: "62vh" }}
        >
          {phase === "scan_live" && (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
          )}

          {(phase === "scan_live" || phase === "scan_starting") && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 100%)",
              }}
            />
          )}

          {phase === "scan_live" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-56 h-36 sm:w-72 sm:h-44">
                {[
                  "top-0 left-0 border-t-2 border-l-2 rounded-tl-xl",
                  "top-0 right-0 border-t-2 border-r-2 rounded-tr-xl",
                  "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl",
                  "bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl",
                ].map((cls, i) => (
                  <div
                    key={i}
                    className={`absolute w-7 h-7 ${cls}`}
                    style={{ borderColor: "#86EFAC" }}
                  />
                ))}
              </div>
            </div>
          )}

          {(phase === "scan_starting" ||
            phase === "scan_looking" ||
            phase === "submitting") && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Loader2
                size={32}
                className="animate-spin"
                style={{ color: "#86EFAC" }}
              />
              <p className="text-white text-[13px]">
                {phase === "scan_starting"
                  ? "Starting camera…"
                  : phase === "scan_looking"
                  ? "Checking scanned product..."
                  : "Submitting proof..."}
              </p>
            </div>
          )}

          {phase === "scan_manual" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
              <div className="w-full max-w-sm">
                <p className="text-white text-[13px] font-semibold mb-2">
                  Enter barcode manually
                </p>
                <input
                  type="text"
                  autoFocus
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                  placeholder="e.g. UNIT-C3DB47E0F4AB"
                  className="w-full h-11 rounded-xl px-4 text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "white",
                    border: "1.5px solid rgba(34,197,94,0.5)",
                  }}
                />

                <Button
                  type="button"
                  onClick={handleManualSubmit}
                  disabled={!manualCode.trim()}
                  className="w-full h-10 mt-3 rounded-xl text-sm font-semibold disabled:opacity-40"
                  style={{ backgroundColor: "#3A7326", color: "white" }}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {phase === "scan_not_found" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(225,29,72,0.2)" }}
              >
                <AlertTriangle size={22} style={{ color: "#FB7185" }} />
              </div>

              <div className="w-full max-w-sm">
                <p className="text-white text-[14px] font-semibold">
                  Product not found
                </p>
                <p
                  className="text-[12px] mt-1 mb-4"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {errMsg || "No valid unit found for this barcode."}
                </p>

                <input
                  type="text"
                  autoFocus
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                  placeholder="Enter another barcode"
                  className="w-full h-11 rounded-xl px-4 text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "white",
                    border: "1.5px solid rgba(34,197,94,0.5)",
                  }}
                />

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Button
                    type="button"
                    onClick={handleManualSubmit}
                    disabled={!manualCode.trim()}
                    className="h-10 rounded-xl text-sm font-semibold disabled:opacity-40"
                    style={{ backgroundColor: "#3A7326", color: "white" }}
                  >
                    Continue
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRescan}
                    className="h-10 rounded-xl text-sm font-semibold"
                    style={{
                      borderColor: "rgba(255,255,255,0.14)",
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <RefreshCw size={14} className="mr-1.5" />
                    Retry Camera
                  </Button>
                </div>
              </div>
            </div>
          )}

          {phase === "cam_error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(225,29,72,0.2)" }}
              >
                <AlertTriangle size={22} style={{ color: "#FB7185" }} />
              </div>

              <div className="w-full max-w-sm">
                <p className="text-white text-[14px] font-semibold">
                  Camera unavailable
                </p>
                <p
                  className="text-[12px] mt-1 mb-4"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {errMsg || "Camera access failed."}
                </p>

                <input
                  type="text"
                  autoFocus
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                  placeholder="Enter barcode manually"
                  className="w-full h-11 rounded-xl px-4 text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "white",
                    border: "1.5px solid rgba(34,197,94,0.5)",
                  }}
                />

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Button
                    type="button"
                    onClick={handleManualSubmit}
                    disabled={!manualCode.trim()}
                    className="h-10 rounded-xl text-sm font-semibold disabled:opacity-40"
                    style={{ backgroundColor: "#3A7326", color: "white" }}
                  >
                    Continue
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRescan}
                    className="h-10 rounded-xl text-sm font-semibold"
                    style={{
                      borderColor: "rgba(255,255,255,0.14)",
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <RefreshCw size={14} className="mr-1.5" />
                    Retry Camera
                  </Button>
                </div>
              </div>
            </div>
          )}

          {phase === "photo_gate" && product && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(58,115,38,0.3)" }}
              >
                <PackageOpen size={24} style={{ color: "#86EFAC" }} />
              </div>

              <div>
                <p className="text-white text-[15px] font-bold">
                  {product.name}
                </p>
                <p
                  className="text-[12px]"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {product.category_name} · Unit #
                  {product.scanned_unit.unit_number}
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setCameraOpen(true)}
                className="h-10 px-5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#3A7326", color: "white" }}
              >
                <CheckCircle2 size={14} className="mr-1.5" />
                Take Proof Photo
              </Button>
            </div>
          )}
        </div>

        <div className="px-5 pt-5 pb-6 space-y-4 shrink-0">
          {(phase === "scan_live" || phase === "scan_starting") && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPhase("scan_manual")}
                className="w-full text-center text-[12px] font-semibold py-2 rounded-xl transition-colors"
                style={{
                  color: "#86EFAC",
                  backgroundColor: "rgba(34,197,94,0.12)",
                }}
              >
                Enter manually
              </button>

              <button
                onClick={handleRescan}
                className="w-full text-center text-[12px] font-semibold py-2 rounded-xl transition-colors"
                style={{
                  color: "#E5E7EB",
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              >
                Restart scanner
              </button>
            </div>
          )}
        </div>
      </div>

      <CameraCapture
        open={cameraOpen}
        onCapture={handleCameraCapture}
        onClose={() => setCameraOpen(false)}
      />
    </>
  );
}
"use client";

import { useState, useCallback } from "react";
import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import BarcodeScanModal from "./BarcodeScanModal";
import SellProductDrawer from "./SellProductDrawer";

export default function SellProductCard() {
  const pathname     = usePathname();
  const isSuperAdmin = pathname.startsWith("/admin");

  // Camera modal state
  const [scanOpen, setScanOpen]         = useState(false);
  // Drawer state — opens after a successful scan
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [scannedCode, setScannedCode]   = useState<string | null>(null);

  /** Called by BarcodeScanModal once a code is detected */
  const handleDetected = useCallback((code: string) => {
    setScanOpen(false);       // close camera
    setScannedCode(code);     // pass code to drawer
    setDrawerOpen(true);      // open drawer immediately
    toast.success("Barcode scanned!", {
      description: `Code: ${code}`,
      position: "bottom-right",
    });
  }, []);

  function handleDrawerClose() {
    setDrawerOpen(false);
    setScannedCode(null);
  }

  return (
    <>
      {/* ── Card ── */}
      <div
        className={`relative rounded-2xl p-4 overflow-hidden ${isSuperAdmin ? "hidden" : ""}`}
        style={{ backgroundColor: "#6D28D9" }}
      >
        {/* SELL badge */}
        <span
          className="absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded italic tracking-wide select-none"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1.5px solid rgba(255,255,255,0.3)",
            display: "inline-block",
            transform: "rotate(6deg)",
          }}
          aria-label="Sell feature"
        >
          SELL
        </span>

        <p
          className="text-xs leading-relaxed mb-4 pr-8"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Scan a product barcode with your camera to select a batch and sell.
        </p>

        <button
          onClick={() => setScanOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 active:scale-95 w-full justify-center"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
          aria-label="Open barcode scanner to sell product"
        >
          <ShoppingCart size={15} aria-hidden="true" />
          Sell Product
        </button>
      </div>

      {/* ── Fullscreen camera modal ── */}
      <BarcodeScanModal
        open={scanOpen}
        onDetected={handleDetected}
        onClose={() => setScanOpen(false)}
      />

      {/* ── Product + batch drawer (opens after scan) ── */}
      <SellProductDrawer
        open={drawerOpen}
        scannedCode={scannedCode}
        onOpenChange={(open) => !open && handleDrawerClose()}
      />
    </>
  );
}
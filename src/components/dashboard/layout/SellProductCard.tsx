"use client";

import { useState, useCallback } from "react";
import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import BarcodeScanModal from "./BarcodeScanModal";
import SellProductDrawer from "./SellProductDrawer";

export default function SellProductCard() {
  const pathname = usePathname();
  const isSuperAdmin = pathname.startsWith("/admin");

  const [scanOpen, setScanOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const handleDetected = useCallback((code: string) => {
    setScanOpen(false);
    setScannedCode(code);
    setDrawerOpen(true);
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
      <div
        className={`relative overflow-hidden rounded-xl p-3 sm:rounded-2xl sm:p-4 ${
          isSuperAdmin ? "hidden" : ""
        }`}
        style={{ backgroundColor: "#6D28D9" }}
      >
        <span
          className="absolute right-2 top-2 inline-block select-none rounded px-1.5 py-0.5 text-[9px] font-extrabold italic tracking-wide sm:right-3 sm:top-3 sm:px-2 sm:text-[10px]"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1.5px solid rgba(255,255,255,0.3)",
            transform: "rotate(6deg)",
          }}
          aria-label="Sell feature"
        >
          SELL
        </span>

        <p
          className="mb-3 pr-7 text-[11px] leading-relaxed sm:mb-4 sm:pr-8 sm:text-xs"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Scan a product barcode with your camera to select a batch and sell.
        </p>

        <button
          onClick={() => setScanOpen(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all hover:opacity-90 active:scale-95 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
          aria-label="Open barcode scanner to sell product"
        >
          <ShoppingCart size={14} aria-hidden="true" className="sm:h-3.75 sm:w-3.75" />
          Sell Product
        </button>
      </div>

      <BarcodeScanModal
        open={scanOpen}
        onDetected={handleDetected}
        onClose={() => setScanOpen(false)}
      />

      <SellProductDrawer
        open={drawerOpen}
        scannedCode={scannedCode}
        onOpenChange={(open: boolean) => !open && handleDrawerClose()}
      />
    </>
  );
}
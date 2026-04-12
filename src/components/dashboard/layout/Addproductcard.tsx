"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import AddProductDrawer from "./AddProductDrawer";
import AddProductBarcodeScanModal from "./AddProductBarcodeScanModal";
import { usePathname } from "next/navigation";
import { scanProductByBarcodeAction } from "@/actions/admin/product.action";
import { toast } from "sonner";

type ScannedProductPrefill = {
  barcode: string;
  existingProduct: boolean;
  lockedFields?: {
    productId: string;
    categoryId: string;
    categoryName: string;
    name: string;
    barcode: string;
    track_open_expiry_days: boolean;
    open_expiry_days: number | null;
  };
};

export default function AddProductCard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [prefillData, setPrefillData] = useState<ScannedProductPrefill | null>(null);

  const pathName = usePathname();
  const isSuperAdmin = pathName.startsWith("/admin");

  function handleAddClick() {
    setPrefillData(null);
    setScannerOpen(true);
  }

  async function handleDetected(code: string) {
    const barcode = code.trim();
    if (!barcode) return;

    setScannerOpen(false);
    setScanLoading(true);

    const result = await scanProductByBarcodeAction(barcode);

    if (!result.success) {
      setScanLoading(false);
      toast.error("Barcode lookup failed", {
        description: result.message,
      });
      return;
    }

    if (result.data.type === "existing") {
      const product = result.data.product;

      setPrefillData({
        barcode: product.barcode,
        existingProduct: true,
        lockedFields: {
          productId: product.id,
          categoryId: product.category,
          categoryName: product.category_name,
          name: product.name,
          barcode: product.barcode,
          track_open_expiry_days: product.track_open_expiry_days,
          open_expiry_days: product.open_expiry_days ?? null,
        },
      });

      toast.success("Existing product found", {
        description: "Locked product information has been prefilled.",
      });
    } else {
      setPrefillData({
        barcode: result.data.barcode,
        existingProduct: false,
      });

      toast.success("New product flow ready", {
        description: "Complete the remaining product information.",
      });
    }

    setScanLoading(false);
    setDrawerOpen(true);
  }

  function handleSkip() {
    setScannerOpen(false);
    setPrefillData({
      barcode: "",
      existingProduct: false,
    });
    setDrawerOpen(true);
  }

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-xl p-3 sm:rounded-2xl sm:p-4 ${
          isSuperAdmin ? "hidden" : ""
        }`}
        style={{ backgroundColor: "#3A7326" }}
      >
        <span
          className="absolute right-2 top-2 inline-block select-none rounded px-1.5 py-0.5 text-[9px] font-extrabold italic tracking-wide sm:right-3 sm:top-3 sm:px-2 sm:text-[10px]"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1.5px solid rgba(255,255,255,0.3)",
            transform: "rotate(6deg)",
          }}
        >
          NEW
        </span>

        <p
          className="mb-3 pr-7 text-[11px] leading-relaxed sm:mb-4 sm:pr-8 sm:text-xs"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Please, organize your menus through button below!
        </p>

        <button
          onClick={handleAddClick}
          disabled={scanLoading}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors hover:opacity-90 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm disabled:opacity-60"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          {scanLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Plus size={14} aria-hidden="true" className="sm:h-3.75 sm:w-3.75" />
          )}
          {scanLoading ? "Checking barcode..." : "Add Product"}
        </button>
      </div>

      <AddProductBarcodeScanModal
        open={scannerOpen}
        onDetected={handleDetected}
        onSkip={handleSkip}
        onClose={() => setScannerOpen(false)}
      />

      <AddProductDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        initialPrefill={prefillData}
      />
    </>
  );
}
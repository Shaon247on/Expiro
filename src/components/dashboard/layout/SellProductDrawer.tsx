"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Clock,
  ShoppingCart,
  RefreshCw,
  CalendarDays,
  Boxes,
  Tag,
  ScanLine,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ProductStatus =
  | "Urgent"
  | "Expiring soon"
  | "Safe Item"
  | "Remove Item"
  | "Open Item";

export const statusMeta: Record<
  ProductStatus,
  { color: string; bg: string; dot: string }
> = {
  Urgent:           { color: "#E11D48", bg: "#FFF1F2", dot: "#E11D48" },
  "Expiring soon":  { color: "#EA580C", bg: "#FFF7ED", dot: "#EA580C" },
  "Safe Item":      { color: "#16A34A", bg: "#F0FDF4", dot: "#16A34A" },
  "Remove Item":    { color: "#E11D48", bg: "#FFF1F2", dot: "#E11D48" },
  "Open Item":      { color: "#16A34A", bg: "#F0FDF4", dot: "#16A34A" },
};

export interface Batch {
  id: string;
  batchNo: string;
  expiryDate: string;
  quantity: number;
  status: ProductStatus;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  barcode: string;
  totalQuantity: number;
  status: ProductStatus;
  batches: Batch[];
}

// ── Mock data — replace with real API call ────────────────────────────────────

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Organic Whole Milk",
    category: "Dairy",
    barcode: "5901234123457",
    totalQuantity: 48,
    status: "Safe Item",
    batches: [
      { id: "b1", batchNo: "BTH-001", expiryDate: "2025-04-20", quantity: 12, status: "Urgent"        },
      { id: "b2", batchNo: "BTH-002", expiryDate: "2025-05-10", quantity: 20, status: "Expiring soon" },
      { id: "b3", batchNo: "BTH-003", expiryDate: "2025-07-15", quantity: 16, status: "Safe Item"     },
    ],
  },
  {
    id: "p2",
    name: "Sourdough Bread",
    category: "Bakery",
    barcode: "4006381333931",
    totalQuantity: 24,
    status: "Expiring soon",
    batches: [
      { id: "b4", batchNo: "BTH-004", expiryDate: "2025-04-18", quantity: 10, status: "Remove Item"   },
      { id: "b5", batchNo: "BTH-005", expiryDate: "2025-04-25", quantity: 14, status: "Expiring soon" },
    ],
  },
];

async function lookupByBarcode(code: string): Promise<Product | null> {
  // TODO: replace with real API call
  await new Promise((r) => setTimeout(r, 500));
  return MOCK_PRODUCTS.find((p) => p.barcode === code) ?? null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(iso));
}

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProductStatus }) {
  const meta = statusMeta[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: meta.dot }} />
      {status}
    </span>
  );
}

// Step bar removed — only one step (batch → sell)
type Step = "loading" | "not_found" | "batch";

// ── Main Component ─────────────────────────────────────────────────────────────

interface SellProductDrawerProps {
  open: boolean;
  /** Barcode string passed in from the camera scan modal */
  scannedCode: string | null;
  onOpenChange: (open: boolean) => void;
}

export default function SellProductDrawer({
  open,
  scannedCode,
  onOpenChange,
}: SellProductDrawerProps) {
  const [step, setStep]                   = useState<Step>("loading");
  const [product, setProduct]             = useState<Product | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // ── Look up product whenever a new code arrives ───────────────────────────
  useEffect(() => {
    if (!open || !scannedCode) return;
    setStep("loading");
    setProduct(null);
    setSelectedBatch(null);

    lookupByBarcode(scannedCode).then((found) => {
      if (found) {
        setProduct(found);
        setStep("batch");
      } else {
        setStep("not_found");
      }
    });
  }, [open, scannedCode]);

  // ── Reset on close ────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    onOpenChange(false);
    // Delay reset so exit animation completes
    setTimeout(() => {
      setStep("loading");
      setProduct(null);
      setSelectedBatch(null);
    }, 300);
  }, [onOpenChange]);

  // ── Confirm sell ──────────────────────────────────────────────────────────
  function handleSell() {
    if (!product || !selectedBatch) return;
    toast.success(
      `Sold 1× ${product.name} from batch ${selectedBatch.batchNo}`,
      { position: "bottom-right" }
    );
    handleClose();
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent
        side="right"
        className="flex flex-col p-0 gap-0 w-full sm:max-w-[520px]"
        style={{ borderRadius: "24px 0 0 24px" }}
      >
        {/* ── Header ── */}
        <SheetHeader className="shrink-0 flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#EDE9FE" }}
            >
              <ShoppingCart size={17} style={{ color: "#6D28D9" }} />
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-[15px] font-bold leading-tight" style={{ color: "#1A3340" }}>
                {product ? product.name : "Sell Product"}
              </SheetTitle>
              {scannedCode && (
                <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <ScanLine size={11} /> {scannedCode}
                </p>
              )}
            </div>
          </div>

          {/* Re-scan button */}
          {(step === "batch" || step === "not_found") && (
            <button
              onClick={handleClose}
              className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-purple-50 shrink-0"
              style={{ color: "#6D28D9" }}
              title="Scan again"
            >
              <RefreshCw size={13} />
              Re-scan
            </button>
          )}
        </SheetHeader>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* ── Loading ── */}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#EDE9FE" }}
              >
                <Loader2 size={28} className="animate-spin" style={{ color: "#6D28D9" }} />
              </div>
              <div className="text-center">
                <p className="text-[15px] font-bold" style={{ color: "#1A3340" }}>Looking up product…</p>
                <p className="text-[12px] text-gray-400 mt-1">Searching barcode {scannedCode}</p>
              </div>
            </div>
          )}

          {/* ── Not found ── */}
          {step === "not_found" && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#FFF1F2" }}
              >
                <AlertTriangle size={28} style={{ color: "#E11D48" }} />
              </div>
              <div>
                <p className="text-[16px] font-bold" style={{ color: "#1A3340" }}>Product Not Found</p>
                <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">
                  No product matched barcode{" "}
                  <span className="font-semibold text-gray-700 font-mono">{scannedCode}</span>.
                  <br />Try scanning again or check the barcode is readable.
                </p>
              </div>
              <Button
                onClick={handleClose}
                className="mt-2 h-10 px-6 rounded-xl text-sm font-semibold border-0"
                style={{ backgroundColor: "#6D28D9", color: "white" }}
              >
                <RefreshCw size={14} className="mr-1.5" /> Scan Again
              </Button>
            </div>
          )}

          {/* ── Batch selection ── */}
          {step === "batch" && product && (
            <div className="space-y-5">

              {/* Product summary strip */}
              <div
                className="rounded-2xl px-4 py-3.5 flex items-center gap-4"
                style={{ backgroundColor: "#F5F3FF", border: "1px solid #DDD6FE" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold truncate" style={{ color: "#1A3340" }}>
                    {product.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] text-gray-500">
                      <Tag size={10} /> {product.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-500">
                      <Boxes size={10} /> {product.totalQuantity} total units
                    </span>
                  </div>
                </div>
                <StatusBadge status={product.status} />
              </div>

              {/* Instruction */}
              <div className="space-y-1">
                <h2 className="text-[15px] font-bold" style={{ color: "#1A3340" }}>
                  Select Batch
                </h2>
                <div
                  className="flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-[12px]"
                  style={{ backgroundColor: "#FFF7ED", color: "#EA580C", border: "1px solid #FED7AA" }}
                >
                  <Clock size={13} className="shrink-0 mt-0.5" />
                  <span>Check the expiry date printed on the product label and select the matching batch below.</span>
                </div>
              </div>

              {/* Batch cards */}
              <div className="space-y-2.5">
                {product.batches.map((batch) => {
                  const isSelected = selectedBatch?.id === batch.id;
                  const days       = daysUntil(batch.expiryDate);

                  return (
                    <button
                      key={batch.id}
                      type="button"
                      onClick={() => setSelectedBatch(batch)}
                      className="w-full text-left rounded-2xl p-4 transition-all duration-150"
                      style={{
                        backgroundColor: isSelected ? "#F5F3FF" : "#FAFAF9",
                        border:          isSelected ? "2px solid #6D28D9" : "1.5px solid #E5E7EB",
                        boxShadow:       isSelected ? "0 0 0 3px rgba(109,40,217,0.08)" : "none",
                      }}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Radio + batch info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-150"
                            style={{
                              borderColor:     isSelected ? "#6D28D9" : "#D1D5DB",
                              backgroundColor: isSelected ? "#6D28D9" : "white",
                            }}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>

                          <div className="min-w-0">
                            <p className="text-[13px] font-bold" style={{ color: "#1A3340" }}>
                              {batch.batchNo}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <CalendarDays size={11} className="text-gray-400 shrink-0" />
                              <span className="text-[11px] text-gray-500">
                                Expires {formatDate(batch.expiryDate)}
                              </span>
                              <span
                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                                style={{
                                  backgroundColor: days < 0 ? "#FFF1F2" : days < 7 ? "#FFF7ED" : "#F0FDF4",
                                  color:           days < 0 ? "#E11D48" : days < 7 ? "#EA580C" : "#16A34A",
                                }}
                              >
                                {days < 0 ? "Expired" : `${days}d left`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status + qty */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <StatusBadge status={batch.status} />
                          <span className="text-[11px] font-semibold text-gray-500">
                            {batch.quantity} units
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <SheetFooter className="shrink-0 flex flex-row items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="h-10 px-6 rounded-xl text-sm"
            style={{ borderColor: "#DDD6FE", color: "#6D28D9" }}
          >
            Cancel
          </Button>

          {step === "batch" && (
            <Button
              onClick={handleSell}
              disabled={!selectedBatch}
              className="h-10 px-6 rounded-xl text-sm font-semibold border-0 disabled:opacity-50"
              style={{ backgroundColor: "#6D28D9", color: "white" }}
            >
              <ShoppingCart size={15} className="mr-1.5" />
              Confirm Sale
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
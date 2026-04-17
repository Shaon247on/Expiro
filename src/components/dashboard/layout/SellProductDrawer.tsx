"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ShoppingCart,
  ScanLine,
  Loader2,
  RefreshCw,
  PackageSearch,
  CalendarDays,
  Boxes,
} from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  sellScannedProductAction,
} from "@/actions/admin/sellProduct.action";
import type {
  ProductScanFindResponse,
  ScanSellBatch,
  ScanSellExistingProduct,
} from "@/types/sellProduct.type";
import { scanProductByBarcodeAction } from "@/actions/admin/product.action";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function daysUntil(iso: string) {
  return Math.ceil(
    (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
}

function getBatchStatusMeta(status: string) {
  switch (status?.toLowerCase()) {
    case "available":
    case "active":
      return {
        label: "Available",
        text: "#15803D",
        bg: "#DCFCE7",
      };
    case "opened":
      return {
        label: "Opened",
        text: "#2563EB",
        bg: "#DBEAFE",
      };
    case "removed":
      return {
        label: "Removed",
        text: "#DC2626",
        bg: "#FEE2E2",
      };
    default:
      return {
        label: status || "Unknown",
        text: "#6B7280",
        bg: "#F3F4F6",
      };
  }
}

type Step = "loading" | "not_found" | "batch";

interface SellProductDrawerProps {
  open: boolean;
  scannedCode: string | null;
  onOpenChange: (open: boolean) => void;
}

export default function SellProductDrawer({
  open,
  scannedCode,
  onOpenChange,
}: SellProductDrawerProps) {
  const [step, setStep] = useState<Step>("loading");
  const [product, setProduct] = useState<ScanSellExistingProduct | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<ScanSellBatch | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !scannedCode) return;

    setStep("loading");
    setProduct(null);
    setSelectedBatch(null);
    setQuantity(1);

    void (async () => {
      const result = await scanProductByBarcodeAction(scannedCode);

      if (!result.success) {
        setStep("not_found");
        toast.error("Lookup failed", {
          description: result.message,
          position: "bottom-right",
        });
        return;
      }

      const payload = result.data as ProductScanFindResponse;

      if (payload.type === "existing") {
        setProduct(payload.product);
        setStep("batch");
      } else {
        setStep("not_found");
      }
    })();
  }, [open, scannedCode]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("loading");
      setProduct(null);
      setSelectedBatch(null);
      setQuantity(1);
      setSubmitting(false);
    }, 300);
  }, [onOpenChange]);

  async function handleSell() {
    if (!product || !selectedBatch) {
      toast.error("Select a batch first.", {
        position: "bottom-right",
      });
      return;
    }

    if (!quantity || quantity < 1) {
      toast.error("Enter a valid quantity.", {
        position: "bottom-right",
      });
      return;
    }

    if (quantity > selectedBatch.available_quantity) {
      toast.error("Quantity exceeds available stock.", {
        description: `Only ${selectedBatch.available_quantity} unit(s) available in this batch.`,
        position: "bottom-right",
      });
      return;
    }

    setSubmitting(true);

    const result = await sellScannedProductAction({
      quantity,
      batch_id: selectedBatch.id,
    });

    if (!result.success) {
      toast.error("Sell failed", {
        description: result.message,
        position: "bottom-right",
      });
      setSubmitting(false);
      return;
    }

    toast.success(result.message, {
      description: `${result.data.sold_quantity} unit(s) sold from ${selectedBatch.batch_code}.`,
      position: "bottom-right",
    });

    handleClose();
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent
        side="right"
        className="flex flex-col p-0 gap-0 w-full sm:max-w-[520px]"
        style={{ borderRadius: "24px 0 0 24px" }}
      >
        <SheetHeader className="shrink-0 flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#EDE9FE" }}
            >
              <ShoppingCart size={17} style={{ color: "#6D28D9" }} />
            </div>

            <div className="min-w-0">
              <SheetTitle
                className="text-[15px] font-bold leading-tight"
                style={{ color: "#1A3340" }}
              >
                {product ? product.name : "Sell Product"}
              </SheetTitle>

              {scannedCode && (
                <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <ScanLine size={11} /> {scannedCode}
                </p>
              )}
            </div>
          </div>

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

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#EDE9FE" }}
              >
                <Loader2
                  size={28}
                  className="animate-spin"
                  style={{ color: "#6D28D9" }}
                />
              </div>
              <div className="text-center">
                <p
                  className="text-[15px] font-bold"
                  style={{ color: "#1A3340" }}
                >
                  Looking up product…
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  Searching barcode {scannedCode}
                </p>
              </div>
            </div>
          )}

          {step === "not_found" && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#FEF2F2" }}
              >
                <PackageSearch size={28} style={{ color: "#DC2626" }} />
              </div>

              <div>
                <p
                  className="text-[15px] font-bold"
                  style={{ color: "#1A3340" }}
                >
                  Product not found
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  No sellable product was found for barcode{" "}
                  <span className="font-mono">{scannedCode}</span>.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleClose}
                className="h-10 px-5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#6D28D9", color: "white" }}
              >
                Scan Again
              </Button>
            </div>
          )}

          {step === "batch" && product && (
            <>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p
                      className="text-[16px] font-bold"
                      style={{ color: "#1A3340" }}
                    >
                      {product.name}
                    </p>
                    <p className="text-[12px] text-gray-500 mt-1">
                      {product.category_name} · ${product.price}
                    </p>
                  </div>

                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{
                      backgroundColor: "#F5F3FF",
                      color: "#6D28D9",
                    }}
                  >
                    {product.batches.length} batch{product.batches.length > 1 ? "es" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Boxes size={14} />
                    Total batches: {product.batches.length}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarDays size={14} />
                    Supplier expiry: {formatDate(product.expiry_date)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p
                  className="text-[13px] font-semibold"
                  style={{ color: "#1A3340" }}
                >
                  Select a batch
                </p>

                <div className="space-y-3">
                  {product.batches.map((batch) => {
                    const active = selectedBatch?.id === batch.id;
                    const days = daysUntil(batch.expiry_date);
                    const statusMeta = getBatchStatusMeta(batch.status);

                    return (
                      <button
                        key={batch.id}
                        type="button"
                        onClick={() => setSelectedBatch(batch)}
                        className="w-full text-left rounded-2xl border p-4 transition-all"
                        style={{
                          borderColor: active ? "#6D28D9" : "#E5E7EB",
                          backgroundColor: active ? "#F5F3FF" : "white",
                          boxShadow: active
                            ? "0 0 0 1px rgba(109,40,217,0.12)"
                            : "none",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p
                              className="text-[13px] font-bold"
                              style={{ color: "#1A3340" }}
                            >
                              {batch.batch_code}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-500">
                              <span>Available: {batch.available_quantity}</span>
                              <span>Received: {batch.received_quantity}</span>
                              <span>${batch.unit_price}</span>
                            </div>
                          </div>

                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
                            style={{
                              color: statusMeta.text,
                              backgroundColor: statusMeta.bg,
                            }}
                          >
                            {statusMeta.label}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">
                            Expiry: {formatDate(batch.expiry_date)}
                          </span>

                          <span
                            className="font-semibold"
                            style={{
                              color:
                                days <= 2
                                  ? "#DC2626"
                                  : days <= 7
                                  ? "#EA580C"
                                  : "#16A34A",
                            }}
                          >
                            {days < 0 ? "Expired" : `${days}d left`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="sell-quantity"
                  className="text-[13px] font-semibold"
                  style={{ color: "#1A3340" }}
                >
                  Quantity to sell
                </label>

                <Input
                  id="sell-quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value || 0))}
                  placeholder="Enter quantity"
                  className="h-11 rounded-xl border-gray-200"
                />

                {selectedBatch && (
                  <p className="text-[11px] text-gray-500">
                    Available in selected batch:{" "}
                    <span className="font-semibold">
                      {selectedBatch.available_quantity}
                    </span>
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <SheetFooter className="shrink-0 flex flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="h-10 px-6 rounded-xl text-sm"
            style={{ borderColor: "#DDD6FE", color: "#6D28D9" }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSell}
            disabled={step !== "batch" || !selectedBatch || submitting}
            className="h-10 px-7 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#6D28D9", color: "white" }}
          >
            {submitting ? "Selling..." : "Confirm Sell"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ── Types ──────────────────────────────────────────────────────────────────────

interface BarcodePrintSheetProps {
  open: boolean;
  itemName: string;
  quantity: number;
  baseBarcode: string;
  onPrinted: () => void;
  onClose: () => void;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const LABELS_PER_PAGE = 9; // 3 × 3 grid on A4 landscape

// ── JsBarcode loader ───────────────────────────────────────────────────────────

function loadJsBarcode(): Promise<void> {
  return new Promise((resolve) => {
    // @ts-expect-error CDN global
    if (typeof window.JsBarcode !== "undefined") { resolve(); return; }
    const s   = document.createElement("script");
    s.src     = "https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js";
    s.onload  = () => resolve();
    document.head.appendChild(s);
  });
}

function renderSvgBarcodes(container: HTMLElement) {
  container.querySelectorAll<SVGElement>("svg[data-code]").forEach((svg) => {
    const code = svg.getAttribute("data-code") ?? "";
    try {
      // @ts-expect-error CDN global
      window.JsBarcode(svg, code, {
        format: "CODE128", width: 2.2, height: 56,
        displayValue: false, margin: 2,
      });
    } catch { /* ignore */ }
  });
}

// ── Printable content component ────────────────────────────────────────────────
// This is the ONLY thing that gets sent to the printer.

interface PrintContentProps {
  itemName: string;
  labels: { no: number; code: string }[];
}

const PrintContent = ({ itemName, labels }: PrintContentProps) => {
  // Split into pages of LABELS_PER_PAGE
  const pages: typeof labels[] = [];
  for (let i = 0; i < labels.length; i += LABELS_PER_PAGE) {
    pages.push(labels.slice(i, i + LABELS_PER_PAGE));
  }

  return (
    <div>
      {pages.map((page, pi) => (
        <div
          key={pi}
          style={{
            width:  "297mm",
            height: "210mm",
            padding: "12mm",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
            gap: "8mm",
            pageBreakAfter: pi < pages.length - 1 ? "always" : "auto",
            breakAfter:     pi < pages.length - 1 ? "page"   : "auto",
            backgroundColor: "white",
          }}
        >
          {Array.from({ length: LABELS_PER_PAGE }).map((_, idx) => {
            const label = page[idx];
            if (!label) return <div key={idx} />;
            return (
              <div
                key={label.no}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "6mm 4mm",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "3mm",
                  backgroundColor: "white",
                  overflow: "hidden",
                }}
              >
                <span style={{ fontSize: "42pt", fontWeight: 900, lineHeight: 1, color: "#111827", fontFamily: "sans-serif" }}>
                  {label.no}
                </span>
                <span style={{ fontSize: "8pt", color: "#6b7280", fontFamily: "sans-serif", textAlign: "center", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {itemName}
                </span>
                <svg data-code={label.code} style={{ width: "100%", maxWidth: "70mm", height: "auto" }} />
                <span style={{ fontSize: "7pt", color: "#9ca3af", fontFamily: "monospace", textAlign: "center" }}>
                  {label.code}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

export default function BarcodePrintSheet({
  open,
  itemName,
  quantity,
  baseBarcode,
  onPrinted,
  onClose,
}: BarcodePrintSheetProps) {
  const [printed,  setPrinted]  = useState(false);
  const printRef   = useRef<HTMLDivElement>(null);  // hidden — sent to printer
  const previewRef = useRef<HTMLDivElement>(null);  // visible — screen preview

  const labels = Array.from({ length: quantity }, (_, i) => ({
    no:   i + 1,
    code: `${baseBarcode || "ITEM"}-${String(i + 1).padStart(2, "0")}`,
  }));

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) { setPrinted(false); }
  }, [open]);

  // Render barcodes into BOTH containers after open / data changes
  const renderAll = useCallback(() => {
    loadJsBarcode().then(() => {
      if (printRef.current)   renderSvgBarcodes(printRef.current);
      if (previewRef.current) renderSvgBarcodes(previewRef.current);
    });
  }, []);

  useEffect(() => {
    if (open) setTimeout(renderAll, 120);
  }, [open, quantity, baseBarcode, renderAll]);

  // react-to-print — targets the hidden printRef
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Barcodes — ${itemName}`,
    pageStyle: `
      @page { size: A4 landscape; margin: 0; }
      @media print {
        body { margin: 0; padding: 0; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
    onAfterPrint: () => setPrinted(true),
  });

  function handleConfirm() {
    onPrinted();
    onClose();
  }

  const pageCount = Math.ceil(quantity / LABELS_PER_PAGE);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="sm:max-w-4xl w-full rounded-3xl p-0 overflow-hidden gap-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center gap-3 px-6 py-4 border-b border-gray-100 space-y-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#EEF3EA" }}>
            <Printer size={18} style={{ color: "#3A7326" }} />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-[15px] font-bold leading-tight" style={{ color: "#1A3340" }}>
              Print Barcode Labels
            </DialogTitle>
            <DialogDescription className="text-[12px] text-gray-400 mt-0">
              {quantity} label{quantity !== 1 ? "s" : ""} · {pageCount} A4 page{pageCount !== 1 ? "s" : ""} (landscape, 9 per page) · {itemName}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Instruction banner */}
        <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-xl px-4 py-3 text-[12px]"
          style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" }}>
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>
            Print all <strong>{quantity}</strong> barcode labels and attach each numbered label to its corresponding product unit.
            You must confirm printing before you can save the product.
          </span>
        </div>

        {/* ── Hidden element sent to printer — A4 landscape pages ── */}
        <div style={{ display: "none" }} aria-hidden="true">
          <div ref={printRef}>
            <PrintContent itemName={itemName} labels={labels} />
          </div>
        </div>

        {/* ── Screen preview ── */}
        <div ref={previewRef} className="overflow-y-auto px-6 py-4" style={{ maxHeight: "52vh" }}>
          <div
            className="grid gap-3 w-full"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
          >
            {labels.map(({ no, code }) => (
              <div
                key={no}
                className="flex flex-col items-center gap-1 rounded-2xl border border-gray-200 p-3 bg-white"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
              >
                <span className="font-black leading-none tabular-nums"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "#111827" }}>
                  {no}
                </span>
                <span className="text-[10px] text-gray-400 text-center truncate w-full">
                  {itemName}
                </span>
                <svg data-code={code} className="w-full" style={{ minHeight: 60 }} />
                <span className="text-[9px] text-gray-400 font-mono text-center">{code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
          {printed ? (
            <div className="flex items-center gap-2 text-[13px] font-semibold mr-auto"
              style={{ color: "#3A7326" }}>
              <CheckCircle2 size={16} />
              Labels printed — you can now save the product.
            </div>
          ) : (
            <p className="text-[12px] text-gray-400 mr-auto">
              Print the labels, then confirm to enable saving.
            </p>
          )}
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={onClose}
              className="h-10 px-5 rounded-xl text-sm"
              style={{ borderColor: "#D4EAC8", color: "#3A7326" }}>
              Cancel
            </Button>
            <Button
              onClick={() => handlePrint()}
              className="h-10 px-5 rounded-xl text-sm font-semibold border-0"
              style={{ backgroundColor: "#3A7326", color: "white" }}>
              <Printer size={14} className="mr-1.5" />
              Print Labels
            </Button>
            {printed && (
              <Button onClick={handleConfirm}
                className="h-10 px-5 rounded-xl text-sm font-semibold border-0"
                style={{ backgroundColor: "#16A34A", color: "white" }}>
                <CheckCircle2 size={14} className="mr-1.5" />
                Confirm & Continue
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
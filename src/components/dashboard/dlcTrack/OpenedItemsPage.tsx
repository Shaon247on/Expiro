"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Eye, PackageOpen, ScanLine } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

import ScanAndCaptureModal, { type LookupResult } from "./ScanAndCaptureModal";
import {
  MOCK_OPENED_ITEMS, computeStatus, daysLeftLabel,
  statusMeta, type OpenedItem, type ProductStatus,
} from "@/types/OpenedItems.type";

// ── Mock DB ────────────────────────────────────────────────────────────────────

const PRODUCT_DB: Record<string, LookupResult> = {
  "5901234123457": { itemName: "Organic Whole Milk", category: "Dairy",     expiryDate: new Date(Date.now() + 5  * 86400000).toISOString().split("T")[0], openExpiryDays: 7,  barcode: "5901234123457" },
  "4006381333931": { itemName: "Sourdough Bread",    category: "Bakery",    expiryDate: new Date(Date.now() + 3  * 86400000).toISOString().split("T")[0], openExpiryDays: 3,  barcode: "4006381333931" },
  "7613035898226": { itemName: "Orange Juice",       category: "Beverages", expiryDate: new Date(Date.now() + 20 * 86400000).toISOString().split("T")[0], openExpiryDays: 14, barcode: "7613035898226" },
};

async function lookupProduct(barcode: string): Promise<LookupResult | null> {
  await new Promise((r) => setTimeout(r, 500));
  return PRODUCT_DB[barcode] ?? null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(iso));
}

// ── StatusBadge ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProductStatus }) {
  const m = statusMeta[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: m.bg, color: m.color }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: m.dot }} />
      {status}
    </span>
  );
}

// ── Detail Dialog ──────────────────────────────────────────────────────────────

function ItemDetailDialog({ item, onClose }: { item: OpenedItem; onClose: () => void }) {
  const days   = daysLeftLabel(item.expiryDate, item.openedAt, item.openExpiryDays);
  const status = computeStatus(item.expiryDate, item.openedAt, item.openExpiryDays);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-2xl border-0 shadow-2xl p-0 overflow-hidden">
        <div className="h-1 w-full" style={{ backgroundColor: "#3A7326" }} />
        <div className="p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-[17px] font-bold" style={{ color: "#1A3340" }}>
              {item.itemName}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-gray-500">
              {item.category} · Barcode: {item.barcode}
            </DialogDescription>
          </DialogHeader>

          {/* Captured photo */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-5 border border-gray-100">
            <Image src={item.imageUrl} alt={item.itemName} fill className="object-cover" />
            <div className="absolute bottom-2 left-2">
              <span className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "white" }}>
                Captured at opening
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Opened",         value: formatDateTime(item.openedAt)     },
              { label: "Expiry Date",    value: formatDate(item.expiryDate)       },
              { label: "Open Valid For", value: `${item.openExpiryDays} days`     },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-[13px]">
                <span className="text-gray-500 font-medium">{label}</span>
                <span className="font-bold" style={{ color: "#1A3340" }}>{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-gray-500 font-medium">Days Left</span>
              <span className="font-bold text-[14px]"
                style={{ color: days < 0 ? "#E11D48" : days <= 2 ? "#E11D48" : days <= 7 ? "#EA580C" : "#16A34A" }}>
                {days < 0 ? "Expired" : `${days} days`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium text-[13px]">Status</span>
              <StatusBadge status={status} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function OpenedItemsPage() {
  const [items, setItems]       = useState<OpenedItem[]>(MOCK_OPENED_ITEMS);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState<OpenedItem | null>(null);

  /** Called by ScanAndCaptureModal once photo is confirmed */
  const handleComplete = useCallback((imageDataUrl: string, product: LookupResult) => {
    const now    = new Date().toISOString();
    const status = computeStatus(product.expiryDate, now, product.openExpiryDays);
    const newItem: OpenedItem = {
      id:             `oi-${Date.now()}`,
      barcode:        product.barcode,
      itemName:       product.itemName,
      category:       product.category,
      imageUrl:       imageDataUrl,
      openedAt:       now,
      expiryDate:     product.expiryDate,
      openExpiryDays: product.openExpiryDays,
      status,
      openedBy: { id: "me", name: "You", email: "user@store.com", avatarInitials: "ME", avatarBg: "#EEF3EA" },
    };
    setItems((prev) => [newItem, ...prev]);
    toast.success(`"${product.itemName}" marked as opened.`, { position: "bottom-right" });
  }, []);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#EEF3EA" }}>
          <PackageOpen size={22} style={{ color: "#3A7326" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold" style={{ color: "#1A3340" }}>Opened Items</h1>
          <p className="text-sm" style={{ color: "#51564E" }}>{items.length} items currently open</p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold border-0 shrink-0"
          style={{ backgroundColor: "#3A7326", color: "white" }}
        >
          <ScanLine size={15} />
          <span className="hidden sm:inline">Scan Product</span>
          <span className="sm:hidden">Scan</span>
        </Button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {["No.", "Item", "Category", "Status", "Days Left", "Action"].map((col, i) => (
                  <th key={col}
                    className={`text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5 ${
                      i === 5 ? "text-right" : i === 0 ? "text-center w-14" : "text-left"
                    }`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <PackageOpen size={36} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm text-gray-400">No opened items yet. Tap Scan Product to begin.</p>
                  </td>
                </tr>
              ) : items.map((item, idx) => {
                const days   = daysLeftLabel(item.expiryDate, item.openedAt, item.openExpiryDays);
                const status = computeStatus(item.expiryDate, item.openedAt, item.openExpiryDays);
                return (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-3.5 text-center text-[12px] font-medium text-gray-400 tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <Image src={item.imageUrl} alt={item.itemName} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: "#1A3340" }}>{item.itemName}</p>
                          <p className="text-[11px] text-gray-400">Opened {formatDateTime(item.openedAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">{item.category}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={status} /></td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-bold tabular-nums"
                        style={{ color: days < 0 ? "#E11D48" : days <= 2 ? "#E11D48" : days <= 7 ? "#EA580C" : "#16A34A" }}>
                        {days < 0 ? "Expired" : `${days}d`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button size="icon" variant="ghost" onClick={() => setViewItem(item)}
                        className="w-8 h-8 rounded-lg text-gray-400 hover:text-[#1A3340] hover:bg-gray-100">
                        <Eye size={15} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-50">
          {items.length === 0 && (
            <div className="py-16 text-center px-6">
              <PackageOpen size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm text-gray-400">No opened items yet.</p>
              <button onClick={() => setModalOpen(true)}
                className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#EEF3EA", color: "#3A7326" }}>
                Scan a product
              </button>
            </div>
          )}
          {items.map((item, idx) => {
            const days   = daysLeftLabel(item.expiryDate, item.openedAt, item.openExpiryDays);
            const status = computeStatus(item.expiryDate, item.openedAt, item.openExpiryDays);
            return (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3.5">
                <span className="text-[11px] font-bold w-5 text-gray-400 tabular-nums shrink-0">{idx + 1}</span>
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                  <Image src={item.imageUrl} alt={item.itemName} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: "#1A3340" }}>{item.itemName}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[11px] text-gray-400">{item.category}</span>
                    <StatusBadge status={status} />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[12px] font-bold"
                    style={{ color: days < 0 ? "#E11D48" : days <= 7 ? "#EA580C" : "#16A34A" }}>
                    {days < 0 ? "Exp" : `${days}d`}
                  </span>
                  <Button size="icon" variant="ghost" onClick={() => setViewItem(item)}
                    className="w-7 h-7 rounded-lg text-gray-400 hover:text-[#1A3340]">
                    <Eye size={13} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unified scan + capture modal */}
      <ScanAndCaptureModal
        open={modalOpen}
        onComplete={handleComplete}
        onClose={() => setModalOpen(false)}
        lookupProduct={lookupProduct}
      />

      {/* Detail dialog */}
      {viewItem && <ItemDetailDialog item={viewItem} onClose={() => setViewItem(null)} />}
    </div>
  );
}
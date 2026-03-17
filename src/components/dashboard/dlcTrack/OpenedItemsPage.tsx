"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Eye, PackageOpen, ScanLine } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

import ScanAndCaptureModal from "./ScanAndCaptureModal";
import {
  MOCK_OPENED_ITEMS, computeStatus, daysLeftLabel, openExpiryDate,
  statusMeta, type OpenedItem, type ProductStatus,
} from "@/types/OpenedItems.type";

// ── Mock product DB ────────────────────────────────────────────────────────────

const PRODUCT_DB: Record<string, {
  itemName: string;
  category: string;
  expiryDate: string;
  openExpiryDays: number;
  barcode: string;
}> = {
  "5901234123457": { itemName: "Organic Whole Milk", category: "Dairy",     barcode: "5901234123457", openExpiryDays: 7,  expiryDate: new Date(Date.now() + 5  * 86400000).toISOString().split("T")[0] },
  "4006381333931": { itemName: "Sourdough Bread",    category: "Bakery",    barcode: "4006381333931", openExpiryDays: 3,  expiryDate: new Date(Date.now() + 3  * 86400000).toISOString().split("T")[0] },
  "7613035898226": { itemName: "Orange Juice",       category: "Beverages", barcode: "7613035898226", openExpiryDays: 14, expiryDate: new Date(Date.now() + 20 * 86400000).toISOString().split("T")[0] },
  "0012000161155": { itemName: "Greek Yogurt",       category: "Dairy",     barcode: "0012000161155", openExpiryDays: 5,  expiryDate: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0] },
  "5449000000996": { itemName: "Cheddar Cheese",     category: "Dairy",     barcode: "5449000000996", openExpiryDays: 21, expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0] },
  "8076809513753": { itemName: "Tomato Sauce",       category: "Other",     barcode: "8076809513753", openExpiryDays: 7,  expiryDate: new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0] },
};

async function lookupProduct(barcode: string) {
  await new Promise((r) => setTimeout(r, 500));
  return PRODUCT_DB[barcode.trim()] ?? null;
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
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: m.bg, color: m.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: m.dot }} />
      {status}
    </span>
  );
}

// ── Detail Dialog ──────────────────────────────────────────────────────────────

function ItemDetailDialog({ item, onClose }: { item: OpenedItem; onClose: () => void }) {
  const days            = daysLeftLabel(item.expiryDate, item.openedAt, item.openExpiryDays);
  const status          = computeStatus(item.expiryDate, item.openedAt, item.openExpiryDays);
  const afterOpenExpiry = openExpiryDate(item.openedAt, item.openExpiryDays);

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

          <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-5 border border-gray-100">
            <Image src={item.imageUrl} alt={item.itemName} fill className="object-cover" />
            <div className="absolute bottom-2 left-2">
              <span className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "white" }}>
                Captured at opening
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Product Name",              value: item.itemName },
              { label: "Supplier Batch / Lot No.",  value: item.supplierBatchNumber },
              { label: "Supplier Expiry (DLC)",     value: formatDate(item.expiryDate) },
              { label: "Product Opening Date",      value: formatDateTime(item.openedAt) },
              { label: "Validity After Opening",    value: `${item.openExpiryDays} days` },
              { label: "Expiry Date After Opening", value: formatDate(afterOpenExpiry) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-4 text-[13px]">
                <span className="text-gray-500 font-medium shrink-0">{label}</span>
                <span className="font-semibold text-right" style={{ color: "#1A3340" }}>{value}</span>
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
            <div className="pt-2.5 mt-1 border-t border-gray-100 flex items-center justify-between text-[13px]">
              <span className="text-gray-500 font-medium">Opened By</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: item.openedBy.avatarBg, color: "#1A3340" }}>
                  {item.openedBy.avatarInitials}
                </div>
                <span className="font-semibold" style={{ color: "#1A3340" }}>{item.openedBy.name}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Table columns ──────────────────────────────────────────────────────────────

const DESKTOP_COLS = [
  { label: "No.",                   cls: "text-center w-12"  },
  { label: "Product Name",          cls: "text-left"         },
  { label: "Supplier Batch",        cls: "text-left"         },
  { label: "Supplier Expiry (DLC)", cls: "text-left"         },
  { label: "Opening Date",          cls: "text-left"         },
  // { label: "Validity",              cls: "text-left"         },
  { label: "Expiry After Opening",  cls: "text-left"         },
  { label: "Status",                cls: "text-left"         },
  { label: "Opened By",             cls: "text-left"         },
  { label: "Action",                cls: "text-right"        },
];

// ── TGTG Badge — shown when product is expiring soon / urgent ─────────────────

function TGTGBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide"
      style={{ backgroundColor: "#FFF7ED", color: "#EA580C", border: "1.5px solid #FED7AA" }}
    >
      🥡 TGTG
    </span>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function OpenedItemsPage() {
  const [items, setItems]         = useState<OpenedItem[]>(MOCK_OPENED_ITEMS);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewItem, setViewItem]   = useState<OpenedItem | null>(null);

  type ProductEntry = typeof PRODUCT_DB[string];

  const handleComplete = useCallback((imageDataUrl: string, product: ProductEntry) => {
    const now    = new Date().toISOString();
    const status = computeStatus(product.expiryDate, now, product.openExpiryDays);
    const newItem: OpenedItem = {
      id:                  `oi-${Date.now()}`,
      barcode:             product.barcode,
      supplierBatchNumber: "—",
      itemName:            product.itemName,
      category:            product.category,
      imageUrl:            imageDataUrl,
      openedAt:            now,
      expiryDate:          product.expiryDate,
      openExpiryDays:      product.openExpiryDays,
      status,
      openedBy: { id: "me", name: "You", email: "user@store.com", avatarInitials: "ME", avatarBg: "#EEF3EA" },
    };
    setItems((prev) => [newItem, ...prev]);
    toast.success(`"${product.itemName}" marked as opened.`, { position: "bottom-right" });
  }, []);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full" style={{ minWidth: 900 }}>
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {DESKTOP_COLS.map(({ label, cls }) => (
                  <th key={label}
                    className={`text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5 ${cls}`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={DESKTOP_COLS.length} className="py-16 text-center">
                    <PackageOpen size={36} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm text-gray-400">No opened items yet. Tap Scan Product to begin.</p>
                  </td>
                </tr>
              ) : items.map((item, idx) => {
                const days            = daysLeftLabel(item.expiryDate, item.openedAt, item.openExpiryDays);
                const status          = computeStatus(item.expiryDate, item.openedAt, item.openExpiryDays);
                const afterOpenExpiry = openExpiryDate(item.openedAt, item.openExpiryDays);
                return (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors">
                    <td className="px-4 py-3 text-center text-[12px] font-medium text-gray-400 tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <Image src={item.imageUrl} alt={item.itemName} fill className="object-cover" />
                        </div>
                        <span className="text-[13px] font-semibold truncate max-w-[120px]" style={{ color: "#1A3340" }}>
                          {item.itemName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-mono text-gray-600">{item.supplierBatchNumber}</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-gray-500 tabular-nums whitespace-nowrap">
                      {formatDate(item.expiryDate)}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-gray-500 tabular-nums whitespace-nowrap">
                      {formatDateTime(item.openedAt)}
                    </td>
                    {/* <td className="px-4 py-3 text-[12px] text-gray-500 whitespace-nowrap">
                      {item.openExpiryDays}d
                    </td> */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-[12px] tabular-nums text-gray-600">{formatDate(afterOpenExpiry)}</p>
                      <p className="text-[11px] font-semibold"
                        style={{ color: days < 0 ? "#E11D48" : days <= 2 ? "#E11D48" : days <= 7 ? "#EA580C" : "#16A34A" }}>
                        {days < 0 ? "Expired" : `${days}d left`}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={status} />
                        {(status === "Urgent" || status === "Expiring soon") && <TGTGBadge />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                          style={{ backgroundColor: item.openedBy.avatarBg, color: "#1A3340" }}>
                          {item.openedBy.avatarInitials}
                        </div>
                        <span className="text-[12px] font-medium text-gray-700 truncate max-w-[80px]">
                          {item.openedBy.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
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
        <div className="md:hidden divide-y divide-gray-50">
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
            const days            = daysLeftLabel(item.expiryDate, item.openedAt, item.openExpiryDays);
            const status          = computeStatus(item.expiryDate, item.openedAt, item.openExpiryDays);
            const afterOpenExpiry = openExpiryDate(item.openedAt, item.openExpiryDays);
            return (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold w-5 text-gray-400 tabular-nums shrink-0">{idx + 1}</span>
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <Image src={item.imageUrl} alt={item.itemName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: "#1A3340" }}>{item.itemName}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{item.supplierBatchNumber}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setViewItem(item)}
                    className="w-8 h-8 rounded-lg text-gray-400 hover:text-[#1A3340] shrink-0">
                    <Eye size={14} />
                  </Button>
                </div>
                <div className="pl-8 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {[
                    { label: "Supplier DLC",  value: formatDate(item.expiryDate)     },
                    { label: "Opened",        value: formatDate(item.openedAt)       },
                    { label: "Validity",      value: `${item.openExpiryDays} days`   },
                    { label: "Expires After", value: formatDate(afterOpenExpiry)     },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                      <p className="text-[12px] font-semibold" style={{ color: "#1A3340" }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="pl-8 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ backgroundColor: item.openedBy.avatarBg, color: "#1A3340" }}>
                      {item.openedBy.avatarInitials}
                    </div>
                    <span className="text-[11px] text-gray-500">{item.openedBy.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={status} />
                    {(status === "Urgent" || status === "Expiring soon") && <TGTGBadge />}
                  </div>
                  <span className="text-[12px] font-bold"
                    style={{ color: days < 0 ? "#E11D48" : days <= 7 ? "#EA580C" : "#16A34A" }}>
                    {days < 0 ? "Expired" : `${days}d left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scan + capture modal */}
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
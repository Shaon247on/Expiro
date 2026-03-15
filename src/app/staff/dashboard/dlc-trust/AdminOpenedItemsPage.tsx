"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Eye, PackageOpen, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

import {
  MOCK_OPENED_ITEMS, computeStatus, daysLeftLabel,
  statusMeta, type OpenedItem, type ProductStatus,
} from "@/types/openedItems.type";

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

// ── Admin Detail Dialog ────────────────────────────────────────────────────────

function AdminDetailDialog({ item, onClose }: { item: OpenedItem; onClose: () => void }) {
  const days   = daysLeftLabel(item.expiryDate, item.openedAt, item.openExpiryDays);
  const status = computeStatus(item.expiryDate, item.openedAt, item.openExpiryDays);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl border-0 shadow-2xl p-0 overflow-hidden">
        <div className="h-1 w-full" style={{ backgroundColor: "#07162D" }} />
        <div className="p-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="text-[17px] font-bold" style={{ color: "#1A3340" }}>
              {item.itemName}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-gray-500">
              {item.category} · Barcode: <span className="font-mono">{item.barcode}</span>
            </DialogDescription>
          </DialogHeader>

          {/* Two-col layout on sm+ */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Captured photo */}
            <div className="relative w-full sm:w-40 h-40 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
              <Image src={item.imageUrl} alt={item.itemName} fill className="object-cover" />
              <div className="absolute bottom-2 left-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                  style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "white" }}>
                  At opening
                </span>
              </div>
            </div>

            {/* Product details */}
            <div className="flex-1 space-y-2.5">
              {[
                { label: "Opened At",     value: formatDateTime(item.openedAt)  },
                { label: "Expiry Date",   value: formatDate(item.expiryDate)    },
                { label: "Open Valid",    value: `${item.openExpiryDays} days`  },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold" style={{ color: "#1A3340" }}>{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-gray-500">Days Left</span>
                <span className="font-bold text-[14px]"
                  style={{ color: days < 0 ? "#E11D48" : days <= 2 ? "#E11D48" : days <= 7 ? "#EA580C" : "#16A34A" }}>
                  {days < 0 ? "Expired" : `${days} days`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-[13px]">Status</span>
                <StatusBadge status={status} />
              </div>
            </div>
          </div>

          {/* Opened by */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Opened By</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: item.openedBy.avatarBg, color: "#1A3340" }}>
                {item.openedBy.avatarInitials}
              </div>
              <div>
                <p className="text-[14px] font-bold" style={{ color: "#1A3340" }}>{item.openedBy.name}</p>
                <p className="text-[12px] text-gray-500">{item.openedBy.email}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ["All", "Open Item", "Expiring soon", "Urgent", "Remove Item"] as const;

export default function AdminOpenedItemsPage() {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewItem, setViewItem]     = useState<OpenedItem | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return MOCK_OPENED_ITEMS.filter((item) => {
      const matchSearch = !q ||
        item.itemName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.openedBy.name.toLowerCase().includes(q) ||
        item.barcode.includes(q);
      const liveStatus = computeStatus(item.expiryDate, item.openedAt, item.openExpiryDays);
      const matchStatus = statusFilter === "All" || liveStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#EEF3EA" }}>
          <PackageOpen size={22} style={{ color: "#3A7326" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold" style={{ color: "#1A3340" }}>Opened Items — Admin</h1>
          <p className="text-sm" style={{ color: "#51564E" }}>
            {MOCK_OPENED_ITEMS.length} total items tracked across all staff
          </p>
        </div>
        {/* Summary chips */}
        <div className="hidden md:flex items-center gap-2">
          {(["Urgent", "Expiring soon", "Remove Item"] as ProductStatus[]).map((s) => {
            const count = MOCK_OPENED_ITEMS.filter((i) => computeStatus(i.expiryDate, i.openedAt, i.openExpiryDays) === s).length;
            if (!count) return null;
            const m = statusMeta[s];
            return (
              <span key={s} className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: m.bg, color: m.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.dot }} />
                {count} {s}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search by item, category, staff, or barcode…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 border-gray-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 placeholder:text-gray-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44 h-10 border-gray-200 rounded-xl text-sm bg-white">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s === "All" ? "All Statuses" : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {["No.", "Item", "Category", "Opened By", "Opened At", "Status", "Days Left", "Action"].map((col, i) => (
                  <th key={col}
                    className={`text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5 ${
                      i === 7 ? "text-right" : i === 0 ? "text-center w-12" : "text-left"
                    }`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <PackageOpen size={36} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm text-gray-400">No items match your filters.</p>
                  </td>
                </tr>
              ) : filtered.map((item, idx) => {
                const days   = daysLeftLabel(item.expiryDate, item.openedAt, item.openExpiryDays);
                const status = computeStatus(item.expiryDate, item.openedAt, item.openExpiryDays);
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
                        <span className="text-[13px] font-semibold truncate max-w-[140px]" style={{ color: "#1A3340" }}>
                          {item.itemName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-gray-500">{item.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                          style={{ backgroundColor: item.openedBy.avatarBg, color: "#1A3340" }}>
                          {item.openedBy.avatarInitials}
                        </div>
                        <span className="text-[12px] font-medium text-gray-700 truncate max-w-[100px]">
                          {item.openedBy.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-gray-400 tabular-nums whitespace-nowrap">
                      {formatDateTime(item.openedAt)}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={status} /></td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-bold tabular-nums"
                        style={{ color: days < 0 ? "#E11D48" : days <= 2 ? "#E11D48" : days <= 7 ? "#EA580C" : "#16A34A" }}>
                        {days < 0 ? "Expired" : `${days}d`}
                      </span>
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
        <div className="sm:hidden divide-y divide-gray-50">
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <PackageOpen size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm text-gray-400">No items match your filters.</p>
            </div>
          )}
          {filtered.map((item, idx) => {
            const days   = daysLeftLabel(item.expiryDate, item.openedAt, item.openExpiryDays);
            const status = computeStatus(item.expiryDate, item.openedAt, item.openExpiryDays);
            return (
              <div key={item.id} className="p-4 space-y-3">
                {/* Top row */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-gray-400 w-5 shrink-0 tabular-nums">{idx + 1}</span>
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <Image src={item.imageUrl} alt={item.itemName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: "#1A3340" }}>{item.itemName}</p>
                    <p className="text-[11px] text-gray-400">{item.category}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setViewItem(item)}
                    className="w-8 h-8 rounded-lg text-gray-400 hover:text-[#1A3340] shrink-0">
                    <Eye size={14} />
                  </Button>
                </div>
                {/* Bottom strip */}
                <div className="flex items-center justify-between pl-8 flex-wrap gap-2">
                  {/* Opened by */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                      style={{ backgroundColor: item.openedBy.avatarBg, color: "#1A3340" }}>
                      {item.openedBy.avatarInitials}
                    </div>
                    <span className="text-[11px] text-gray-500">{item.openedBy.name}</span>
                  </div>
                  <StatusBadge status={status} />
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

      {/* Detail dialog */}
      {viewItem && <AdminDetailDialog item={viewItem} onClose={() => setViewItem(null)} />}
    </div>
  );
}
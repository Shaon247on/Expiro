"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Eye, PackageOpen, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  DLC_STATUS_META,
  DLC_TRACKING_PAGE_SIZE,
  type DlcTrackingStatus,
  type ProductOpenProofItem,
} from "@/types/dlc-tracking.type";
import ProductPagination from "@/components/dashboard/product/Productpagination";

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function getDaysLeftMeta(days: number) {
  if (days < 0) {
    return { label: "Expired", color: "#E11D48" };
  }
  if (days <= 2) {
    return { label: `${days}d`, color: "#E11D48" };
  }
  if (days <= 7) {
    return { label: `${days}d`, color: "#EA580C" };
  }
  return { label: `${days}d`, color: "#16A34A" };
}

function StatusBadge({ status }: { status: DlcTrackingStatus }) {
  const m = DLC_STATUS_META[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: m.bg, color: m.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: m.dot }}
      />
      {m.label}
    </span>
  );
}

function AdminDetailDialog({
  item,
  onClose,
}: {
  item: ProductOpenProofItem;
  onClose: () => void;
}) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl border-0 shadow-2xl p-0 overflow-hidden">
        <div className="p-6 space-y-5">
          <DialogHeader>
            <DialogTitle
              className="text-[17px] font-bold"
              style={{ color: "#1A3340" }}
            >
              {item.product_name}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-gray-500">
              {item.category_name} · Barcode:{" "}
              <span className="font-mono">{item.scanned_barcode}</span>
            </DialogDescription>
          </DialogHeader>

          {/* Two-col layout on sm+ */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Captured photo */}
            <div className="relative w-full sm:w-40 h-40 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
              <Image
                src={item.proof_image}
                alt={item.product_name}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.55)",
                    color: "white",
                  }}
                >
                  At opening
                </span>
              </div>
            </div>

            {/* Product details */}
            <div className="flex-1 space-y-2.5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-gray-500">Days Left</span>
                <span
                  className="font-bold text-[14px]"
                  style={{
                    color:
                      item.days_left < 0
                        ? "#E11D48"
                        : item.days_left <= 2
                          ? "#E11D48"
                          : item.days_left <= 7
                            ? "#EA580C"
                            : "#16A34A",
                  }}
                >
                  {item.days_left < 0 ? "Expired" : `${item.days_left} days`}
                </span>
              </div>
              {[
                { label: "Opened At", value: formatDateTime(item.opened_at) },
                { label: "Category", value: item.category_name },
                { label: "Note", value: item.note || "-" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-[13px] gap-3"
                >
                  <span className="text-gray-500">{label}</span>
                  <span
                    className="font-semibold text-right"
                    style={{ color: "#1A3340" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Opened by */}
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Opened By
            </p>
            <div className="flex items-center w-full border px-4 bg-gray-200 rounded-lg gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                {item.opened_by_name}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "open", label: "Open Item" },
  { value: "expiring_soon", label: "Expiring soon" },
  { value: "urgent", label: "Urgent" },
  { value: "removed", label: "Remove Item" },
];

export default function AdminOpenedItemsPage({
  items,
  totalItems,
  currentPage,
  status,
  search,
}: {
  items: ProductOpenProofItem[];
  totalItems: number;
  currentPage: number;
  status: string;
  search: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewItem, setViewItem] = useState<ProductOpenProofItem | null>(null);

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / DLC_TRACKING_PAGE_SIZE),
  );

  const statusSummary = useMemo(() => {
    return (["urgent", "expiring_soon", "removed"] as DlcTrackingStatus[])
      .map((s) => ({
        status: s,
        count: items.filter((i) => i.product_status === s).length,
      }))
      .filter((x) => x.count > 0);
  }, [items]);

  function updateQuery(next: {
    search?: string;
    status?: string;
    page?: string;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.search !== undefined) {
      if (next.search.trim()) params.set("search", next.search.trim());
      else params.delete("search");
    }

    if (next.status !== undefined) {
      if (next.status && next.status !== "all")
        params.set("status", next.status);
      else params.delete("status");
    }

    if (next.page !== undefined) {
      params.set("page", next.page);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#EEF3EA" }}
        >
          <PackageOpen size={22} style={{ color: "#3A7326" }} />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold" style={{ color: "#1A3340" }}>
            Opened Items — Admin
          </h1>
          <p className="text-sm" style={{ color: "#51564E" }}>
            {totalItems} total items tracked across all staff
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {statusSummary.map(({ status, count }) => {
            const m = DLC_STATUS_META[status];
            return (
              <span
                key={status}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: m.bg, color: m.color }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: m.dot }}
                />
                {count} {m.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <Input
            placeholder="Search by item, category, staff, or barcode…"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateQuery({
                  search: (e.target as HTMLInputElement).value,
                  page: "1",
                });
              }
            }}
            className="pl-10 h-10 border-gray-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 placeholder:text-gray-400"
          />
        </div>

        <Select
          value={status || "all"}
          onValueChange={(value) =>
            updateQuery({
              status: value,
              page: "1",
            })
          }
        >
          <SelectTrigger className="w-full sm:w-44 h-10 border-gray-200 rounded-xl text-sm bg-white">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {[
                  "No.",
                  "Item",
                  "Category",
                  "Opened By",
                  "Opened At",
                  "Status",
                  "Days Left",
                  "Action",
                ].map((col, i) => (
                  <th
                    key={col}
                    className={`text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5 ${
                      i === 7
                        ? "text-right"
                        : i === 0
                          ? "text-center w-12"
                          : "text-left"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <PackageOpen
                      size={36}
                      className="mx-auto mb-3 opacity-20"
                    />
                    <p className="text-sm text-gray-400">
                      No items match your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const daysMeta = getDaysLeftMeta(item.days_left);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-center text-[12px] font-medium text-gray-400 tabular-nums">
                        {String(
                          (currentPage - 1) * DLC_TRACKING_PAGE_SIZE + idx + 1,
                        ).padStart(2, "0")}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                            <Image
                              src={item.proof_image}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span
                            className="text-[13px] font-semibold truncate max-w-[140px]"
                            style={{ color: "#1A3340" }}
                          >
                            {item.product_name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-[12px] text-gray-500">
                        {item.category_name}
                      </td>

                      <td className="px-4 py-3 text-[12px] font-medium text-gray-700">
                        {item.opened_by_name}
                      </td>

                      <td className="px-4 py-3 text-[11px] text-gray-400 tabular-nums whitespace-nowrap">
                        {formatDateTime(item.opened_at)}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge
                          status={item.product_status as DlcTrackingStatus}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className="text-[13px] font-bold tabular-nums"
                          style={{ color: daysMeta.color }}
                        >
                          {daysMeta.label}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setViewItem(item)}
                          className="w-8 h-8 rounded-lg text-gray-400 hover:text-[#1A3340] hover:bg-gray-100"
                        >
                          <Eye size={15} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden divide-y divide-gray-50">
          {items.length === 0 && (
            <div className="py-16 text-center">
              <PackageOpen size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm text-gray-400">
                No items match your filters.
              </p>
            </div>
          )}

          {items.map((item, idx) => {
            const daysMeta = getDaysLeftMeta(item.days_left);

            return (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-gray-400 w-5 shrink-0 tabular-nums">
                    {(currentPage - 1) * DLC_TRACKING_PAGE_SIZE + idx + 1}
                  </span>

                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <Image
                      src={item.proof_image as string}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-semibold truncate"
                      style={{ color: "#1A3340" }}
                    >
                      {item.product_name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {item.category_name}
                    </p>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setViewItem(item)}
                    className="w-8 h-8 rounded-lg text-gray-400 hover:text-[#1A3340] shrink-0"
                  >
                    <Eye size={14} />
                  </Button>
                </div>

                <div className="flex items-center justify-between pl-8 flex-wrap gap-2">
                  <span className="text-[11px] text-gray-500">
                    {item.opened_by_name}
                  </span>

                  <StatusBadge
                    status={item.product_status as DlcTrackingStatus}
                  />

                  <span
                    className="text-[12px] font-bold"
                    style={{ color: daysMeta.color }}
                  >
                    {daysMeta.label === "Expired"
                      ? "Expired"
                      : `${item.days_left}d left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={(() => {
          const params = new URLSearchParams();
          if (search) params.set("search", search);
          if (status && status !== "all") params.set("status", status);
          const query = params.toString();
          return query
            ? `/dashboard/dlc-tracking?${query}`
            : "/dashboard/dlc-tracking";
        })()}
      />

      {viewItem && (
        <AdminDetailDialog item={viewItem} onClose={() => setViewItem(null)} />
      )}
    </div>
  );
}

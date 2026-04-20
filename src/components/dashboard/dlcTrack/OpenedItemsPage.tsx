"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Eye, PackageOpen, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ScanAndCaptureModal from "./ScanAndCaptureModal";
import ProductPagination from "@/components/dashboard/product/Productpagination";
import {
  lookupUnitForOpenAction,
  confirmOpenProductAction,
  type OpenProjectLookupData,
} from "@/actions/dlc/open-project.action";
import {
  DLC_TRUST_PAGE_SIZE,
  DLC_TRUST_STATUS_META,
  type DlcTrustFilterStatus,
  type DlcTrustProduct,
} from "@/types/dlc-trust.type";
import { getDlcTrustProductDetailsAction } from "@/actions/staff/dlc-trust.action";

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

function getDlcStatus(item: DlcTrustProduct): DlcTrustFilterStatus {
  const productStatus = item.products_status?.toLowerCase();

  if (productStatus === "urgent") return "urgent";
  if (productStatus === "expiring_soon") return "expiring_soon";
  if (productStatus === "remove_item" || item.status === "removed")
    return "removed";
  return "opened";
}

function getDaysLeft(date: string | null) {
  if (!date) return null;
  const ms = new Date(date).getTime() - new Date().getTime();
  return Math.ceil(ms / 86400000);
}

function StatusBadge({ status }: { status: DlcTrustFilterStatus }) {
  const m = DLC_TRUST_STATUS_META[status];

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

function TGTGBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide"
      style={{
        backgroundColor: "#FFF7ED",
        color: "#EA580C",
        border: "1.5px solid #FED7AA",
      }}
    >
      🥡 TGTG
    </span>
  );
}

function DetailLine({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-start justify-between gap-4 text-[13px]">
      <span className="text-gray-500 font-medium shrink-0">{label}</span>
      <span className="font-semibold text-right" style={{ color: "#1A3340" }}>
        {value}
      </span>
    </div>
  );
}

function ItemDetailDialog({
  item,
  onClose,
}: {
  item: DlcTrustProduct;
  onClose: () => void;
}) {
  const days = getDaysLeft(item.active_expiry_date ?? item.expiry_date);
  const status = getDlcStatus(item);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-2xl border-0 shadow-2xl p-0 overflow-hidden">
        <div className="h-1 w-full" style={{ backgroundColor: "#3A7326" }} />
        <div className="p-6">
          <DialogHeader className="mb-5">
            <DialogTitle
              className="text-[17px] font-bold"
              style={{ color: "#1A3340" }}
            >
              {item.name}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-gray-500">
              {item.category_name} · Barcode: {item.barcode}
            </DialogDescription>
          </DialogHeader>

          <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-5 border border-gray-100 bg-gray-50">
            {item.category_image ? (
              <Image
                src={item.category_image}
                alt={item.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">
                📦
              </div>
            )}
            <div className="absolute bottom-2 left-2">
              <span
                className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "white" }}
              >
                Opened product
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <DetailLine label="Product Name" value={item.name} />
            {/* <DetailLine label="Opened Units Count" value={item.opened_units_count} /> */}
            <DetailLine
              label="Supplier Expiry (DLC)"
              value={formatDate(item.expiry_date)}
            />
            <DetailLine
              label="Product Opening Date"
              value={formatDateTime(item.created_at)}
            />
            <DetailLine
              label="Validity After Opening"
              value={
                item.track_open_expiry_days && item.open_expiry_days != null
                  ? `${item.open_expiry_days} days`
                  : "No PAO"
              }
            />
            <DetailLine
              label="Expiry Date After Opening"
              value={
                item.active_expiry_date
                  ? formatDate(item.active_expiry_date)
                  : "—"
              }
            />
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-gray-500 font-medium">Days Left</span>
              <span
                className="font-bold text-[14px]"
                style={{
                  color:
                    days == null
                      ? "#6B7280"
                      : days < 0
                        ? "#E11D48"
                        : days <= 2
                          ? "#E11D48"
                          : days <= 7
                            ? "#EA580C"
                            : "#16A34A",
                }}
              >
                {days == null ? "—" : days < 0 ? "Expired" : `${days} days`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium text-[13px]">
                Status
              </span>
              <StatusBadge status={status} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const DESKTOP_COLS = [
  { label: "No.", cls: "text-center w-12" },
  { label: "Product Name", cls: "text-left" },
  { label: "Category", cls: "text-left" },
  { label: "Supplier Expiry (DLC)", cls: "text-left" },
  { label: "Opening Date", cls: "text-left" },
  { label: "Expiry After Opening", cls: "text-left" },
  { label: "Status", cls: "text-left" },
  // { label: "Opened Units", cls: "text-left" },
  { label: "Action", cls: "text-right" },
];

const FILTER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All" },
  { value: "opened", label: "Opened" },
  { value: "expiring_soon", label: "Expiring soon" },
  { value: "urgent", label: "Urgent" },
  { value: "removed", label: "Removed" },
];

export default function OpenedItemsPage({
  items,
  totalItems,
  currentPage,
  filter,
}: {
  items: DlcTrustProduct[];
  totalItems: number;
  currentPage: number;
  filter: string;
}) {
  const router = useRouter();
  const [localItems, setLocalItems] = useState<DlcTrustProduct[]>(items);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState<DlcTrustProduct | null>(null);
  const [detailsLoadingId, setDetailsLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const lookupProduct = useCallback(async (barcode: string) => {
    const result = await lookupUnitForOpenAction(barcode);

    if (!result.success) {
      toast.error("Lookup failed", {
        description: result.message,
        position: "bottom-right",
      });
      return null;
    }

    return result.data;
  }, []);

  const handleComplete = useCallback(
    async (
      proofFile: File,
      previewUrl: string,
      product: OpenProjectLookupData,
    ) => {
      const formData = new FormData();
      formData.append("unique_barcode", product.scanned_unit.unique_barcode);
      formData.append("proof_image", proofFile);

      const result = await confirmOpenProductAction(formData);

      if (!result.success) {
        toast.error("Open confirmation failed", {
          description: result.message,
          position: "bottom-right",
        });
        return;
      }

      const proof = result.data.proof;

      const newItem: DlcTrustProduct = {
        id: result.data.product_id,
        category: product.category,
        category_name: product.category_name,
        category_image: result.data.proof.proof_image || previewUrl,
        name: result.data.product_name,
        barcode: result.data.product_barcode,
        quantity: 1,
        purchase_date: result.data.batch.purchase_date,
        expiry_date: result.data.batch.expiry_date,
        track_open_expiry_days: product.track_open_expiry_days,
        open_expiry_days: product.open_expiry_days,
        status: proof.product_status,
        products_status: proof.item_status,
        active_expiry_date: result.data.opened_unit.opened_expiry_date,
        price: result.data.batch.unit_price,
        opened_units_count: 1,
        created_at: proof.opened_at,
        updated_at: proof.created_at,
      };

      setLocalItems((prev) => [newItem, ...prev]);

      toast.success(result.message, {
        description: `${result.data.product_name} — unit #${result.data.opened_unit.unit_number} opened successfully.`,
        position: "bottom-right",
      });

      setModalOpen(false);
    },
    [],
  );

  async function handleViewDetails(item: DlcTrustProduct) {
    setDetailsLoadingId(item.id);

    const result = await getDlcTrustProductDetailsAction(item.id);

    if (!result.success) {
      toast.error("Failed to load details", {
        description: result.message,
        position: "bottom-right",
      });
      setDetailsLoadingId(null);
      return;
    }

    setViewItem(item);
    setDetailsLoadingId(null);
  }

  function handleFilterChange(value: string) {
    const params = new URLSearchParams();
    if (value && value !== "all") {
      params.set("filter", value);
    }
    params.set("page", "1");
    router.push(`/staff/dashboard/dlc-trust?${params.toString()}`);
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / DLC_TRUST_PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      {/* DLC trust card with scan button */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#EEF3EA" }}
        >
          <PackageOpen size={22} style={{ color: "#3A7326" }} />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold" style={{ color: "#1A3340" }}>
            Opened Items
          </h1>
          <p className="text-sm" style={{ color: "#51564E" }}>
            {localItems.length} items currently open
          </p>
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

      {/* filter between card and list */}
      <div className="flex justify-end ">
        <Select value={filter || "all"} onValueChange={handleFilterChange}>
          <SelectTrigger className="h-10 min-w-36 border-gray-200 rounded-xl text-sm bg-white">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full" style={{ minWidth: 980 }}>
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {DESKTOP_COLS.map(({ label, cls }) => (
                  <th
                    key={label}
                    className={`text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5 ${cls}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {localItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={DESKTOP_COLS.length}
                    className="py-16 text-center"
                  >
                    <PackageOpen
                      size={36}
                      className="mx-auto mb-3 opacity-20"
                    />
                    <p className="text-sm text-gray-400">
                      No opened items yet. Tap Scan Product to begin.
                    </p>
                  </td>
                </tr>
              ) : (
                localItems.map((item, idx) => {
                  const days = getDaysLeft(
                    item.active_expiry_date ?? item.expiry_date,
                  );
                  const status = getDlcStatus(item);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-center text-[12px] font-medium text-gray-400 tabular-nums">
                        {String(
                          (currentPage - 1) * DLC_TRUST_PAGE_SIZE + idx + 1,
                        ).padStart(2, "0")}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                            {item.category_image ? (
                              <Image
                                src={item.category_image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm">
                                📦
                              </div>
                            )}
                          </div>
                          <span
                            className="text-[13px] font-semibold truncate max-w-[120px]"
                            style={{ color: "#1A3340" }}
                          >
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-[12px] text-gray-500">
                        {item.category_name}
                      </td>

                      <td className="px-4 py-3 text-[12px] text-gray-500 tabular-nums whitespace-nowrap">
                        {formatDate(item.expiry_date)}
                      </td>

                      <td className="px-4 py-3 text-[12px] text-gray-500 tabular-nums whitespace-nowrap">
                        {formatDateTime(item.created_at)}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-[12px] tabular-nums text-gray-600">
                          {item.active_expiry_date
                            ? formatDate(item.active_expiry_date)
                            : "—"}
                        </p>
                        <p
                          className="text-[11px] font-semibold"
                          style={{
                            color:
                              days == null
                                ? "#6B7280"
                                : days < 0
                                  ? "#E11D48"
                                  : days <= 2
                                    ? "#E11D48"
                                    : days <= 7
                                      ? "#EA580C"
                                      : "#16A34A",
                          }}
                        >
                          {days == null
                            ? "—"
                            : days < 0
                              ? "Expired"
                              : `${days}d left`}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={status} />
                          {(status === "urgent" ||
                            status === "expiring_soon") && <TGTGBadge />}
                        </div>
                      </td>

                      {/* <td className="px-4 py-3 text-[12px] font-medium text-gray-700">
                        {item.opened_units_count}
                      </td> */}

                      <td className="px-4 py-3 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => void handleViewDetails(item)}
                          disabled={detailsLoadingId === item.id}
                          className="w-8 h-8 rounded-lg text-gray-400 hover:text-[#1A3340] hover:bg-gray-100"
                        >
                          {detailsLoadingId === item.id ? (
                            <ScanLine size={15} className="animate-spin" />
                          ) : (
                            <Eye size={15} />
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-50">
          {localItems.length === 0 && (
            <div className="py-16 text-center px-6">
              <PackageOpen size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm text-gray-400">No opened items yet.</p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#EEF3EA", color: "#3A7326" }}
              >
                Scan a product
              </button>
            </div>
          )}

          {localItems.map((item, idx) => {
            const days = getDaysLeft(
              item.active_expiry_date ?? item.expiry_date,
            );
            const status = getDlcStatus(item);

            return (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold w-5 text-gray-400 tabular-nums shrink-0">
                    {(currentPage - 1) * DLC_TRUST_PAGE_SIZE + idx + 1}
                  </span>

                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                    {item.category_image ? (
                      <Image
                        src={item.category_image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm">
                        📦
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-semibold truncate"
                      style={{ color: "#1A3340" }}
                    >
                      {item.name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {item.category_name}
                    </p>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => void handleViewDetails(item)}
                    disabled={detailsLoadingId === item.id}
                    className="w-8 h-8 rounded-lg text-gray-400 hover:text-[#1A3340] shrink-0"
                  >
                    {detailsLoadingId === item.id ? (
                      <ScanLine size={14} className="animate-spin" />
                    ) : (
                      <Eye size={14} />
                    )}
                  </Button>
                </div>

                <div className="pl-8 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {[
                    {
                      label: "Supplier DLC",
                      value: formatDate(item.expiry_date),
                    },
                    { label: "Opened", value: formatDate(item.created_at) },
                    {
                      label: "Validity",
                      value:
                        item.track_open_expiry_days &&
                        item.open_expiry_days != null
                          ? `${item.open_expiry_days} days`
                          : "No PAO",
                    },
                    {
                      label: "Expires After",
                      value: item.active_expiry_date
                        ? formatDate(item.active_expiry_date)
                        : "—",
                    },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        {label}
                      </p>
                      <p
                        className="text-[12px] font-semibold"
                        style={{ color: "#1A3340" }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pl-8 flex items-center justify-between flex-wrap gap-2">
                  {/* <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-500">
                      Opened units: {item.opened_units_count}
                    </span>
                  </div> */}

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={status} />
                    {(status === "urgent" || status === "expiring_soon") && (
                      <TGTGBadge />
                    )}
                  </div>

                  <span
                    className="text-[12px] font-bold"
                    style={{
                      color:
                        days == null
                          ? "#6B7280"
                          : days < 0
                            ? "#E11D48"
                            : days <= 7
                              ? "#EA580C"
                              : "#16A34A",
                    }}
                  >
                    {days == null
                      ? "—"
                      : days < 0
                        ? "Expired"
                        : `${days}d left`}
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
        basePath={
          filter && filter !== "all"
            ? `/dashboard/dlc-track?filter=${encodeURIComponent(filter)}`
            : "/dashboard/dlc-track"
        }
      />

      <ScanAndCaptureModal
        open={modalOpen}
        onComplete={handleComplete}
        onClose={() => setModalOpen(false)}
        lookupProduct={lookupProduct}
      />

      {viewItem && (
        <ItemDetailDialog item={viewItem} onClose={() => setViewItem(null)} />
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import {
  ProductItem,
  PRODUCT_STATUS_LABELS,
  PRODUCT_STATUS_META,
} from "@/types/product.type";
import BatchTable from "./BatchTable";

function DetailLine({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-baseline gap-2">
      <span
        className="shrink-0 text-sm font-semibold"
        style={{ color: "#1A3340" }}
      >
        {label}
      </span>
      <span className="text-sm" style={{ color: "#374151" }}>
        {value}
      </span>
    </div>
  );
}

function getBatchStatusMeta(status: string) {
  switch (status?.toLowerCase()) {
    case "active":
      return {
        label: "Active",
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

type Props = {
  product: ProductItem;
  onBatchView?: (batchId: string) => void;
};

export default function ProductDetailsView({ product, onBatchView }: Props) {
  const productStatusLabel = PRODUCT_STATUS_LABELS[product.products_status];
  const productStatusMeta = PRODUCT_STATUS_META[product.products_status];
  const batchStatusMeta = getBatchStatusMeta(product.status);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">Product Details</h1>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row">
          <div className="border-b border-gray-100 p-6 lg:w-65 lg:border-b-0 lg:border-r">
            <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
              {product.category_image ? (
                <Image
                  src={product.category_image}
                  alt={product.category_name}
                  width={260}
                  height={176}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-5xl">📦</span>
              )}
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#1A3340" }}>
                  {product.name}
                </h1>
                <p className="mt-1 text-sm" style={{ color: "#51564E" }}>
                  Category:{" "}
                  <span className="font-medium">{product.category_name}</span>
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: productStatusMeta?.dot }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: productStatusMeta?.color }}
                >
                  {productStatusLabel}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              <DetailLine label="Barcode:" value={product.barcode} />
              <DetailLine label="Quantity:" value={product.quantity} />
              <DetailLine label="Price:" value={`$${product.price}`} />
              <DetailLine label="Purchase Date:" value={product.purchase_date} />
              <DetailLine label="Expiry Date:" value={product.expiry_date} />
              <DetailLine
                label="PAO:"
                value={product.track_open_expiry_days ? "Yes" : "No"}
              />
              <DetailLine
                label="Open Expiry Days:"
                value={product.open_expiry_days}
              />
              <DetailLine
                label="Total Unit Labels:"
                value={product.total_unit_labels}
              />
              <DetailLine label="Batches:" value={product.batches.length} />

              <div className="flex items-center gap-2">
                <span
                  className="shrink-0 text-sm font-semibold"
                  style={{ color: "#1A3340" }}
                >
                  Status:
                </span>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    color: batchStatusMeta.text,
                    backgroundColor: batchStatusMeta.bg,
                  }}
                >
                  {batchStatusMeta.label}
                </span>
              </div>
            </div>

            {product.description && (
              <div className="mt-6">
                <p
                  className="mb-1 text-sm font-semibold"
                  style={{ color: "#1A3340" }}
                >
                  Description
                </p>
                <p className="text-sm leading-relaxed text-gray-600">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

       <BatchTable productId={product.id} batches={product.batches} onView={onBatchView} />
    </div>
  );
}
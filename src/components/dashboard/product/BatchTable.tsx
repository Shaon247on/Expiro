"use client";

import { useState } from "react";
import {
  MoreVertical,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";

import { ProductBatch } from "@/types/product.type";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

// TODO: Adjust this import route
import { removeBatchCountAction } from "@/actions/admin/product.action";

function getBatchStatusMeta(status: string) {
  switch (status?.toLowerCase()) {
    case "active":
      return { label: "Active", text: "#15803D", bg: "#DCFCE7" };

    case "opened":
      return { label: "Opened", text: "#2563EB", bg: "#DBEAFE" };

    case "removed":
      return { label: "Removed", text: "#DC2626", bg: "#FEE2E2" };

    default:
      return {
        label: status || "Unknown",
        text: "#6B7280",
        bg: "#F3F4F6",
      };
  }
}

function StatusCountBadge({
  value,
  text,
  bg,
}: {
  value: number;
  text: string;
  bg: string;
}) {
  return (
    <div
      className="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold"
      style={{
        color: text,
        backgroundColor: bg,
      }}
    >
      <span>{value}</span>
    </div>
  );
}

type BatchTableProps = {
  productId?: string;
  batches: ProductBatch[];
  onView?: (batchId: string) => void;
};

export default function BatchTable({
  productId = "",
  batches,
  onView,
}: BatchTableProps) {
  const router = useRouter();

  const [selectedBatch, setSelectedBatch] =
    useState<ProductBatch | null>(null);

  const [removeQuantity, setRemoveQuantity] = useState(1);

  const [isRemoving, setIsRemoving] = useState(false);

  if (batches.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-sm text-gray-400 shadow-sm">
        No batches found.
      </div>
    );
  }

  const handleRemove = async () => {
    if (!selectedBatch) return;

    const availableCount =
      selectedBatch?.counts?.available_units_count;

    if (removeQuantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (removeQuantity > availableCount) {
      toast.error(
        `You can remove maximum ${availableCount} unit(s)`,
      );
      return;
    }

    try {
      setIsRemoving(true);

      const response = await removeBatchCountAction(
        selectedBatch.id,
        removeQuantity,
      );

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);

      setSelectedBatch(null);
      setRemoveQuantity(1);

      router.refresh();
    } catch {
      toast.error("Failed to remove units");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold" style={{ color: "#1A3340" }}>
            Batches
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="border-b border-gray-100 bg-gray-50/80">
              <tr>
                {[
                  "Batch Code",
                  "Received",
                  "Available",
                  "Opened",
                  "Sold",
                  "Removed",
                  "Expired",
                  "Purchase",
                  "Expiry",
                  "Status",
                  "Price",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {heading}
                  </th>
                ))}

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {batches.map((batch) => {
                const statusMeta = getBatchStatusMeta(batch.status);

                return (
                  <tr
                    key={batch.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">
                      {batch.batch_code}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {batch.received_quantity}
                    </td>

                    <td className="px-5 py-4">
                      <StatusCountBadge
                        value={batch?.counts?.available_units_count}
                        text="#15803D"
                        bg="#DCFCE7"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <StatusCountBadge
                        value={batch?.counts?.opened_units_count}
                        text="#2563EB"
                        bg="#DBEAFE"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <StatusCountBadge
                        value={batch?.counts?.sold_units_count}
                        text="#7C3AED"
                        bg="#EDE9FE"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <StatusCountBadge
                        value={batch?.counts?.removed_units_count}
                        text="#DC2626"
                        bg="#FEE2E2"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <StatusCountBadge
                        value={batch?.counts?.expired_units_count}
                        text="#D97706"
                        bg="#FEF3C7"
                      />
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {batch.purchase_date}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {batch.expiry_date}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{
                          color: statusMeta.text,
                          backgroundColor: statusMeta.bg,
                        }}
                      >
                        {statusMeta.label}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      ${batch.unit_price}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100">
                            <MoreVertical
                              size={16}
                              className="text-gray-500"
                            />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-36 rounded-xl border-gray-100 p-1 shadow-lg"
                        >
                          <DropdownMenuItem
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                            onClick={() => {
                              if (onView) {
                                onView(batch.id);
                              } else {
                                router.push(
                                  `/dashboard/products/${productId}/batches/${batch.id}`,
                                );
                              }
                            }}
                          >
                            <Eye
                              size={14}
                              style={{ color: "#2563EB" }}
                            />
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600"
                            onClick={() => {
                              setSelectedBatch(batch);
                              setRemoveQuantity(1);
                            }}
                          >
                            <Trash2 size={14} />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={!!selectedBatch}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBatch(null);
            setRemoveQuantity(1);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Units</DialogTitle>

            <DialogDescription>
              Remove units from batch{" "}
              <span className="font-semibold">
                {selectedBatch?.batch_code}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                Available Units
              </p>

              <p className="mt-1 text-2xl font-bold text-green-700">
                {selectedBatch?.available_quantity ?? 0}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Quantity To Remove
              </label>

              <Input
                type="number"
                min={1}
                max={
                  selectedBatch?.available_quantity ?? 1
                }
                value={removeQuantity}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  const max =
                    selectedBatch?.available_quantity ??
                    1;

                  if (value > max) {
                    setRemoveQuantity(max);
                    return;
                  }

                  setRemoveQuantity(value);
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedBatch(null);
                setRemoveQuantity(1);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                  Removing...
                </>
              ) : (
                "Remove Units"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
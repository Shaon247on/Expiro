"use client";

import { useRouter } from "next/navigation";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { ProductBatch } from "@/types/product.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function BatchTable({
  productId,
  batches,
}: {
  productId: string;
  batches: ProductBatch[];
}) {
  const router = useRouter();

  if (batches.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-sm text-gray-400">
        No batches found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold" style={{ color: "#1A3340" }}>
          Batches
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Batch Code
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Received
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Available
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Purchase
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Expiry
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Price
              </th>
              <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
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
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {batch.available_quantity}
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
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100">
                          <MoreVertical size={16} className="text-gray-500" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-36 rounded-xl shadow-lg border-gray-100 p-1"
                      >
                        <DropdownMenuItem
                          className="flex items-center gap-2 rounded-lg text-sm px-3 py-2"
                          onClick={() =>
                            router.push(
                              `/dashboard/products/${productId}/batches/${batch.id}`
                            )
                          }
                        >
                          <Eye size={14} style={{ color: "#2563EB" }} />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          disabled
                          className="flex items-center gap-2 rounded-lg text-sm px-3 py-2 opacity-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          disabled
                          className="flex items-center gap-2 rounded-lg text-sm px-3 py-2 opacity-50"
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
  );
}
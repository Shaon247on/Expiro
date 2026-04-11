"use client";

import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { ProductBatch } from "@/types/product.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

function getBatchStatusMeta(status: string) {
  switch (status?.toLowerCase()) {
    case "active":
      return { label: "Active",  text: "#15803D", bg: "#DCFCE7" };
    case "opened":
      return { label: "Opened",  text: "#2563EB", bg: "#DBEAFE" };
    case "removed":
      return { label: "Removed", text: "#DC2626", bg: "#FEE2E2" };
    default:
      return { label: status || "Unknown", text: "#6B7280", bg: "#F3F4F6" };
  }
}

type BatchTableProps = {
  productId?: string;
  batches: ProductBatch[];
  onView?: (batchId: string) => void;
};

export default function BatchTable({ productId="" ,batches, onView }: BatchTableProps) {
  const router = useRouter()
  if (batches.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-sm text-gray-400 shadow-sm">
        No batches found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-lg font-bold" style={{ color: "#1A3340" }}>
          Batches
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-gray-100 bg-gray-50/80">
            <tr>
              {[
                "Batch Code",
                "Received",
                "Available",
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
                      style={{ color: statusMeta.text, backgroundColor: statusMeta.bg }}
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
                          <MoreVertical size={16} className="text-gray-500" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-36 rounded-xl border-gray-100 p-1 shadow-lg"
                      >
                        <DropdownMenuItem
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                          onClick={() => {
                            if(onView){
                              onView(batch.id)
                            }else{
                              router.push(`/dashboard/products/${productId}/batches/${batch.id}
`)
                            }
                          }}
                        >
                          <Eye size={14} style={{ color: "#2563EB" }} />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          disabled
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm opacity-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          disabled
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm opacity-50"
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
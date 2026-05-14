import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { getBatchDetailsAction } from "@/actions/admin/product.action";

export default async function BatchDetailsModalPage({
  params,
}: {
  params: Promise<{ productId: string; batchId: string }>;
}) {
  const { productId, batchId } = await params;
  const result = await getBatchDetailsAction(batchId);

  return (
    <Dialog open>
      <DialogContent
        className="p-0 overflow-hidden border-0 shadow-2xl"
        style={{
          borderRadius: 16,
          maxWidth: "min(1100px, 95vw)",
          width: "min(1100px, 95vw)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-bold" style={{ color: "#1A3340" }}>
            Batch Details
          </DialogTitle>
          <Link href={`/dashboard/products/${productId}`} className="text-sm text-gray-500">
            Close
          </Link>
        </div>

        <div className="max-h-[85vh] overflow-y-auto p-6">
          {result.success && result.data ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p><span className="font-semibold">Batch Code:</span> {result.data.batch_code}</p>
                <p><span className="font-semibold">Product:</span> {result.data.product_name}</p>
                <p><span className="font-semibold">Received Quantity:</span> {result.data.received_quantity}</p>
                <p><span className="font-semibold">Available Quantity:</span> {result.data.available_quantity}</p>
                <p><span className="font-semibold">Purchase Date:</span> {result.data.purchase_date}</p>
                <p><span className="font-semibold">Expiry Date:</span> {result.data.expiry_date}</p>
                <p><span className="font-semibold">Status:</span> {result.data.status}</p>
                <p><span className="font-semibold">Unit Price:</span> ${result.data.unit_price}</p>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3" style={{ color: "#1A3340" }}>
                  Unit Labels
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px]">
                    <thead className="bg-gray-50/80 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Unit #</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Barcode</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Opened At</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Opened Expiry</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Sold At</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Removed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.unit_labels.map((label) => (
                        <tr key={label.id} className="border-b border-gray-50">
                          <td className="px-4 py-3 text-sm">{label.unit_number}</td>
                          <td className="px-4 py-3 text-sm">{label.unique_barcode}</td>
                          <td className="px-4 py-3 text-sm">{label.status}</td>
                          <td className="px-4 py-3 text-sm">{label.opened_at ?? "-"}</td>
                          <td className="px-4 py-3 text-sm">{label.opened_expiry_date ?? "-"}</td>
                          <td className="px-4 py-3 text-sm">{label.sold_at ?? "-"}</td>
                          <td className="px-4 py-3 text-sm">{label.removed_at ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-500">{result.message}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
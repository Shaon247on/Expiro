import { getBatchDetailsAction } from "@/actions/admin/product.action";
import BatchBarcodeSection from "@/components/dashboard/product/BatchBarcodeSection";

export default async function BatchDetailsPage({
  params,
}: {
  params: Promise<{ productId: string; batchId: string }>;
}) {
  const { batchId } = await params;
  const result = await getBatchDetailsAction(batchId);

  if (!result.success || !result.data) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm text-red-500 text-sm">
        {result.message}
      </div>
    );
  }

  function getUnitStatusMeta(status: string) {
    switch (status?.toLowerCase()) {
      case "available":
        return {
          label: "Available",
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
      case "sold":
        return {
          label: "Sold",
          text: "#7C3AED",
          bg: "#EDE9FE",
        };
      case "expired":
        return {
          label: "Expired",
          text: "#B91C1C",
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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <h1 className="text-2xl font-bold" style={{ color: "#1A3340" }}>
          Batch Details
        </h1>

        <BatchBarcodeSection
          productName={result.data.product_name}
          batchCode={result.data.batch_code}
          unitLabels={result.data.unit_labels}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 text-sm">
        <p>
          <span className="font-semibold">Batch Code:</span>{" "}
          {result.data.batch_code}
        </p>
        <p>
          <span className="font-semibold">Product:</span>{" "}
          {result.data.product_name}
        </p>
        <p>
          <span className="font-semibold">Received Quantity:</span>{" "}
          {result.data.received_quantity}
        </p>
        <p>
          <span className="font-semibold">Available Quantity:</span>{" "}
          {result.data.available_quantity}
        </p>
        <p>
          <span className="font-semibold">Purchase Date:</span>{" "}
          {result.data.purchase_date}
        </p>
        <p>
          <span className="font-semibold">Expiry Date:</span>{" "}
          {result.data.expiry_date}
        </p>
        <p>
          <span className="font-semibold">Status:</span> {result.data.status}
        </p>
        <p>
          <span className="font-semibold">Unit Price:</span> $
          {result.data.unit_price}
        </p>
        <p>
          <span className="font-semibold">Total Unit Labels:</span>{" "}
          {result.data.total_unit_labels}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-3" style={{ color: "#1A3340" }}>
          Unit Labels
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                  Unit #
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                  Barcode
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                  Opened At
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                  Opened Expiry
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                  Sold At
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                  Removed At
                </th>
              </tr>
            </thead>
            <tbody>
              {[...result.data.unit_labels]
                .sort((a, b) => a.unit_number - b.unit_number)
                .map((label) => {
                  const statusMeta = getUnitStatusMeta(label.status);

                  return (
                    <tr key={label.id} className="border-b border-gray-50">
                      <td className="px-4 py-3 text-sm">{label.unit_number}</td>
                      <td className="px-4 py-3 text-sm">
                        {label.unique_barcode}
                      </td>
                      <td className="px-4 py-3 text-sm">
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
                      <td className="px-4 py-3 text-sm">
                        {label.opened_at ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {label.opened_expiry_date ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {label.sold_at ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {label.removed_at ?? "-"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

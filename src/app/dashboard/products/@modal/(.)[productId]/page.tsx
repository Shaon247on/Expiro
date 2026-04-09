import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { getProductDetailsAction } from "@/actions/admin/product.action";
import ProductDetailsView from "@/components/dashboard/product/ProductDetailsView";
import Link from "next/link";

export default async function ProductDetailsModalPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const result = await getProductDetailsAction(productId);

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
            Product Details
          </DialogTitle>
          <Link href="/dashboard/products" className="text-sm text-gray-500">
            Close
          </Link>
        </div>

        <div className="max-h-[85vh] overflow-y-auto p-6">
          {result.success && result.data ? (
            <ProductDetailsView product={result.data} />
          ) : (
            <div className="text-sm text-red-500">{result.message}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { getProductDetailsAction } from "@/actions/admin/product.action";
import ProductDetailsView from "@/components/dashboard/product/ProductDetailsView";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const result = await getProductDetailsAction(productId);

  if (!result.success || !result.data) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm text-red-500 text-sm">
        {result.message}
      </div>
    );
  }

  return <ProductDetailsView product={result.data} />;
}
import { getProductDetailsAction } from "@/actions/admin/product.action";
import ProductDetailsModal from "./ProductDetailsModal";

export default async function ProductDetailsModalPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const result = await getProductDetailsAction(productId);

  return <ProductDetailsModal productId={productId} result={result} />;
}
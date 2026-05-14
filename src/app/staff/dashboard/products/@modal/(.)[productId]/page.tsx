import { getProductDetailsAction } from "@/actions/admin/product.action";
import ProductDetailsModal from "./ProductDetailsModal";

export default async function ProductDetailsModalPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const result = await getProductDetailsAction(productId);

  console.log("The proejct details:", result)

  return <ProductDetailsModal productId={productId} result={result} />;
}
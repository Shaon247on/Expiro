import OpenedItemsPage from "@/components/dashboard/dlcTrack/OpenedItemsPage";
import { MOCK_PRODUCTS } from "@/data/productData";

export default function page() {
  const data = MOCK_PRODUCTS;
  return (
    <div className="p-6">
      <OpenedItemsPage lookupProduct={data.map(product => product.barcode)} />
    </div>
  );
}

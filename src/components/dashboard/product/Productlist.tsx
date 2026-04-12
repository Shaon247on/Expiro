import Image from "next/image";
import { ProductItem, PRODUCT_STATUS_LABELS, PRODUCT_STATUS_META } from "@/types/product.type";
import ProductActions from "./Productactions";

interface ProductListProps {
  products: ProductItem[];
}

function ProductCard({ product }: { product: ProductItem }) {
  const businessStatus = product.products_status;
  const meta = PRODUCT_STATUS_META[businessStatus];
  const label = PRODUCT_STATUS_LABELS[businessStatus];
  const batchCount = product?.batch_count;

  return (
    <article
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      aria-label={product.name}
    >
      <div className="flex items-center gap-4 px-5 py-4">
        <div
          className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden"
          aria-hidden="true"
        >
          {product.category_image ? (
            <Image
              src={product.category_image}
              alt={product.category_name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl">📦</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-base" style={{ color: "#1A3340" }}>
            {product.name}
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              {product.category_name}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              ${product.price}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xs text-gray-500">Quantity</p>
            <p className="text-2xl font-bold leading-tight" style={{ color: "#1A3340" }}>
              {String(product.quantity).padStart(2, "0")}
            </p>
          </div>
          <ProductActions product={product} />
        </div>
      </div>

      <div
        className="flex items-center justify-between px-5 py-2.5 border-t"
        style={{ borderColor: "#f5f5f5" }}
      >
        <div className="flex items-center gap-4 flex-wrap text-xs">
          <p className="font-medium" style={{ color: "#3A7326" }}>
            Batch Count: <span className="font-semibold">{batchCount}</span>
          </p>
          <p className="font-medium" style={{ color: "#3A7326" }}>
            PAO: <span className="font-semibold">{product.track_open_expiry_days ? "Yes":"No"}</span>
          </p>
          <p className="font-medium" style={{ color: "#3A7326" }}>
            Barcode: <span className="font-semibold">{product.barcode}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: meta?.dot }}
            aria-hidden="true"
          />
          <span className="text-xs font-medium" style={{ color: meta?.color }}>
            {label}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-30" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
        <p className="text-sm">No products found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
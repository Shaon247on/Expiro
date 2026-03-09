import { statusMeta } from "@/data/productData";
import { Product } from "@/types/product.type";
import ProductActions from "./Productactions";


interface ProductListProps {
  products: Product[];
}

function ProductCard({ product }: { product: Product }) {
  const meta = statusMeta[product.status];
  const isOpenDate =
    product.status === "Open Item" ||
    product.expireDate.includes("Open");

  return (
    <article
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      aria-label={product.name}
    >
      {/* Top row */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Thumbnail */}
        <div
          className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0 border border-gray-100"
          aria-hidden="true"
        >
          {product.thumbnail}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base" style={{ color: "#1A3340" }}>
            {product.name}
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              {/* layers icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8"/>
              </svg>
              {product.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              {/* coin icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="1.8"/>
                <path d="M12 7v10M9 9.5h4.5a1.5 1.5 0 0 1 0 3H10a1.5 1.5 0 0 0 0 3H15" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {product.price}
            </span>
          </div>
        </div>

        {/* Total products + 3-dot */}
        <div className="flex items-start gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Products</p>
            <p className="text-2xl font-bold leading-tight" style={{ color: "#1A3340" }}>
              {String(product.totalProducts).padStart(2, "0")}
            </p>
          </div>
          {/* Client island — only this part is hydrated */}
          <ProductActions product={product} />
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex items-center justify-between px-5 py-2.5 border-t"
        style={{ borderColor: "#f5f5f5" }}
      >
        <p className="text-xs font-medium" style={{ color: "#3A7326" }}>
          {isOpenDate ? "Open Expire Date:" : "Expire Date:"}{" "}
          <span className="font-semibold">{product.expireDate}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: meta.dot }}
            aria-hidden="true"
          />
          <span className="text-xs font-medium" style={{ color: meta.color }}>
            {product.status}
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
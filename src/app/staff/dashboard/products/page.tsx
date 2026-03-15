import ProductList from "@/components/dashboard/product/Productlist";
import ProductPagination from "@/components/dashboard/product/Productpagination";
import StatusFilter from "@/components/dashboard/product/Statusfilter";
import { MOCK_PRODUCTS, PAGE_SIZE } from "@/data/productData";
import { ProductStatus } from "@/types/product.type";


interface ProductsPageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export const metadata = { title: "Products — Expiro" };

const VALID_STATUSES: ProductStatus[] = [
  "Urgent", "Expiring soon", "Safe Item", "Remove Item", "Open Item",
];

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // ── Status filter ──────────────────────────────────────────────────────────
  const rawStatus     = params?.status ?? "";
  const activeStatus  = VALID_STATUSES.includes(rawStatus as ProductStatus)
    ? (rawStatus as ProductStatus)
    : "";

  const filtered = activeStatus
    ? MOCK_PRODUCTS.filter((p) => p.status === activeStatus)
    : MOCK_PRODUCTS;

  // ── Pagination ─────────────────────────────────────────────────────────────
  const currentPage = Math.max(1, Number(params?.page ?? 1));
  const totalItems  = filtered.length;
  const totalPages  = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage    = Math.min(currentPage, totalPages);
  const start       = (safePage - 1) * PAGE_SIZE;
  const products    = filtered.slice(start, start + PAGE_SIZE);

  // Build basePath including status so pagination preserves the filter
  const paginationBase = activeStatus
    ? `/dashboard/products?status=${encodeURIComponent(activeStatus)}`
    : "/dashboard/products";

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1A3340" }}>
            Expiring Products
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#51564E" }}>
            Track products nearing their expiry date.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Count badge */}
          <p className="text-xs text-gray-400">
            {totalItems === 0
              ? "No products"
              : `${start + 1}–${Math.min(start + PAGE_SIZE, totalItems)} of ${totalItems}`}
          </p>

          {/* Status filter dropdown (client island) */}
          <StatusFilter currentStatus={activeStatus} />
        </div>
      </div>

      {/* ── Product cards ── */}
      <ProductList products={products} />

      {/* ── Pagination ── */}
      <ProductPagination
        currentPage={safePage}
        totalPages={totalPages}
        basePath={paginationBase}
      />
    </div>
  );
}
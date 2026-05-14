import ProductList from "@/components/dashboard/product/Productlist";
import ProductPagination from "@/components/dashboard/product/Productpagination";
import StatusFilter from "@/components/dashboard/product/Statusfilter";
import {
  PAGE_SIZE,
  PRODUCT_STATUS_LABELS,
  type ProductBusinessStatus,
} from "@/types/product.type";
import { getProductsAction } from "@/actions/admin/product.action";

interface ProductsPageProps {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}

export const metadata = { title: "Products — Expiro" };

const VALID_STATUSES = Object.keys(
  PRODUCT_STATUS_LABELS
) as ProductBusinessStatus[];

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params?.page ?? 1));
  const search = params?.search?.trim() ?? "";

  const rawStatus = (params?.status ?? "").trim() as ProductBusinessStatus | "";
  const activeStatus = VALID_STATUSES.includes(rawStatus as ProductBusinessStatus)
    ? rawStatus
    : "";

  const result = await getProductsAction({
    page: currentPage,
    status: activeStatus || undefined,
    search,
  });

  if (!result.success) {
    return (
      <div className="flex flex-col gap-6">
        <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm text-red-500 text-sm">
          {result.message}
        </div>
      </div>
    );
  }

  const products = result.data ?? [];
  const totalItems = result.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginationParams = new URLSearchParams();
  if (activeStatus) paginationParams.set("status", activeStatus);
  if (search) paginationParams.set("search", search);

  const paginationBase = paginationParams.toString()
    ? `/dashboard/products?${paginationParams.toString()}`
    : "/dashboard/products";

  const listKey = `${safePage}-${activeStatus}-${search}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1A3340" }}>
            Products
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#51564E" }}>
            Track products, statuses, and batch counts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <p className="text-xs text-gray-400">
            {totalItems === 0
              ? "No products"
              : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(
                  safePage * PAGE_SIZE,
                  totalItems
                )} of ${totalItems}`}
          </p>

          {/* <StatusFilter currentStatus={activeStatus} /> */}
        </div>
      </div>

      {search ? (
        <p className="text-sm text-gray-500">
          Search result for:{" "}
          <span className="font-medium text-gray-700">{search}</span>
        </p>
      ) : null}

      <ProductList key={listKey} products={products} />

      <ProductPagination
        currentPage={safePage}
        totalPages={totalPages}
        basePath={paginationBase}
      />
    </div>
  );
}
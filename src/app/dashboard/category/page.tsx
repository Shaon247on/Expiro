import { Suspense } from "react";
import ProductPagination from "@/components/dashboard/product/Productpagination";
import { LayoutGrid } from "lucide-react";
import { CATEGORY_PAGE_SIZE } from "@/types/category.type";
import AddCategoryDialog from "@/components/dashboard/category/AddCategoryDialog";
import CategoryTable from "@/components/dashboard/category/CategoryTable";
import { getCategoriesAction } from "@/actions/admin/category.action";

export const metadata = { title: "Categories — Expiro" };

interface CategoryPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function CategoryPage({
  searchParams,
}: CategoryPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params?.page ?? 1));
  const search = params?.search?.trim() ?? "";

  const result = await getCategoriesAction({
    page: currentPage,
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

  const categories = result.data ?? [];
  const totalItems = result.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / CATEGORY_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginationBase = search
    ? `/dashboard/categories?search=${encodeURIComponent(search)}`
    : "/dashboard/categories";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#EEF3EA" }}
          aria-hidden="true"
        >
          <LayoutGrid size={22} style={{ color: "#3A7326" }} />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold" style={{ color: "#1A3340" }}>
            Categories
          </h1>
          <p className="text-sm" style={{ color: "#51564E" }}>
            {totalItems} categories
          </p>
        </div>

        <Suspense
          fallback={
            <div className="h-10 w-36 rounded-xl bg-gray-100 animate-pulse" />
          }
        >
          <AddCategoryDialog />
        </Suspense>
      </div>

      <CategoryTable categories={categories} />

      <ProductPagination
        currentPage={safePage}
        totalPages={totalPages}
        basePath={paginationBase}
      />
    </div>
  );
}
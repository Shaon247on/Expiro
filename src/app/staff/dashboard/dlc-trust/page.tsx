import OpenedItemsPage from "@/components/dashboard/dlcTrack/OpenedItemsPage";
import { getDlcTrustProductsAction } from "@/actions/staff/dlc-trust.action";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    filter?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const currentPage = Math.max(1, Number(params?.page ?? 1));
  const filter = params?.filter ?? "all";

  const result = await getDlcTrustProductsAction({
    page: currentPage,
    filter,
  });

  if (!result.success) {
    return (
      <div className="p-6">
        <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm text-red-500 text-sm">
          {result.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <OpenedItemsPage
        items={result.data ?? []}
        totalItems={result.count ?? 0}
        currentPage={currentPage}
        filter={filter}
      />
    </div>
  );
}
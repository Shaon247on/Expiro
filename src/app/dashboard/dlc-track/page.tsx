import { getProductOpenProofsAction } from "@/actions/dlc/DlcTracking.action";
import AdminOpenedItemsPage from "@/components/dashboard/dlcTrust/AdminOpenedItemsPage";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export const metadata = { title: "DLC Tracking — Expiro" };

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Math.max(1, Number(params?.page ?? 1));
  const search = params?.search ?? "";
  const status = params?.status ?? "all";

  const result = await getProductOpenProofsAction({
    page,
    search,
    status,
  });

  if (!result.success) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm text-red-500 text-sm">
        {result.message}
      </div>
    );
  }

  return (
    <AdminOpenedItemsPage
      items={result.data ?? []}
      totalItems={result.count ?? 0}
      currentPage={page}
      status={status}
      search={search}
    />
  );
}
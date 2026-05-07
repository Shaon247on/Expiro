import { UsersList } from "@/components/superAdmin/users/UsersList";
import UsersFilter from "@/components/superAdmin/users/UsersFilter";
import UsersPagination from "@/components/superAdmin/users/UsersPagination";
import { getAdminUsersAction } from "@/actions/superAdmin/users.action";
import {
  USERS_PAGE_SIZE,
  type UserStatusFilter,
} from "@/types/superAdmin/users.type";

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    filter?: string;
    search?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(1, Number(params?.page ?? 1));
  const search = params?.search?.trim() ?? "";

  const currentFilter =
    params?.filter === "active" || params?.filter === "banned"
      ? (params.filter as UserStatusFilter)
      : "all";

  const result = await getAdminUsersAction({
    page: currentPage,
    filter: currentFilter,
    search,
  });


  const users = result.success ? result.data : [];
  const totalItems = result.success ? (result.count ?? 0) : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / USERS_PAGE_SIZE));

  const paginationParams = new URLSearchParams();
  if (currentFilter !== "all") {
    paginationParams.set("filter", currentFilter);
  }
  if (search) {
    paginationParams.set("search", search);
  }

  const paginationBase = paginationParams.toString()
    ? `/admin/users?${paginationParams.toString()}`
    : "/admin/users";

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            All User
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Subscribers</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <UsersFilter currentFilter={currentFilter} />
        </div>
      </div>

      {search ? (
        <p className="text-sm text-gray-500">
          Search result for: <span className="font-medium text-gray-700">{search}</span>
        </p>
      ) : null}

      {!result.success ? (
        <div className="rounded-2xl border border-red-100 bg-white p-5 text-sm text-red-500 shadow-sm">
          {result.message}
        </div>
      ) : (
        <>
          <UsersList initialUsers={users} />
          <UsersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={paginationBase}
          />
        </>
      )}
    </div>
  );
}
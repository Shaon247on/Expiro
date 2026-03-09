import ProductPagination from "@/components/dashboard/product/Productpagination";
import InviteStaffDialog from "@/components/dashboard/staff/Invitestaffdialog";
import StaffList from "@/components/dashboard/staff/StaffList";
import { MOCK_STAFF, STAFF_PAGE_SIZE } from "@/data/staffData";
import { Suspense } from "react";

interface StaffPageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata = { title: "Staff — Expiro" };

export default async function StaffPage({ searchParams }: StaffPageProps) {
  const params      = await searchParams;
  const currentPage = Math.max(1, Number(params?.page ?? 1));
  const totalItems  = MOCK_STAFF.length;
  const totalPages  = Math.max(1, Math.ceil(totalItems / STAFF_PAGE_SIZE));
  const safePage    = Math.min(currentPage, totalPages);
  const start       = (safePage - 1) * STAFF_PAGE_SIZE;
  const members     = MOCK_STAFF.slice(start, start + STAFF_PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ── */}
      <div
        className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
      >
        {/* Team icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#EEF3EA" }}
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#3A7326" strokeWidth="1.8"/>
            <circle cx="9" cy="7" r="4" stroke="#3A7326" strokeWidth="1.8"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#3A7326" strokeWidth="1.8"/>
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold" style={{ color: "#1A3340" }}>Team</h1>
          <p className="text-sm" style={{ color: "#51564E" }}>{totalItems} members</p>
        </div>

        {/* Invite staff (client island) */}
        <Suspense fallback={
          <div className="h-10 w-28 rounded-xl bg-gray-100 animate-pulse" />
        }>
          <InviteStaffDialog />
        </Suspense>
      </div>

      {/* ── Staff list (server) ── */}
      <StaffList members={members} />

      {/* ── Pagination ── */}
      <ProductPagination
        currentPage={safePage}
        totalPages={totalPages}
        basePath="/dashboard/staff"
      />
    </div>
  );
}
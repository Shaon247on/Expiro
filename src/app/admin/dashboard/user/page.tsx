import { UsersList } from "@/components/superAdmin/users/UsersList";
import { usersData } from "@/data/superAdmin/usersData";

export default function UsersPage() {
  // In production: const users = await fetchUsers();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">All User</h1>
        <p className="text-sm text-gray-500 mt-0.5">Subscribers</p>
      </div>

      {/* ── Users list — client component handles interactivity ─────────── */}
      <UsersList initialUsers={usersData} />
    </div>
  );
}
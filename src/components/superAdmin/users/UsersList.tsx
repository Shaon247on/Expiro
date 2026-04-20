"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User } from "@/types/superAdmin/users.type";
import { UserCard } from "@/components/elements/UserCard";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { toggleAdminStatusAction } from "@/actions/superAdmin/users.action";

interface UsersListProps {
  initialUsers: User[];
}

export function UsersList({ initialUsers }: UsersListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    setUsers(initialUsers);

    setSelectedUser((prev) => {
      if (!prev) return null;
      const matched = initialUsers.find((user) => user.id === prev.id);
      return matched ?? null;
    });
  }, [initialUsers]);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleToggleBan = async (userId: string) => {
    const currentUser = users.find((u) => u.id === userId);
    if (!currentUser) return;

    const nextIsActive = currentUser.status !== "active";

    setPendingId(userId);

    const result = await toggleAdminStatusAction({
      id: userId,
      is_active: nextIsActive,
    });

    if (!result.success) {
      toast.error("Status update failed", {
        description: result.message,
        position: "bottom-right",
      });
      setPendingId(null);
      return;
    }

    const nextStatus = result.data.is_active ? "active" : "banned";

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: nextStatus,
            }
          : u
      )
    );

    setSelectedUser((prev) =>
      prev && prev.id === userId
        ? {
            ...prev,
            status: nextStatus,
          }
        : prev
    );

    toast.success(result.message, {
      position: "bottom-right",
    });

    setPendingId(null);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onView={handleView}
            onToggleBan={handleToggleBan}
            disabled={pendingId === user.id}
          />
        ))}
      </div>

      <UserDetailsDialog
        user={selectedUser}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onPause={handleToggleBan}
        disabled={pendingId === selectedUser?.id}
      />
    </>
  );
}
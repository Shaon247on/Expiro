"use client";

import { useState } from "react";
import { User } from "@/types/superAdmin/analytics.type";
import { UserCard } from "@/components/elements/UserCard";
import { UserDetailsDialog } from "./UserDetailsDialog";

interface UsersListProps {
  initialUsers: User[];
}

export function UsersList({ initialUsers }: UsersListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleToggleBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "banned" : "active" }
          : u
      )
    );
  };

  // Also update selected user if it changes
  const handlePauseFromDialog = (userId: string) => {
    handleToggleBan(userId);
    // update selected user state too so dialog reflects change
    setSelectedUser((prev) =>
      prev && prev.id === userId
        ? { ...prev, status: prev.status === "active" ? "banned" : "active" }
        : prev
    );
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
          />
        ))}
      </div>

      <UserDetailsDialog
        user={selectedUser}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onPause={handlePauseFromDialog}
      />
    </>
  );
}

export type StaffRole   = "Admin" | "Manager" | "Staff";
export type StaffStatus = "active" | "banned";

export interface StaffMember {
  id: number;
  name: string;
  role: StaffRole;
  email: string;
  phone: string;
  status: StaffStatus;
  avatarInitials: string;
  avatarBg: string;
  joinedDate: string;
}

export const roleMeta: Record<StaffRole, { color: string; dot: string }> = {
  Admin:   { color: "#15803D", dot: "#22C55E" },
  Manager: { color: "#B45309", dot: "#EAB308" },
  Staff:   { color: "#0E7490", dot: "#06B6D4" },
};

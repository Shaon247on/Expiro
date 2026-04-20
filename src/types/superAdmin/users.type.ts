export type AdminUserApiItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin";
  is_active: boolean;
  date_joined: string;
  total_staff_added: number;
  current_plan_type: string | null;
  image: string | null;
  shop_category: "restaurant" | "super_market";
};

export type AdminUsersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminUserApiItem[];
};

export type ToggleAdminStatusResponse = {
  success: true;
  message: string;
  is_active: boolean;
};

export type UserStatusFilter = "all" | "active" | "banned";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin";
  status: "active" | "banned";
  joinedAt: string;
  totalStaffAdded: number;
  currentPlanType: string | null;
  image: string | null;
  shopCategory: "restaurant" | "super_market";
};

export const USERS_PAGE_SIZE = 10;
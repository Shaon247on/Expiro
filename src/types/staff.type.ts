export type StaffApiMember = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "staff";
  is_active: boolean;
  profile_image: string | null;
  date_joined: string;
  invitation_token: string | null;
  invitation_expires_at: string | null;
  invitation_is_used: boolean;
  invitation_accepted_at: string | null;
};

export type StaffListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    success: boolean;
    message: string;
    data: StaffApiMember[];
  };
};

export type InviteStaffResponse = {
  success: boolean;
  message: string;
  errors: string[];
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: "staff";
  };
};

export type BanUnbanStaffResponse = {
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
  };
};

export type RemoveStaffResponse = {
  message: string;
};

export const roleMeta = {
  staff: {
    dot: "#3A7326",
    color: "#3A7326",
  },
} as const;
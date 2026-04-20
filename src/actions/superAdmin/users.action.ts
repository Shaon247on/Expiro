"use server";

import axios from "axios";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  AdminUsersResponse,
  ToggleAdminStatusResponse,
  User,
  UserStatusFilter,
} from "@/types/superAdmin/users.type";

type ActionResult<T> =
  | {
      success: true;
      message: string;
      data: T;
      count?: number;
      next?: string | null;
      previous?: string | null;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

function mapAdminUser(item: AdminUsersResponse["results"][number]): User {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    role: item.role,
    status: item.is_active ? "active" : "banned",
    joinedAt: item.date_joined,
    totalStaffAdded: item.total_staff_added,
    currentPlanType: item.current_plan_type,
    image: item.image,
    shopCategory: item.shop_category,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const serverData = error.response?.data as
      | { message?: string; detail?: string }
      | undefined;

    return serverData?.message || serverData?.detail || fallback;
  }

  return fallback;
}

export async function getAdminUsersAction(params?: {
  page?: number;
  filter?: UserStatusFilter;
  search?: string;
}): Promise<ActionResult<User[]>> {
  try {
    const api = await createBackendClient();

    const query = new URLSearchParams();
    query.set("page", String(params?.page ?? 1));

    if (params?.filter && params.filter !== "all") {
      query.set("filter", params.filter);
    }

    const search = params?.search?.trim();
    if (search) {
      query.set("search", search);
    }

    const { data } = await api.get<AdminUsersResponse>(
      `/api/dashboard/admins/?${query.toString()}`
    );

    return {
      success: true,
      message: "Admins fetched successfully.",
      data: (data.results ?? []).map(mapAdminUser),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch users."),
    };
  }
}

export async function toggleAdminStatusAction(payload: {
  id: string;
  is_active: boolean;
}): Promise<ActionResult<{ is_active: boolean }>> {
  try {
    const api = await createBackendClient();

    const { data } = await api.patch<ToggleAdminStatusResponse>(
      `/api/dashboard/admins/${payload.id}/status/`,
      { is_active: payload.is_active },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return {
      success: true,
      message: data.message,
      data: {
        is_active: data.is_active,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to update user status."),
    };
  }
}
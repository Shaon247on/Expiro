"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  StaffApiMember,
  StaffListResponse,
  InviteStaffResponse,
  BanUnbanStaffResponse,
  RemoveStaffResponse,
} from "@/types/staff.type";
import { error } from "console";

type ActionResult<T = undefined> =
  | {
      success: true;
      message: string;
      data?: T;
      count?: number;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export async function getStaffListAction(params?: {
  page?: number;
  search?: string;
}): Promise<ActionResult<StaffApiMember[]>> {
  try {
    const api = await createBackendClient();

    const page = params?.page ?? 1;
    const search = params?.search?.trim() ?? "";

    const query = new URLSearchParams();
    query.set("page", String(page));
    if (search) query.set("search", search);

    const { data } = await api.get<StaffListResponse>(
      `/api/staff/?${query.toString()}`,
    );

    return {
      success: true,
      message: data.results?.message || "Staff list fetched successfully.",
      data: data.results?.data ?? [],
      count: data.count,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | { message?: string; detail?: string }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          "Failed to fetch staff list.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching staff.",
    };
  }
}

export async function inviteStaffAction(payload: {
  name: string;
  email: string;
  phone: string;
}): Promise<ActionResult<InviteStaffResponse["data"]>> {
  try {
    const api = await createBackendClient();

    const { data } = await api.post<InviteStaffResponse>(
      "/api/staff/invite/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    console.log("testing the staff:", data);
    revalidatePath("/dashboard/staff");

    if (data.errors) {
      return {
        success: true,
        message: data.errors[0] || "Staff invitation sent successfully.",
        data: data.data,
      };
    }

    return {
      success: true,
      message: data.success ? data.message : data.errors[0],
      data: data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            message?: string;
            detail?: string;
            name?: string[];
            email?: string[];
            phone?: string[];
            errors?: string[];
          }
        | undefined;

      console.log("testing the staff:", serverData);

      return {
        success: false,
        message:
          serverData?.errors[0] ||
          serverData?.message ||
          serverData?.detail ||
          serverData?.name?.[0] ||
          serverData?.email?.[0] ||
          serverData?.phone?.[0] ||
          "Failed to invite staff.",
        fieldErrors: {
          name: serverData?.name,
          email: serverData?.email,
          phone: serverData?.phone,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong while inviting staff.",
    };
  }
}

export async function toggleStaffBanAction(payload: {
  id: number;
  is_active: boolean;
}): Promise<ActionResult<BanUnbanStaffResponse["data"]>> {
  try {
    const api = await createBackendClient();

    const { data } = await api.patch<BanUnbanStaffResponse>(
      `/api/staff/${payload.id}/ban/`,
      {
        is_active: payload.is_active,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    revalidatePath("/dashboard/staff");

    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | { message?: string; detail?: string }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          "Failed to update staff status.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while updating staff status.",
    };
  }
}

export async function removeStaffAction(id: number): Promise<ActionResult> {
  try {
    const api = await createBackendClient();

    const { data } = await api.delete<RemoveStaffResponse>(
      `/api/staff/${id}/remove/`,
    );

    revalidatePath("/dashboard/staff");

    return {
      success: true,
      message: data.message || "Staff removed successfully.",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | { message?: string; detail?: string }
        | undefined;

      console.log("the remove responsae:", serverData);

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          "Failed to remove staff.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while removing staff.",
    };
  }
}

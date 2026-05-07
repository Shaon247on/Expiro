"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { createBackendClient } from "@/lib/http/backend.client";
import { COOKIE } from "@/lib/auth/cookies";

export type ProfileDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  plan_type: "free" | "starter" | "professional" | "enterprise";
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  date_of_birth: string | null;
  profile_image: string | null;
  started_at?: string | null;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type GetProfileResponse = {
  message: string;
  data: ProfileDto;
};

type UpdateProfileResponse = {
  message: string;
  data: ProfileDto;
};

type ChangePasswordResponse = {
  message: string;
  errors?: {
    current_password?: string[];
    new_password?: string[];
    confirm_new_password?: string[];
  };
};

export type ActionResult<T = undefined> =
  | {
      success: true;
      message: string;
      data?: T;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export async function getProfileAction(): Promise<ActionResult<ProfileDto>> {
  try {
    const api = await createBackendClient();
    const { data } = await api.get<GetProfileResponse>("/api/profile/");

    return {
      success: true,
      message: "Profile fetched successfully.",
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
          "Failed to fetch profile.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching profile.",
    };
  }
}

export async function updateProfileAction(
  formData: FormData,
): Promise<ActionResult<ProfileDto>> {
  try {
    const api = await createBackendClient();

    const { data } = await api.patch<UpdateProfileResponse>(
      "/api/profile/",
      formData,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    const updatedUser = data.data;
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";

    const existingSessionRaw = cookieStore.get(COOKIE.session)?.value;

    let existingSession: {
      id?: string;
      email?: string;
      name?: string;
      role?: string;
      phone?: string;
      shop_category?: string | null;
      plan_type?: "free" | "starter" | "professional" | "enterprise";
      profile_image?: string | null;
      is_active?: boolean;
    } = {};

    if (existingSessionRaw) {
      try {
        existingSession = JSON.parse(existingSessionRaw);
      } catch {
        existingSession = {};
      }
    }

    cookieStore.set({
      name: COOKIE.session,
      value: JSON.stringify({
        id: updatedUser.id ?? existingSession.id,
        email: updatedUser.email ?? existingSession.email ?? "",
        name: updatedUser.name ?? existingSession.name ?? "",
        role: updatedUser.role ?? existingSession.role ?? "",
        phone: updatedUser.phone ?? existingSession.phone ?? "",
        shop_category: existingSession.shop_category ?? null,
        plan_type: updatedUser.plan_type ?? existingSession.plan_type ?? "free",
        profile_image:
          updatedUser.profile_image ?? existingSession.profile_image ?? null,
        is_active: existingSession.is_active ?? true,
      }),
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
    });

    return {
      success: true,
      message: data.message || "Profile updated successfully.",
      data: updatedUser,
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
            first_name?: string[];
            last_name?: string[];
            gender?: string[];
            date_of_birth?: string[];
            profile_image?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          serverData?.name?.[0] ||
          serverData?.email?.[0] ||
          serverData?.phone?.[0] ||
          "Failed to update profile.",
        fieldErrors: {
          name: serverData?.name,
          email: serverData?.email,
          phone: serverData?.phone,
          first_name: serverData?.first_name,
          last_name: serverData?.last_name,
          gender: serverData?.gender,
          date_of_birth: serverData?.date_of_birth,
          profile_image: serverData?.profile_image,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong while updating profile.",
    };
  }
}

export async function changePasswordAction(payload: {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}): Promise<ActionResult> {
  try {
    const api = await createBackendClient();

    const { data } = await api.post<ChangePasswordResponse>(
      "/api/change-password/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    return {
      success: true,
      message: data.message || "Password changed successfully.",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | ChangePasswordResponse
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.errors?.current_password?.[0] ||
          serverData?.errors?.new_password?.[0] ||
          serverData?.errors?.confirm_new_password?.[0] ||
          "Password change failed.",
        fieldErrors: {
          current_password: serverData?.errors?.current_password,
          new_password: serverData?.errors?.new_password,
          confirm_new_password: serverData?.errors?.confirm_new_password,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong while changing password.",
    };
  }
}
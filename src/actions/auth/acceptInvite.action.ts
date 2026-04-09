"use server";

import axios from "axios";
import { env } from "@/lib/config/env";

type ActionResult =
  | {
      success: true;
      message: string;
      data?: {
        email: string;
      };
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

type AcceptInvitePayload = {
  token: string;
  password: string;
  confirm_password: string;
};

type AcceptInviteResponse = {
  success: true;
  message: string;
  data: {
    email: string;
  };
};

export async function acceptInviteAction(
  payload: AcceptInvitePayload
): Promise<ActionResult> {
  const token = payload.token?.trim();
  const password = payload.password;
  const confirm_password = payload.confirm_password;

  if (!token) {
    return {
      success: false,
      message: "Invitation token is missing.",
    };
  }

  if (!password || !confirm_password) {
    return {
      success: false,
      message: "Both password fields are required.",
      fieldErrors: {
        password: !password ? ["Password is required."] : undefined,
        confirm_password: !confirm_password
          ? ["Confirm password is required."]
          : undefined,
      },
    };
  }

  if (password !== confirm_password) {
    return {
      success: false,
      message: "Passwords do not match.",
      fieldErrors: {
        confirm_password: ["Passwords do not match."],
      },
    };
  }

  try {
    const response = await axios.post<AcceptInviteResponse>(
      `${env.BACKEND_BASE_URL}/api/staff/invite/accept/`,
      {
        token,
        password,
        confirm_password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
      }
    );

    return {
      success: true,
      message: response.data.message || "Invitation accepted successfully.",
      data: response.data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            message?: string;
            detail?: string;
            token?: string[];
            password?: string[];
            confirm_password?: string[];
            errors?: {
              token?: string[];
              password?: string[];
              confirm_password?: string[];
            };
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          serverData?.errors?.token?.[0] ||
          serverData?.errors?.password?.[0] ||
          serverData?.errors?.confirm_password?.[0] ||
          serverData?.token?.[0] ||
          serverData?.password?.[0] ||
          serverData?.confirm_password?.[0] ||
          "Failed to accept invitation.",
        fieldErrors: {
          token: serverData?.errors?.token ?? serverData?.token,
          password: serverData?.errors?.password ?? serverData?.password,
          confirm_password:
            serverData?.errors?.confirm_password ?? serverData?.confirm_password,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
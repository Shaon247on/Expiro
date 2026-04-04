"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/config/env";

type ForgotPasswordPayload = {
  email: string;
};

type ForgotPasswordResponse = {
  detail: string;
};



type VerifyForgotOtpPayload = {
  email: string;
  otp: string;
};

type VerifyForgotOtpResponse = {
  detail: string;
  reset_token: string;
};

type ResetPasswordPayload = {
  reset_token: string;
  new_password: string;
  confirm_password: string;
};

type ResetPasswordResponse = {
  message: string;
};


type ResendOtpPayload = {
  email: string;
};

type ResendOtpResponse = {
  detail: string;
};


function getResetTokenCookieMaxAge() {
  return 60 * 15;
}


type ActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export async function forgotPasswordAction(
  payload: ForgotPasswordPayload
): Promise<ActionResult> {
  const email = payload.email?.trim();

  if (!email) {
    return {
      success: false,
      message: "Email is required.",
      fieldErrors: {
        email: ["Email is required."],
      },
    };
  }

  try {
    const response = await axios.post<ForgotPasswordResponse>(
      `${env.BACKEND_BASE_URL}/api/forgot-password/`,
      { email },
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
      message: response.data.detail || "OTP sent",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            detail?: string;
            message?: string;
            email?: string[];
            non_field_errors?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.detail ||
          serverData?.message ||
          serverData?.email?.[0] ||
          serverData?.non_field_errors?.[0] ||
          error.message ||
          "Failed to send verification code.",
        fieldErrors: {
          email: serverData?.email,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function verifyForgotOtpAction(
  payload: VerifyForgotOtpPayload
): Promise<ActionResult> {
  const email = payload.email?.trim();
  const otp = payload.otp?.trim();

  if (!email || !otp) {
    return {
      success: false,
      message: "Email and OTP are required.",
      fieldErrors: {
        email: !email ? ["Email is required."] : undefined,
        otp: !otp ? ["OTP is required."] : undefined,
      },
    };
  }

  try {
    const response = await axios.post<VerifyForgotOtpResponse>(
      `${env.BACKEND_BASE_URL}/api/verify-forgot-otp/`,
      {
        email,
        otp: Number(otp),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
      }
    );

    console.log("forgetting response:", response.data)

    const data = response.data;

    if (!data?.reset_token) {
      return {
        success: false,
        message: "OTP verified but reset token was not returned.",
      };
    }

    const cookieStore = await cookies();
    const isProd = env.NODE_ENV === "production";

    cookieStore.set({
      name: "password_reset_token",
      value: data.reset_token,
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: getResetTokenCookieMaxAge(),
    });

    cookieStore.set({
      name: "password_reset_email",
      value: email,
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: getResetTokenCookieMaxAge(),
    });

    return {
      success: true,
      message: data.detail || "OTP verified successfully.",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            detail?: string;
            message?: string;
            otp?: string[];
            email?: string[];
            non_field_errors?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.detail ||
          serverData?.message ||
          serverData?.otp?.[0] ||
          serverData?.email?.[0] ||
          serverData?.non_field_errors?.[0] ||
          "OTP verification failed.",
        fieldErrors: {
          otp: serverData?.otp,
          email: serverData?.email,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function resetPasswordAction(
  payload: ResetPasswordPayload
): Promise<ActionResult> {
  const reset_token = payload.reset_token?.trim();
  const new_password = payload.new_password;
  const confirm_password = payload.confirm_password;

  if (!reset_token) {
    return {
      success: false,
      message: "Reset token is missing.",
    };
  }

  if (!new_password || !confirm_password) {
    return {
      success: false,
      message: "Both password fields are required.",
      fieldErrors: {
        new_password: !new_password ? ["New password is required."] : undefined,
        confirm_password: !confirm_password
          ? ["Confirm password is required."]
          : undefined,
      },
    };
  }

  if (new_password !== confirm_password) {
    return {
      success: false,
      message: "Passwords do not match.",
      fieldErrors: {
        confirm_password: ["Passwords do not match."],
      },
    };
  }

  try {
    const response = await axios.post<ResetPasswordResponse>(
      `${env.BACKEND_BASE_URL}/api/reset-password/`,
      {
        reset_token,
        new_password,
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

    console.log("new password reset:", response.data)

    const cookieStore = await cookies();
    cookieStore.delete("password_reset_token");
    cookieStore.delete("password_reset_email");

    return {
      success: true,
      message: response.data.message || "Password reset successfully.",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            detail?: string;
            message?: string;
            new_password?: string[];
            confirm_password?: string[];
            reset_token?: string[];
            non_field_errors?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.detail ||
          serverData?.message ||
          serverData?.new_password?.[0] ||
          serverData?.confirm_password?.[0] ||
          serverData?.reset_token?.[0] ||
          serverData?.non_field_errors?.[0] ||
          "Password reset failed.",
        fieldErrors: {
          new_password: serverData?.new_password,
          confirm_password: serverData?.confirm_password,
          reset_token: serverData?.reset_token,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function resendOtpAction(
  payload: ResendOtpPayload
): Promise<ActionResult> {
  const email = payload.email?.trim();

  if (!email) {
    return {
      success: false,
      message: "Email is required.",
      fieldErrors: {
        email: ["Email is required."],
      },
    };
  }

  try {
    const response = await axios.post<ResendOtpResponse>(
      `${env.BACKEND_BASE_URL}/api/resend-otp/`,
      { email },
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
      message: response.data.detail || "OTP resent successfully",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            detail?: string;
            message?: string;
            email?: string[];
            non_field_errors?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.detail ||
          serverData?.message ||
          serverData?.email?.[0] ||
          serverData?.non_field_errors?.[0] ||
          "Failed to resend OTP.",
        fieldErrors: {
          email: serverData?.email,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function getPasswordResetToken() {
  const cookieStore = await cookies();
  return cookieStore.get("password_reset_token")?.value ?? null;
}
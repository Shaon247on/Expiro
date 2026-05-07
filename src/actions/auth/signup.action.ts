"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE } from "@/lib/auth/cookies";

type SignupPayload = {
  name: string;
  email: string;
  phone: string;
  shop_category: string;
  password: string;
  confirm_password: string;
};

type SignupResponse = {
  detail: string;
};

type VerifyOtpPayload = {
  email: string;
  otp: string;
};

type VerifyOtpResponse = {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: "admin" | "super_admin" | "staff";
    plan_type: "free" | "starter" | "professional" | null;
  };
};

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

function getJwtExpMs(token: string): number | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

    const decoded = JSON.parse(
      Buffer.from(padded, "base64").toString("utf-8"),
    ) as { exp?: number };

    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

function secondsUntil(msEpoch: number): number {
  return Math.max(0, Math.floor((msEpoch - Date.now()) / 1000));
}

function getRedirectPathByRole(role: string) {
  if (role === "super_admin") return "/admin/dashboard";
  if (role === "staff") return "/staff/dashboard";
  return "/dashboard";
}

export async function signupAction(
  payload: SignupPayload,
): Promise<ActionResult> {
  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const phone = payload.phone?.trim();
  const shop_category = payload.shop_category?.trim();
  const password = payload.password?.trim();
  const confirm_password = payload.confirm_password?.trim();

  if (
    !name ||
    !email ||
    !phone ||
    !shop_category ||
    !password ||
    !confirm_password
  ) {
    return {
      success: false,
      message: "All fields are required.",
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
    const response = await axios.post<SignupResponse>(
      `${process.env.BACKEND_BASE_URL}/api/signup/`,
      {
        name,
        email,
        phone,
        shop_category,
        password,
        confirm_password,
        role: "admin",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
      },
    );
    console.log("getting started", response);
    return {
      success: true,
      message: response.data.detail || "Verification OTP sent successfully.",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            detail?: string;
            message?: string;
            name?: string[];
            email?: string[];
            phone?: string[];
            plan_type?: string[];
            shop_category?: string[];
            password?: string[];
            confirm_password?: string[];
            role?: string[];
          }
        | undefined;

      console.error("getting started", {
        status: error.response?.status,
        data: error.response?.data,
      });

      const firstFieldError =
        serverData?.name?.[0] ||
        serverData?.email?.[0] ||
        serverData?.phone?.[0] ||
        serverData?.plan_type?.[0] ||
        serverData?.shop_category?.[0] ||
        serverData?.password?.[0] ||
        serverData?.confirm_password?.[0] ||
        serverData?.role?.[0];

      return {
        success: false,
        message:
          serverData?.detail ||
          serverData?.message ||
          firstFieldError ||
          "Signup failed. Please try again.",
        fieldErrors: {
          name: serverData?.name,
          email: serverData?.email,
          phone: serverData?.phone,
          plan_type: serverData?.plan_type,
          shop_category: serverData?.shop_category,
          password: serverData?.password,
          confirm_password: serverData?.confirm_password,
        },
      };
    }

    console.error("Unexpected signup error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function verifyOtpAction(
  payload: VerifyOtpPayload,
): Promise<ActionResult> {
  const email = payload.email?.trim();
  const otp = payload.otp?.trim();
  if (!email || !otp) {
    return {
      success: false,
      message: "Email and OTP are required.",
    };
  }
  console.log("the receivable:", email, otp);

  let redirectPath: string | null = null;

  try {
    const response = await axios.post<VerifyOtpResponse>(
      `${process.env.BACKEND_BASE_URL}/api/verify-otp/`,
      {
        email,
        otp: otp,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
        timeout: 15000,
      },
    );
    console.log("OTP Reponse:", response.data);
    // console.log("forgetting response:", response.data)

    const data = response.data;
    const access = data?.access;
    const refresh = data?.refresh;
    const user = data?.user;

    if (!access || !refresh || !user) {
      return {
        success: false,
        message: "OTP verification failed. Invalid server response.",
      };
    }

    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";

    const accessExpMs = getJwtExpMs(access);
    const refreshExpMs = getJwtExpMs(refresh);

    const accessMaxAge = accessExpMs ? secondsUntil(accessExpMs) : 60 * 10;
    const refreshMaxAge = refreshExpMs
      ? secondsUntil(refreshExpMs)
      : 60 * 60 * 24 * 14;

    cookieStore.set({
      name: COOKIE.access,
      value: access,
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: accessMaxAge,
    });

    cookieStore.set({
      name: COOKIE.refresh,
      value: refresh,
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: refreshMaxAge,
    });

    cookieStore.set({
      name: COOKIE.session,
      value: JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }),
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: refreshMaxAge,
    });

    if (!user.plan_type) {
      redirectPath = "/package/plans";
      redirect(redirectPath);
    }

    redirectPath = getRedirectPathByRole(user.role);

    return {
      success: true,
      message: "OTP verified successfully.",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | { detail?: string; message?: string; otp?: string[] }
        | undefined;

      console.log("service data:", serverData);

      return {
        success: false,
        message:
          serverData?.detail ||
          serverData?.message ||
          "Invalid OTP. Please try again.",
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}

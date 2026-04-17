"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE } from "@/lib/auth/cookies";
type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  message: string;
  token: {
    refresh: string;
    access: string;
  };
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    phone: string;
    shop_category: string;
    profile_image: string;
  };
};

type LoginActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: {
        email?: string[];
        password?: string[];
      };
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

export async function loginAction(
  payload: LoginPayload,
): Promise<LoginActionResult> {
  const email = payload.email?.trim();
  const password = payload.password?.trim();

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required.",
      fieldErrors: {
        email: !email ? ["Email is required."] : undefined,
        password: !password ? ["Password is required."] : undefined,
      },
    };
  }

  let redirectPath: string | null = null;

  try {
    const response = await axios.post<LoginResponse>(
      `${process.env.BACKEND_BASE_URL}${process.env.BACKEND_LOGIN_PATH}`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
      },
    );

    const data = response.data;
    console.log("the response3:", data);
    const access = data?.token?.access;
    const refresh = data?.token?.refresh;
    const user = data?.user;

    if (!access || !refresh || !user) {
      return {
        success: false,
        message: "Login failed. Invalid server response.",
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

    // Temporary session cookie.
    // Later we should replace this with a signed session token.
    cookieStore.set({
      name: COOKIE.session,
      value: JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        shop_category: user.shop_category,
        profile_pic: user.profile_image
      }),
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: refreshMaxAge,
    });

    redirectPath =
      user.role === "super_admin"
        ? "/admin/dashboard"
        : user.role === "staff"
          ? "/staff/dashboard"
          : "/dashboard";

    return {
      success: true,
      message: data.message || "Login successful",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        (error.response?.data as { message?: string } | undefined)?.message ||
        "Invalid email or password.";
    console.log("the response3:", serverMessage);

      return {
        success: false,
        message: serverMessage,
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

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE.access);
  cookieStore.delete(COOKIE.refresh);
  cookieStore.delete(COOKIE.session);

  redirect("/login");
}

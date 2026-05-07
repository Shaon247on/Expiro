"use server";

import axios from "axios";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  SubscribePayload,
  SubscribeResponse,
  SubscriptionPlan,
  SubscriptionPlanListResponse,
} from "@/types/subscription.type";
import { cookies } from "next/headers";
import { COOKIE } from "@/lib/auth/cookies";
import { redirect } from "next/navigation";

type ActionResult<T> =
  | {
      success: true;
      message: string;
      data: T;
      count?: number;
    }
  | {
      success: false;
      message: string;
    };

export async function getSubscriptionPlansAction(): Promise<
  ActionResult<SubscriptionPlan[]>
> {
  try {
    const api = await createBackendClient();

    const { data } = await api.get<SubscriptionPlanListResponse>(
      "/api/subscription/plan/"
    );

    return {
      success: true,
      message: data.message,
      data: (data.data ?? []).sort((a, b) => a.sort_order - b.sort_order),
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
          "Failed to fetch subscription plans.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching subscription plans.",
    };
  }
}

export async function subscribeToPlanAction(
  payload: SubscribePayload
): Promise<
  | { success: true; checkout_url?: string; plan_type?: string }
  | { success: false; message: string }
> {
  try {
    const api = await createBackendClient();

    const { data } = await api.post("/api/subscription/subscribe/", payload);

    // ✅ FREE PLAN HANDLING
    if (payload.plan_type === "free") {
      const cookieStore = await cookies();

      const session = JSON.parse(
        cookieStore.get(COOKIE.session)?.value || "{}"
      );

      cookieStore.set({
        name: COOKIE.session,
        value: JSON.stringify({
          ...session,
          plan_type: "free",
        }),
        path: "/",
      });

      return {
        success: true,
        plan_type: "free",
      };
    }

    return {
      success: true,
      checkout_url: data.checkout_url,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Subscription failed.",
    };
  }
}
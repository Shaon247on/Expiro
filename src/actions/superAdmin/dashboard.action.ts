"use server";

import axios from "axios";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  DashboardAnalyticsResponse,
  SubscriptionAnalyticsResponse,
  SubscriptionReportResponse,
  RecentSubscriptionsResponse,
  RecentSubscriptionItem,
} from "@/types/superAdmin/analytics.type";

type ActionResult<T> =
  | {
      success: true;
      message: string;
      data: T;
    }
  | {
      success: false;
      message: string;
    };

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const serverData = error.response?.data as
      | { message?: string; detail?: string }
      | undefined;

    return serverData?.message || serverData?.detail || fallback;
  }

  return fallback;
}

export async function getDashboardAnalyticsAction(): Promise<
  ActionResult<DashboardAnalyticsResponse["data"]>
> {
  try {
    const api = await createBackendClient();

    const { data } = await api.get<DashboardAnalyticsResponse>(
      "/api/dashboard/analytics/"
    );

    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch dashboard analytics."),
    };
  }
}

export async function getSubscriptionAnalyticsAction(): Promise<
  ActionResult<SubscriptionAnalyticsResponse["data"]>
> {
  try {
    const api = await createBackendClient();

    const { data } = await api.get<SubscriptionAnalyticsResponse>(
      "/api/dashboard/subscriptions/analytics/"
    );

    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to fetch subscription analytics."
      ),
    };
  }
}

export async function getSubscriptionReportAction(): Promise<
  ActionResult<SubscriptionReportResponse["data"]>
> {
  try {
    const api = await createBackendClient();

    const { data } = await api.get<SubscriptionReportResponse>(
      "/api/dashboard/subscriptions/report/"
    );

    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch subscription report."),
    };
  }
}

export async function getRecentSubscriptionsAction(): Promise<
  ActionResult<RecentSubscriptionItem[]>
> {
  try {
    const api = await createBackendClient();

    const { data } = await api.get<RecentSubscriptionsResponse>(
      "/api/dashboard/subscriptions/recent/"
    );

    return {
      success: true,
      message: "Recent subscriptions fetched successfully.",
      data: data.results ?? [],
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to fetch recent subscriptions."
      ),
    };
  }
}
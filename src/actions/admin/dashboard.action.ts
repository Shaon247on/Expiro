"use server";

import axios from "axios";

import { createBackendClient } from "@/lib/http/backend.client";

import type {
  DashboardAnalyticsResponse,
  ExpiryTimelineResponse,
  SavingFoodSummaryResponse,
  RecentActivitiesResponse,
} from "@/types/analytics.type";

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
    };

export async function getDashboardAnalyticsAction(): Promise<
  ActionResult<DashboardAnalyticsResponse["data"]>
> {
  try {
    const api = await createBackendClient();

    const { data } = await api.get<DashboardAnalyticsResponse>(
      "/api/dashboard/analytics/",
    );

    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch dashboard analytics.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching analytics.",
    };
  }
}

export async function getExpiryTimelineAction(): Promise<
  ActionResult<ExpiryTimelineResponse["data"]>
> {
  try {
    const api = await createBackendClient();

    const { data } = await api.get<ExpiryTimelineResponse>(
      "/api/monthly-product-count-line-chart/",
    );

    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch expiry timeline.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching expiry timeline.",
    };
  }
}

export async function getSavingFoodSummaryAction(): Promise<
  ActionResult<SavingFoodSummaryResponse["data"]>
> {
  try {
    const api = await createBackendClient();

    const { data } = await api.get<SavingFoodSummaryResponse>(
      "/api/dashboard/food-saving-weekday-summary/",
    );

    return {
      success: true,
      message: data.message,
      data: data.data,
      count: data.count,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch food saving summary.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching food saving summary.",
    };
  }
}

export async function getRecentActivitiesAction(
  limit = 10,
): Promise<ActionResult<RecentActivitiesResponse["data"]>> {
  try {
    const api = await createBackendClient();

    const { data } = await api.get<RecentActivitiesResponse>(
      `/api/dashboard/admin/recent-activities/?limit=${limit}`,
    );

    return {
      success: true,
      message: data.message,
      data: data.data,
      count: data.count,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch recent activities.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching recent activities.",
    };
  }
}
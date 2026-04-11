"use server";

import axios from "axios";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  MarkReadResponse,
  NotificationItem,
  NotificationListResponse,
  NotificationSummaryResponse,
} from "@/types/notification.type";

type ActionResult<T = undefined> =
  | {
      success: true;
      message: string;
      data?: T;
      count?: number;
      unreadCount?: number;
      unreadNotifications?: number;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export async function getNotificationSummaryAction(): Promise<
  ActionResult<NotificationSummaryResponse["data"]>
> {
  try {
    const api = await createBackendClient();
    const { data } = await api.get<NotificationSummaryResponse>("/api/summary/");

    return {
      success: true,
      message: data.message,
      data: data.data,
      unreadNotifications: data.unread_notifications,
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
          "Failed to fetch notification summary.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching notification summary.",
    };
  }
}

export async function getNotificationsAction(params?: {
  page?: number;
  filter?: string;
}): Promise<ActionResult<NotificationItem[]>> {
  try {
    const api = await createBackendClient();

    const query = new URLSearchParams();
    query.set("page", String(params?.page ?? 1));

    if (params?.filter?.trim() && params.filter !== "all") {
      query.set("type", params.filter.trim());
    }

    const { data } = await api.get<NotificationListResponse>(
      `/api/notifications/?${query.toString()}`
    );

    return {
      success: true,
      message: data.message,
      data: data.results,
      count: data.count,
      unreadCount: data.unread_count,
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
          "Failed to fetch notifications.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching notifications.",
    };
  }
}

export async function markNotificationReadAction(
  id: string
): Promise<ActionResult> {
  try {
    const api = await createBackendClient();

    const { data } = await api.patch<MarkReadResponse>(
      `/api/notifications/${id}/read/`,
      {}
    );

    return {
      success: true,
      message: data.message || "Notification marked as read successfully.",
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
          "Failed to mark notification as read.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while marking the notification as read.",
    };
  }
}
"use server";

import axios from "axios";
import { createBackendClient } from "@/lib/http/backend.client";

export type NotificationPreferencesDto = {
  user_id: number;
  user_email: string;
  user_role: string;
  expiry_alerts: boolean;
  low_stock_alerts: boolean;
  daily_summary_email: boolean;
  created_at: string;
  updated_at: string;
};

type NotificationPreferencesResponse = {
  message: string;
  data: NotificationPreferencesDto;
};

type ActionResult<T = undefined> =
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

export async function getNotificationPreferencesAction(): Promise<
  ActionResult<NotificationPreferencesDto>
> {
  try {
    const api = await createBackendClient();

    const { data } = await api.get<NotificationPreferencesResponse>(
      "/api/notification-preferences/"
    );

    return {
      success: true,
      message: data.message || "Notification preferences fetched successfully.",
      data: data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            message?: string;
            detail?: string;
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          "Failed to fetch notification preferences.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching notification preferences.",
    };
  }
}

export async function updateNotificationPreferencesAction(payload: {
  expiry_alerts: boolean;
  low_stock_alerts: boolean;
  daily_summary_email: boolean;
}): Promise<ActionResult<NotificationPreferencesDto>> {
  try {
    const api = await createBackendClient();

    const { data } = await api.patch<NotificationPreferencesResponse>(
      "/api/notification-preferences/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return {
      success: true,
      message: data.message || "Notification preferences updated successfully.",
      data: data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            message?: string;
            detail?: string;
            expiry_alerts?: string[];
            low_stock_alerts?: string[];
            daily_summary_email?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          serverData?.expiry_alerts?.[0] ||
          serverData?.low_stock_alerts?.[0] ||
          serverData?.daily_summary_email?.[0] ||
          "Failed to update notification preferences.",
        fieldErrors: {
          expiry_alerts: serverData?.expiry_alerts,
          low_stock_alerts: serverData?.low_stock_alerts,
          daily_summary_email: serverData?.daily_summary_email,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong while updating notification preferences.",
    };
  }
}
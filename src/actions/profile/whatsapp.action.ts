"use server";

import axios from "axios";
import { createBackendClient } from "@/lib/http/backend.client";

export type WhatsappPreferenceDto = {
  phone: string | null;
  is_verified: boolean;
  is_enabled: boolean;
  last_error: string | null;
  created_at: string;
  updated_at: string;
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

type WhatsappPreferenceResponse = {
  success: true;
  data: WhatsappPreferenceDto;
};

type SendOtpResponse = {
  success: true;
  message: string;
  data: {
    phone: string;
    expires_in_minutes: number;
  };
};

type VerifyOtpResponse = {
  success: true;
  message: string;
};

type ToggleWhatsappResponse = {
  success: true;
  message: string;
  data: WhatsappPreferenceDto;
};

export async function getWhatsappPreferenceAction(): Promise<
  ActionResult<WhatsappPreferenceDto>
> {
  try {
    const api = await createBackendClient();
    const { data } = await api.get<WhatsappPreferenceResponse>(
      "/api/whatsapp/preference/",
    );

    return {
      success: true,
      message: "WhatsApp preference fetched successfully.",
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
          "Failed to fetch WhatsApp preference.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching WhatsApp preference.",
    };
  }
}

export async function sendWhatsappOtpAction(payload: {
  phone: string;
}): Promise<ActionResult<{ phone: string; expires_in_minutes: number }>> {
  try {
    const api = await createBackendClient();
    const { data } = await api.post<SendOtpResponse>(
      "/api/whatsapp/send-otp/",
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
      message: data.message,
      data: data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            message?: string;
            detail?: string;
            phone?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          serverData?.phone?.[0] ||
          "Failed to send WhatsApp verification code.",
        fieldErrors: {
          phone: serverData?.phone,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong while sending OTP.",
    };
  }
}

export async function verifyWhatsappOtpAction(payload: {
  otp_code: string;
}): Promise<ActionResult> {
  try {
    const api = await createBackendClient();
    const { data } = await api.post<VerifyOtpResponse>(
      "/api/whatsapp/verify-otp/",
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
      message: data.message,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            message?: string;
            detail?: string;
            otp_code?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          serverData?.otp_code?.[0] ||
          "Failed to verify OTP.",
        fieldErrors: {
          otp_code: serverData?.otp_code,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong while verifying OTP.",
    };
  }
}

export async function toggleWhatsappNotificationAction(payload: {
  is_enabled: boolean;
}): Promise<ActionResult<WhatsappPreferenceDto>> {
  try {
    const api = await createBackendClient();
    const { data } = await api.post<ToggleWhatsappResponse>(
      "/api/whatsapp/toggle/",
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
      message: data.message,
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
          "Failed to update WhatsApp notification.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while updating WhatsApp notification.",
    };
  }
}
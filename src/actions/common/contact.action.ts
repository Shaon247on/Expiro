"use server";

import axios from "axios";
import type { ContactUsPayload, ContactUsResponse } from "@/types/contact.type";

type ActionResult<T> =
  | {
      success: true;
      message: string;
      data: T;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export async function submitContactUsAction(
  payload: ContactUsPayload
): Promise<ActionResult<ContactUsResponse["data"]>> {
  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const message = payload.message?.trim();

  if (!name || !email || !message) {
    return {
      success: false,
      message: "All fields are required.",
      fieldErrors: {
        name: !name ? ["Name is required."] : undefined,
        email: !email ? ["Email is required."] : undefined,
        message: !message ? ["Message is required."] : undefined,
      },
    };
  }

  try {
    const { data } = await axios.post<ContactUsResponse>(
      `${process.env.BACKEND_BASE_URL}/api/contact-us/`,
      {
        name,
        email,
        message,
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
      message: data.message || "Message sent successfully.",
      data: data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            message?: string;
            detail?: string;
            name?: string[];
            email?: string[];
            message_field?: string[];
            message_text?: string[];
            message_body?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          "Failed to send message.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while sending your message.",
    };
  }
}
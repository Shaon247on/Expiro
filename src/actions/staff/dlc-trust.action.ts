"use server";

import axios from "axios";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  DlcTrustDetailsResponse,
  DlcTrustListResponse,
  DlcTrustProduct,
} from "@/types/dlc-trust.type";

type ActionResult<T = undefined> =
  | {
      success: true;
      message: string;
      data?: T;
      count?: number;
      next?: string | null;
      previous?: string | null;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export async function getDlcTrustProductsAction(params?: {
  page?: number;
  filter?: string;
}): Promise<ActionResult<DlcTrustProduct[]>> {
  try {
    const api = await createBackendClient();

    const query = new URLSearchParams();
    query.set("page", String(params?.page ?? 1));

    if (params?.filter?.trim() && params.filter !== "all") {
      query.set("filter", params.filter.trim());
    }

    const { data } = await api.get<DlcTrustListResponse>(
      `/api/opened-products/?${query.toString()}`
    );

    return {
      success: true,
      message:
        data.results?.message || "Opened products fetched successfully.",
      data: data.results?.data ?? [],
      count: data.count,
      next: data.next,
      previous: data.previous,
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
          "Failed to fetch opened products.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching opened products.",
    };
  }
}

export async function getDlcTrustProductDetailsAction(id: string) {
  try {
    const api = await createBackendClient();

    const { data } = await api.get<DlcTrustDetailsResponse>(
      `/api/opened-products/${id}/`
    );

    return {
      success: true as const,
      message:
        data.message || "Opened product details fetched successfully.",
      data: data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | { message?: string; detail?: string }
        | undefined;

      return {
        success: false as const,
        message:
          serverData?.message ||
          serverData?.detail ||
          "Failed to fetch opened product details.",
      };
    }

    return {
      success: false as const,
      message: "Something went wrong while fetching opened product details.",
    };
  }
}
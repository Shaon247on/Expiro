"use server";

import axios from "axios";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  ProductOpenProofItem,
  ProductOpenProofListResponse,
} from "@/types/dlc-tracking.type";

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

export async function getProductOpenProofsAction(params?: {
  page?: number;
  search?: string;
  status?: string;
}): Promise<ActionResult<ProductOpenProofItem[]>> {
  try {
    const api = await createBackendClient();

    const query = new URLSearchParams();
    query.set("page", String(params?.page ?? 1));

    if (params?.search?.trim()) {
      query.set("search", params.search.trim());
    }

    if (params?.status?.trim() && params.status !== "all") {
      query.set("status", params.status.trim());
    }

    const { data } = await api.get<ProductOpenProofListResponse>(
      `/api/product-open-proofs/?${query.toString()}`
    );

    return {
      success: true,
      message: data.message || "Open proof list fetched successfully.",
      data: data.results ?? [],
      count: data.count,
      next: data.next,
      previous: data.previous,
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
          "Failed to fetch DLC tracking items.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching DLC tracking items.",
    };
  }
}
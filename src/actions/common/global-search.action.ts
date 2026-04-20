"use server";

import axios from "axios";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  GlobalSearchResponse,
  GlobalSearchResultItem,
} from "@/types/globalSearch.type";

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

export async function globalSearchAction(
  search: string
): Promise<ActionResult<GlobalSearchResultItem[]>> {
  try {
    const api = await createBackendClient();
    const query = search.trim();

    const { data } = await api.get<GlobalSearchResponse>(
      `/api/search/?search=${encodeURIComponent(query)}`
    );

    return {
      success: true,
      message: data.message,
      data: data.data.results ?? [],
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
          "Failed to fetch search results.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while searching.",
    };
  }
}
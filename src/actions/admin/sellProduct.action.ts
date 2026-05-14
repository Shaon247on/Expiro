"use server";

import axios from "axios";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  SellProductRequest,
  SellProductResponse,
} from "@/types/sellProduct.type";
import { revalidatePath } from "next/cache";

type SellActionResult =
  | {
      success: true;
      message: string;
      data: SellProductResponse["data"];
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export async function sellScannedProductAction(
  payload: SellProductRequest,
): Promise<SellActionResult> {
  console.log("the payloads:", payload);
  try {
    const api = await createBackendClient();

    const { data } = await api.post<SellProductResponse>(
      "/api/products/scan-sell/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    console.log("the response2:", data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/products");
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
            errors?: Record<string, string[]>;
            quantity?: string[];
            batch_id?: string[];
          }
        | undefined;
      console.log("the response2:", serverData);

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          serverData?.quantity?.[0] ||
          serverData?.batch_id?.[0] ||
          "Failed to sell product.",
        fieldErrors: {
          quantity: serverData?.errors?.quantity ?? serverData?.quantity,
          batch_id: serverData?.errors?.batch_id ?? serverData?.batch_id,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong while selling the product.",
    };
  }
}

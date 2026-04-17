"use server";

import axios from "axios";
import { createBackendClient } from "@/lib/http/backend.client";

export type OpenProjectLookupData = {
  id: string;
  name: string;
  barcode: string;
  price: string;
  category: string;
  category_name: string;
  status: string;
  products_status: string;
  track_open_expiry_days: boolean;
  open_expiry_days: number | null;
  batches: Array<{
    id: string;
    batch_code: string;
    received_quantity: number;
    available_quantity: number;
    purchase_date: string;
    expiry_date: string;
    status: string;
    unit_price: string;
    available_units: number;
  }>;
  scanned_unit: {
    id: string;
    unit_number: number;
    unique_barcode: string;
    status: string;
    opened_at: string | null;
    opened_expiry_date: string | null;
    sold_at: string | null;
    removed_at: string | null;
    created_at: string;
    batch_id: string;
    product_id: string;
  };
};

type LookupResponse = {
  success: true;
  message: string;
  data: OpenProjectLookupData;
};

type ConfirmResponse = {
  success: true;
  message: string;
  data: {
    product_id: string;
    product_name: string;
    product_barcode: string;
    batch: {
      id: string;
      batch_code: string;
      received_quantity: number;
      available_quantity: number;
      purchase_date: string;
      expiry_date: string;
      status: string;
      unit_price: string;
      created_at: string;
      updated_at: string;
    };
    opened_unit: {
      id: string;
      unit_number: number;
      unique_barcode: string;
      status: string;
      opened_at: string | null;
      opened_expiry_date: string | null;
      sold_at: string | null;
      removed_at: string | null;
      created_at: string;
    };
    proof: {
      id: string;
      unit: string;
      product: string;
      product_name: string;
      category_name: string;
      opened_by: string;
      opened_by_name: string;
      proof_image: string;
      product_status: string;
      item_status: string;
      expiry_date: string;
      days_left: number;
      scanned_barcode: string;
      opened_at: string;
      created_at: string;
    };
  };
};

type ActionResult<T> =
  | { success: true; message: string; data: T }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export async function lookupUnitForOpenAction(
  unique_barcode: string
): Promise<ActionResult<OpenProjectLookupData>> {
  try {
    const api = await createBackendClient();

    const { data } = await api.post<LookupResponse>(
      "/api/product-units/scan-open/",
      { unique_barcode },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
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
            errors?: Record<string, string[]>;
            unique_barcode?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          serverData?.unique_barcode?.[0] ||
          "Failed to fetch product from scanned unit barcode.",
        fieldErrors: {
          unique_barcode:
            serverData?.errors?.unique_barcode ?? serverData?.unique_barcode,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong while looking up the scanned unit.",
    };
  }
}

export async function confirmOpenProductAction(
  formData: FormData
): Promise<ActionResult<ConfirmResponse["data"]>> {
  try {
    const api = await createBackendClient();

    const { data } = await api.post<ConfirmResponse>(
      "/api/products/scan-open/confirm/",
      formData,
      {
        headers: {
          Accept: "application/json",
        },
      }
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
            errors?: Record<string, string[]>;
            unique_barcode?: string[];
            proof_image?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          serverData?.unique_barcode?.[0] ||
          serverData?.proof_image?.[0] ||
          "Failed to confirm opened product.",
        fieldErrors: {
          unique_barcode:
            serverData?.errors?.unique_barcode ?? serverData?.unique_barcode,
          proof_image:
            serverData?.errors?.proof_image ?? serverData?.proof_image,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong while confirming the opened product.",
    };
  }
}
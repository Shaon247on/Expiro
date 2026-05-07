"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  BatchDetailsResponse,
  ProductCreateOrUpdateResponse,
  ProductDetailsResponse,
  ProductItem,
  ProductListResponse,
  ProductScanResponse,
} from "@/types/product.type";

type ActionResult<T = undefined> =
  | { success: true; message: string; data?: T; count?: number }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

type ScanActionResult =
  | {
      success: true;
      message: string;
      data: ProductScanResponse;
    }
  | {
      success: false;
      message: string;
    };

export async function scanProductByBarcodeAction(
  barcode: string,
): Promise<ScanActionResult> {
  try {
    const api = await createBackendClient();

    const { data } = await api.get<ProductScanResponse>(
      `/api/products/scan/find/?barcode=${encodeURIComponent(barcode)}`,
    );
    console.log("Getting the response:", data);
    return {
      success: true,
      message: data.message,
      data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | { message?: string; detail?: string }
        | undefined;

      console.log("Getting the response1:", serverData);

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          "Failed to scan product barcode.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while scanning the product barcode.",
    };
  }
}

export async function getProductsAction(params?: {
  page?: number;
  status?: string;
  search?: string;
}): Promise<ActionResult<ProductItem[]>> {
  try {
    const api = await createBackendClient();
    const query = new URLSearchParams();

    query.set("page", String(params?.page ?? 1));

    const status = params?.status?.trim();
    if (status) {
      query.set("status", status);
    }

    const search = params?.search?.trim();
    if (search) {
      query.set("search", search);
    }

    const { data } = await api.get<ProductListResponse>(
      `/api/products/?${query.toString()}`
    );

    return {
      success: true,
      message: data.message,
      data: data.data,
      count: data.count,
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
          "Failed to fetch products.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching products.",
    };
  }
}

export async function getProductDetailsAction(
  id: string,
): Promise<ActionResult<ProductItem>> {
  try {
    const api = await createBackendClient();
    const { data } = await api.get<ProductDetailsResponse>(
      `/api/products/${id}/`,
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
          "Failed to fetch product details.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching product details.",
    };
  }
}

export async function getBatchDetailsAction(batchId: string) {
  try {
    const api = await createBackendClient();
    const { data } = await api.get<BatchDetailsResponse>(
      `/api/product-batches/${batchId}/`,
    );
    return { success: true as const, message: data.message, data: data.data };
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
          "Failed to fetch batch details.",
      };
    }
    return {
      success: false as const,
      message: "Something went wrong while fetching batch details.",
    };
  }
}

export async function createProductAction(payload: {
  category: string;
  name: string;
  barcode?: string;
  quantity: number;
  purchase_date: string;
  expiry_date: string;
  track_open_expiry_days: boolean;
  open_expiry_days?: number | null;
  confirm_labels_printed: boolean;
  price: string;
  description?: string;
}): Promise<ActionResult<ProductItem>> {
  try {
    const api = await createBackendClient();
    const { data } = await api.post<ProductCreateOrUpdateResponse>(
      "/api/products/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    console.log("the response of product:", data);
    revalidatePath("/dashboard/products");

    return { success: true, message: data.message, data: data.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            message?: string;
            errors?: Record<string, string[]>;
          }
        | undefined;
      console.log("the response of product1:", serverData);

      return {
        success: false,
        message: serverData?.message || "Product creation failed.",
        fieldErrors: serverData?.errors,
      };
    }
    return {
      success: false,
      message: "Something went wrong while creating product.",
    };
  }
}

export async function updateProductAction(
  id: string,
  payload: {
    category: string;
    name: string;
    barcode?: string;
    quantity: number;
    purchase_date: string;
    expiry_date: string;
    track_open_expiry_days: boolean;
    open_expiry_days?: number | null;
    confirm_labels_printed: boolean;
    price: string;
    description?: string;
  },
): Promise<ActionResult<ProductItem>> {
  try {
    const api = await createBackendClient();
    const { data } = await api.put<ProductCreateOrUpdateResponse>(
      `/api/products/${id}/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${id}`);

    return { success: true, message: data.message, data: data.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            message?: string;
            errors?: Record<string, string[]>;
          }
        | undefined;

      return {
        success: false,
        message: serverData?.message || "Product update failed.",
        fieldErrors: serverData?.errors,
      };
    }
    return {
      success: false,
      message: "Something went wrong while updating product.",
    };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  try {
    const api = await createBackendClient();
    const { data } = await api.delete<{ message: string }>(
      `/api/products/${id}/`,
    );

    revalidatePath("/dashboard/products");

    return {
      success: true,
      message: data.message || "Product removed successfully.",
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
          "Failed to delete product.",
      };
    }
    return {
      success: false,
      message: "Something went wrong while deleting product.",
    };
  }
}

export async function removeBatchCountAction(
  batchId: string,
  quantity: number,
): Promise<ActionResult> {
  try {
    const api = await createBackendClient();

    const { data } = await api.post<{
      success: boolean;
      message: string;
    }>(`/api/product-batches/${batchId}/remove-units/`, {
      quantity,
    });

    revalidatePath("/dashboard/products");

    return {
      success: true,
      message: data.message || "Units removed successfully.",
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
          "Failed to remove units.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while removing units.",
    };
  }
}

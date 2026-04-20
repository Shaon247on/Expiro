"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  CategoryApiItem,
  CategoryListResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
} from "@/types/category.type";

type ActionResult<T = undefined> =
  | {
      success: true;
      message: string;
      data?: T;
      count?: number;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export async function getCategoriesAction(params?: {
  page?: number;
  search?: string;
}): Promise<ActionResult<CategoryApiItem[]>> {
  try {
    const api = await createBackendClient();

    const query = new URLSearchParams();
    query.set("page", String(params?.page ?? 1));

    const search = params?.search?.trim();
    if (search) {
      query.set("search", search);
    }

    const { data } = await api.get<CategoryListResponse>(
      `/api/categories/?${query.toString()}`
    );

    return {
      success: true,
      message: data.results?.message || "Categories fetched successfully.",
      data: data.results?.data ?? [],
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
          "Failed to fetch categories.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while fetching categories.",
    };
  }
}

export async function createCategoryAction(
  formData: FormData
): Promise<ActionResult<CreateCategoryResponse["data"]>> {
  try {
    const api = await createBackendClient();

    const { data } = await api.post<CreateCategoryResponse>(
      "/api/categories/",
      formData,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    revalidatePath("/dashboard/categories");

    return {
      success: true,
      message: data.message || "Category created successfully.",
      data: data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            message?: string;
            detail?: string;
            name?: string[];
            description?: string[];
            image?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          serverData?.name?.[0] ||
          serverData?.description?.[0] ||
          serverData?.image?.[0] ||
          "Failed to create category.",
        fieldErrors: {
          name: serverData?.name,
          description: serverData?.description,
          image: serverData?.image,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong while creating category.",
    };
  }
}

export async function updateCategoryAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const api = await createBackendClient();

    const { data } = await api.patch<UpdateCategoryResponse>(
      `/api/categories/${id}/`,
      formData,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    revalidatePath("/dashboard/categories");

    return {
      success: true,
      message: data.message || "Category updated successfully.",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverData = error.response?.data as
        | {
            message?: string;
            detail?: string;
            name?: string[];
            description?: string[];
            image?: string[];
          }
        | undefined;

      return {
        success: false,
        message:
          serverData?.message ||
          serverData?.detail ||
          serverData?.name?.[0] ||
          serverData?.description?.[0] ||
          serverData?.image?.[0] ||
          "Failed to update category.",
        fieldErrors: {
          name: serverData?.name,
          description: serverData?.description,
          image: serverData?.image,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong while updating category.",
    };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const api = await createBackendClient();

    await api.delete(`/api/categories/${id}/`);

    revalidatePath("/dashboard/categories");

    return {
      success: true,
      message: "Category deleted successfully.",
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
          "Failed to delete category.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while deleting category.",
    };
  }
}
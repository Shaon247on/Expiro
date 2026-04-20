export const CATEGORY_PAGE_SIZE = 10;

export type CategoryApiItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  total_products: number;
  created_at: string;
  updated_at: string;
};

export type CategoryListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    message: string;
    data: CategoryApiItem[];
  };
};

export type CreateCategoryResponse = {
  message: string;
  data: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    created_by: number;
    image: string | null;
    created_at: string;
    updated_at: string;
  };
};

export type UpdateCategoryResponse = {
  message: string;
};

export type DeleteCategoryResponse = void;



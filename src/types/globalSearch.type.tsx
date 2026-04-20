export type GlobalSearchResultType = "product" | "staff" | "user" | "category";

export type GlobalSearchResultItem = {
  type: GlobalSearchResultType;
  id: string;
  name: string;
  category?: string | null;
  price?: string | null;
  quantity?: number | null;
  image?: string | null;
};

export type GlobalSearchResponse = {
  success: true;
  message: string;
  data: {
    results: GlobalSearchResultItem[];
  };
};
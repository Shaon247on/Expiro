export type ProductApiStatus = "active" | "opened" | "removed";
export type ProductBusinessStatus =
  | "active"
  | "remove_item"
  | "open_item";

export type ProductBatch = {
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
  total_unit_labels?: number;
};

export type UnitLabel = {
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

export type ProductItem = {
  id: string;
  category: string;
  category_name: string;
  category_image: string | null;
  name: string;
  barcode: string;
  quantity: number;
  batch_count: number;
  purchase_date: string;
  expiry_date: string;
  track_open_expiry_days: boolean;
  open_expiry_days: number | null;
  labels_print_confirmed: boolean;
  status: ProductApiStatus;
  price: string;
  description: string | null;
  created_by: number | null;
  products_status: ProductBusinessStatus;
  active_expiry_date: string | null;
  total_unit_labels: number;
  batches: ProductBatch[];
  unit_labels?: UnitLabel[];
  created_at: string;
  updated_at: string;
};

export type ProductListResponse = {
  message: string;
  count: number;
  filter_status: string;
  data: ProductItem[];
};

export type ProductDetailsResponse = {
  message: string;
  data: ProductItem;
};

export type ProductCreateOrUpdateResponse = {
  message: string;
  data: ProductItem;
};

export type BatchDetailsResponse = {
  success: boolean;
  message: string;
  data: ProductBatch & {
    product_id: string;
    product_name: string;
    unit_labels: UnitLabel[];
  };
};

export const PAGE_SIZE = 10;

export const PRODUCT_STATUS_LABELS: Record<ProductBusinessStatus, string> = {
  active: "Safe Item",
  remove_item: "Remove Item",
  open_item: "Open Item",
};

export const PRODUCT_STATUS_META: Record<
  ProductBusinessStatus,
  { dot: string; color: string }
> = {
  active: { dot: "#16A34A", color: "#16A34A" },
  remove_item: { dot: "#DC2626", color: "#DC2626" },
  open_item: { dot: "#15803D", color: "#15803D" },
};


//existing product

export type ProductScanExistingResponse = {
  success: true;
  type: "existing";
  message: string;
  product: {
    id: string;
    name: string;
    barcode: string;
    price: string;
    category: string;
    category_name: string;
    status: string;
    products_status: string;
    expiry_date: string;
    batches: Array<{
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
      unit_labels?: Array<{
        id: string;
        unit_number: number;
        unique_barcode: string;
        status?: string;
      }>;
    }>;
  };
};

export type ScannedProductPrefill = {
  barcode: string;
  existingProduct: boolean;
  lockedFields?: {
    productId: string;
    categoryId: string;
    categoryName: string;
    name: string;
    barcode: string;
    track_open_expiry_days: boolean;
    open_expiry_days: number | null;
  };
};

export type ProductScanNewResponse = {
  success: true;
  type: "new";
  message: string;
  barcode: string;
};

export type ProductScanResponse =
  | ProductScanExistingResponse
  | ProductScanNewResponse;
export type ScanSellBatch = {
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

export type ScanSellExistingProduct = {
  id: string;
  name: string;
  barcode: string;
  price: string;
  category: string;
  category_name: string;
  status: string;
  products_status: string;
  expiry_date: string;
  track_open_expiry_days?: boolean;
  open_expiry_days?: number | null;
  batches: ScanSellBatch[];
};

export type ProductScanFindExistingResponse = {
  success: true;
  type: "existing";
  message: string;
  product: ScanSellExistingProduct;
};

export type ProductScanFindNewResponse = {
  success: true;
  type: "new";
  message: string;
  barcode: string;
};

export type ProductScanFindResponse =
  | ProductScanFindExistingResponse
  | ProductScanFindNewResponse;

export type SellProductRequest = {
  quantity: number;
  batch_id: string;
};

export type SoldUnit = {
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

export type UpdatedBatchAfterSell = {
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

export type SellProductResponse = {
  success: true;
  message: string;
  data: {
    product_id: string;
    product_name: string;
    barcode: string;
    sold_quantity: number;
    sold_units: SoldUnit[];
    updated_batches: UpdatedBatchAfterSell[];
  };
};
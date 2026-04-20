export type DlcTrustFilterStatus =
  | "opened"
  | "expiring_soon"
  | "urgent"
  | "expired"
  | "removed";

export type DlcTrustProduct = {
  id: string;
  category: string;
  category_name: string;
  category_image: string | null;
  name: string;
  barcode: string;
  quantity: number;
  purchase_date: string;
  expiry_date: string;
  track_open_expiry_days: boolean;
  open_expiry_days: number | null;
  status: string;
  products_status: string;
  active_expiry_date: string | null;
  price: string;
  opened_units_count: number;
  created_at: string;
  proof_image: string;
  opened_units: {
    id: string;
    unit_number: number;
    unique_barcode: string;
    status: string;
    opened_at: string | null;
    opened_expiry_date: string | null;
    batch: string;
    batch_code: string;
  };
  updated_at: string;
};

export type DlcTrustListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  message: string;
  data: DlcTrustProduct[];
};

export type DlcTrustDetailsResponse = {
  message: string;
  data: {
    id: string;
    category: string;
    category_name: string;
    category_image: string | null;
    name: string;
    barcode: string;
    quantity: number;
    purchase_date: string;
    expiry_date: string;
    track_open_expiry_days: boolean;
    open_expiry_days: number | null;
    status: string;
    products_status: string;
    active_expiry_date: string | null;
    price: string;
    description: string | null;
    batches: Array<{
      id: string;
      batch_code: string;
      received_quantity: number;
      available_quantity: number;
      purchase_date: string;
      expiry_date: string;
      status: string;
      unit_price: string;
    }>;
    opened_units: Array<{
      id: string;
      unit_number: number;
      unique_barcode: string;
      status: string;
      opened_at: string | null;
      opened_expiry_date: string | null;
      batch: string;
      batch_code: string;
    }>;
    created_at: string;
    updated_at: string;
  };
};

export const DLC_TRUST_PAGE_SIZE = 10;

export const DLC_TRUST_STATUS_META: Record<
  DlcTrustFilterStatus,
  {
    label: string;
    bg: string;
    color: string;
    dot: string;
  }
> = {
  opened: {
    label: "Opened",
    bg: "#DBEAFE",
    color: "#2563EB",
    dot: "#2563EB",
  },
  expiring_soon: {
    label: "Expiring soon",
    bg: "#FFEDD5",
    color: "#EA580C",
    dot: "#EA580C",
  },
  urgent: {
    label: "Urgent",
    bg: "#FFE4E6",
    color: "#E11D48",
    dot: "#E11D48",
  },
  removed: {
    label: "Removed",
    bg: "#FEE2E2",
    color: "#DC2626",
    dot: "#DC2626",
  },
  expired: {
    label: "Expired",
    bg: "#f0b1b1",
    color: "#DC2626",
    dot: "#DC2626",
  },
};

export type ScanOpenBatch = {
  id: string;
  batch_code: string;
  received_quantity: number;
  available_quantity: number;
  purchase_date: string;
  expiry_date: string;
  status: string;
  unit_price: string;
  available_units: number;
};

export type ScannedUnitForOpen = {
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

export type ScanOpenProductData = {
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
  batches: ScanOpenBatch[];
  scanned_unit: ScannedUnitForOpen;
};

export type ScanOpenLookupResponse = {
  success: true;
  message: string;
  data: ScanOpenProductData;
};

export type ConfirmOpenResponse = {
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

export type DlcTrustFilterStatus =
  | "opened"
  | "expiring_soon"
  | "urgent"
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
  updated_at: string;
};

export type DlcTrustListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    message: string;
    count: number;
    data: DlcTrustProduct[];
  };
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
};
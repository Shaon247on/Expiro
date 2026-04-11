export type DlcTrackingStatus =
  | "removed"
  | "opened"
  | "urgent"
  | "expiring_soon";

export type ProductOpenProofItem = {
  id: string;
  unit: string;
  product: string;
  product_name: string;
  category_name: string;
  batch: string;
  opened_by: string;
  opened_by_name: string;
  proof_image: string;
  product_status: "removed" | "open" | "urgent" | "expiring_soon";
  item_status: string;
  note: string | null;
  scanned_barcode: string;
  opened_at: string;
  created_at: string;
  days_left: number;
};

export type ProductOpenProofListResponse = {
  message: string;
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductOpenProofItem[];
};

export const DLC_TRACKING_PAGE_SIZE = 10;

export const DLC_STATUS_META: Record<
  DlcTrackingStatus,
  {
    label: string;
    color: string;
    bg: string;
    dot: string;
  }
> = {
  removed: {
    label: "Remove Item",
    color: "#DC2626",
    bg: "#FEE2E2",
    dot: "#DC2626",
  },
  opened: {
    label: "Open Item",
    color: "#2563EB",
    bg: "#DBEAFE",
    dot: "#2563EB",
  },
  urgent: {
    label: "Urgent",
    color: "#E11D48",
    bg: "#FFE4E6",
    dot: "#E11D48",
  },
  expiring_soon: {
    label: "Expiring soon",
    color: "#EA580C",
    bg: "#FFEDD5",
    dot: "#EA580C",
  },
};
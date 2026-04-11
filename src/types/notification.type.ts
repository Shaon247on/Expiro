export type NotificationType =
  | "open_item"
  | "low_stock"
  | "expiring_soon"
  | "urgent";

export type NotificationSummaryMetric = {
  current: number;
  previous: number;
  difference: number;
  direction: "up" | "down" | "same";
  display: string;
};

export type NotificationSummaryResponse = {
  message: string;
  unread_notifications: number;
  data: {
    summary: {
      total_active_products: NotificationSummaryMetric;
      expiring_soon_products: NotificationSummaryMetric;
      low_stock_products: NotificationSummaryMetric;
      open_products: NotificationSummaryMetric;
    };
    snapshot_date: string;
    comparison_date: string;
  };
};

export type NotificationItem = {
  id: string;
  product_id: string;
  batch_id: string;
  product_name: string;
  notification_type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  time_ago: string;
  category_img: string | null;
};

export type NotificationListResponse = {
  message: string;
  count: number;
  unread_count: number;
  results: NotificationItem[];
};

export type MarkReadResponse = {
  message: string;
};

export const NOTIFICATION_PAGE_SIZE = 10;

export const NOTIFICATION_TYPE_META: Record<
  NotificationType,
  {
    label: string;
    bg: string;
    color: string;
    dot: string;
    lightBg: string;
  }
> = {
  low_stock: {
    label: "Low Stock",
    bg: "#DBEAFE",
    color: "#2563EB",
    dot: "#2563EB",
    lightBg: "#EFF6FF",
  },
  expiring_soon: {
    label: "Expiring Soon",
    bg: "#FFEDD5",
    color: "#EA580C",
    dot: "#EA580C",
    lightBg: "#FFF7ED",
  },
  urgent: {
    label: "Urgent",
    bg: "#FFE4E6",
    color: "#E11D48",
    dot: "#E11D48",
    lightBg: "#FFF1F2",
  },
  open_item: {
    label: "Open Item",
    bg: "#DCFCE7",
    color: "#15803D",
    dot: "#15803D",
    lightBg: "#F0FDF4",
  },
};
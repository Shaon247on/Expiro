export type DashboardAnalyticsResponse = {
  success: boolean;
  message: string;
  data: {
    total_user: number;
    total_customer: number;
    new_customer: number;
    total_products: number;
    total_batches: number;
    total_units: number;
    sold_units: number;
    total_profit: number;
  };
};

export type ExpiryTimelineResponse = {
  success: boolean;
  message: string;
  data: {
    labels: string[];
    safe: number[];
    expiring_soon: number[];
    urgent: number[];
    y_axis: {
      min: number;
      max: number;
      step_size: number;
    };
  };
};

export type ExpiryTimelinePoint = {
  month: string;
  safe: number;
  expiringSoon: number;
  urgent: number;
};

export type SavingFoodSummaryResponse = {
  success: boolean;
  message: string;
  count: number;
  data: SavingFoodPoint[];
};

export type SavingFoodPoint = {
  weekday: string;
  weekday_number: number;
  total_food_quantity: number;
  total_products: number;
  total_food_value: number;
};

export type RecentActivitiesResponse = {
  success: boolean;
  message: string;
  count: number;
  data: ActivityRow[];
};

export type ActivityRow = {
  user: string;
  product: string;
  quantity: number;
  action: string;
  datetime: string;
  tracking_no: string;
  unique_barcode: string | null;
  price: string;
};

export type StatCard = {
  label: string;
  value: string | number;
  delta: number;
  deltaLabel: string;
  variant: "green" | "yellow" | "red" | "emerald";
};
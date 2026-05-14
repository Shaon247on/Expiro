export type DashboardAnalyticsResponse = {
  success: boolean;
  message: string;
  data: {
    total_user: number;
    total_customer: number;
    new_customer: number;
    total_products: Product;
    total_batches: number;
    total_units: TotalUnits;
    sold_units: SoldUnits;
    total_staff: TotalProfit;
  };
};

export type Product = {
  total: number;
  difference: number;
  trend: "up" | "down",
  message: string;
}
export type TotalUnits = {
  total: number;
  difference: number;
  trend: "up" | "down",
  message: string;
}
export type SoldUnits = {
  total: number;
  difference: number;
  trend: "up" | "down",
  message: string;
}
export type TotalStaff = {
  total: number;
  difference: number;
  trend: "up" | "down",
  message: string;
}

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
  created_at: string;
  tracking_no: string;
  unique_barcode: string | null;
  price: string;
};

export type StatCard = {
  label: string | number;
  value: string | number;
  delta: string | number;
  deltaLabel: string;
  trend: "up" | "down";
  variant: "green" | "yellow" | "red" | "emerald" | "package";
};
export type DashboardAnalyticsResponse = {
  success: true;
  message: string;
  data: {
    total_user: number;
    total_customer: number;
    new_customer: number;
    total_profit: number;
  };
};

export type SubscriptionAnalyticsResponse = {
  success: true;
  message: string;
  data: {
    plans: {
      free: number;
      professional: number;
      custom: number;
    };
  };
};

export type SubscriptionReportResponse = {
  success: true;
  message: string;
  day_wise: Array<{
      day: string;
      total: number;
    }>;
};

export type RecentSubscriptionItem = {
  id: string;
  user_name: string;
  user_email: string;
  plan_type: string;
  plan_code: "free" | "professional" | "custom" | string;
  plan_price: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
};

export type RecentSubscriptionsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RecentSubscriptionItem[];
};

export type DashboardStat = {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  href: string;
  linkLabel: string;
};

export type ReportPoint = {
  time: string;
  subscriptions: number;
};

export type AnalyticsDonutItem = {
  label: string;
  value: number;
  color: string;
};

export type RecentOrder = {
  id: string;
  tracking: string;
  name: string;
  price: string;
  totalOrder: string;
  totalAmount: string;
};

export type BillingCycle = "monthly" | "yearly";

export type SubscriptionPlanType =
  | "free"
  | "starter"
  | "professional"
  | "enterprise";

export type SubscriptionPlan = {
  id: string;
  name: string;
  plan_type: SubscriptionPlanType;
  currency: string;
  price_monthly: string | null;
  price_yearly: string | null;
  display_price:
    | string
    | {
        monthly: number;
        yearly: number;
      };
  products_limit: number | null;
  users_limit: number | null;
  locations_limit: number | null;
  monthly_sales_limit: string | null;
  alerts_per_week: number | null;
  traceability: boolean;
  support: string;
  features: string[];
  is_recommended: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SubscriptionPlanListResponse = {
  success: true;
  message: string;
  count: number;
  data: SubscriptionPlan[];
};

export type SubscribePayload = {
  plan_type: "free" | "starter" | "professional" | "enterprise";
  billing_cycle: BillingCycle;
};

export type SubscribeResponse = {
  success: true;
  checkout_url: string;
};
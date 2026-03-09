// ─── Dashboard Stat Card ──────────────────────────────────────────────────────
export interface DashboardStat {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  href: string;
}

// ─── Reports chart ────────────────────────────────────────────────────────────
export interface ReportPoint {
  time: string;
  subscriptions: number;
}

// ─── Analytics donut ─────────────────────────────────────────────────────────
export interface AnalyticsSegment {
  name: string;
  value: number;
  color: string;
}

// ─── Recent Orders ────────────────────────────────────────────────────────────
export interface RecentOrder {
  id: string;
  tracking: string;
  name: string;
  imageUrl: string;
  price: string;
  totalOrder: number;
  totalAmount: string;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export type PlanType = "Free" | "Professional" | "Enterprise";
export type BanStatus = "active" | "banned";

export interface User {
  id: string;
  name: string;
  shopName: string;
  avatarUrl: string;
  contact: string;
  email: string;
  plan: PlanType;
  status: BanStatus;
  categoryType: string;
  mobile: string;
}
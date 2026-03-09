// ─── Stat Cards ───────────────────────────────────────────────────────────────
export interface StatCard {
  label: string;
  value: string | number;
  delta: number; // positive = up, negative = down
  deltaLabel: string; // e.g. "than last week"
  variant: "green" | "yellow" | "red" | "emerald";
}

// ─── Expiry Timeline ──────────────────────────────────────────────────────────
export interface ExpiryTimelinePoint {
  month: string;
  safe: number;
  expiringSoon: number;
  urgent: number;
}

// ─── Saving Food (bar chart) ──────────────────────────────────────────────────
export interface SavingFoodPoint {
  day: string;
  value: number;
}

// ─── Recent Activity ──────────────────────────────────────────────────────────
export interface ActivityRow {
  id: string;
  user: string;
  product: string;
  quantity: number;
  action: "Safe" | "Expiring Soon" | "Urgent" | "Wasted";
  dateTime: string;
}
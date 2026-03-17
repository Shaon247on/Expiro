export type ProductStatus =
  | "Urgent"
  | "Expiring soon"
  | "Safe Item"
  | "Remove Item"
  | "Open Item";

export const statusMeta: Record<
  ProductStatus,
  { color: string; bg: string; dot: string }
> = {
  "Urgent":        { color: "#E11D48", bg: "#FFF1F2", dot: "#E11D48" },
  "Expiring soon": { color: "#EA580C", bg: "#FFF7ED", dot: "#EA580C" },
  "Safe Item":     { color: "#16A34A", bg: "#F0FDF4", dot: "#16A34A" },
  "Remove Item":   { color: "#E11D48", bg: "#FFF1F2", dot: "#E11D48" },
  "Open Item":     { color: "#16A34A", bg: "#F0FDF4", dot: "#16A34A" },
};

export interface OpenedItem {
  id: string;
  barcode: string;
  supplierBatchNumber: string;   // Supplier batch / lot number
  itemName: string;
  category: string;
  imageUrl: string;              // captured photo at opening
  openedAt: string;              // ISO datetime — product opening date
  expiryDate: string;            // ISO date  — supplier expiry (DLC)
  openExpiryDays: number;        // validity duration after opening (days)
  status: ProductStatus;
  openedBy: {
    id: string;
    name: string;
    email: string;
    avatarInitials: string;
    avatarBg: string;
  };
}

// ── Derived helpers ────────────────────────────────────────────────────────────

/** Expiry date after opening = openedAt + openExpiryDays */
export function openExpiryDate(openedAt: string, openExpiryDays: number): string {
  const d = new Date(openedAt);
  d.setDate(d.getDate() + openExpiryDays);
  return d.toISOString().split("T")[0];
}

function daysLeft(expiryDate: string, openedAt: string, openExpiryDays: number): number {
  const fromExpiry = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / 86400000);
  const fromOpen   = Math.ceil((new Date(openedAt).getTime() + openExpiryDays * 86400000 - Date.now()) / 86400000);
  return Math.min(fromExpiry, fromOpen);
}

export function computeStatus(expiryDate: string, openedAt: string, openExpiryDays: number): ProductStatus {
  const days = daysLeft(expiryDate, openedAt, openExpiryDays);
  if (days < 0)  return "Remove Item";
  if (days <= 2) return "Urgent";
  if (days <= 7) return "Expiring soon";
  return "Open Item";
}

export function daysLeftLabel(expiryDate: string, openedAt: string, openExpiryDays: number): number {
  return daysLeft(expiryDate, openedAt, openExpiryDays);
}

// ── Mock data ──────────────────────────────────────────────────────────────────

export const MOCK_OPENED_ITEMS: OpenedItem[] = [
  {
    id: "oi1",
    barcode: "5901234123457",
    supplierBatchNumber: "LOT-2024-A01",
    itemName: "Organic Whole Milk",
    category: "Dairy",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80",
    openedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    openExpiryDays: 7,
    status: "Expiring soon",
    openedBy: { id: "u1", name: "Maria Garcia", email: "maria@store.com", avatarInitials: "MG", avatarBg: "#EDE9FE" },
  },
  {
    id: "oi2",
    barcode: "4006381333931",
    supplierBatchNumber: "LOT-2024-B03",
    itemName: "Sourdough Bread",
    category: "Bakery",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80",
    openedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    openExpiryDays: 3,
    status: "Urgent",
    openedBy: { id: "u2", name: "James Lee", email: "james@store.com", avatarInitials: "JL", avatarBg: "#EEF3EA" },
  },
  {
    id: "oi3",
    barcode: "7613035898226",
    supplierBatchNumber: "LOT-2024-C07",
    itemName: "Orange Juice",
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=80",
    openedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 20 * 86400000).toISOString().split("T")[0],
    openExpiryDays: 14,
    status: "Open Item",
    openedBy: { id: "u1", name: "Maria Garcia", email: "maria@store.com", avatarInitials: "MG", avatarBg: "#EDE9FE" },
  },
  {
    id: "oi4",
    barcode: "0012000161155",
    supplierBatchNumber: "LOT-2024-D02",
    itemName: "Greek Yogurt",
    category: "Dairy",
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80",
    openedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
    openExpiryDays: 5,
    status: "Remove Item",
    openedBy: { id: "u3", name: "Sophie Chen", email: "sophie@store.com", avatarInitials: "SC", avatarBg: "#FEF3C7" },
  },
  {
    id: "oi5",
    barcode: "5449000000996",
    supplierBatchNumber: "LOT-2024-E09",
    itemName: "Cheddar Cheese",
    category: "Dairy",
    imageUrl: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=200&q=80",
    openedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    openExpiryDays: 21,
    status: "Open Item",
    openedBy: { id: "u2", name: "James Lee", email: "james@store.com", avatarInitials: "JL", avatarBg: "#EEF3EA" },
  },
  {
    id: "oi6",
    barcode: "8076809513753",
    supplierBatchNumber: "LOT-2024-F11",
    itemName: "Tomato Sauce",
    category: "Other",
    imageUrl: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=200&q=80",
    openedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0],
    openExpiryDays: 7,
    status: "Expiring soon",
    openedBy: { id: "u3", name: "Sophie Chen", email: "sophie@store.com", avatarInitials: "SC", avatarBg: "#FEF3C7" },
  },
];
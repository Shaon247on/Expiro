import { ActivityRow, ExpiryTimelinePoint, SavingFoodPoint, StatCard } from "@/types/analytics.type";


export const statCards: StatCard[] = [
  {
    label: "Total Products",
    value: 156,
    delta: 5,
    deltaLabel: "than last week",
    variant: "green",
  },
  {
    label: "Expiring Soon",
    value: 18,
    delta: 55,
    deltaLabel: "than last week",
    variant: "yellow",
  },
  {
    label: "Low Stock",
    value: 20,
    delta: -5,
    deltaLabel: "than last week",
    variant: "red",
  },
  {
    label: "Waste Prevented",
    value: "$2.4k",
    delta: 55,
    deltaLabel: "than last week",
    variant: "emerald",
  },
];

export const expiryTimeline: ExpiryTimelinePoint[] = [
  { month: "Jan", safe: 60, expiringSoon: 40, urgent: 10 },
  { month: "Feb", safe: 55, expiringSoon: 55, urgent: 12 },
  { month: "Mar", safe: 70, expiringSoon: 60, urgent: 8 },
  { month: "Apr", safe: 65, expiringSoon: 45, urgent: 14 },
  { month: "May", safe: 80, expiringSoon: 70, urgent: 18 },
  { month: "Jun", safe: 75, expiringSoon: 65, urgent: 15 },
  { month: "Jul", safe: 70, expiringSoon: 50, urgent: 12 },
  { month: "Aug", safe: 85, expiringSoon: 72, urgent: 20 },
  { month: "Sept", safe: 78, expiringSoon: 68, urgent: 22 },
  { month: "Oct", safe: 60, expiringSoon: 80, urgent: 30 },
  { month: "Nov", safe: 65, expiringSoon: 85, urgent: 28 },
  { month: "Dec", safe: 72, expiringSoon: 90, urgent: 25 },
];

export const savingFoodData: SavingFoodPoint[] = [
  { day: "Sun", value: 65 },
  { day: "Mon", value: 80 },
  { day: "Tue", value: 42 },
  { day: "Wed", value: 38 },
  { day: "Thu", value: 65 },
  { day: "Fri", value: 58 },
  { day: "Sat", value: 20 },
  { day: "Sun", value: 62 },
];

export const recentActivity: ActivityRow[] = [
  {
    id: "1",
    user: "John Son",
    product: "Milk-1L",
    quantity: 125,
    action: "Safe",
    dateTime: "2026-01-11  15:25",
  },
  {
    id: "2",
    user: "Sarah Kim",
    product: "Yogurt-500g",
    quantity: 80,
    action: "Expiring Soon",
    dateTime: "2026-01-11  14:10",
  },
  {
    id: "3",
    user: "Marc Dupont",
    product: "Cheese-200g",
    quantity: 30,
    action: "Urgent",
    dateTime: "2026-01-11  13:55",
  },
  {
    id: "4",
    user: "John Son",
    product: "Milk-1L",
    quantity: 125,
    action: "Safe",
    dateTime: "2026-01-11  13:00",
  },
  {
    id: "5",
    user: "Amina Bel",
    product: "Butter-250g",
    quantity: 50,
    action: "Safe",
    dateTime: "2026-01-11  12:40",
  },
];
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


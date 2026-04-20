import {
  DashboardStat,
  ReportPoint,
  AnalyticsSegment,
  RecentOrder,
} from "@/types/superAdmin/analytics.type";

export const dashboardStats: DashboardStat[] = [
  {
    label: "Total User",
    value: "25.1k",
    delta: "+15%",
    deltaPositive: true,
    href: "#",
  },
  {
    label: "Total Profit",
    value: "$2,435k",
    delta: "-3.5%",
    deltaPositive: false,
    href: "#",
  },
  {
    label: "Total Customer",
    value: "3.5M",
    delta: "+15%",
    deltaPositive: true,
    href: "#",
  },
  {
    label: "New Customer",
    value: "43.5k",
    delta: "+10%",
    deltaPositive: true,
    href: "#",
  },
];

export const reportData: ReportPoint[] = [
  { time: "10am", subscriptions: 40 },
  { time: "11am", subscriptions: 62 },
  { time: "12am", subscriptions: 45 },
  { time: "01am", subscriptions: 35 },
  { time: "02am", subscriptions: 78 },
  { time: "03am", subscriptions: 55 },
  { time: "04am", subscriptions: 48 },
  { time: "05am", subscriptions: 70 },
  { time: "06am", subscriptions: 60 },
  { time: "07am", subscriptions: 50 },
];

export const analyticsData: AnalyticsSegment[] = [
  { name: "Free", value: 45, color: "#4f46e5" },
  { name: "Professional", value: 30, color: "#22c55e" },
  { name: "Enterprise", value: 25, color: "#ec4899" },
];

export const recentOrders: RecentOrder[] = [
  {
    id: "1",
    tracking: "#876364",
    name: "Camera Lens",
    imageUrl: "/images/camera-lens.png",
    price: "$178",
    totalOrder: 325,
    totalAmount: "$1,46,660",
  },
  {
    id: "2",
    tracking: "#876368",
    name: "Black Sleep Dress",
    imageUrl: "/images/dress.png",
    price: "$14",
    totalOrder: 53,
    totalAmount: "$46,660",
  },
  {
    id: "3",
    tracking: "#876412",
    name: "Argan Oil",
    imageUrl: "/images/argan-oil.png",
    price: "$21",
    totalOrder: 78,
    totalAmount: "$3,46,676",
  },
  {
    id: "4",
    tracking: "#876621",
    name: "EAU DE Parfum",
    imageUrl: "/images/parfum.png",
    price: "$32",
    totalOrder: 98,
    totalAmount: "$3,46,981",
  },
];
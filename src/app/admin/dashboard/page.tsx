import { DashboardStatCards } from "@/components/elements/DashboardStatCards";
import { AnalyticsDonut } from "@/components/superAdmin/analytics/AnalyticsDonut";
import { RecentOrdersTable } from "@/components/superAdmin/analytics/RecentOrdersTable";
import { ReportsChart } from "@/components/superAdmin/analytics/ReportsChart";
import {
  getDashboardAnalyticsAction,
  getRecentSubscriptionsAction,
  getSubscriptionAnalyticsAction,
  getSubscriptionReportAction,
} from "@/actions/superAdmin/dashboard.action";
import type {
  AnalyticsDonutItem,
  DashboardStat,
  RecentOrder,
  ReportPoint,
} from "@/types/superAdmin/analytics.type";

function formatCurrency(value: number | string) {
  const amount = typeof value === "number" ? value : Number(value);
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function DashboardPage() {
  const [
    dashboardResult,
    subscriptionAnalyticsResult,
    subscriptionReportResult,
    recentSubscriptionsResult,
  ] = await Promise.all([
    getDashboardAnalyticsAction(),
    getSubscriptionAnalyticsAction(),
    getSubscriptionReportAction(),
    getRecentSubscriptionsAction(),
  ]);

  const dashboardStats: DashboardStat[] = [
    {
      label: "Total Users",
      value: dashboardResult.success
        ? String(dashboardResult.data.total_user)
        : "0",
      delta: "+0%",
      deltaPositive: true,
      href: "/admin/users",
      linkLabel: "See all",
    },
    {
      label: "Total Customers",
      value: dashboardResult.success
        ? String(dashboardResult.data.total_customer)
        : "0",
      delta: "+0%",
      deltaPositive: true,
      href: "/admin/customers",
      linkLabel: "See all",
    },
    {
      label: "New Customers",
      value: dashboardResult.success
        ? String(dashboardResult.data.new_customer)
        : "0",
      delta: "+0%",
      deltaPositive: true,
      href: "/admin/customers",
      linkLabel: "See all",
    },
    {
      label: "Total Profit",
      value: dashboardResult.success
        ? formatCurrency(dashboardResult.data.total_profit)
        : "$0.00",
      delta: "+0%",
      deltaPositive: true,
      href: "/admin/reports",
      linkLabel: "Details",
    },
  ];

  const reportData: ReportPoint[] = subscriptionReportResult.success
    ? subscriptionReportResult.data.day_wise_subscriptions.map((item) => ({
        time: formatDate(item.day),
        subscriptions: item.total_subscriptions,
      }))
    : [];

  const analyticsData: AnalyticsDonutItem[] = subscriptionAnalyticsResult.success
    ? [
        {
          label: "Free",
          value: subscriptionAnalyticsResult.data.plans.free ?? 0,
          color: "#60A5FA",
        },
        {
          label: "Professional",
          value: subscriptionAnalyticsResult.data.plans.professional ?? 0,
          color: "#A78BFA",
        },
        {
          label: "Custom",
          value: subscriptionAnalyticsResult.data.plans.custom ?? 0,
          color: "#F472B6",
        },
      ]
    : [
        { label: "Free", value: 0, color: "#60A5FA" },
        { label: "Professional", value: 0, color: "#A78BFA" },
        { label: "Custom", value: 0, color: "#F472B6" },
      ];

  const totalPlans = analyticsData.reduce((sum, item) => sum + item.value, 0);
  const dominantPlanValue = Math.max(...analyticsData.map((item) => item.value), 0);
  const donutPercentage =
    totalPlans > 0 ? Math.round((dominantPlanValue / totalPlans) * 100) : 0;

  const recentOrders: RecentOrder[] = recentSubscriptionsResult.success
    ? recentSubscriptionsResult.data.map((item) => ({
        id: item.id,
        tracking: item.id.slice(0, 8).toUpperCase(),
        name: item.user_name,
        price: formatCurrency(item.plan_price),
        totalOrder: item.plan_type,
        totalAmount: formatDate(item.created_at),
      }))
    : [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back to the super admin dashboard.
          </p>
        </div>
      </div>

      <DashboardStatCards stats={dashboardStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ReportsChart data={reportData} />
        </div>
        <div className="lg:col-span-1">
          <AnalyticsDonut data={analyticsData} percentage={donutPercentage} />
        </div>
      </div>

      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
}
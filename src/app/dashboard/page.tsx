import { ExpiryTimelineChart } from "@/components/dashboard/analytics/ExpiryTimelineChart";
import { RecentActivityTable } from "@/components/dashboard/analytics/RecentActivityTable";
import { SavingFoodChart } from "@/components/dashboard/analytics/SavingFoodChart";
import { AnalyticCard } from "@/components/elements/AnalyticCard";

import {
  getDashboardAnalyticsAction,
  getExpiryTimelineAction,
  getRecentActivitiesAction,
  getSavingFoodSummaryAction,
} from "@/actions/admin/dashboard.action";

import {
  ActivityRow,
  ExpiryTimelinePoint,
  SavingFoodPoint,
  StatCard,
} from "@/types/analytics.type";

export default async function AnalyticsPage() {
  const [
    analyticsResult,
    expiryTimelineResult,
    savingFoodResult,
    recentActivityResult,
  ] = await Promise.all([
    getDashboardAnalyticsAction(),
    getExpiryTimelineAction(),
    getSavingFoodSummaryAction(),
    getRecentActivitiesAction(),
  ]);

  // Analytics Cards
  const statCards: StatCard[] = analyticsResult.success
    ? [
        {
          label: "Total Products",
          value: analyticsResult.data?.total_products ?? 0,
          delta: 12,
          deltaLabel: "vs last month",
          variant: "green",
        },
        {
          label: "Total Units",
          value: analyticsResult.data?.total_units ?? 0,
          delta: 8,
          deltaLabel: "inventory growth",
          variant: "yellow",
        },
        {
          label: "Sold Units",
          value: analyticsResult.data?.sold_units ?? 0,
          delta: -2,
          deltaLabel: "wastage reduced",
          variant: "red",
        },
        {
          label: "Total Profit",
          value: `$${analyticsResult.data?.total_profit ?? 0}`,
          delta: 15,
          deltaLabel: "profit increase",
          variant: "emerald",
        },
      ]
    : [];

  // Expiry Timeline Transform
  const expiryTimeline: ExpiryTimelinePoint[] =
    expiryTimelineResult.success && expiryTimelineResult.data
      ? expiryTimelineResult.data.labels.map((month, index) => ({
          month,
          safe: expiryTimelineResult.data?.safe[index] ?? 0,
          expiringSoon:
            expiryTimelineResult.data?.expiring_soon[index] ?? 0,
          urgent: expiryTimelineResult.data?.urgent[index] ?? 0,
        }))
      : [];

  // Saving Food Transform
  const savingFoodData: SavingFoodPoint[] =
    savingFoodResult.success && savingFoodResult.data
      ? savingFoodResult.data
      : [];

  // Recent Activities
  const recentActivity: ActivityRow[] =
    recentActivityResult.success && recentActivityResult.data
      ? recentActivityResult.data
      : [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Analytics
        </h1>

        <p className="text-sm text-gray-500 mt-0.5">
          Store performance overview
        </p>
      </div>

      <AnalyticCard cards={statCards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpiryTimelineChart data={expiryTimeline} />

        <SavingFoodChart data={savingFoodData} />
      </div>

      <RecentActivityTable rows={recentActivity} />
    </div>
  );
}
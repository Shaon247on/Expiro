
import { ExpiryTimelineChart } from "@/components/dashboard/analytics/ExpiryTimelineChart";
import { RecentActivityTable } from "@/components/dashboard/analytics/RecentActivityTable";
import { SavingFoodChart } from "@/components/dashboard/analytics/SavingFoodChart";
import { AnalyticCard } from "@/components/elements/AnalyticCard";
import {
  statCards,
  expiryTimeline,
  savingFoodData,
  recentActivity,
} from "@/data/analyticsData";

// No "use client" — this stays a Server Component.
export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Analytics
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Store performance overview
        </p>
      </div>

      {/* ── Stat cards row ───────────────────────────────────────────────── */}
      <AnalyticCard cards={statCards} />

      {/* ── Charts row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpiryTimelineChart data={expiryTimeline} />
        <SavingFoodChart data={savingFoodData} />
      </div>

      {/* ── Recent activity table ────────────────────────────────────────── */}
      <RecentActivityTable rows={recentActivity} />
    </div>
  );
}

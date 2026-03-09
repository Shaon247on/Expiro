import { DashboardStatCards } from "@/components/elements/DashboardStatCards";
import { AnalyticsDonut } from "@/components/superAdmin/analytics/AnalyticsDonut";
import { RecentOrdersTable } from "@/components/superAdmin/analytics/RecentOrdersTable";
import { ReportsChart } from "@/components/superAdmin/analytics/ReportsChart";
import {
  dashboardStats,
  reportData,
  analyticsData,
  recentOrders,
} from "@/data/superAdmin/dashboardData";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Hi, Mohammad AnaYet. Welcome back to Ana Admin!
          </p>
        </div>
        <button className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-sm hover:bg-gray-50 transition-colors self-start sm:self-auto">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
            </svg>
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-gray-700">Filter Periode</p>
            <p className="text-[11px] text-gray-400">01 Jan 2026 - 01 Feb 2026</p>
          </div>
          <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────────── */}
      <DashboardStatCards stats={dashboardStats} />

      {/* ── Charts row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ReportsChart data={reportData} />
        </div>
        <div className="lg:col-span-1">
          <AnalyticsDonut data={analyticsData} percentage={80} />
        </div>
      </div>

      {/* ── Recent Orders ───────────────────────────────────────────────────── */}
      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
}

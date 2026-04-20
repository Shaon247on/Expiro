"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportPoint } from "@/types/superAdmin/analytics.type";

interface ReportsChartProps {
  data: ReportPoint[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-pink-500 text-white text-xs font-semibold rounded-lg px-3 py-2 shadow-lg">
        <p className="text-[10px] font-normal opacity-80">Subscriptions</p>
        <p className="text-base font-bold">{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

export function ReportsChart({ data }: ReportsChartProps) {
  return (
    <Card className="border border-gray-100 shadow-sm bg-white">
      <CardHeader className="pt-5 pb-2 px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-800">
            Reports
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-2 pb-5">
        {data.length === 0 ? (
          <div className="h-60 flex items-center justify-center text-sm text-gray-400">
            No subscription report data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reportGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
                <linearGradient id="reportFill" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c7d2fe" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#fbcfe8" stopOpacity={0.5} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="subscriptions"
                stroke="url(#reportGrad)"
                strokeWidth={2.5}
                fill="url(#reportFill)"
                dot={{ r: 4, fill: "#818cf8", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#f472b6" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
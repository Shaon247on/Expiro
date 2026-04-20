"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsDonutItem } from "@/types/superAdmin/analytics.type";

interface AnalyticsDonutProps {
  data: AnalyticsDonutItem[];
  percentage: number;
}

export function AnalyticsDonut({
  data,
  percentage,
}: AnalyticsDonutProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const safeData =
    total > 0
      ? data
      : [
          { label: "Free", value: 1, color: "#60A5FA" },
          { label: "Professional", value: 1, color: "#A78BFA" },
          { label: "Custom", value: 1, color: "#F472B6" },
        ];

  return (
    <Card className="border border-gray-100 shadow-sm bg-white h-full">
      <CardHeader className="pt-5 pb-2 px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-800">
            Subscription Analytics
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        <div className="relative w-full h-55">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={safeData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={4}
                cornerRadius={10}
                stroke="transparent"
              >
                {safeData.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-3xl font-bold text-gray-900">
              {total > 0 ? `${percentage}%` : "0%"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {total > 0 ? "Top plan share" : "No subscriptions"}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {data.map((item) => {
            const itemPercentage =
              total > 0 ? Math.round((item.value / total) * 100) : 0;

            return (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-gray-500">{item.value}</span>
                  <span className="text-xs font-semibold text-gray-400 min-w-9 text-right">
                    {itemPercentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
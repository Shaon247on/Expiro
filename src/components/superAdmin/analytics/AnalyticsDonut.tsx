"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { AnalyticsSegment } from "@/types/superAdmin/analytics.type";

interface AnalyticsDonutProps {
  data: AnalyticsSegment[];
  percentage?: number;
}

export function AnalyticsDonut({ data, percentage = 80 }: AnalyticsDonutProps) {
  return (
    <Card className="border border-gray-100 shadow-sm bg-white">
      <CardHeader className="pt-5 pb-2 px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-800">Analytics</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 pb-6 px-5">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value}%`, name]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
            <span className="text-xs text-gray-500 font-medium">Transactions</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 flex-wrap">
          {data.map((seg) => (
            <span key={seg.name} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: seg.color }}
              />
              {seg.name}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
import { Users, TrendingUp, FileText, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DashboardStat } from "@/types/superAdmin/analytics.type";
import Link from "next/link";

const icons = [Users, TrendingUp, FileText, UserPlus];

interface DashboardStatCardsProps {
  stats: DashboardStat[];
}

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = icons[i];
        return (
          <Card key={stat.label} className="border border-gray-100 shadow-sm bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <div className="size-14 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <Icon className="size-6 text-gray-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-xs font-semibold flex items-center gap-1",
                    stat.deltaPositive ? "text-green-600" : "text-red-500"
                  )}
                >
                  <span
                    className={cn(
                      "size-6 rounded-full flex items-center justify-center text-white text-[10px]",
                      stat.deltaPositive ? "bg-green-500" : "bg-red-500"
                    )}
                  >
                    {stat.deltaPositive ? "↑" : "↓"}
                  </span>
                  {stat.delta}
                </span>
                <Link
                  href={stat.href}
                  className="text-xs font-semibold text-[#4a7c59] hover:underline"
                >
                  {stat.linkLabel}
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
"use client";

import {
  Package,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StatCard } from "@/types/analytics.type";
import { usePathname } from "next/navigation";

const variantConfig = {
  package: {
    card: "bg-green-50 border-green-100",
    icon: "bg-green-500",
    delta: "text-green-600",
    label: "text-green-700",
    value: "text-green-900",
    IconEl: Package,
  },
  green: {
    card: "bg-green-50 border-green-100",
    icon: "bg-green-500",
    delta: "text-green-600",
    label: "text-green-700",
    value: "text-green-900",
    IconEl: TrendingUp,
  },
  yellow: {
    card: "bg-amber-50 border-amber-100",
    icon: "bg-amber-400",
    delta: "text-amber-600",
    label: "text-amber-700",
    value: "text-amber-900",
    IconEl: AlertTriangle,
  },
  red: {
    card: "bg-red-50 border-red-100",
    icon: "bg-red-400",
    delta: "text-red-600",
    label: "text-red-700",
    value: "text-red-900",
    IconEl: TrendingDown,
  },
  emerald: {
    card: "bg-emerald-50 border-emerald-100",
    icon: "bg-emerald-500",
    delta: "text-emerald-600",
    label: "text-emerald-700",
    value: "text-emerald-900",
    IconEl: DollarSign,
  },
};

interface AnalyticCardProps {
  cards: StatCard[];
}

export function AnalyticCard({ cards }: AnalyticCardProps) {
  const pathName = usePathname()
  const isStaff = pathName.startsWith("/staff")
  return (
    <div className={`grid grid-cols-1 ${isStaff ? "sm:grid-cols-3":"sm:grid-cols-2"}  gap-4`}>
      {cards.map((card) => {
        const cfg = variantConfig[card.variant];
        const Icon = cfg.IconEl;

        return (
          <Card key={card.label} className={cn("border shadow-sm", cfg.card)}>
            <CardContent className="flex flex-col gap-3">
              {/* top row: icon + label */}
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "size-14 rounded-full flex items-center justify-center shadow-sm",
                    cfg.icon,
                  )}
                >
                  <Icon className="size-6 text-white" />
                </div>
                <div className=" text-end">
                  <span className={cn("text-sm font-semibold", cfg.label)}>
                    {card.label}
                  </span>
                  <p
                    className={cn(
                      "text-3xl font-bold tracking-tight",
                      cfg.value,
                    )}
                  >
                    {card.value}
                  </p>
                </div>
              </div>
              <p className={cn("text-sm font-medium", cfg.delta)}>
                <span
                  className={`${card.trend === "up" ? "text-green-500" : "text-red-500"}`}
                >
                  {card.trend === "up" ? "▲" : "▼"}{" "}
                  {Math.abs(Number(card.delta))}{" "}
                </span>
                <span className="font-normal text-gray-500">
                  {card.deltaLabel}
                </span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

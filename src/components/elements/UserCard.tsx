"use client";

import { useState } from "react";
import { MoreVertical, Store, Eye, Ban, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { User, PlanType } from "@/types/superAdmin/analytics.type";

const planConfig: Record<PlanType, { label: string; className: string; dot: string }> = {
  Free: {
    label: "Free",
    className: "text-green-700 bg-green-50 border-green-200",
    dot: "bg-green-500",
  },
  Professional: {
    label: "Professional",
    className: "text-indigo-700 bg-indigo-50 border-indigo-200",
    dot: "bg-indigo-500",
  },
  Enterprise: {
    label: "Enterprise",
    className: "text-amber-700 bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
};

interface UserCardProps {
  user: User;
  onView: (user: User) => void;
  onToggleBan: (userId: string) => void;
}

export function UserCard({ user, onView, onToggleBan }: UserCardProps) {
  const plan = planConfig[user.plan];
  const isBanned = user.status === "banned";

  return (
    <div
      className={cn(
        "bg-white border rounded-2xl shadow-sm overflow-hidden transition-colors",
        isBanned ? "border-red-200 bg-red-50/30" : "border-gray-100 hover:border-gray-200"
      )}
    >
      {/* Top row */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
            🏪
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {user.name}
              </h3>
              {isBanned && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-red-600 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
                  Banned
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Store className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{user.shopName}</span>
            </div>
          </div>
        </div>

        {/* 3-dot menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 rounded-xl shadow-lg border border-gray-100">
            <DropdownMenuItem
              className="flex items-center gap-2 text-sm cursor-pointer"
              onClick={() => onView(user)}
            >
              <Eye className="w-4 h-4 text-gray-500" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(
                "flex items-center gap-2 text-sm cursor-pointer",
                isBanned
                  ? "text-green-700 focus:text-green-700 focus:bg-green-50"
                  : "text-red-600 focus:text-red-600 focus:bg-red-50"
              )}
              onClick={() => onToggleBan(user.id)}
            >
              {isBanned ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Unban
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4" />
                  Ban
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between px-5 py-3 flex-wrap gap-2">
        <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500">
          <span>
            <span className="font-semibold text-[#4a7c59]">Contact: </span>
            {user.contact}
          </span>
          <span>
            <span className="font-semibold text-[#4a7c59]">Email: </span>
            {user.email}
          </span>
        </div>

        <Badge
          variant="outline"
          className={cn("text-xs font-semibold flex items-center gap-1.5 px-3 py-1", plan.className)}
        >
          <span className={cn("w-2 h-2 rounded-full inline-block", plan.dot)} />
          {plan.label}
        </Badge>
      </div>
    </div>
  );
}
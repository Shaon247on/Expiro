"use client";

import { useState } from "react";
import { MoreVertical, UserX, ShieldOff, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StaffMember } from "@/types/staff.type";

interface StaffActionsProps {
  member: StaffMember;
}

type ActionType = "remove" | "ban" | "unban" | null;

const ACTION_CONFIG = {
  remove: {
    icon: <Trash2 size={20} className="text-red-500" />,
    iconBg: "#FFF1F2",
    title: "Remove Staff Member?",
    description: (name: string) =>
      `Are you sure you want to permanently remove "${name}" from the team? This action cannot be undone.`,
    actionLabel: "Remove",
    actionClass: "bg-red-500 hover:bg-red-600 text-white border-0",
    toastMsg: (name: string) => `"${name}" has been removed from the team.`,
  },
  ban: {
    icon: <ShieldOff size={20} className="text-orange-500" />,
    iconBg: "#FFF7ED",
    title: "Ban Staff Member?",
    description: (name: string) =>
      `Are you sure you want to ban "${name}"? They will lose access to the dashboard immediately.`,
    actionLabel: "Ban",
    actionClass: "bg-orange-500 hover:bg-orange-600 text-white border-0",
    toastMsg: (name: string) => `"${name}" has been banned.`,
  },
  unban: {
    icon: <ShieldCheck size={20} className="text-green-600" />,
    iconBg: "#F0FDF4",
    title: "Unban Staff Member?",
    description: (name: string) =>
      `Are you sure you want to unban "${name}"? They will regain access to the dashboard.`,
    actionLabel: "Unban",
    actionClass: "text-white border-0",
    actionStyle: { backgroundColor: "#3A7326" },
    toastMsg: (name: string) => `"${name}" has been unbanned.`,
  },
} as const;

export default function StaffActions({ member }: StaffActionsProps) {
  const [action, setAction] = useState<ActionType>(null);

  const isBanned = member.status === "banned";

  function handleConfirm() {
    if (!action) return;
    const cfg = ACTION_CONFIG[action];
    toast.success(cfg.toastMsg(member.name), { position: "bottom-right" });
    setAction(null);
  }

  const cfg = action ? ACTION_CONFIG[action] : null;

  return (
    <>
      {/* 3-dot trigger */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label={`Actions for ${member.name}`}
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-36 rounded-xl shadow-lg border-gray-100 p-1">
          {/* Ban / Unban */}
          {isBanned ? (
            <DropdownMenuItem
              className="flex items-center gap-2 rounded-lg text-sm cursor-pointer px-3 py-2"
              style={{ color: "#16A34A" }}
              onClick={() => setAction("unban")}
            >
              <ShieldCheck size={14} />
              <span>Unban</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="flex items-center gap-2 rounded-lg text-sm cursor-pointer px-3 py-2"
              style={{ color: "#EA580C" }}
              onClick={() => setAction("ban")}
            >
              <ShieldOff size={14} />
              <span>Ban</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="my-1" />

          {/* Remove */}
          <DropdownMenuItem
            className="flex items-center gap-2 rounded-lg text-sm cursor-pointer px-3 py-2 text-red-500 focus:text-red-500"
            onClick={() => setAction("remove")}
          >
            <UserX size={14} />
            <span>Remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation dialog */}
      <AlertDialog open={!!action} onOpenChange={(o) => { if (!o) setAction(null); }}>
        <AlertDialogContent className="rounded-3xl border-0 shadow-2xl max-w-sm">
          <AlertDialogHeader>
            {cfg && (
              <>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: cfg.iconBg }}
                >
                  {cfg.icon}
                </div>
                <AlertDialogTitle className="text-lg font-bold" style={{ color: "#1A3340" }}>
                  {cfg.title}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm" style={{ color: "#51564E" }}>
                  {cfg.description(member.name)}
                </AlertDialogDescription>
              </>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-2">
            <AlertDialogCancel
              className="h-10 rounded-xl text-sm flex-1"
              style={{ borderColor: "#D4EAC8", color: "#3A7326" }}
              onClick={() => setAction(null)}
            >
              Cancel
            </AlertDialogCancel>
            {cfg && (
              <AlertDialogAction
                onClick={handleConfirm}
                className={`h-10 rounded-xl text-sm flex-1 ${cfg.actionClass}`}
                style={"actionStyle" in cfg ? cfg.actionStyle : undefined}
              >
                {cfg.actionLabel}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
"use client";

import { useState, useTransition } from "react";
import {
  MoreVertical,
  UserX,
  ShieldOff,
  ShieldCheck,
  Trash2,
} from "lucide-react";
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
import { removeStaffAction, toggleStaffBanAction } from "@/actions/admin/staff.action";
import { StaffApiMember } from "@/types/staff.type";

interface StaffActionsProps {
  member: StaffApiMember;
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
  },
  ban: {
    icon: <ShieldOff size={20} className="text-orange-500" />,
    iconBg: "#FFF7ED",
    title: "Ban Staff Member?",
    description: (name: string) =>
      `Are you sure you want to ban "${name}"? They will lose access to the dashboard immediately.`,
    actionLabel: "Ban",
    actionClass: "bg-orange-500 hover:bg-orange-600 text-white border-0",
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
  },
} as const;

export default function StaffActions({ member }: StaffActionsProps) {
  const [action, setAction] = useState<ActionType>(null);
  const [isPending, startTransition] = useTransition();

  const isBanned = !member.is_active;

  function handleConfirm() {
    if (!action) return;

    startTransition(async () => {
      if (action === "remove") {
        const result = await removeStaffAction(member.id);

        if (!result.success) {
          toast.error("Remove failed", {
            description: result.message,
            position: "bottom-right",
          });
          return;
        }

        toast.success(result.message, {
          position: "bottom-right",
        });
        setAction(null);
        return;
      }

      const result = await toggleStaffBanAction({
        id: member.id,
        is_active: action === "unban",
      });

      if (!result.success) {
        toast.error("Action failed", {
          description: result.message,
          position: "bottom-right",
        });
        return;
      }

      toast.success(result.message, {
        position: "bottom-right",
      });
      setAction(null);
    });
  }

  const cfg = action ? ACTION_CONFIG[action] : null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0 disabled:opacity-50"
            aria-label={`Actions for ${member.name}`}
            disabled={isPending}
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-36 rounded-xl shadow-lg border-gray-100 p-1"
        >
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

          <DropdownMenuItem
            className="flex items-center gap-2 rounded-lg text-sm cursor-pointer px-3 py-2 text-red-500 focus:text-red-500"
            onClick={() => setAction("remove")}
          >
            <UserX size={14} />
            <span>Remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={!!action}
        onOpenChange={(open) => {
          if (!open && !isPending) setAction(null);
        }}
      >
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

                <AlertDialogTitle
                  className="text-lg font-bold"
                  style={{ color: "#1A3340" }}
                >
                  {cfg.title}
                </AlertDialogTitle>

                <AlertDialogDescription
                  className="text-sm"
                  style={{ color: "#51564E" }}
                >
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
              disabled={isPending}
            >
              Cancel
            </AlertDialogCancel>

            {cfg && (
              <AlertDialogAction
                onClick={handleConfirm}
                className={`h-10 rounded-xl text-sm flex-1 ${cfg.actionClass}`}
                style={"actionStyle" in cfg ? cfg.actionStyle : undefined}
                disabled={isPending}
              >
                {isPending ? "Please wait..." : cfg.actionLabel}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
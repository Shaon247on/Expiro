"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavbarSessionUser } from "@/app/layout";
import { logoutAction } from "@/actions/auth/auth.actions";

function getInitials(name: string) {
  return (
    name
      ?.trim()
      ?.split(/\s+/)
      ?.slice(0, 2)
      ?.map((part) => part[0])
      ?.join("")
      ?.toUpperCase() || "U"
  );
}

function getDashboardHref(role: NavbarSessionUser["role"]) {
  if (role === "super_admin") return "/admin/dashboard";
  if (role === "staff") return "/staff/dashboard";
  return "/dashboard";
}

export default function NavbarUserMenu({
  user,
  mobile = false,
  onAction,
}: {
  user: NavbarSessionUser;
  mobile?: boolean;
  onAction?: () => void;
}) {
  const initials = getInitials(user.name);
  const dashboardHref = getDashboardHref(user.role);

  if (mobile) {
    return (
      <div className="pt-4 flex flex-col gap-2">
        <h1>test</h1>
        <Link
          href={dashboardHref}
          onClick={onAction}
          className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1B5E35] inline-flex items-center justify-center gap-2"
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            onClick={onAction}
            className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-200 inline-flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </form>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="outline-none rounded-full ring-offset-white focus-visible:ring-2 focus-visible:ring-[#1B5E35]/30"
          aria-label="Open user menu"
        >
          <Avatar className="h-11 w-11 border border-green-100 shadow-sm cursor-pointer">
            <AvatarImage
              src={
                user.profile_image && user.profile_image !== ""
                  ? user.profile_image
                  : undefined
              }
              alt={user.name}
            />
            <AvatarFallback className="bg-[#EAF6EE] text-[#1B5E35] font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 rounded-2xl border border-green-100 shadow-xl p-2"
      >
        <div className="px-3 py-2 border-b border-gray-100 mb-1">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {user.role.replace("_", " ")}
          </p>
        </div>

        <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
          <Link href={dashboardHref} className="flex items-center gap-2">
            <LayoutDashboard size={16} className="text-[#1B5E35]" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
          <form action={logoutAction} className="w-full">
            <button
              type="submit"
              className="w-full flex items-center gap-2 text-left"
            >
              <LogOut size={16} className="text-red-500" />
              Logout
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

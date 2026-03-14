"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Bell,
  Users,
  Settings,
  User,
  Tag,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ComponentType<{
    size?: number;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  href: string;
  badge?: number;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { label: "Home", icon: LayoutDashboard, href: "/dashboard", exact: true },
  { label: "Products", icon: Package, href: "/dashboard/products" },
  { label: "Alerts", icon: Bell, href: "/dashboard/alerts", badge: 1 },
  { label: "Staff", icon: Users, href: "/dashboard/staff" },
  { label: "Category", icon: Tag, href: "/dashboard/category" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const superAdminNav: NavItem[] = [
  { label: "Home", icon: LayoutDashboard, href: "/admin/dashboard", exact: true },
  { label: "User", icon: User, href: "/admin/dashboard/user" },
  { label: "Settings", icon: Settings, href: "/admin/dashboard/settings" },
];

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SidebarNavLinks() {
  const pathname = usePathname();

  const currentNavItems = pathname.startsWith("/admin")
    ? superAdminNav
    : pathname.startsWith("/dashboard")
    ? navItems
    : [];

  return (
    <nav
      className="flex-1 flex flex-col gap-1 min-h-0"
      aria-label="Main navigation"
    >
      {currentNavItems.map(({ label, icon: Icon, href, badge, exact }) => {
        const active = isActive(pathname, href, exact);

        return (
          <Link
            key={label}
            href={href}
            aria-current={active ? "page" : undefined}
            className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            style={{
              backgroundColor: active ? "#EEF3EA" : "transparent",
              color: active ? "#3A7326" : "#51564E",
            }}
          >
            <Icon size={18} aria-hidden="true" />
            {label}

            {badge != null && (
              <span
                className="ml-auto flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ backgroundColor: "#3A7326", color: "white" }}
                aria-label={`${badge} unread`}
              >
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
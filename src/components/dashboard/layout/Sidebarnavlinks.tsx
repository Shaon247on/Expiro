"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Bell,
  BarChart2,
  Users,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" | "false" }>;
  href: string;
  badge?: number;
  /** If true, only match exact path (not prefix) */
  exact?: boolean;
}

const navItems: NavItem[] = [
  { label: "Home",      icon: LayoutDashboard, href: "/dashboard",            exact: true },
  { label: "Products",  icon: Package,         href: "/dashboard/products" },
  { label: "Alerts",    icon: Bell,            href: "/dashboard/alerts",     badge: 1 },
  { label: "Analytics", icon: BarChart2,       href: "/dashboard/analytics" },
  { label: "Staff",     icon: Users,           href: "/dashboard/staff" },
  { label: "Settings",  icon: Settings,        href: "/dashboard/settings" },
];

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SidebarNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 flex flex-col gap-1 min-h-0" aria-label="Main navigation">
      {navItems.map(({ label, icon: Icon, href, badge, exact }) => {
        const active = isActive(pathname, href, exact);
        return (
          <Link
            key={label}
            href={href}
            aria-current={active ? "page" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative"
            style={{
              backgroundColor: active ? "#EEF3EA" : "transparent",
              color: active ? "#3A7326" : "#51564E",
            }}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
            {badge != null && (
              <span
                className="ml-auto text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
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
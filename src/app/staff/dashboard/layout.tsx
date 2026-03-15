
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { ReactNode } from "react";

export const metadata = {
  title: "Dashboard — Expiro",
  description: "Expiry management dashboard",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 
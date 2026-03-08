
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./Topnavbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#FCFCFC]">
      {/* ── Desktop Sidebar (always visible lg+) ── */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:z-30">
        <Sidebar />
      </div>

      {/* ── Main column ── */}
      <div className="flex flex-col flex-1 min-w-0 lg:pl-64">
        {/* TopNavbar contains the mobile hamburger + Sheet; it's a client component */}
        <TopNavbar />

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
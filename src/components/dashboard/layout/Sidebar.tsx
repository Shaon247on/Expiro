import { LogOut } from "lucide-react";
import SidebarNavLinks from "./Sidebarnavlinks";
import AddProductCard from "./Addproductcard";
import ExpiroLogo from "@/components/elements/Logo";
import SellProductCard from "./SellProductCard";

export default function Sidebar() {
  return (
    <aside
      className="flex h-full w-64 flex-col overflow-hidden bg-white px-4 py-6"
      style={{ borderRight: "1px solid #f0f0f0" }}
    >
      {/* Logo */}
      <div className="mb-6 shrink-0">
        <ExpiroLogo />
      </div>

      {/* Nav links */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <SidebarNavLinks />
      </div>

      {/* Bottom actions */}
      <div className="mt-4 shrink-0 space-y-3 border-t border-gray-100 pt-4">
        <AddProductCard />
        <SellProductCard />

        <button
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100"
          style={{ color: "#51564E" }}
          aria-label="Log out"
        >
          <LogOut size={18} aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
}

import { LogOut } from "lucide-react";
import SidebarNavLinks from "./Sidebarnavlinks";
import AddProductCard from "./Addproductcard";
import ExpiroLogo from "@/components/elements/Logo";

export default function Sidebar() {
  return (
    <aside
      className="flex flex-col h-full w-64 py-6 px-4 bg-white"
      style={{ borderRight: "1px solid #f0f0f0" }}
    >
      {/* ── Logo ── */}
      <div className="w-full mb-6">
        <ExpiroLogo/>
      </div>

      {/* ── Nav links (client — needs usePathname) ── */}
      <SidebarNavLinks />

      {/* ── Add Product card (client — opens drawer) ── */}
      <div className="my-4 shrink-0">
        <AddProductCard />
      </div>

      {/* ── Logout ── */}
      <button
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-colors hover:bg-gray-100 shrink-0"
        style={{ color: "#51564E" }}
        aria-label="Log out"
      >
        <LogOut size={18} aria-hidden="true" />
        Logout
      </button>
    </aside>
  );
}
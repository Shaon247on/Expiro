
import { LogOut } from "lucide-react";
import SidebarNavLinks from "./Sidebarnavlinks";
import AddProductCard from "./Addproductcard";

export default function Sidebar() {
  return (
    <aside
      className="flex flex-col h-full w-64 py-6 px-4 bg-white"
      style={{ borderRight: "1px solid #f0f0f0" }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-2 mb-8 flex-shrink-0">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#D4EAC8" }}
        >
          {/* Inline SVG avoids any client-side import cost */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="#3A7326" strokeWidth="1.8" fill="none" />
            <path
              d="M7 11l3 3 5-5"
              stroke="#3A7326"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold text-base leading-tight" style={{ color: "#3A7326" }}>
            expiro
          </p>
          <p className="text-[10px] leading-tight" style={{ color: "#51564E" }}>
            La traçabilité qui
            <br />
            anticipe vos DLC
          </p>
        </div>
      </div>

      {/* ── Nav links (client — needs usePathname) ── */}
      <SidebarNavLinks />

      {/* ── Add Product card (client — opens drawer) ── */}
      <div className="my-4 flex-shrink-0">
        <AddProductCard />
      </div>

      {/* ── Logout ── */}
      <button
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-colors hover:bg-gray-100 flex-shrink-0"
        style={{ color: "#51564E" }}
        aria-label="Log out"
      >
        <LogOut size={18} aria-hidden="true" />
        Logout
      </button>
    </aside>
  );
}
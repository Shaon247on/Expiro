// Server Component — static markup; only the mobile sheet trigger is a client island.
import { Search } from "lucide-react";
import MobileMenuTrigger from "./Mobilemenutrigge";
import NotificationDropdown from "./Notificationdropdow";
import Link from "next/link";
import SettingNav from "./SettingNav";

export default function TopNavbar() {
  console.log("testing")
  return (
    <header
      className="sticky shadow top-0 z-20 flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16 bg-white shrink-0"
      style={{ borderBottom: "1px solid #f0f0f0" }}
    >
      {/* Mobile hamburger (client island) */}
      <div className="lg:hidden shrink-0">
        <MobileMenuTrigger />
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <input
          type="search"
          placeholder="Search here"
          aria-label="Search"
          className="w-full h-10 pl-4 pr-10 rounded-2xl border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
        />
        <Search
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 shrink-0 ml-auto">
        {/* Notification bell (client — needs dropdown state) */}
        <NotificationDropdown />

        {/* Settings icon with badge */}
        <SettingNav />
        <div className="relative"></div>
        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" aria-hidden="true" />

        {/* Greeting + avatar */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 hidden sm:inline">
            Hello, <span className="font-semibold text-gray-800">Mohammad</span>
          </span>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: "#3A7326" }}
            aria-label="Mohammad's avatar"
          >
            M
          </div>
        </div>
      </div>
    </header>
  );
}

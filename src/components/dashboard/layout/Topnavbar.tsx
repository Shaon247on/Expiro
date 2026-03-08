// Server Component — static markup; only the mobile sheet trigger is a client island.
import { Search } from "lucide-react";
import MobileMenuTrigger from "./Mobilemenutrigge";
import NotificationDropdown from "./Notificationdropdow";

export default function TopNavbar() {
  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16 bg-white shrink-0"
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
        <div className="relative">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center bg-pink-50 hover:bg-pink-100 transition-colors"
            aria-label="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                stroke="#EC4899"
                strokeWidth="1.8"
                fill="none"
              />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                stroke="#EC4899"
                strokeWidth="1.8"
                fill="none"
              />
            </svg>
          </button>
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
            style={{ backgroundColor: "#EC4899", color: "white" }}
            aria-label="9 notifications"
          >
            9
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" aria-hidden="true" />

        {/* Greeting + avatar */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 hidden sm:inline">
            Hello,{" "}
            <span className="font-semibold text-gray-800">Mohammad</span>
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
"use client";

import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: number;
  icon: string;
  message: string;
  time: string;
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: 1, icon: "🥛", message: "Organic Milk 1L is expiring in 3 days.", time: "2 min ago",  read: false },
  { id: 2, icon: "🐟", message: "Fresh Salmon Fillet — low stock alert.",  time: "15 min ago", read: false },
  { id: 3, icon: "🧀", message: "Greek Yogurt passed expiry inspection.",  time: "1 hr ago",   read: true  },
  { id: 4, icon: "🥚", message: "Organic Eggs batch added successfully.",  time: "3 hr ago",   read: true  },
  { id: 5, icon: "🍞", message: "Fresh Bread marked for removal.",         time: "Yesterday",  read: true  },
  { id: 6, icon: "🍫", message: "Chocolate Milk 1L — Remove from shelf.",  time: "Yesterday",  read: true  },
];

const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

export default function NotificationDropdown() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative w-9 h-9 rounded-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors"
          aria-label={`${unreadCount} unread notifications`}
        >
          <Bell size={18} style={{ color: "#3B82F6" }} aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
              style={{ backgroundColor: "#3B82F6", color: "white" }}
              aria-hidden="true"
            >
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-0 rounded-2xl shadow-xl border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-800">Notifications</h3>
          {unreadCount > 0 && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#EEF3EA", color: "#3A7326" }}
            >
              {unreadCount} new
            </span>
          )}
        </div>

        {/* List */}
        <ScrollArea className="h-72">
          {NOTIFICATIONS.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-gray-400">
              <Bell size={28} className="mb-2 opacity-40" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <ul className="py-1">
              {NOTIFICATIONS.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ backgroundColor: n.read ? "transparent" : "#F8FDF6" }}
                >
                  <span className="text-xl leading-none shrink-0 mt-0.5" aria-hidden="true">
                    {n.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs leading-snug ${n.read ? "text-gray-600" : "text-gray-800 font-medium"}`}>
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: "#3A7326" }}
                      aria-label="Unread"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-2.5">
          <button
            className="text-xs font-semibold w-full text-center hover:underline transition-all"
            style={{ color: "#3A7326" }}
          >
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import {
  NOTIFICATION_TYPE_META,
  type NotificationType,
} from "@/types/notification.type";

const ALL_TYPES: NotificationType[] = [
  "open_item",
  "low_stock",
  "expiring_soon",
  "urgent",
];

interface NotificationStatusFilterProps {
  currentStatus: string;
}

export default function NotificationStatusFilter({
  currentStatus,
}: NotificationStatusFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function select(value: string) {
    setOpen(false);
    const params = new URLSearchParams();

    if (value && value !== "all") {
      params.set("status", value);
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  const isFiltered = !!currentStatus;
  const activeMeta = currentStatus
    ? NOTIFICATION_TYPE_META[currentStatus as NotificationType]
    : null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 h-9 px-4 rounded-xl border text-sm font-medium transition-colors hover:bg-gray-50"
        style={{
          borderColor: isFiltered ? "#3A7326" : "#e5e7eb",
          color: isFiltered ? "#3A7326" : "#374151",
          backgroundColor: isFiltered ? "#EEF3EA" : "white",
        }}
      >
        {activeMeta && (
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: activeMeta.dot }}
          />
        )}

        {isFiltered ? activeMeta?.label : "All Status"}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul className="absolute right-0 mt-2 z-20 w-48 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden py-1">
            <li
              onClick={() => select("all")}
              className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ color: !isFiltered ? "#3A7326" : "#374151" }}
            >
              <span>All Status</span>
              {!isFiltered && <Check size={13} style={{ color: "#3A7326" }} />}
            </li>

            <div className="border-t border-gray-100 my-1" />

            {ALL_TYPES.map((type) => {
              const meta = NOTIFICATION_TYPE_META[type];
              const active = currentStatus === type;

              return (
                <li
                  key={type}
                  onClick={() => select(type)}
                  className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ color: active ? "#3A7326" : "#374151" }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: meta.dot }}
                    />
                    {meta.label}
                  </div>
                  {active && <Check size={13} style={{ color: "#3A7326" }} />}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
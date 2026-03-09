"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react"
import { ProductStatus } from "@/types/product.type";

const ALL_STATUSES: ProductStatus[] = [
  "Urgent",
  "Expiring soon",
  "Safe Item",
  "Remove Item",
  "Open Item",
];

const statusDot: Record<ProductStatus, string> = {
  "Urgent":        "#E11D48",
  "Expiring soon": "#EA580C",
  "Safe Item":     "#16A34A",
  "Remove Item":   "#E11D48",
  "Open Item":     "#16A34A",
};

interface StatusFilterProps {
  currentStatus: string; // "" = All Status
}

export default function StatusFilter({ currentStatus }: StatusFilterProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function select(value: string) {
    setOpen(false);
    const params = new URLSearchParams();
    if (value) params.set("status", value);
    // Reset to page 1 whenever filter changes
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  const label = currentStatus || "All Status";
  const isFiltered = !!currentStatus;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Filter by status"
        className="flex items-center gap-2 h-9 px-4 rounded-xl border text-sm font-medium transition-colors hover:bg-gray-50"
        style={{
          borderColor: isFiltered ? "#3A7326" : "#e5e7eb",
          color: isFiltered ? "#3A7326" : "#374151",
          backgroundColor: isFiltered ? "#EEF3EA" : "white",
        }}
      >
        {/* Active dot */}
        {isFiltered && (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: statusDot[currentStatus as ProductStatus] }}
            aria-hidden="true"
          />
        )}
        {label}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          {/* Backdrop — click outside to close */}
          <div
            className="fixed inset-0 z-10"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <ul
            role="listbox"
            aria-label="Status options"
            className="absolute right-0 mt-2 z-20 w-44 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden py-1"
          >
            {/* "All Status" option */}
            <li
              role="option"
              aria-selected={!isFiltered}
              onClick={() => select("")}
              className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ color: !isFiltered ? "#3A7326" : "#374151" }}
            >
              <span>All Status</span>
              {!isFiltered && <Check size={13} style={{ color: "#3A7326" }} aria-hidden="true" />}
            </li>

            <div className="border-t border-gray-100 my-1" />

            {ALL_STATUSES.map((s) => {
              const active = currentStatus === s;
              return (
                <li
                  key={s}
                  role="option"
                  aria-selected={active}
                  onClick={() => select(s)}
                  className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ color: active ? "#3A7326" : "#374151" }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: statusDot[s] }}
                      aria-hidden="true"
                    />
                    {s}
                  </div>
                  {active && <Check size={13} style={{ color: "#3A7326" }} aria-hidden="true" />}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
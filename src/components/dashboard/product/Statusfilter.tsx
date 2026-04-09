"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { PRODUCT_STATUS_LABELS, PRODUCT_STATUS_META, type ProductBusinessStatus } from "@/types/product.type";

const ALL_STATUSES = Object.keys(PRODUCT_STATUS_LABELS) as ProductBusinessStatus[];

interface StatusFilterProps {
  currentStatus: string;
}

export default function StatusFilter({ currentStatus }: StatusFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function select(value: string) {
    setOpen(false);
    const params = new URLSearchParams();
    if (value) params.set("status", value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  const label = currentStatus
    ? PRODUCT_STATUS_LABELS[currentStatus as ProductBusinessStatus]
    : "All Status";

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
        {isFiltered && (
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              backgroundColor:
                PRODUCT_STATUS_META[currentStatus as ProductBusinessStatus].dot,
            }}
          />
        )}
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            className="absolute right-0 mt-2 z-20 w-48 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden py-1"
          >
            <li
              role="option"
              aria-selected={!isFiltered}
              onClick={() => select("")}
              className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ color: !isFiltered ? "#3A7326" : "#374151" }}
            >
              <span>All Status</span>
              {!isFiltered && <Check size={13} style={{ color: "#3A7326" }} />}
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
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: PRODUCT_STATUS_META[s].dot }}
                    />
                    {PRODUCT_STATUS_LABELS[s]}
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
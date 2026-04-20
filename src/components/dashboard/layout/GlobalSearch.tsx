"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  Package,
  Users,
  UserCog,
  LayoutGrid,
} from "lucide-react";
import { globalSearchAction } from "@/actions/common/global-search.action";
import type {
  GlobalSearchResultItem,
  GlobalSearchResultType,
} from "@/types/globalSearch.type";

type UserRole = "admin" | "staff" | "super_admin";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function getResultHref(
  item: GlobalSearchResultItem,
  role: UserRole,
  search: string
) {
  const query = `?search=${encodeURIComponent(search)}`;

  switch (item.type) {
    case "product":
      return role === "staff"
        ? `/staff/dashboard/products${query}`
        : `/dashboard/products${query}`;

    case "category":
      return role === "staff"
        ? `/staff/dashboard/category${query}`
        : `/dashboard/category${query}`;

    case "staff":
      return `/dashboard/staff${query}`;

    case "user":
      return `/admin/dashboard/user${query}`;

    default:
      return "#";
  }
}

function getTypeMeta(type: GlobalSearchResultType) {
  switch (type) {
    case "product":
      return {
        label: "Product",
        icon: Package,
        iconColor: "#2563EB",
        bg: "#EFF6FF",
      };
    case "staff":
      return {
        label: "Staff",
        icon: UserCog,
        iconColor: "#7C3AED",
        bg: "#F5F3FF",
      };
    case "user":
      return {
        label: "User",
        icon: Users,
        iconColor: "#EA580C",
        bg: "#FFF7ED",
      };
    case "category":
      return {
        label: "Category",
        icon: LayoutGrid,
        iconColor: "#16A34A",
        bg: "#F0FDF4",
      };
    default:
      return {
        label: "Result",
        icon: Search,
        iconColor: "#6B7280",
        bg: "#F9FAFB",
      };
  }
}

interface GlobalSearchProps {
  role: UserRole;
}

export default function GlobalSearch({ role }: GlobalSearchProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef(0);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResultItem[]>([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 400);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (!trimmed) {
      return;
    }

    let cancelled = false;
    const currentRequestId = ++requestRef.current;

    async function runSearch() {
      setLoading(true);

      const result = await globalSearchAction(trimmed);

      if (cancelled || currentRequestId !== requestRef.current) {
        return;
      }

      if (!result.success) {
        setResults([]);
        setError(result.message);
        setOpen(true);
        setLoading(false);
        return;
      }

      setResults(result.data);
      setError("");
      setOpen(true);
      setLoading(false);
    }

    void runSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const showDropdown = useMemo(
    () => open && query.trim().length > 0,
    [open, query]
  );

  function handleInputChange(value: string) {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      setError("");
      setOpen(false);
      setLoading(false);
      return;
    }

    setOpen(true);
  }

  function handleSelect(item: GlobalSearchResultItem) {
    const trimmed = query.trim();
    if (!trimmed) return;

    const href = getResultHref(item, role, trimmed);

    setOpen(false);
    setQuery("");
    setResults([]);
    setError("");

    router.push(href);
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl min-w-0">
      <input
        type="search"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (query.trim()) {
            setOpen(true);
          }
        }}
        placeholder="Search here"
        aria-label="Search"
        className="w-full h-10 pl-4 pr-10 rounded-2xl border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
      />

      {loading ? (
        <Loader2
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
          aria-hidden="true"
        />
      ) : (
        <Search
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {showDropdown && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          {error ? (
            <div className="px-4 py-3 text-sm text-red-500">{error}</div>
          ) : loading ? (
            <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found.
            </div>
          ) : (
            <ul className="max-h-[360px] overflow-y-auto">
              {results.map((item) => {
                const meta = getTypeMeta(item.type);
                const Icon = meta.icon;

                return (
                  <li key={`${item.type}-${item.id}`}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                        style={{ backgroundColor: meta.bg }}
                      >
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon size={18} style={{ color: meta.iconColor }} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {item.name}
                          </p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase">
                            {meta.label}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-3 flex-wrap text-xs text-gray-500">
                          {item.category ? <span>{item.category}</span> : null}
                          {item.price ? <span>${item.price}</span> : null}
                          {typeof item.quantity === "number" ? (
                            <span>Qty: {item.quantity}</span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
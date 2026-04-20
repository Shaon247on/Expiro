"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

export default function ClearSearchButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  if (!search) return null;

  function handleClear() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page"); // optional: reset pagination too after clearing search

    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(nextUrl);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClear}
      className="h-10 px-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2 shrink-0"
      aria-label="Clear search"
      title="Clear search"
    >
      <X size={16} />
      <span className="hidden sm:inline">Clear</span>
    </button>
  );
}
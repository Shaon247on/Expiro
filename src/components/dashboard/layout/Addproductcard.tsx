"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddProductDrawer from "./AddProductDrawer";
import { usePathname } from "next/navigation";

export default function AddProductCard() {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
  const isSuperAdmin = pathName.startsWith("/admin");

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-xl p-3 sm:rounded-2xl sm:p-4 ${
          isSuperAdmin ? "hidden" : ""
        }`}
        style={{ backgroundColor: "#3A7326" }}
      >
        <span
          className="absolute right-2 top-2 inline-block select-none rounded px-1.5 py-0.5 text-[9px] font-extrabold italic tracking-wide sm:right-3 sm:top-3 sm:px-2 sm:text-[10px]"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1.5px solid rgba(255,255,255,0.3)",
            transform: "rotate(6deg)",
          }}
          aria-label="New feature"
        >
          NEW
        </span>

        <p
          className="mb-3 pr-7 text-[11px] leading-relaxed sm:mb-4 sm:pr-8 sm:text-xs"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Please, organize your menus through button below!
        </p>

        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors hover:opacity-90 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
          aria-label="Open Add Product drawer"
        >
          <Plus
            size={14}
            aria-hidden="true"
            className="sm:h-3.75 sm:w-3.75"
          />
          Add Product
        </button>
      </div>

      <AddProductDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddProductDrawer from "./AddProductDrawer";
import { usePathname } from "next/navigation";

export default function AddProductCard() {
  const [open, setOpen] = useState(false);
 const pathName = usePathname()
 const isSuperAdmin = pathName.startsWith("/admin")
  return (
    <>
      <div
        className={`relative rounded-2xl p-4 overflow-hidden ${isSuperAdmin ? "hidden":""}`}
        style={{ backgroundColor: "#3A7326" }}
      >
        {/* NEW badge */}
        <span
          className="absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded italic tracking-wide select-none"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1.5px solid rgba(255,255,255,0.3)",
            display: "inline-block",
            transform: "rotate(6deg)",
          }}
          aria-label="New feature"
        >
          NEW
        </span>

        <p className="text-xs leading-relaxed mb-4 pr-8" style={{ color: "rgba(255,255,255,0.85)" }}>
          Please, organize your menus through button below!
        </p>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90 w-full justify-center"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
          aria-label="Open Add Product drawer"
        >
          <Plus size={15} aria-hidden="true" />
          Add Product
        </button>
      </div>

      <AddProductDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
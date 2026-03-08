"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

export default function MobileMenuTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={20} className="text-gray-600" aria-hidden="true" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64" aria-label="Navigation menu">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>
    </>
  );
}
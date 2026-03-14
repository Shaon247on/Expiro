"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { LayoutGrid } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/category.type";
import CategoryActions from "./CategoryActions";

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

// ── Avatar ─────────────────────────────────────────────────────────────────────

const AVATAR_BG = [
  "#EEF3EA", "#E8F4FD", "#FEF3C7", "#F0FDF4",
  "#FDF2F8", "#F0F9FF", "#FFF7ED", "#F5F3FF",
];
const AVATAR_TEXT = [
  "#3A7326", "#1D6FA4", "#B45309", "#15803D",
  "#9D174D", "#0369A1", "#C2410C", "#6D28D9",
];

function CategoryAvatar({ category, index }: { category: Category; index: number }) {
  const bg   = AVATAR_BG[index % AVATAR_BG.length];
  const text = AVATAR_TEXT[index % AVATAR_TEXT.length];
  const initials = category.name.slice(0, 2).toUpperCase();

  if (category.image) {
    return (
      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-100">
        <Image src={category.image} alt={category.name} width={40} height={40} className="object-cover w-full h-full" />
      </div>
    );
  }
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
      style={{ backgroundColor: bg, color: text }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface CategoryTableProps {
  categories: Category[];
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function CategoryTable({ categories: initial }: CategoryTableProps) {
  const [items, setItems] = useState<Category[]>(initial);

  const handleDelete = useCallback((id: string) => {
    setItems((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleUpdate = useCallback((updated: Category) => {
    setItems((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-white rounded-2xl border border-gray-100">
        <LayoutGrid size={40} className="mb-3 opacity-25" aria-hidden="true" />
        <p className="text-sm">No categories found.</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop Table ────────────────────────────────────────────────── */}
      <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b border-gray-100 hover:bg-gray-50/80">
              <TableHead
                className="text-[11px] font-semibold uppercase tracking-wider w-12 text-center"
                style={{ color: "#51564E" }}
              >
                No.
              </TableHead>
              <TableHead
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "#51564E" }}
              >
                Category
              </TableHead>
              <TableHead
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "#51564E" }}
              >
                Products
              </TableHead>
              <TableHead
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "#51564E" }}
              >
                Created
              </TableHead>
              <TableHead
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "#51564E" }}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((cat, idx) => (
              <TableRow
                key={cat.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors"
              >
                {/* No. */}
                <TableCell className="text-center">
                  <span className="text-[12px] font-medium text-gray-400 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </TableCell>

                {/* Image + Name */}
                <TableCell>
                  <div className="flex items-center gap-3 min-w-0">
                    <CategoryAvatar category={cat} index={idx} />
                    <span className="text-[13px] font-semibold truncate" style={{ color: "#1F485B" }}>
                      {cat.name}
                    </span>
                  </div>
                </TableCell>

                {/* Project count */}
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="rounded-full text-[11px] font-semibold px-2.5"
                    style={{ backgroundColor: "#EEF3EA", color: "#3A7326", border: "none" }}
                  >
                    {cat.projectCount} {cat.projectCount === 1 ? "product" : "products"}
                  </Badge>
                </TableCell>

                {/* Created at */}
                <TableCell className="text-[12px] font-medium text-gray-400 tabular-nums">
                  {formatDate(cat.createdAt)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <CategoryActions
                    category={cat}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Mobile Cards ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:hidden">
        {items.map((cat, idx) => (
          <Card
            key={cat.id}
            className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Top row */}
              <div className="flex items-center gap-3 px-4 py-4">
                {/* No. chip */}
                <span
                  className="text-[11px] font-bold tabular-nums shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#EEF3EA", color: "#3A7326" }}
                >
                  {idx + 1}
                </span>

                <CategoryAvatar category={cat} index={idx} />

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold truncate" style={{ color: "#1F485B" }}>
                    {cat.name}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(cat.createdAt)}</p>
                </div>

                <CategoryActions
                  category={cat}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              </div>

              {/* Bottom strip */}
              <div
                className="flex items-center gap-2 px-4 py-2.5 border-t text-xs"
                style={{ borderColor: "#F5F5F5", backgroundColor: "#FAFAFA" }}
              >
                <span className="font-semibold" style={{ color: "#3A7326" }}>Projects: </span>
                <span className="text-gray-600">{cat.projectCount}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
"use client";

import { useState } from "react";
import {
  MoreVertical,
  Pencil,
  Eye,
  Trash2,
  X,
  Upload,
  ScanLine,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Product } from "@/types/product.type";
import { statusMeta } from "@/data/productData";
import Image from "next/image";

// ── Edit schema (mirrors AddProductDrawer) ────────────────────────────────────
const editSchema = z
  .object({
    categoryType: z.string().min(1, "Category is required."),
    itemName: z.string().min(2, "At least 2 characters."),
    barcode: z.string().optional(),
    quantity: z.coerce.number().min(1, "Must be at least 1."),
    datePurchased: z.string().min(1, "Required."),
    dateExpire: z.string().min(1, "Required."),
    openExpiryDays: z.coerce.number().min(0).optional().or(z.literal("")),
    storeName: z.string().min(2, "At least 2 characters."),
    price: z.coerce.number().min(0, "Must be 0 or more."),
    description: z.string().max(300).optional(),
  })
  .refine(
    (d) =>
      !d.datePurchased ||
      !d.dateExpire ||
      new Date(d.dateExpire) > new Date(d.datePurchased),
    {
      message: "Expiry date must be after purchase date.",
      path: ["dateExpire"],
    },
  );

type EditValues = z.infer<typeof editSchema>;

const CATEGORIES = [
  "Daily",
  "Bakery",
  "Meat",
  "Seafood",
  "Dairy",
  "Frozen",
  "Beverages",
  "Other",
];

const inputCls =
  "bg-white border border-gray-200 rounded-xl h-10 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400";
const labelStyle = { color: "#3A7326" };
const labelCls = "text-xs font-semibold mb-1.5";

// ── Helpers ───────────────────────────────────────────────────────────────────
function toIso(ddmmyyyy: string): string {
  const [d, m, y] = (ddmmyyyy ?? "").split("/");
  if (!d || !m || !y) return "";
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

// ── Barcode SVG generator (Code128-style visual, no library needed) ───────────
// Encodes each character as a deterministic pattern of bars using charCode bits.
// Produces a realistic-looking barcode SVG purely from the string.
function BarcodeImage({
  code,
  width = 340,
  height = 80,
}: {
  code: string;
  width?: number;
  height?: number;
}) {
  if (!code) return null;

  // Build bar pattern: quiet zone + start bars + data bars + stop bars + quiet zone
  const BAR_NARROW = 2;
  const BAR_WIDE = 4;
  const QUIET = 12;

  // Code128 B subset — simplified bar widths (each char → 6 elements: 3 bars + 3 spaces)
  // Using charCode to derive a unique 6-module pattern per character
  function charBars(char: string): number[] {
    const c = char.charCodeAt(0) - 32; // Code128B offset
    // Derive 6 widths from the char value (sum = 11 modules: 3 bars + 3 spaces + check)
    const patterns = [
      [2, 1, 2, 2, 2, 2],
      [2, 2, 2, 1, 2, 2],
      [2, 2, 2, 2, 2, 1],
      [1, 2, 1, 2, 2, 3],
      [1, 2, 1, 3, 2, 2],
      [1, 3, 1, 2, 2, 2],
      [1, 2, 2, 2, 1, 3],
      [1, 2, 2, 3, 1, 2],
      [1, 3, 2, 2, 1, 2],
      [2, 2, 1, 2, 1, 3],
      [2, 2, 1, 3, 1, 2],
      [2, 3, 1, 2, 1, 2],
      [1, 1, 2, 2, 3, 2],
      [1, 2, 2, 1, 3, 2],
      [1, 2, 2, 2, 3, 1],
      [1, 1, 3, 2, 2, 2],
      [1, 2, 3, 1, 2, 2],
      [1, 2, 3, 2, 2, 1],
      [2, 2, 3, 2, 1, 1],
      [2, 2, 1, 1, 3, 2],
      [2, 2, 1, 2, 3, 1],
      [2, 1, 3, 2, 1, 2],
      [2, 2, 3, 1, 1, 2],
      [3, 1, 2, 1, 3, 1],
      [3, 1, 1, 2, 2, 2],
      [3, 2, 1, 1, 2, 2],
      [3, 2, 1, 2, 2, 1],
      [3, 1, 2, 2, 1, 2],
      [3, 2, 2, 1, 1, 2],
      [3, 2, 2, 2, 1, 1],
      [2, 1, 2, 1, 2, 3],
      [2, 1, 2, 3, 2, 1],
      [2, 3, 2, 1, 2, 1],
      [1, 1, 1, 3, 2, 3],
      [1, 3, 1, 1, 3, 2],
      [1, 3, 1, 3, 1, 2],
      [1, 1, 2, 3, 1, 3],
      [1, 3, 2, 1, 1, 3],
      [2, 1, 3, 1, 1, 3],
      [1, 1, 3, 3, 2, 1],
      [1, 3, 3, 1, 2, 1],
      [2, 1, 1, 3, 3, 1],
      [2, 3, 1, 1, 3, 1],
      [1, 1, 2, 1, 3, 3],
      [1, 1, 3, 1, 2, 3],
      [3, 1, 1, 1, 2, 3],
      [1, 3, 1, 1, 2, 3],
      [1, 1, 2, 3, 3, 1],
      [1, 3, 2, 3, 1, 1],
      [2, 1, 3, 3, 1, 1],
      [2, 1, 1, 1, 3, 3],
      [3, 2, 1, 3, 1, 1],
      [2, 3, 1, 3, 1, 1],
      [2, 3, 3, 1, 1, 1],
      [1, 1, 3, 1, 3, 2],
      [1, 1, 3, 2, 3, 1],
      [3, 1, 3, 1, 1, 2],
      [3, 1, 3, 1, 2, 1],
      [3, 1, 3, 2, 1, 1],
      [3, 3, 1, 1, 2, 1],
      [3, 3, 1, 2, 1, 1],
      [3, 3, 2, 1, 1, 1],
      [3, 1, 1, 3, 1, 2],
      [3, 1, 2, 3, 1, 1],
      [3, 1, 1, 1, 3, 2],
      [3, 1, 2, 1, 3, 1],
      [1, 1, 3, 2, 1, 3],
      [1, 2, 3, 1, 3, 1],
      [2, 1, 3, 2, 1, 2],
      [2, 3, 2, 1, 1, 2],
      [2, 1, 2, 2, 3, 1],
      [3, 1, 1, 2, 3, 1],
      [2, 2, 1, 3, 2, 1],
      [2, 2, 3, 1, 1, 2],
      [2, 2, 2, 3, 1, 1],
      [1, 1, 3, 2, 2, 2],
      [2, 2, 3, 2, 1, 1],
      [3, 2, 2, 1, 2, 1],
      [3, 1, 2, 2, 2, 1],
      [1, 2, 2, 3, 2, 1],
      [2, 1, 2, 3, 1, 2],
      [3, 2, 1, 2, 1, 2],
      [1, 1, 1, 1, 4, 3],
      [1, 1, 1, 3, 4, 1],
      [1, 3, 1, 1, 4, 1],
      [1, 1, 4, 1, 1, 3],
      [1, 1, 4, 3, 1, 1],
      [4, 1, 1, 1, 1, 3],
      [4, 1, 1, 3, 1, 1],
      [1, 1, 3, 1, 4, 1],
      [1, 1, 4, 1, 3, 1],
      [3, 1, 1, 1, 4, 1],
      [4, 1, 1, 1, 3, 1],
      [2, 1, 1, 4, 1, 2],
      [2, 1, 1, 2, 1, 4],
      [2, 1, 1, 4, 2, 1],
      [2, 2, 1, 1, 1, 4],
    ];
    const idx = ((c % patterns.length) + patterns.length) % patterns.length;
    return patterns[idx];
  }

  // Start bar (Code128B): [2,1,1,4,1,2]
  const startBars = [2, 1, 1, 4, 1, 2];
  // Stop bar: [2,3,3,1,1,1,2]
  const stopBars = [2, 3, 3, 1, 1, 1, 2];

  // Collect all bar widths
  const allBars: { w: number; isBar: boolean }[] = [];

  // Quiet zone left
  allBars.push({ w: QUIET, isBar: false });

  // Start
  startBars.forEach((w, i) =>
    allBars.push({ w: w * BAR_NARROW, isBar: i % 2 === 0 }),
  );

  // Data chars
  for (const ch of code) {
    charBars(ch).forEach((w, i) =>
      allBars.push({ w: w * BAR_NARROW, isBar: i % 2 === 0 }),
    );
  }

  // Stop
  stopBars.forEach((w, i) =>
    allBars.push({ w: w * BAR_NARROW, isBar: i % 2 === 0 }),
  );

  // Quiet zone right
  allBars.push({ w: QUIET, isBar: false });

  // Calculate total width and scale to fit
  const rawWidth = allBars.reduce((acc, b) => acc + b.w, 0);
  const scale = width / rawWidth;

  let x = 0;
  const rects: { x: number; w: number }[] = [];
  for (const bar of allBars) {
    const bw = bar.w * scale;
    if (bar.isBar) rects.push({ x, w: bw });
    x += bw;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-label={`Barcode for ${code}`}
      role="img"
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={0} width={r.w} height={height} fill="#111" />
      ))}
    </svg>
  );
}

// ── Inventory history timeline ─────────────────────────────────────────────────
const HISTORY_STEPS = [
  "Safe Item",
  "Open Item",
  "Urgent Store",
  "Expiring soon",
  "Remove Item",
] as const;

function InventoryTimeline({ currentStatus }: { currentStatus: string }) {
  // Find which step is active (first match)
  const activeIdx = HISTORY_STEPS.findIndex((s) =>
    currentStatus.toLowerCase().includes(s.toLowerCase().split(" ")[0]),
  );
  const highlightIdx = activeIdx >= 0 ? activeIdx : 0;

  return (
    <div>
      <p className="text-sm font-semibold mb-4" style={{ color: "#1A3340" }}>
        Inventory History
      </p>
      <div className="flex flex-col">
        {HISTORY_STEPS.map((step, i) => {
          const isActive = i === highlightIdx;
          const isPast = i < highlightIdx;
          return (
            <div key={step} className="flex items-start gap-3">
              {/* Dot + line */}
              <div
                className="flex flex-col items-center flex-shrink-0"
                style={{ width: 20 }}
              >
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 z-10"
                  style={{
                    backgroundColor: isActive
                      ? "#E11D48"
                      : isPast
                        ? "#3A7326"
                        : "#D1D5DB",
                    boxShadow: isActive
                      ? "0 0 0 3px rgba(225,29,72,0.18)"
                      : "none",
                  }}
                  aria-hidden="true"
                />
                {i < HISTORY_STEPS.length - 1 && (
                  <div
                    className="w-0.5 flex-1"
                    style={{
                      minHeight: 28,
                      backgroundColor: isPast ? "#3A7326" : "#E5E7EB",
                    }}
                  />
                )}
              </div>
              {/* Label */}
              <p
                className="text-sm pb-7 leading-none pt-0.5"
                style={{
                  color: isActive ? "#E11D48" : isPast ? "#3A7326" : "#9CA3AF",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Inline label: value row (matches screenshot style) ───────────────────────
function DetailLine({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-baseline gap-2">
      <span
        className="text-sm font-semibold flex-shrink-0"
        style={{ color: "#1A3340" }}
      >
        {label}
      </span>
      <span className="text-sm" style={{ color: "#374151" }}>
        {value}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const meta = statusMeta[product.status];

  // ── Edit form ──────────────────────────────────────────────────────────────
  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      categoryType: product.category,
      itemName: product.name,
      barcode: product.barcode ?? "",
      quantity: product.quantity ?? product.totalProducts,
      datePurchased: toIso(product.datePurchased ?? ""),
      dateExpire: toIso(product.expireDate),
      openExpiryDays: product.openExpiryDays ?? "",
      storeName: product.storeName ?? "",
      price: Number(product.price),
      description: product.description ?? "",
    },
  });

  function onEditSubmit(data: EditValues) {
    toast("Product updated!", {
      description: (
        <pre className="mt-2 max-w-xs overflow-x-auto rounded-md bg-gray-900 p-3 text-xs text-green-300">
          <code>{JSON.stringify({ id: product.id, ...data }, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
    });
    setShowEdit(false);
  }

  function handleDelete() {
    toast.success(`"${product.name}" deleted.`, { position: "bottom-right" });
    setShowDelete(false);
  }

  return (
    <>
      {/* ── 3-dot trigger ── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label={`Actions for ${product.name}`}
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-36 rounded-xl shadow-lg border-gray-100 p-1"
        >
          <DropdownMenuItem
            className="flex items-center gap-2 rounded-lg text-sm cursor-pointer px-3 py-2"
            onClick={() => setShowEdit(true)}
          >
            <Pencil size={14} style={{ color: "#3A7326" }} />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 rounded-lg text-sm cursor-pointer px-3 py-2"
            onClick={() => setShowView(true)}
          >
            <Eye size={14} style={{ color: "#2563EB" }} />
            <span>View</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 rounded-lg text-sm cursor-pointer px-3 py-2 text-red-500 focus:text-red-500"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ════════════════════════════════════════
          VIEW DIALOG — matches screenshot layout
      ════════════════════════════════════════ */}
      <Dialog open={showView} onOpenChange={setShowView}>
        <DialogContent
          className="p-0 overflow-hidden border-0 shadow-2xl"
          style={{
            borderRadius: 16,
            maxWidth: "min(900px, 95vw)",
            width: "min(900px, 95vw)",
          }}
        >
          {/* ── Header bar ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <DialogTitle
              className="text-lg font-bold"
              style={{ color: "#1A3340" }}
            >
              Item Details
            </DialogTitle>
          </div>

          {/* ── Two-column body ── */}
          <div className="flex min-h-0" style={{ maxHeight: "80vh" }}>
            {/* ── LEFT PANEL ── */}
            <div
              className="flex flex-col gap-6 p-6 flex-shrink-0 overflow-y-auto"
              style={{ width: 240, borderRight: "1px solid #f0f0f0" }}
            >
              {/* Product image placeholder */}
              <div
                className="w-full rounded-2xl flex flex-col items-center justify-center gap-2 flex-shrink-0"
                style={{
                  height: 160,
                  backgroundColor: "#3D4F61",
                }}
                aria-label="Product image"
              >
                {product.thumbnail}
              </div>

              {/* Inventory history timeline */}
              <InventoryTimeline currentStatus={product.status} />
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="flex-1 min-w-0 overflow-y-auto px-8 py-6">
              {/* Product name + category */}
              <h2
                className="text-2xl font-bold mb-1"
                style={{ color: "#1A3340" }}
              >
                {product.name}
              </h2>
              <p className="text-sm mb-6" style={{ color: "#51564E" }}>
                <span className="font-medium">Category Type :</span>{" "}
                <span style={{ color: "#1A3340" }}>{product.category}</span>
              </p>

              {/* Details rows */}
              <div className="flex flex-col gap-3 mb-6">
                {product.storeName && (
                  <DetailLine label="Store :" value={product.storeName} />
                )}
                <DetailLine
                  label="Quantity Item:"
                  value={String(product.quantity ?? product.totalProducts)}
                />
                {product.datePurchased && (
                  <DetailLine
                    label="Purchase Date:"
                    value={product.datePurchased}
                  />
                )}
                {(product.expireDate ||
                  product.openExpiryDays !== undefined) && (
                  <div className="flex items-center gap-6 flex-wrap">
                    <DetailLine
                      label="Open Item Date:"
                      value={product.expireDate}
                    />
                    {product.openExpiryDays !== undefined && (
                      <DetailLine
                        label="Open Item Time:"
                        value={`${product.openExpiryDays} Days`}
                      />
                    )}
                  </div>
                )}
                {product.description && (
                  <div className="flex gap-3">
                    <span
                      className="text-sm font-semibold flex-shrink-0 mt-0.5"
                      style={{ color: "#1A3340", minWidth: 90 }}
                    >
                      Description:
                    </span>
                    <p
                      className="text-sm leading-relaxed text-justify"
                      style={{ color: "#6B7280" }}
                    >
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Barcode */}
              {product.barcode && (
                <div className="flex flex-col items-center gap-2 pt-2">
                  <BarcodeImage
                    code={product.barcode}
                    width={340}
                    height={72}
                  />
                  <p
                    className="font-mono text-xs tracking-widest select-all"
                    style={{ color: "#374151", letterSpacing: "0.18em" }}
                  >
                    {product.barcode}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════
          DELETE DIALOG
      ════════════════════════════════════════ */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent className="rounded-3xl border-0 shadow-2xl max-w-sm">
          <AlertDialogHeader>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ backgroundColor: "#FFF1F2" }}
            >
              <Trash2 size={22} className="text-red-500" aria-hidden="true" />
            </div>
            <AlertDialogTitle
              className="text-lg font-bold"
              style={{ color: "#1A3340" }}
            >
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription
              className="text-sm"
              style={{ color: "#51564E" }}
            >
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                "{product.name}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-2">
            <AlertDialogCancel
              className="h-10 rounded-xl text-sm flex-1"
              style={{ borderColor: "#D4EAC8", color: "#3A7326" }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-10 rounded-xl text-sm flex-1 bg-red-500 hover:bg-red-600 text-white border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ════════════════════════════════════════
          EDIT DRAWER
      ════════════════════════════════════════ */}
      <Sheet
        open={showEdit}
        onOpenChange={(o) => {
          if (!o) {
            form.reset();
          }
          setShowEdit(o);
        }}
      >
        <SheetContent
          side="right"
          className="flex flex-col p-0 gap-0 w-full sm:max-w-[560px]"
          style={{ borderRadius: "24px 0 0 24px" }}
        >
          <SheetHeader className="flex-shrink-0 flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <SheetTitle
              className="text-lg font-bold"
              style={{ color: "#1A3340" }}
            >
              Edit Item
            </SheetTitle>
            <button
              onClick={() => setShowEdit(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Close edit drawer"
            >
              <X size={17} className="text-gray-500" />
            </button>
          </SheetHeader>

          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <form
              id={`edit-form-${product.id}`}
              onSubmit={form.handleSubmit(onEditSubmit)}
            >
              <FieldGroup>
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="categoryType"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`edit-cat-${product.id}`}
                          className={labelCls}
                          style={labelStyle}
                        >
                          Category Type <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id={`edit-cat-${product.id}`}
                            className="h-10 rounded-xl border-gray-200 text-sm"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="itemName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`edit-name-${product.id}`}
                          className={labelCls}
                          style={labelStyle}
                        >
                          Item Name <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`edit-name-${product.id}`}
                          className={inputCls}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="barcode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`edit-bc-${product.id}`}
                          className={labelCls}
                          style={labelStyle}
                        >
                          Barcode
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            id={`edit-bc-${product.id}`}
                            className={`${inputCls} pr-9`}
                            placeholder="Scan or enter"
                          />
                          <ScanLine
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: "#3A7326" }}
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="quantity"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`edit-qty-${product.id}`}
                          className={labelCls}
                          style={labelStyle}
                        >
                          Item Quantity <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`edit-qty-${product.id}`}
                          type="number"
                          min={1}
                          className={inputCls}
                          value={field.value ?? ""}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="datePurchased"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`edit-dp-${product.id}`}
                          className={labelCls}
                          style={labelStyle}
                        >
                          Date of Purchased{" "}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`edit-dp-${product.id}`}
                          type="date"
                          className={inputCls}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="dateExpire"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`edit-de-${product.id}`}
                          className={labelCls}
                          style={labelStyle}
                        >
                          Date of Expire <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`edit-de-${product.id}`}
                          type="date"
                          className={inputCls}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="openExpiryDays"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`edit-oe-${product.id}`}
                          className={labelCls}
                          style={labelStyle}
                        >
                          Open Expiry
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            id={`edit-oe-${product.id}`}
                            type="number"
                            min={0}
                            placeholder="60"
                            className={`${inputCls} pr-12`}
                            value={field.value ?? ""}
                          />
                          <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
                            style={{ color: "#51564E" }}
                          >
                            Days
                          </span>
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="storeName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`edit-store-${product.id}`}
                          className={labelCls}
                          style={labelStyle}
                        >
                          Store Name <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`edit-store-${product.id}`}
                          className={inputCls}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Row 5 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="price"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`edit-price-${product.id}`}
                          className={labelCls}
                          style={labelStyle}
                        >
                          Price <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                            $
                          </span>
                          <Input
                            {...field}
                            id={`edit-price-${product.id}`}
                            type="number"
                            step="0.01"
                            min={0}
                            className={`${inputCls} pl-6`}
                            value={field.value ?? ""}
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Description */}
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={`edit-desc-${product.id}`}
                        className={labelCls}
                        style={labelStyle}
                      >
                        Description
                      </FieldLabel>
                      <textarea
                        {...field}
                        id={`edit-desc-${product.id}`}
                        rows={4}
                        maxLength={300}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400"
                      />
                      <div className="flex justify-end mt-0.5">
                        <span className="text-[10px] text-gray-400">
                          {field.value?.length ?? 0}/300
                        </span>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </div>

          <SheetFooter className="flex-shrink-0 flex flex-row items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEdit(false)}
              className="h-10 px-6 rounded-xl text-sm"
              style={{ borderColor: "#D4EAC8", color: "#3A7326" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form={`edit-form-${product.id}`}
              className="h-10 px-7 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "#3A7326", color: "white" }}
            >
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

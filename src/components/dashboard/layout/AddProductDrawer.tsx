"use client";

import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { ScanLine, Plus, Printer, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BarcodeScanner from "./BarcodeScanner";
import BarcodePrintSheet from "./BarcodePrintSheet";

// ── Zod Schema ────────────────────────────────────────────────────────────────

export const schema = z
  .object({
    categoryType: z.string().min(1, "Category is required."),
    itemName: z.string().min(2, "Item name must be at least 2 characters."),
    barcode: z.string().optional(),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
    datePurchased: z.string().min(1, "Purchase date is required."),
    dateExpire: z.string().min(1, "Expiry date is required."),
    openExpiryDays: z.union([
      z.coerce.number().min(0, "Must be 0 or more."),
      z.literal(""),
      z.undefined(),
    ]),
    price: z.coerce.number().min(0, "Price must be 0 or more."),
    description: z.string().max(300, "Max 300 characters.").optional(),
  })
  .refine((d) => new Date(d.dateExpire) > new Date(d.datePurchased), {
    message: "Expiry date must be after purchase date.",
    path: ["dateExpire"],
  });

export type FormValues = z.infer<typeof schema>;

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
const labelCls = "text-xs font-semibold mb-1.5";
const labelStyle = { color: "#3A7326" };

// ── Component ─────────────────────────────────────────────────────────────────

interface AddProductDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddProductDrawer({
  open,
  onOpenChange,
}: AddProductDrawerProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [openExpiryEnabled, setOpenExpiryEnabled] = useState(false);
  const [labelsHavePrinted, setLabelsHavePrinted] = useState(false);
  const [printSheetOpen, setPrintSheetOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryType: "",
      itemName: "",
      barcode: "",
      quantity: 1,
      datePurchased: "",
      dateExpire: "",
      openExpiryDays: "",
      price: 0,
      description: "",
    },
  });

  const watchedQuantity = form.watch("quantity");
  const watchedBarcode = form.watch("barcode");
  const watchedName = form.watch("itemName");

  const canSubmit = !openExpiryEnabled || labelsHavePrinted;

  // ── Checkbox toggle ────────────────────────────────────────────────────────
  const handleOpenExpiryToggle = useCallback(
    (checked: boolean) => {
      setOpenExpiryEnabled(checked);
      setLabelsHavePrinted(false);
      if (!checked) form.setValue("openExpiryDays", "");
    },
    [form],
  );

  // ── Barcode scanner ────────────────────────────────────────────────────────
  function handleBarcodeDetected(code: string) {
    form.setValue("barcode", code, { shouldValidate: true });
    setShowScanner(false);
    toast("Barcode scanned!", {
      description: `Code: ${code}`,
      position: "bottom-right",
    });
  }

  // ── Close / reset ──────────────────────────────────────────────────────────
  function handleClose() {
    form.reset();
    setShowScanner(false);
    setOpenExpiryEnabled(false);
    setLabelsHavePrinted(false);
    setPrintSheetOpen(false);
    onOpenChange(false);
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  function onSubmit(data: FormValues) {
    if (openExpiryEnabled && !labelsHavePrinted) {
      toast.error("Please print the barcode labels first.", {
        position: "bottom-right",
      });
      return;
    }
    toast("Product added!", {
      description: (
        <pre>
          {/* <code>{JSON.stringify(data, null, 2)}</code> */}
          Product added
        </pre>
      ),
      position: "bottom-right",
    });
    handleClose();
  }

  // ── Print sheet ────────────────────────────────────────────────────────────
  function handleOpenPrintSheet() {
    form.trigger(["quantity", "itemName"]).then((valid) => {
      if (!valid) return;
      const qty = Number(form.getValues("quantity"));
      if (!qty || qty < 1) {
        form.setError("quantity", { message: "Enter a valid quantity first." });
        return;
      }
      setPrintSheetOpen(true);
    });
  }

  function handlePrinted() {
    setLabelsHavePrinted(true);
    setPrintSheetOpen(false);
    toast.success("Labels printed! You can now save the product.", {
      position: "bottom-right",
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent
          side="right"
          className="flex flex-col p-0 gap-0 w-full sm:max-w-[560px]"
          style={{ borderRadius: "24px 0 0 24px" }}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {/* Header */}
          <SheetHeader className="shrink-0 flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <SheetTitle
              className="text-lg font-bold"
              style={{ color: "#1A3340" }}
            >
              Add New Item
            </SheetTitle>
          </SheetHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <form id="add-product-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                {/* Row 1: Category + Item Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="categoryType"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="cat-type"
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
                            id="cat-type"
                            aria-invalid={fieldState.invalid}
                            className="h-10 rounded-xl border-gray-200 text-sm"
                          >
                            <SelectValue placeholder="Select category" />
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
                          htmlFor="item-name"
                          className={labelCls}
                          style={labelStyle}
                        >
                          Item Name <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="item-name"
                          placeholder="Organic Milk"
                          aria-invalid={fieldState.invalid}
                          className={inputCls}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Row 2: Barcode + Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="barcode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="barcode"
                          className={labelCls}
                          style={labelStyle}
                        >
                          Barcode
                        </FieldLabel>
                        <div className="flex flex-col gap-2">
                          <div className="relative">
                            <Input
                              {...field}
                              id="barcode"
                              placeholder="Scan or enter barcode"
                              className={`${inputCls} pr-10`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowScanner((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                              aria-label="Toggle barcode scanner"
                            >
                              <ScanLine
                                size={17}
                                style={{ color: "#3A7326" }}
                              />
                            </button>
                          </div>
                          {showScanner && (
                            <div
                              className="rounded-2xl p-3 mt-1"
                              style={{
                                backgroundColor: "#F8FDF6",
                                border: "1px solid #D4EAC8",
                              }}
                            >
                              <BarcodeScanner
                                onDetected={handleBarcodeDetected}
                                onClose={() => setShowScanner(false)}
                              />
                            </div>
                          )}
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
                          htmlFor="qty"
                          className={labelCls}
                          style={labelStyle}
                        >
                          Item Quantity <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="qty"
                          type="number"
                          min={1}
                          placeholder="10"
                          aria-invalid={fieldState.invalid}
                          className={inputCls}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(e);
                            if (openExpiryEnabled) setLabelsHavePrinted(false);
                          }}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Row 3: Date Purchased + Date Expire */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="datePurchased"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="date-purchased"
                          className={labelCls}
                          style={labelStyle}
                        >
                          Date of Purchased{" "}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="date-purchased"
                          type="date"
                          aria-invalid={fieldState.invalid}
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
                          htmlFor="date-expire"
                          className={labelCls}
                          style={labelStyle}
                        >
                          Date of Expire <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="date-expire"
                          type="date"
                          aria-invalid={fieldState.invalid}
                          className={inputCls}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* ── Open Expiry section ─────────────────────────────────── */}
                <div className="space-y-3">
                  {/* Toggle checkbox card */}
                  <div
                    className="flex items-start gap-3 rounded-2xl px-4 py-3.5 cursor-pointer transition-all duration-150"
                    style={{
                      backgroundColor: openExpiryEnabled
                        ? "#EEF3EA"
                        : "#FAFAFA",
                      border: `1.5px solid ${openExpiryEnabled ? "#D4EAC8" : "#E5E7EB"}`,
                    }}
                    onClick={() => handleOpenExpiryToggle(!openExpiryEnabled)}
                  >
                    <Checkbox
                      id="open-expiry-toggle"
                      checked={openExpiryEnabled}
                      onCheckedChange={(v) => handleOpenExpiryToggle(!!v)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5 shrink-0 data-[state=checked]:bg-[#3A7326] data-[state=checked]:border-[#3A7326]"
                    />
                    <div className="flex-1 min-w-0 select-none">
                      <p
                        className="text-[13px] font-semibold"
                        style={{ color: "#1A3340" }}
                      >
                        Track open expiry days
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                        Generates numbered barcode labels per unit — must be
                        printed before saving.
                      </p>
                    </div>
                  </div>

                  {/* Days input */}
                  <Controller
                    name="openExpiryDays"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid && openExpiryEnabled}
                      >
                        <FieldLabel
                          htmlFor="open-expiry"
                          className={labelCls}
                          style={{
                            color: openExpiryEnabled ? "#3A7326" : "#9CA3AF",
                          }}
                        >
                          Days valid after opening
                          {openExpiryEnabled && (
                            <span className="text-red-500 ml-0.5">*</span>
                          )}
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            id="open-expiry"
                            type="number"
                            min={0}
                            placeholder="e.g. 7"
                            disabled={!openExpiryEnabled}
                            className={`${inputCls} pr-12 ${!openExpiryEnabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
                            value={field.value ?? ""}
                            onChange={(e) => {
                              field.onChange(e);
                              setLabelsHavePrinted(false);
                            }}
                          />
                          <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
                            style={{
                              color: openExpiryEnabled ? "#51564E" : "#9CA3AF",
                            }}
                          >
                            Days
                          </span>
                        </div>
                        {fieldState.invalid && openExpiryEnabled && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Print gate */}
                  {openExpiryEnabled && (
                    <div
                      className="rounded-2xl overflow-hidden transition-all duration-200"
                      style={{
                        border: `1.5px solid ${labelsHavePrinted ? "#BBF7D0" : "#FDE68A"}`,
                        backgroundColor: labelsHavePrinted
                          ? "#F0FDF4"
                          : "#FFFBEB",
                      }}
                    >
                      <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          {labelsHavePrinted ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle2
                                size={15}
                                style={{ color: "#16A34A" }}
                                className="shrink-0"
                              />
                              <div>
                                <p
                                  className="text-[13px] font-semibold"
                                  style={{ color: "#15803D" }}
                                >
                                  {Number(watchedQuantity)} label
                                  {Number(watchedQuantity) !== 1 ? "s" : ""}{" "}
                                  printed ✓
                                </p>
                                <p
                                  className="text-[11px]"
                                  style={{ color: "#16A34A" }}
                                >
                                  Product is ready to save.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p
                                className="text-[13px] font-semibold"
                                style={{ color: "#92400E" }}
                              >
                                {Number(watchedQuantity) || 0} barcode label
                                {Number(watchedQuantity) !== 1 ? "s" : ""}{" "}
                                required
                              </p>
                              <p className="text-[11px] text-amber-700">
                                Print and attach labels before saving.
                              </p>
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={handleOpenPrintSheet}
                          className="h-9 px-4 rounded-xl text-[12px] font-semibold border-0 shrink-0 whitespace-nowrap"
                          style={{
                            backgroundColor: labelsHavePrinted
                              ? "#3A7326"
                              : "#D97706",
                            color: "white",
                          }}
                        >
                          <Printer size={13} className="mr-1.5" />
                          {labelsHavePrinted ? "Re-print" : "Print Labels"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price */}
                <Controller
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="price"
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
                          id="price"
                          type="number"
                          step="0.01"
                          min={0}
                          placeholder="19.99"
                          aria-invalid={fieldState.invalid}
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

                {/* Description */}
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="description"
                        className={labelCls}
                        style={labelStyle}
                      >
                        Description
                      </FieldLabel>
                      <textarea
                        {...field}
                        id="description"
                        rows={4}
                        placeholder="Input description"
                        maxLength={300}
                        aria-invalid={fieldState.invalid}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400"
                      />
                      <div className="flex justify-between mt-0.5">
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <span />
                        )}
                        <span className="text-[10px] text-gray-400 ml-auto">
                          {field.value?.length ?? 0}/300
                        </span>
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </div>

          {/* Footer */}
          <SheetFooter className="shrink-0 flex flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-white">
            {openExpiryEnabled && !labelsHavePrinted && (
              <p className="text-[11px] text-amber-600 flex items-center gap-1.5 min-w-0 truncate">
                <Printer size={12} className="shrink-0" />
                Print labels to enable saving
              </p>
            )}
            <div className="flex items-center gap-3 ml-auto shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-10 px-6 rounded-xl text-sm"
                style={{ borderColor: "#D4EAC8", color: "#3A7326" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-product-form"
                disabled={!canSubmit}
                title={!canSubmit ? "Print barcode labels first" : undefined}
                className="h-10 px-7 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#3A7326", color: "white" }}
              >
                <Plus size={15} className="mr-1.5" /> Add
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Barcode print sheet modal */}
      <BarcodePrintSheet
        open={printSheetOpen}
        itemName={watchedName || "Product"}
        quantity={Math.max(1, Number(watchedQuantity) || 1)}
        baseBarcode={watchedBarcode || "ITEM"}
        onPrinted={handlePrinted}
        onClose={() => setPrintSheetOpen(false)}
      />
    </>
  );
}

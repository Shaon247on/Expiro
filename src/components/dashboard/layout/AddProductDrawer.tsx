"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Plus } from "lucide-react";

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
import BarcodePrintSheet from "./BarcodePrintSheet";

import { getCategoriesAction } from "@/actions/admin/category.action";
import { createProductAction } from "@/actions/admin/product.action";
import type { CategoryApiItem } from "@/types/category.type";

// ── Schema ───────────────────────────────────────────────────────────────────

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

const inputCls =
  "bg-white border border-gray-200 rounded-xl h-10 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400";
const labelCls = "text-xs font-semibold mb-1.5";
const labelStyle = { color: "#3A7326" };

interface AddProductDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPrefill?: {
    barcode: string;
    existingProduct: boolean;
    lockedFields?: {
      productId: string;
      categoryId: string;
      categoryName: string;
      name: string;
      barcode: string;
      track_open_expiry_days: boolean;
      open_expiry_days: number | null;
    };
  } | null;
}

type LockedScanProduct = {
  productId: string;
  categoryId: string;
  categoryName: string;
  name: string;
  barcode: string;
  track_open_expiry_days: boolean;
  open_expiry_days: number | null;
};

type PrintPayload = {
  productName: string;
  batchCode: string;
  labels: {
    id: string;
    unit_number: number;
    unique_barcode: string;
    status?: string;
  }[];
} | null;

function extractPrintPayload(product: unknown): PrintPayload {
  const p = product as
    | {
        name?: string;
        batch_code?: string;
        unit_labels?: Array<{
          id: string;
          unit_number: number;
          unique_barcode: string;
          status?: string;
        }>;
        batches?: Array<{
          batch_code?: string;
          unit_labels?: Array<{
            id: string;
            unit_number: number;
            unique_barcode: string;
            status?: string;
          }>;
        }>;
      }
    | undefined;

  const firstBatch = p?.batches?.[0];

  const labels = firstBatch?.unit_labels ?? p?.unit_labels ?? [];
  const batchCode = firstBatch?.batch_code ?? p?.batch_code ?? "BATCH";

  if (!p?.name || !labels?.length) {
    return null;
  }

  return {
    productName: p.name,
    batchCode,
    labels,
  };
}

export default function AddProductDrawer({
  open,
  onOpenChange,
  initialPrefill = null,
}: AddProductDrawerProps) {
  const [openExpiryEnabled, setOpenExpiryEnabled] = useState(false);
  const [categories, setCategories] = useState<CategoryApiItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [lockedScanProduct, setLockedScanProduct] =
    useState<LockedScanProduct | null>(null);

  const [printSheetOpen, setPrintSheetOpen] = useState(false);
  const [printPayload, setPrintPayload] = useState<PrintPayload>(null);

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

  const watchedName = form.watch("itemName");
  const fieldsLocked = !!lockedScanProduct;

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);

    const result = await getCategoriesAction({ page: 1 });

    if (result.success && result.data) {
      setCategories(result.data);
    } else if (!result.success) {
      toast.error("Failed to load categories", {
        description: result.message,
      });
    }

    setCategoriesLoading(false);
  }, []);

  const handleOpenExpiryToggle = useCallback(
    (checked: boolean) => {
      setOpenExpiryEnabled(checked);
      if (!checked) {
        form.setValue("openExpiryDays", "");
      }
    },
    [form],
  );

  useEffect(() => {
    if (!open) return;

    void loadCategories();

    form.reset({
      categoryType: "",
      itemName: "",
      barcode: "",
      quantity: 1,
      datePurchased: "",
      dateExpire: "",
      openExpiryDays: "",
      price: 0,
      description: "",
    });

    setOpenExpiryEnabled(false);
    setLockedScanProduct(null);

    if (initialPrefill?.existingProduct && initialPrefill.lockedFields) {
      const locked = initialPrefill.lockedFields;

      form.setValue("barcode", locked.barcode, { shouldValidate: true });
      form.setValue("itemName", locked.name, { shouldValidate: true });
      form.setValue("categoryType", locked.categoryId, {
        shouldValidate: true,
      });
      form.setValue("openExpiryDays", locked.open_expiry_days ?? "", {
        shouldValidate: true,
      });

      setOpenExpiryEnabled(locked.track_open_expiry_days);
      setLockedScanProduct(locked);
    } else if (initialPrefill?.barcode) {
      form.setValue("barcode", initialPrefill.barcode, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [open, initialPrefill, form, loadCategories]);

  function handleClose() {
    form.reset();
    setOpenExpiryEnabled(false);
    setLockedScanProduct(null);
    onOpenChange(false);
  }

  async function onSubmit(data: FormValues) {
    setSubmitting(true);

    const payload = {
      category: data.categoryType,
      name: data.itemName,
      barcode: data.barcode || "",
      quantity: Number(data.quantity),
      purchase_date: data.datePurchased,
      expiry_date: data.dateExpire,
      track_open_expiry_days: openExpiryEnabled,
      open_expiry_days: openExpiryEnabled
        ? Number(data.openExpiryDays || 0)
        : null,
      confirm_labels_printed: false,
      price: String(data.price),
      description: data.description || "",
    };

    const result = await createProductAction(payload);

    if (!result.success) {
      Object.entries(result.fieldErrors ?? {}).forEach(([key, value]) => {
        const msg = value?.[0];
        if (!msg) return;

        const fieldMap: Record<string, keyof FormValues | null> = {
          category: "categoryType",
          name: "itemName",
          barcode: "barcode",
          quantity: "quantity",
          purchase_date: "datePurchased",
          expiry_date: "dateExpire",
          open_expiry_days: "openExpiryDays",
          price: "price",
          description: "description",
        };

        const mapped = fieldMap[key];
        if (mapped) {
          form.setError(mapped, { type: "server", message: msg });
        }
      });

      toast.error("Product creation failed", {
        description: result.message,
      });

      setSubmitting(false);
      return;
    }

    toast.success("Product created", {
      description: result.message,
    });

    const shouldPrint = openExpiryEnabled;
    const createdProduct = result.data;
    const nextPrintPayload = shouldPrint
      ? extractPrintPayload(createdProduct)
      : null;

    handleClose();

    if (shouldPrint && nextPrintPayload) {
      setPrintPayload(nextPrintPayload);
      setPrintSheetOpen(true);
    }

    setSubmitting(false);
  }

  const selectedCategoryId = form.watch("categoryType");

const selectedCategoryName = useMemo(() => {
  const matched = categories.find(
    (c) => c.id === selectedCategoryId
  );

  return matched?.name ?? lockedScanProduct?.categoryName ?? "";
}, [categories, selectedCategoryId, lockedScanProduct]);

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
          <SheetHeader className="shrink-0 flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <SheetTitle
              className="text-lg font-bold"
              style={{ color: "#1A3340" }}
            >
              Add New Item
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <form id="add-product-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                {fieldsLocked && (
                  <div
                    className="rounded-2xl px-4 py-3 text-[12px]"
                    style={{
                      backgroundColor: "#EEF3EA",
                      border: "1px solid #D4EAC8",
                      color: "#2F5E20",
                    }}
                  >
                    Matched existing product. Category, product name, barcode,
                    open expiry tracking, and open expiry days have been locked.
                  </div>
                )}

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
                          disabled={fieldsLocked || categoriesLoading}
                        >
                          <SelectTrigger
                            id="cat-type"
                            aria-invalid={fieldState.invalid}
                            className="h-10 rounded-xl border-gray-200 text-sm"
                          >
                            <SelectValue
                              placeholder={
                                categoriesLoading
                                  ? "Loading categories..."
                                  : "Select category"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
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
                          disabled={fieldsLocked}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

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
                        <Input
                          {...field}
                          id="barcode"
                          placeholder="Scanned or entered barcode"
                          className={inputCls}
                          disabled={fieldsLocked}
                        />
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
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

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

                <div className="space-y-3">
                  <div
                    className="flex items-start gap-3 rounded-2xl px-4 py-3.5 transition-all duration-150"
                    style={{
                      backgroundColor: openExpiryEnabled
                        ? "#EEF3EA"
                        : "#FAFAFA",
                      border: `1.5px solid ${
                        openExpiryEnabled ? "#D4EAC8" : "#E5E7EB"
                      }`,
                    }}
                  >
                    <Checkbox
                      id="open-expiry-toggle"
                      checked={openExpiryEnabled}
                      disabled={fieldsLocked}
                      onCheckedChange={(v) => {
                        if (fieldsLocked) return;
                        handleOpenExpiryToggle(Boolean(v));
                      }}
                      className="mt-0.5 shrink-0 data-[state=checked]:bg-[#3A7326] data-[state=checked]:border-[#3A7326]"
                    />

                    <label
                      htmlFor="open-expiry-toggle"
                      className="flex-1 min-w-0 cursor-pointer select-none"
                    >
                      <p
                        className="text-[13px] font-semibold"
                        style={{ color: "#1A3340" }}
                      >
                        Track open expiry days
                      </p>

                      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                        After product creation, barcode labels will be generated
                        for printing.
                      </p>
                    </label>
                  </div>

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
                            disabled={!openExpiryEnabled || fieldsLocked}
                            className={`${inputCls} pr-12 ${
                              !openExpiryEnabled || fieldsLocked
                                ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                                : ""
                            }`}
                            value={field.value ?? ""}
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
                </div>

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

          <SheetFooter className="shrink-0 flex flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-white">
            <div />
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
                disabled={submitting}
                className="h-10 px-7 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#3A7326", color: "white" }}
              >
                <Plus size={15} className="mr-1.5" />
                {submitting ? "Adding..." : "Add"}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <BarcodePrintSheet
        open={printSheetOpen}
        productName={printPayload?.productName ?? (watchedName || "Product")}
        batchCode={printPayload?.batchCode ?? "BATCH"}
        labels={printPayload?.labels ?? []}
        onPrinted={() => {
          toast.success("Labels printed successfully.");
        }}
        onClose={() => setPrintSheetOpen(false)}
      />
    </>
  );
}

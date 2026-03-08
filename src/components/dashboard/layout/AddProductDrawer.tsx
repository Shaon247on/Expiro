"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { X, ScanLine, Upload, Plus, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// ── Zod Schema ────────────────────────────────────────────────────────────────
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const schema = z
  .object({
    categoryType:   z.string().min(1, "Category is required."),
    itemName:       z.string().min(2, "Item name must be at least 2 characters."),
    barcode:        z.string().optional(),
    quantity:       z.coerce.number({ invalid_type_error: "Enter a valid number." }).min(1, "Quantity must be at least 1."),
    datePurchased:  z.string().min(1, "Purchase date is required."),
    dateExpire:     z.string().min(1, "Expiry date is required."),
    openExpiryDays: z.coerce.number().min(0).optional().or(z.literal("")),
    storeName:      z.string().min(2, "Store name must be at least 2 characters."),
    price:          z.coerce.number({ invalid_type_error: "Enter a valid price." }).min(0, "Price must be 0 or more."),
    description:    z.string().max(300, "Max 300 characters.").optional(),
  })
  .refine(
    (d) => !d.datePurchased || !d.dateExpire || new Date(d.dateExpire) > new Date(d.datePurchased),
    { message: "Expiry date must be after purchase date.", path: ["dateExpire"] }
  );

type FormValues = z.infer<typeof schema>;

const CATEGORIES = ["Daily", "Bakery", "Meat", "Seafood", "Dairy", "Frozen", "Beverages", "Other"];

const inputCls =
  "bg-white border border-gray-200 rounded-xl h-10 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400";

const labelCls = "text-xs font-semibold mb-1.5";
const labelStyle = { color: "#3A7326" };

// ── Component ─────────────────────────────────────────────────────────────────
interface AddProductDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddProductDrawer({ open, onOpenChange }: AddProductDrawerProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [imageFile, setImageFile]     = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryType: "", itemName: "", barcode: "", quantity: undefined,
      datePurchased: "", dateExpire: "", openExpiryDays: "", storeName: "",
      price: undefined, description: "",
    },
  });

  function handleBarcodeDetected(code: string) {
    form.setValue("barcode", code, { shouldValidate: true });
    setShowScanner(false);
    toast("Barcode scanned!", { description: `Code: ${code}`, position: "bottom-right" });
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { toast.error("Image must be under 2 MB."); return; }
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleClose() {
    form.reset();
    setShowScanner(false);
    setImageFile(null);
    setImagePreview(null);
    onOpenChange(false);
  }

  function onSubmit(data: FormValues) {
    toast("Product added!", {
      description: (
        <pre className="mt-2 max-w-xs overflow-x-auto rounded-md bg-gray-900 p-3 text-xs text-green-300">
          <code>{JSON.stringify({ ...data, image: imageFile?.name ?? null }, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
    });
    handleClose();
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="flex flex-col p-0 gap-0 w-full sm:max-w-[560px]"
        style={{ borderRadius: "24px 0 0 24px" }}
      >
        {/* Header */}
        <SheetHeader className="flex-shrink-0 flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-lg font-bold" style={{ color: "#1A3340" }}>
            Add New Item
          </SheetTitle>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Close drawer"
          >
            <X size={17} className="text-gray-500" />
          </button>
        </SheetHeader>

        {/* Scrollable form body */}
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
                      <FieldLabel htmlFor="cat-type" className={labelCls} style={labelStyle}>
                        Category Type <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="cat-type" aria-invalid={fieldState.invalid} className="h-10 rounded-xl border-gray-200 text-sm">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="itemName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="item-name" className={labelCls} style={labelStyle}>
                        Item Name <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input {...field} id="item-name" placeholder="Organic Milk" aria-invalid={fieldState.invalid} className={inputCls} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                      <FieldLabel htmlFor="barcode" className={labelCls} style={labelStyle}>
                        Barcode / Image
                      </FieldLabel>
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          <Input {...field} id="barcode" placeholder="Scan Barcode" className={`${inputCls} pr-10`} />
                          <button type="button" onClick={() => setShowScanner((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70" aria-label="Toggle barcode scanner">
                            <ScanLine size={17} style={{ color: "#3A7326" }} />
                          </button>
                        </div>
                        {/* Image upload */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50" style={{ borderColor: "#D4EAC8", color: "#3A7326" }}>
                            <Upload size={12} /> Upload Image
                          </button>
                          {imageFile && (
                            <div className="flex items-center gap-1.5 min-w-0">
                              {imagePreview
                                ? <img src={imagePreview} alt="preview" className="w-7 h-7 rounded object-cover border border-gray-200" />
                                : <ImageIcon size={16} className="text-gray-400" />
                              }
                              <span className="text-xs text-gray-500 truncate max-w-[90px]">{imageFile.name}</span>
                              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} aria-label="Remove image" className="text-gray-400 hover:text-red-400">
                                <X size={12} />
                              </button>
                            </div>
                          )}
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} aria-label="Upload product image" />
                        </div>
                        {/* Inline scanner */}
                        {showScanner && (
                          <div className="rounded-2xl p-3 mt-1" style={{ backgroundColor: "#F8FDF6", border: "1px solid #D4EAC8" }}>
                            <BarcodeScanner onDetected={handleBarcodeDetected} onClose={() => setShowScanner(false)} />
                          </div>
                        )}
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="quantity"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="qty" className={labelCls} style={labelStyle}>
                        Item Quantity <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input {...field} id="qty" type="number" min={1} placeholder="1999" aria-invalid={fieldState.invalid} className={inputCls} value={field.value ?? ""} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                      <FieldLabel htmlFor="date-purchased" className={labelCls} style={labelStyle}>
                        Date of Purchased <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input {...field} id="date-purchased" type="date" aria-invalid={fieldState.invalid} className={inputCls} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="dateExpire"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="date-expire" className={labelCls} style={labelStyle}>
                        Date of Expire <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input {...field} id="date-expire" type="date" aria-invalid={fieldState.invalid} className={inputCls} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {/* Row 4: Open Expiry + Store Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="openExpiryDays"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="open-expiry" className={labelCls} style={labelStyle}>
                        Date of Open Expiry
                      </FieldLabel>
                      <div className="relative">
                        <Input {...field} id="open-expiry" type="number" min={0} placeholder="60" className={`${inputCls} pr-12`} value={field.value ?? ""} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none" style={{ color: "#51564E" }}>Days</span>
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="storeName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="store-name" className={labelCls} style={labelStyle}>
                        Store Name <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input {...field} id="store-name" placeholder="First Store" aria-invalid={fieldState.invalid} className={inputCls} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {/* Row 5: Price (half) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="price" className={labelCls} style={labelStyle}>
                        Price <span className="text-red-500">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">$</span>
                        <Input {...field} id="price" type="number" step="0.01" min={0} placeholder="19.99" aria-invalid={fieldState.invalid} className={`${inputCls} pl-6`} value={field.value ?? ""} />
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {/* Row 6: Description */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description" className={labelCls} style={labelStyle}>
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
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : <span />}
                      <span className="text-[10px] text-gray-400 ml-auto">{(field.value?.length ?? 0)}/300</span>
                    </div>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>

        {/* Footer */}
        <SheetFooter className="flex-shrink-0 flex flex-row items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
          <Button type="button" variant="outline" onClick={handleClose} className="h-10 px-6 rounded-xl text-sm" style={{ borderColor: "#D4EAC8", color: "#3A7326" }}>
            Cancel
          </Button>
          <Button type="submit" form="add-product-form" className="h-10 px-7 rounded-xl text-sm font-semibold" style={{ backgroundColor: "#3A7326", color: "white" }}>
            <Plus size={15} className="mr-1.5" /> Add
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
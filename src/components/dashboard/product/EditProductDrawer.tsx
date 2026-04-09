"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { X, ScanLine } from "lucide-react";

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
import { ProductItem } from "@/types/product.type";
import { updateProductAction } from "@/actions/admin/product.action";

const editSchema = z
  .object({
    category: z.string().min(1, "Category is required."),
    name: z.string().min(2, "At least 2 characters."),
    barcode: z.string().optional(),
    quantity: z.coerce.number().min(1, "Must be at least 1."),
    purchase_date: z.string().min(1, "Required."),
    expiry_date: z.string().min(1, "Required."),
    track_open_expiry_days: z.boolean(),
    open_expiry_days: z.coerce.number().min(0).nullable(),
    confirm_labels_printed: z.boolean(),
    price: z.string().min(1, "Required."),
    description: z.string().optional(),
  })
  .refine(
    (d) =>
      !d.purchase_date ||
      !d.expiry_date ||
      new Date(d.expiry_date) > new Date(d.purchase_date),
    {
      message: "Expiry date must be after purchase date.",
      path: ["expiry_date"],
    }
  );

type EditValues = z.infer<typeof editSchema>;

const inputCls =
  "bg-white border border-gray-200 rounded-xl h-10 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400";
const labelStyle = { color: "#3A7326" };
const labelCls = "text-xs font-semibold mb-1.5";

export default function EditProductDrawer({
  product,
  open,
  onOpenChange,
}: {
  product: ProductItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      category: product.category,
      name: product.name,
      barcode: product.barcode ?? "",
      quantity: product.quantity,
      purchase_date: product.purchase_date,
      expiry_date: product.expiry_date,
      track_open_expiry_days: product.track_open_expiry_days,
      open_expiry_days: product.open_expiry_days ?? null,
      confirm_labels_printed: product.labels_print_confirmed,
      price: product.price,
      description: product.description ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        category: product.category,
        name: product.name,
        barcode: product.barcode ?? "",
        quantity: product.quantity,
        purchase_date: product.purchase_date,
        expiry_date: product.expiry_date,
        track_open_expiry_days: product.track_open_expiry_days,
        open_expiry_days: product.open_expiry_days ?? null,
        confirm_labels_printed: product.labels_print_confirmed,
        price: product.price,
        description: product.description ?? "",
      });
    }
  }, [open, product, form]);

  function onSubmit(data: EditValues) {
    form.clearErrors();

    void (async () => {
      const result = await updateProductAction(product.id, data);

      if (!result.success) {
        Object.entries(result.fieldErrors ?? {}).forEach(([key, value]) => {
          const msg = value?.[0];
          if (!msg) return;
          if (key in data) {
            form.setError(key as keyof EditValues, { type: "server", message: msg });
          }
        });

        toast.error("Product update failed", {
          description: result.message,
          position: "bottom-right",
        });
        return;
      }

      toast.success("Product updated", {
        description: result.message,
        position: "bottom-right",
      });

      onOpenChange(false);
    })();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col p-0 gap-0 w-full sm:max-w-[560px]"
        style={{ borderRadius: "24px 0 0 24px" }}
      >
        <SheetHeader className="flex-shrink-0 flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-lg font-bold" style={{ color: "#1A3340" }}>
            Edit Item
          </SheetTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Close edit drawer"
          >
            <X size={17} className="text-gray-500" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id={`edit-form-${product.id}`} onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className={labelCls} style={labelStyle}>
                      Category UUID
                    </FieldLabel>
                    <Input {...field} className={inputCls} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className={labelCls} style={labelStyle}>
                      Item Name
                    </FieldLabel>
                    <Input {...field} className={inputCls} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="barcode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className={labelCls} style={labelStyle}>
                      Barcode
                    </FieldLabel>
                    <div className="relative">
                      <Input {...field} className={`${inputCls} pr-9`} />
                      <ScanLine
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "#3A7326" }}
                      />
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
                    <FieldLabel className={labelCls} style={labelStyle}>
                      Quantity
                    </FieldLabel>
                    <Input {...field} type="number" min={1} className={inputCls} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="purchase_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className={labelCls} style={labelStyle}>
                      Purchase Date
                    </FieldLabel>
                    <Input {...field} type="date" className={inputCls} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="expiry_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className={labelCls} style={labelStyle}>
                      Expiry Date
                    </FieldLabel>
                    <Input {...field} type="date" className={inputCls} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="open_expiry_days"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className={labelCls} style={labelStyle}>
                      Open Expiry Days
                    </FieldLabel>
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? null : Number(e.target.value))
                      }
                      type="number"
                      min={0}
                      className={inputCls}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className={labelCls} style={labelStyle}>
                      Price
                    </FieldLabel>
                    <Input {...field} className={inputCls} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className={labelCls} style={labelStyle}>
                      Description
                    </FieldLabel>
                    <textarea
                      {...field}
                      rows={4}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
            onClick={() => onOpenChange(false)}
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
  );
}
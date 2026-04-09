"use client";

import { useRef, useCallback, useEffect, useState, useTransition, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { X, ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { CategoryApiItem } from "@/types/category.type";
import { updateCategoryAction } from "@/actions/admin/category.action";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(1, "Description is required."),
  image: z.instanceof(File).nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

const inputCls =
  "w-full h-12 px-4 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400";

const textareaCls =
  "w-full min-h-[110px] px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400 resize-none";

const labelCls = "text-sm font-semibold mb-1.5";
const labelStyle = { color: "#1F485B" };

interface ImageUploadProps {
  currentImageUrl?: string | null;
  value: File | null | undefined;
  onChange: (file: File | null) => void;
}

function ImageUploadField({
  currentImageUrl,
  value,
  onChange,
}: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const objectUrl = useMemo(() => {
    if (!value) return null;
    return URL.createObjectURL(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const preview = objectUrl ?? currentImageUrl ?? null;

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5 MB.");
        return;
      }

      onChange(file);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onChange]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onChange]
  );

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold" style={{ color: "#1F485B" }}>
        Category Image <span className="font-normal text-gray-400">(optional)</span>
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0] ?? null);
        }}
        className="relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-150"
        style={{
          borderColor: dragging ? "#3A7326" : preview ? "#86EFAC" : "#E5E7EB",
          backgroundColor: dragging ? "#F0FDF4" : preview ? "#F0FDF4" : "#FAFAFA",
          height: preview ? 160 : 120,
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload category image"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />

        {preview ? (
          <>
            <Image
              src={preview}
              alt="Category preview"
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md backdrop-blur-sm transition-colors hover:bg-red-50"
              aria-label="Remove image"
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "#EEF3EA" }}
            >
              <ImagePlus size={18} style={{ color: "#3A7326" }} />
            </div>

            <p className="text-sm text-gray-500">
              Drag & drop or{" "}
              <span className="font-semibold" style={{ color: "#3A7326" }}>
                browse
              </span>
            </p>

            <p className="text-xs text-gray-400">PNG, JPG, WEBP · max 5 MB</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface EditCategoryDialogProps {
  category: CategoryApiItem;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditCategoryDialog({
  category,
  open,
  onClose,
  onSuccess,
}: EditCategoryDialogProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category.name,
      description: category.description ?? "",
      image: null,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      name: category.name,
      description: category.description ?? "",
      image: null,
    });
  }, [open, category.id, category.name, category.description, form]);

  function handleClose() {
    if (isPending) return;

    form.reset({
      name: category.name,
      description: category.description ?? "",
      image: null,
    });

    onClose();
  }

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const payload = new FormData();
      payload.append("name", data.name);
      payload.append("description", data.description);

      if (data.image) {
        payload.append("image", data.image);
      }

      const result = await updateCategoryAction(category.id, payload);

      if (!result.success) {
        if (result.fieldErrors?.name?.[0]) {
          form.setError("name", {
            type: "server",
            message: result.fieldErrors.name[0],
          });
        }

        if (result.fieldErrors?.description?.[0]) {
          form.setError("description", {
            type: "server",
            message: result.fieldErrors.description[0],
          });
        }

        toast.error("Failed to update category", {
          description: result.message,
        });
        return;
      }

      toast.success("Category updated", {
        description: result.message,
      });

      onSuccess?.();
      handleClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent
        className="w-full overflow-hidden border-0 p-0 shadow-2xl"
        style={{ borderRadius: 16, maxWidth: "min(520px, 95vw)" }}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <DialogTitle className="text-base font-bold" style={{ color: "#1A3340" }}>
            Edit Category
          </DialogTitle>
        </div>

        <div className="px-8 py-8">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold" style={{ color: "#1F485B" }}>
              Edit Category
            </h2>
            <p className="text-sm text-gray-500">
              Update the category details below.
            </p>
          </div>

          <form id="edit-category-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
              <Controller
                name="image"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <ImageUploadField
                      currentImageUrl={category.image}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </Field>
                )}
              />

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-cat-name" className={labelCls} style={labelStyle}>
                      Category Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="edit-cat-name"
                      placeholder="e.g. Dairy"
                      aria-invalid={fieldState.invalid}
                      className={inputCls}
                      autoComplete="off"
                      disabled={isPending}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-cat-description" className={labelCls} style={labelStyle}>
                      Description
                    </FieldLabel>
                    <textarea
                      {...field}
                      id="edit-cat-description"
                      placeholder="e.g. Milk products"
                      aria-invalid={fieldState.invalid}
                      className={textareaCls}
                      disabled={isPending}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <Button
            type="submit"
            form="edit-category-form"
            disabled={isPending}
            className="mt-6 h-12 w-full rounded-2xl text-base font-semibold disabled:opacity-70"
            style={{ backgroundColor: "#3A7326", color: "white" }}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { useState, useRef, useCallback, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Plus, ImagePlus, Trash2, Loader2 } from "lucide-react";
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
import { createCategoryAction } from "@/actions/admin/category.action";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(1, "Description is required."),
});

type FormValues = z.infer<typeof schema>;

const inputCls =
  "w-full h-12 px-4 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400";
const textareaCls =
  "w-full min-h-[110px] px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400 resize-none";
const labelCls = "text-sm font-semibold mb-1.5";
const labelStyle = { color: "#1F485B" };

interface ImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

function ImageUploadField({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(file);
    },
    [onChange]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      onChange(null);
      if (inputRef.current) inputRef.current.value = "";
    },
    [preview, onChange]
  );

  return (
    <div>
      <p className={labelCls} style={labelStyle}>
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
        className="relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-150 overflow-hidden"
        style={{
          borderColor: dragging ? "#3A7326" : preview ? "#86EFAC" : "#E5E7EB",
          backgroundColor: dragging ? "#F0FDF4" : preview ? "#F0FDF4" : "#FAFAFA",
          height: preview ? 160 : 120,
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload category image"
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
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
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="opacity-0 hover:opacity-100 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg transition-opacity"
                aria-label="Remove image"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-4 text-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#EEF3EA" }}
            >
              <ImagePlus size={18} style={{ color: "#3A7326" }} />
            </div>
            <p className="text-sm text-gray-500">
              Drag & drop or <span className="font-semibold" style={{ color: "#3A7326" }}>browse</span>
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP · max 5 MB</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function handleClose() {
    if (isPending) return;
    form.reset();
    setImage(null);
    setOpen(false);
  }

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const payload = new FormData();
      payload.append("name", data.name);
      payload.append("description", data.description);
      if (image) {
        payload.append("image", image);
      }

      const result = await createCategoryAction(payload);

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

        toast.error("Create failed", {
          description: result.message,
        });
        return;
      }

      toast.success("Category created", {
        description: result.message,
      });

      form.reset();
      setImage(null);
      setOpen(false);
    });
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold"
        style={{ backgroundColor: "#3A7326", color: "white" }}
      >
        <Plus size={16} aria-hidden="true" />
        Add Category
      </Button>

      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent
          className="p-0 overflow-hidden border-0 shadow-2xl w-full"
          style={{ borderRadius: 16, maxWidth: "min(520px, 95vw)" }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <DialogTitle className="text-base font-bold" style={{ color: "#1A3340" }}>
              Add Category
            </DialogTitle>
          </div>

          <div className="px-8 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: "#1F485B" }}>
                New Category
              </h2>
              <p className="text-sm text-gray-500">
                Add category details to organise your inventory.
              </p>
            </div>

            <form id="add-category-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="gap-5">
                <Field>
                  <ImageUploadField value={image} onChange={setImage} />
                </Field>

                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="cat-name" className={labelCls} style={labelStyle}>
                        Category Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="cat-name"
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
                      <FieldLabel htmlFor="cat-description" className={labelCls} style={labelStyle}>
                        Description
                      </FieldLabel>
                      <textarea
                        {...field}
                        id="cat-description"
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
              form="add-category-form"
              disabled={isPending}
              className="w-full h-12 rounded-2xl text-base font-semibold mt-6 disabled:opacity-70"
              style={{ backgroundColor: "#3A7326", color: "white" }}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Category"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
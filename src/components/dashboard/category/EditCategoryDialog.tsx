"use client";

import { useState, useRef, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { X, ImagePlus } from "lucide-react";
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
import type { Category } from "@/types/category.type";

// ── Schema ─────────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});
type FormValues = z.infer<typeof schema>;

const inputCls =
  "w-full h-12 px-4 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400";
const labelCls = "text-sm font-semibold mb-1.5";
const labelStyle = { color: "#1F485B" };

// ── Image Upload Field (identical to Add, reused) ──────────────────────────────

interface ImageUploadProps {
  currentImageUrl?: string | null;
  value: File | null;
  onChange: (file: File | null) => void;
}

function ImageUploadField({ currentImageUrl, value, onChange }: ImageUploadProps) {
  // Show existing image URL or new file preview
  const [preview, setPreview] = useState<string | null>(currentImageUrl ?? null);
  const [isNewFile, setIsNewFile] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please upload a valid image file."); return; }
    if (file.size > 5 * 1024 * 1024)    { toast.error("Image must be under 5 MB."); return; }
    if (isNewFile && preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setIsNewFile(true);
    onChange(file);
  }, [isNewFile, preview, onChange]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isNewFile && preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setIsNewFile(false);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [isNewFile, preview, onChange]);

  return (
    <div>
      <p className={labelCls} style={labelStyle}>
        Category Image <span className="font-normal text-gray-400">(optional)</span>
      </p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0] ?? null); }}
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
            <Image src={preview} alt="Category preview" fill className="object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors z-10"
              aria-label="Remove image"
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-4 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#EEF3EA" }}>
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

// ── Dialog ─────────────────────────────────────────────────────────────────────

interface EditCategoryDialogProps {
  category: Category;
  open: boolean;
  onClose: () => void;
  onSuccess?: (updated: Category) => void;
}

export default function EditCategoryDialog({
  category,
  open,
  onClose,
  onSuccess,
}: EditCategoryDialogProps) {
  const [image, setImage]     = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: category.name },
  });

  function handleClose() {
    if (loading) return;
    form.reset({ name: category.name });
    setImage(null);
    onClose();
  }

  async function onSubmit(data: FormValues) {
    setLoading(true);
    try {
      // TODO: replace with real server action call
      await new Promise((r) => setTimeout(r, 800));
      toast.success(`Category updated successfully.`, { position: "bottom-right" });
      onSuccess?.({ ...category, name: data.name, image: image ? URL.createObjectURL(image) : category.image });
      handleClose();
    } catch {
      toast.error("Failed to update category. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="p-0 overflow-hidden border-0 shadow-2xl w-full"
        style={{ borderRadius: 16, maxWidth: "min(520px, 95vw)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-base font-bold" style={{ color: "#1A3340" }}>
            Edit Category
          </DialogTitle>
          <button
            onClick={handleClose}
            disabled={loading}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "#1F485B" }}>Edit Category</h2>
            <p className="text-sm text-gray-500">Update the name or image for this category.</p>
          </div>

          <form id="edit-category-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
              <Field>
                <ImageUploadField
                  currentImageUrl={category.image}
                  value={image}
                  onChange={setImage}
                />
              </Field>

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
                      placeholder="e.g. Design Systems"
                      aria-invalid={fieldState.invalid}
                      className={inputCls}
                      autoComplete="off"
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
            disabled={loading}
            className="w-full h-12 rounded-2xl text-base font-semibold mt-6 disabled:opacity-70"
            style={{ backgroundColor: "#3A7326", color: "white" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </span>
            ) : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
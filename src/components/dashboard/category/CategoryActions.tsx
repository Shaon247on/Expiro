"use client";

import { useState, useCallback } from "react";
import { MoreHorizontal, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import EditCategoryDialog from "./EditCategoryDialog";
import { Category } from "@/types/category.type";

interface CategoryActionsProps {
  category: Category;
  onDelete?: (id: string) => void;
  onUpdate?: (updated: Category) => void;
}

export default function CategoryActions({ category, onDelete, onUpdate }: CategoryActionsProps) {
  const [editOpen,   setEditOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      // TODO: replace with real server action
      await new Promise((r) => setTimeout(r, 700));
      toast.success(`"${category.name}" deleted.`, { position: "bottom-right" });
      onDelete?.(category.id);
      setDeleteOpen(false);
    } catch {
      toast.error("Failed to delete category.");
    } finally {
      setDeleting(false);
    }
  }, [category, onDelete]);

  return (
    <>
      {/* 3-dot trigger */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label={`Actions for ${category.name}`}
          >
            <MoreHorizontal size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-gray-100">
          <DropdownMenuItem
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 text-sm cursor-pointer rounded-lg"
          >
            <Pencil size={14} className="text-gray-500" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-2 text-sm cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit dialog */}
      <EditCategoryDialog
        category={category}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={(updated) => { onUpdate?.(updated); setEditOpen(false); }}
      />

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={(o) => !deleting && setDeleteOpen(o)}>
        <AlertDialogContent className="rounded-2xl border-0 shadow-2xl max-w-[420px] p-0 overflow-hidden">
          <div className="h-1 w-full bg-red-500" />
          <div className="p-6 pt-5">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
            </div>
            <AlertDialogHeader className="space-y-2 mb-5 text-center">
              <AlertDialogTitle className="text-[17px] font-bold" style={{ color: "#1A3340" }}>
                Delete Category?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[13px] leading-relaxed text-gray-500 text-center">
                You are about to permanently delete{" "}
                <span className="font-semibold" style={{ color: "#1A3340" }}>&ldquo;{category.name}&ldquo;</span>.
                {" "}This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel
                disabled={deleting}
                className="flex-1 rounded-xl border-gray-200 h-10 text-[13px] font-semibold disabled:opacity-50"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => { e.preventDefault(); handleDelete(); }}
                disabled={deleting}
                className="flex-1 rounded-xl border-0 bg-red-600 hover:bg-red-700 text-white h-10 text-[13px] font-semibold disabled:opacity-70"
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Deleting…
                  </span>
                ) : "Yes, Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
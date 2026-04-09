"use client";

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
import { Trash2 } from "lucide-react";

export default function DeleteProductDialog({
  productName,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: {
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl border-0 shadow-2xl max-w-sm">
        <AlertDialogHeader>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ backgroundColor: "#FFF1F2" }}
          >
            <Trash2 size={22} className="text-red-500" />
          </div>
          <AlertDialogTitle className="text-lg font-bold" style={{ color: "#1A3340" }}>
            Delete Product?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm" style={{ color: "#51564E" }}>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-800">&ldquo;{productName}&ldquo;</span>?
            This action cannot be undone.
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
            onClick={onConfirm}
            className="h-10 rounded-xl text-sm flex-1 bg-red-500 hover:bg-red-600 text-white border-0"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
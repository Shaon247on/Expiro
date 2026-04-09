"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MoreVertical, Pencil, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ProductItem } from "@/types/product.type";
import { deleteProductAction } from "@/actions/admin/product.action";
import DeleteProductDialog from "./DeleteProductDialog";
import EditProductDrawer from "./EditProductDrawer";

interface ProductActionsProps {
  product: ProductItem;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProductAction(product.id);

      if (!result.success) {
        toast.error("Delete failed", { description: result.message, position: "bottom-right" });
        return;
      }

      toast.success(result.message, { position: "bottom-right" });
      setShowDelete(false);
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label={`Actions for ${product.name}`}
            disabled={isPending}
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-36 rounded-xl shadow-lg border-gray-100 p-1">
          <DropdownMenuItem
            className="flex items-center gap-2 rounded-lg text-sm cursor-pointer px-3 py-2"
            onClick={() => setShowEdit(true)}
          >
            <Pencil size={14} style={{ color: "#3A7326" }} />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 rounded-lg text-sm cursor-pointer px-3 py-2"
            onClick={() => router.push(`/dashboard/products/${product.id}`)}
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

      <DeleteProductDialog
        productName={product.name}
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        loading={isPending}
      />

      <EditProductDrawer
        product={product}
        open={showEdit}
        onOpenChange={setShowEdit}
      />
    </>
  );
}
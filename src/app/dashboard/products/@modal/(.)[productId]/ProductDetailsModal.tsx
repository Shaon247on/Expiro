"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductDetailsView from "@/components/dashboard/product/ProductDetailsView";
import type { ProductItem } from "@/types/product.type";
import { ActionResult } from "@/actions/profile/profile.action";

type ProductDetailsModalProps = {
  productId: string;
  result: ActionResult<ProductItem>;
};

export default function ProductDetailsModal({
  productId,
  result,
}: ProductDetailsModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  // When productId changes (or component re-renders for the same productId
  // after being "closed"), reset open to true so the dialog shows again.
  useEffect(() => {
    setOpen(true);
  }, [productId]);

  const handleClose = () => {
    setOpen(false);
    router.back();
  };

  const handleBatchView = (batchId: string) => {
    setOpen(false);
    router.push(`/dashboard/products/${productId}/batches/${batchId}`);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <DialogContent
        className="overflow-hidden border-0 p-0 shadow-2xl"
        style={{
          borderRadius: 16,
          maxWidth: "min(1100px, 95vw)",
          width: "min(1100px, 95vw)",
        }}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <DialogTitle
            className="text-lg font-bold"
            style={{ color: "#1A3340" }}
          >
            Product Details
          </DialogTitle>
        </div>

        <div className="max-h-[85vh] overflow-y-auto p-6">
          {result.success && result.data ? (
            <ProductDetailsView
              product={result.data}
              onBatchView={handleBatchView}
            />
          ) : (
            <div className="text-sm text-red-500">{result.message}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import BarcodePrintSheet from "../layout/BarcodePrintSheet";

export default function BatchBarcodeSection({
  productName,
  batchCode,
  unitLabels,
}: {
  productName: string;
  batchCode: string;
  unitLabels: {
    id: string;
    unit_number: number;
    unique_barcode: string;
    status?: string;
  }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="h-10 rounded-xl text-sm font-semibold"
        style={{ backgroundColor: "#3A7326", color: "white" }}
      >
        Print Barcodes
      </Button>

      <BarcodePrintSheet
        open={open}
        productName={productName}
        batchCode={batchCode}
        labels={unitLabels}
        onPrinted={() => {}}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
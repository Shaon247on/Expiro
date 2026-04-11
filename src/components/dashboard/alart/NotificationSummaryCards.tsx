import {
  Bell,
  Package,
  AlertTriangle,
  TriangleAlert,
  PackageOpen,
} from "lucide-react";
import { StatCardItem } from "@/components/elements/StatCardItem";
import { type NotificationSummaryResponse } from "@/types/notification.type";

export default function NotificationSummaryCards({
  summary,
}: {
  summary: NotificationSummaryResponse["data"]["summary"];
}) {
  const cards = [
    {
      label: "Total Active Products",
      value: summary?.total_active_products.current,
      delta: summary?.total_active_products.display,
      icon: <Package className="text-[#034F75]" size={26} />,
      iconBgStart: "from-[#D6F2FF]",
      iconBgEnd: "to-[#EEF9FF]",
    },
    {
      label: "Expiring Soon",
      value: summary?.expiring_soon_products.current,
      delta: summary?.expiring_soon_products.display,
      icon: <AlertTriangle className="text-[#EA580C]" size={26} />,
      iconBgStart: "from-[#FFF1E5]",
      iconBgEnd: "to-[#FFF8F0]",
    },
    {
      label: "Low Stock",
      value: summary?.low_stock_products.current,
      delta: summary?.low_stock_products.display,
      icon: <TriangleAlert className="text-[#2563EB]" size={26} />,
      iconBgStart: "from-[#E6F0FF]",
      iconBgEnd: "to-[#F4F8FF]",
    },
    {
      label: "Open Products",
      value: summary?.open_products.current,
      delta: summary?.open_products.display,
      icon: <PackageOpen className="text-[#3A7326]" size={26} />,
      iconBgStart: "from-[#EAF8E4]",
      iconBgEnd: "to-[#F5FCF1]",
    },
  ];

  return (
    <section aria-label="Summary statistics">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <StatCardItem key={card.label} card={card} />
        ))}
      </div>
    </section>
  );
}
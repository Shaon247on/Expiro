import { StatCard } from "@/types/alert.type";
import { Separator } from "../ui/separator";

export function StatCardItem({ card }: { card: StatCard }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className={`size-15.5 rounded-full flex items-center justify-center shrink-0 bg-linear-to-l ${card.iconBgStart} ${card.iconBgEnd}`}
        >
          {card.icon}
        </div>
        <div className="min-w-0 text-end w-full text-[#034F75]">
          <p className="text-sm  leading-tight">{card.label}</p>
          <p className="text-2xl font-bold  leading-tight">{card.value}</p>
        </div>
      </div>
      <Separator />
      <p className="text-xs font-bold text-[#3A7326]">
        {card.delta}{" "}
        <span className="text-[#034F75] font-normal">than last week</span>
      </p>
    </div>
  );
}
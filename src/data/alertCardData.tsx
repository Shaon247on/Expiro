import { StatCard } from "@/types/alert.type";

export const STAT_CARDS: StatCard[] = [
  {
    label: "Total Active Products",
    value: "1081",
    delta: "+155",
    iconBgStart: "from-[#3A7326]",
    iconBgEnd: "to-[#86EA63]",
    iconColor: "#FFFFFF",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          fill="none"
        />
        <polyline
          points="3.27 6.96 12 12.01 20.73 6.96"
          stroke="#FFFFFF"
          strokeWidth="1.8"
        />
        <line
          x1="12"
          y1="22.08"
          x2="12"
          y2="12"
          stroke="#FFFFFF"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    label: "Expiring Soon",
    value: "81",
    delta: "+155",
    iconBgStart: "from-[#FFBB3E]",
    iconBgEnd: "to-[#DD9D28]",
    iconColor: "#FFFFFF",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          fill="none"
        />
        <polyline
          points="12 6 12 12 16 14"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Low Stock",
    value: "45",
    delta: "+155",
    iconBgStart: "from-[#D93939]",
    iconBgEnd: "to-[#E34747]",
    iconColor: "#FFFFFF",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          fill="none"
        />
        <polyline points="17 8 12 3 7 8" stroke="#FFFFFF" strokeWidth="1.8" />
        <line
          x1="12"
          y1="3"
          x2="12"
          y2="15"
          stroke="#FFFFFF"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    label: "Open Products",
    value: "18",
    delta: "+155",
    iconBgStart: "from-[#84D7C6]",
    iconBgEnd: "to-[#04705B]",
    iconColor: "#FFFFFF",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          fill="none"
        />
        <line
          x1="7"
          y1="7"
          x2="7.01"
          y2="7"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];
import { ChevronDown } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface StatCard {
  label: string;
  value: string;
  delta: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  expireDate: string;
  totalProducts: number;
  status: "Urgent" | "Expiring soon" | "Safe Item" | "Remove Item" | "Open Item";
  thumbnail: string;
}

// ── Mocked data ───────────────────────────────────────────────────────────────
const STAT_CARDS: StatCard[] = [
  {
    label: "Total Active Products", value: "1081", delta: "+155 than last week",
    iconBg: "#EEF3EA", iconColor: "#3A7326",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" stroke="#3A7326" strokeWidth="1.8" fill="none" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="#3A7326" strokeWidth="1.8" />
        <line x1="12" y1="22.08" x2="12" y2="12" stroke="#3A7326" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    label: "Expiring Soon", value: "81", delta: "+155 than last week",
    iconBg: "#FFF7ED", iconColor: "#EA580C",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="#EA580C" strokeWidth="1.8" fill="none" />
        <polyline points="12 6 12 12 16 14" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Low Stock", value: "45", delta: "+155 than last week",
    iconBg: "#FFF1F2", iconColor: "#E11D48",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#E11D48" strokeWidth="1.8" fill="none" />
        <polyline points="17 8 12 3 7 8" stroke="#E11D48" strokeWidth="1.8" />
        <line x1="12" y1="3" x2="12" y2="15" stroke="#E11D48" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    label: "Open Products", value: "18", delta: "+155 than last week",
    iconBg: "#EFF6FF", iconColor: "#2563EB",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" stroke="#2563EB" strokeWidth="1.8" fill="none" />
        <line x1="7" y1="7" x2="7.01" y2="7" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const statusMeta: Record<Product["status"], { color: string; bg: string }> = {
  "Urgent":       { color: "#E11D48", bg: "#FFF1F2" },
  "Expiring soon":{ color: "#EA580C", bg: "#FFF7ED" },
  "Safe Item":    { color: "#16A34A", bg: "#F0FDF4" },
  "Remove Item":  { color: "#E11D48", bg: "#FFF1F2" },
  "Open Item":    { color: "#16A34A", bg: "#F0FDF4" },
};

const PRODUCTS: Product[] = [
  { id:1, name:"Organic Milk",  category:"Daily",  price:"4.99",  expireDate:"15/01/2026", totalProducts:34,  status:"Urgent",        thumbnail:"🥛" },
  { id:2, name:"Fresh Bread",   category:"Bakery",  price:"9.99",  expireDate:"01/01/2026", totalProducts:122, status:"Expiring soon",  thumbnail:"🍞" },
  { id:3, name:"Greek Yogurt",  category:"Daily",   price:"19.99", expireDate:"15/01/2031", totalProducts:10,  status:"Safe Item",      thumbnail:"🧆" },
  { id:4, name:"Organic Eggs",  category:"Daily",   price:"4.99",  expireDate:"15/01/2026", totalProducts:22,  status:"Remove Item",    thumbnail:"🥚" },
  { id:5, name:"Organic Milk",  category:"Daily",   price:"4.99",  expireDate:"15/01/2026", totalProducts:9,   status:"Open Item",      thumbnail:"🥛" },
];

// ── Subcomponents (plain functions, no hooks, still server-safe) ──────────────

function StatCardItem({ card }: { card: StatCard }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: card.iconBg }}>
          {card.icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 leading-tight">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900 leading-tight">{card.value}</p>
        </div>
      </div>
      <p className="text-xs font-medium" style={{ color: "#3A7326" }}>{card.delta}</p>
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const meta = statusMeta[product.status];
  const isOpenItem = product.status === "Open Item";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Thumbnail */}
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0 border border-gray-100" aria-hidden="true">
          {product.thumbnail}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">{product.name}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2"/></svg>
              {product.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              ${product.price}
            </span>
          </div>
        </div>

        {/* Right: total count + status */}
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-500">Total Products</p>
          <p className="text-xl font-bold text-gray-900">{String(product.totalProducts).padStart(2, "0")}</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-50">
        <p className="text-xs font-medium" style={{ color: "#3A7326" }}>
          {isOpenItem ? "Open Expire Date:" : "Expire Date:"}{" "}
          <span className="font-semibold">{product.expireDate}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} aria-hidden="true" />
          <span className="text-xs font-medium" style={{ color: meta.color }}>{product.status}</span>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardHomePage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Stat cards */}
      <section aria-label="Summary statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARDS.map((card) => (
            <StatCardItem key={card.label} card={card} />
          ))}
        </div>
      </section>

      {/* Expiring products */}
      <section aria-label="Expiring products">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Expiring Products</h2>
            <p className="text-sm text-gray-500 mt-0.5">Track products nearing their expiry date.</p>
          </div>
          <button
            className="flex items-center gap-1.5 text-sm font-semibold shrink-0 rounded-xl px-3 py-2 border border-gray-200 hover:bg-gray-50 transition-colors"
            style={{ color: "#1A3340" }}
            aria-label="View all expiring products"
          >
            View all <ChevronDown size={15} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {PRODUCTS.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
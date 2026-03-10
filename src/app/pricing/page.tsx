"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap, Building2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

type Cycle = "monthly" | "yearly";

interface Plan {
  name: string;
  icon: React.ReactNode;
  monthlyPrice: string | null;
  yearlyPrice: string | null;
  period: string;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  featured: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    icon: <Sparkles size={20} />,
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    period: "7 days trial",
    tagline: "Try before you commit",
    description: "Full access to core features — no credit card required.",
    features: [
      "Up to 50 products",
      "Basic expiry alerts",
      "2 staff users",
      "Email support",
      "Barcode scanning",
      "Mobile dashboard",
    ],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Professional",
    icon: <Zap size={20} />,
    monthlyPrice: "$29",
    yearlyPrice: "$290",
    period: "per month",
    tagline: "For growing food businesses",
    description: "Everything you need to eliminate waste and stay compliant.",
    features: [
      "Unlimited products",
      "Advanced DLC alerts",
      "Up to 10 users",
      "Priority support",
      "Full audit trail",
      "Analytics & reports",
      "Multi-store support",
      "API access",
    ],
    cta: "Get Started",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    icon: <Building2 size={20} />,
    monthlyPrice: "$249",
    yearlyPrice: "$2,490",
    period: "per month",
    tagline: "For large-scale operations",
    description: "Custom integrations, dedicated support, and SLA guarantees.",
    features: [
      "Unlimited everything",
      "Dedicated account manager",
      "Custom integrations",
      "SSO & advanced security",
      "HACCP-ready exports",
      "EU data residency",
      "24/7 phone support",
      "Custom onboarding",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

const COMPARE_FEATURES = [
  { label: "Products tracked",      free: "50",        pro: "Unlimited",  ent: "Unlimited" },
  { label: "Staff users",           free: "2",         pro: "10",         ent: "Unlimited" },
  { label: "Expiry alerts",         free: "Basic",     pro: "Advanced",   ent: "Advanced"  },
  { label: "Audit trail",           free: false,       pro: true,         ent: true        },
  { label: "API access",            free: false,       pro: true,         ent: true        },
  { label: "Multi-store",           free: false,       pro: true,         ent: true        },
  { label: "Custom integrations",   free: false,       pro: false,        ent: true        },
  { label: "Dedicated support",     free: false,       pro: false,        ent: true        },
  { label: "EU data residency",     free: false,       pro: false,        ent: true        },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

function CheckCell({ value }: { value: boolean | string }) {
  if (value === false) return <span className="text-gray-500 text-lg">—</span>;
  if (value === true) return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: "#EEF3EA" }}>
      <Check size={13} style={{ color: "#3A7326" }} />
    </span>
  );
  return <span className="text-sm font-medium" style={{ color: "#1A3340" }}>{value}</span>;
}

export default function PricingPage() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const ref      = useRef(null);
  const tableRef = useRef(null);
  const inView       = useInView(ref,      { once: true, margin: "-60px" });
  const tableInView  = useInView(tableRef, { once: true, margin: "-60px" });

  return (
    <div
      className="min-h-screen pt-28 pb-10 px-4"
      style={{ backgroundColor: "#F8FDF6" }}
    >
      <div className="max-w-6xl mx-auto" ref={ref}>

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight" style={{ color: "#1A3340" }}>
            Pricing that scales
            <br />
            <span style={{ color: "#3A7326" }}>with your business</span>
          </h1>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: "#51564E" }}>
            No hidden fees. No surprises. Start free and upgrade when you're ready.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 mt-8 p-1 rounded-2xl" style={{ backgroundColor: "#EEF3EA", border: "1px solid #D4EAC8" }}>
            {(["monthly", "yearly"] as Cycle[]).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className="relative px-5 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  color:           cycle === c ? "white" : "#51564E",
                  backgroundColor: cycle === c ? "#3A7326" : "transparent",
                }}
              >
                {c === "yearly" ? (
                  <span className="flex items-center gap-2">
                    Yearly
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: "#A6DC94", color: "#1A3340" }}
                    >
                      Save 17%
                    </span>
                  </span>
                ) : "Monthly"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Plan cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="relative flex flex-col rounded-3xl overflow-hidden"
              style={{
                backgroundColor: plan.featured ? "#1A3340" : "white",
                border: plan.featured ? "none" : "1.5px solid #E5E7EB",
                boxShadow: plan.featured ? "0 24px 60px rgba(58,115,38,0.25)" : "0 2px 16px rgba(0,0,0,0.04)",
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-5 right-5">
                  <span
                    className="text-[10px] font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: "#A6DC94", color: "#1A3340" }}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-7 flex flex-col flex-1">
                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: plan.featured ? "rgba(166,220,148,0.15)" : "#EEF3EA",
                      color: plan.featured ? "#A6DC94" : "#3A7326",
                    }}
                  >
                    {plan.icon}
                  </div>
                  <div>
                    <p className="font-bold text-base" style={{ color: plan.featured ? "white" : "#1A3340" }}>
                      {plan.name}
                    </p>
                    <p className="text-xs" style={{ color: plan.featured ? "rgba(255,255,255,0.5)" : "#9CA3AF" }}>
                      {plan.tagline}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span
                    className="text-5xl font-extrabold"
                    style={{ color: plan.featured ? "#A6DC94" : "#1A3340" }}
                  >
                    {cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  {plan.monthlyPrice !== "$0" && (
                    <span className="text-sm ml-1" style={{ color: plan.featured ? "rgba(255,255,255,0.5)" : "#9CA3AF" }}>
                      /{cycle === "yearly" ? "yr" : "mo"}
                    </span>
                  )}
                </div>
                <p className="text-xs mb-6" style={{ color: plan.featured ? "rgba(255,255,255,0.45)" : "#9CA3AF" }}>
                  {plan.period}
                </p>

                {/* Divider */}
                <div
                  className="h-px mb-6"
                  style={{ backgroundColor: plan.featured ? "rgba(255,255,255,0.1)" : "#F0F0F0" }}
                />

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: plan.featured ? "rgba(166,220,148,0.15)" : "#EEF3EA",
                        }}
                      >
                        <Check size={11} style={{ color: plan.featured ? "#A6DC94" : "#3A7326" }} />
                      </span>
                      <span style={{ color: plan.featured ? "rgba(255,255,255,0.8)" : "#374151" }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className="w-full h-12 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    backgroundColor: plan.featured ? "#3A7326" : "#EEF3EA",
                    color:           plan.featured ? "white"   : "#3A7326",
                  }}
                >
                  {plan.cta}
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Comparison table ── */}
        <div ref={tableRef}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-2xl font-extrabold text-center mb-8"
            style={{ color: "#1A3340" }}
          >
            Full feature comparison
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white"
          >
            {/* Table header */}
            <div
              className="grid text-sm font-bold"
              style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", backgroundColor: "#1A3340" }}
            >
              <div className="px-6 py-4 text-white">Feature</div>
              {["Free", "Professional", "Enterprise"].map((h) => (
                <div key={h} className="px-6 py-4 text-center" style={{ color: "#A6DC94" }}>
                  {h}
                </div>
              ))}
            </div>

            {/* Rows */}
            {COMPARE_FEATURES.map((row, i) => (
              <div
                key={row.label}
                className="grid text-sm items-center"
                style={{
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  borderBottom: i < COMPARE_FEATURES.length - 1 ? "1px solid #F5F5F5" : "none",
                  backgroundColor: i % 2 === 0 ? "white" : "#FAFAFA",
                }}
              >
                <div className="px-6 py-4 font-medium" style={{ color: "#374151" }}>
                  {row.label}
                </div>
                {[row.free, row.pro, row.ent].map((val, j) => (
                  <div key={j} className="px-6 py-4 flex items-center justify-center">
                    <CheckCell value={val} />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={tableInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-base" style={{ color: "#51564E" }}>
            Not sure which plan is right for you?{" "}
            <Link href="/contact" className="font-semibold underline underline-offset-2" style={{ color: "#3A7326" }}>
              Talk to our team
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
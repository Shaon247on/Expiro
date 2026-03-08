"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Users } from "lucide-react";

type BillingCycle = "monthly" | "yearly";

interface PricingPlan {
  name: string;
  featured: boolean;
  monthlyPrice: string;
  monthlyPeriod: string;
  yearlyPrice: string;
  yearlyPeriod: string;
  description: string;
  features: string[];
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    featured: false,
    monthlyPrice: "$0",
    monthlyPeriod: "7 days for free",
    yearlyPrice: "$0",
    yearlyPeriod: "7 days for free",
    description: "Try all features free for 7 days",
    features: [
      "Up to 50 products",
      "Basic expiry alerts",
      "2 user",
      "Email support",
      "Advanced Security",
    ],
  },
  {
    name: "Professional",
    featured: true,
    monthlyPrice: "$29",
    monthlyPeriod: "Monthly",
    yearlyPrice: "$290",
    yearlyPeriod: "Yearly",
    description: "Full access for growing businesses",
    features: [
      "Unlimited products",
      "Advanced alerts & reports",
      "Up to 10 users",
      "Priority support",
      "Traceability logs",
    ],
  },
  {
    name: "Enterprise",
    featured: false,
    monthlyPrice: "$249",
    monthlyPeriod: "Monthly",
    yearlyPrice: "$249",
    yearlyPeriod: "Yearly",
    description: "Best value — save over 28%",
    features: [
      "Everything in Monthly",
      "Unlimited users",
      "Custom branding",
      "Dedicated account manager",
      "Priority Security",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function PricingSection() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="w-full py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Label pill */}
        <div className="flex justify-center mb-5">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm"
            style={{ color: "#51564E" }}
          >
            <Users size={14} aria-hidden="true" />
            Plans and pricing
          </motion.span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={1}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-tight mb-4"
          >
            Simple And Affordable
            <br />
            Pricing For Expiro Teams
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={2}
            className="text-base md:text-lg"
            style={{ color: "#51564E" }}
          >
            Choose the best plan for your business. Change plans as you grow.
          </motion.p>
        </div>

        {/* Toggle */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={3}
          className="flex justify-center mb-10"
        >
          <div
            className="inline-flex items-center rounded-full p-1 gap-1"
            style={{ backgroundColor: "#E8F5E2", border: "1px solid #C5E0B8" }}
            role="group"
            aria-label="Billing cycle"
          >
            <button
              onClick={() => setBilling("monthly")}
              className="rounded-full px-5 py-2 text-sm font-medium transition-all"
              style={
                billing === "monthly"
                  ? { backgroundColor: "#3A7326", color: "white" }
                  : { color: "#51564E" }
              }
              aria-pressed={billing === "monthly"}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className="rounded-full px-5 py-2 text-sm font-medium transition-all flex items-center gap-2"
              style={
                billing === "yearly"
                  ? { backgroundColor: "#3A7326", color: "white" }
                  : { color: "#51564E" }
              }
              aria-pressed={billing === "yearly"}
            >
              Yearly
            </button>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold mr-1"
              style={{ backgroundColor: "#D4EAC8", color: "#3A7326" }}
            >
              2-Months Free
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {plans.map((plan, i) => {
            const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const period = billing === "monthly" ? plan.monthlyPeriod : plan.yearlyPeriod;

            return (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={i + 4}
                className="flex flex-col rounded-2xl p-6 md:p-7"
                style={{
                  backgroundColor: plan.featured ? "#EEF3EA" : "white",
                  border: plan.featured
                    ? "1.5px solid #3A7326"
                    : "1.5px solid #D4EAC8",
                  boxShadow: plan.featured
                    ? "0 4px 24px rgba(58,115,38,0.12)"
                    : "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                {/* Plan name */}
                <p
                  className="text-base font-semibold mb-4"
                  style={{ color: plan.featured ? "#3A7326" : "#51564E" }}
                >
                  {plan.name}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-black">{price}</span>
                  <span className="text-sm" style={{ color: "#51564E" }}>
                    / {period}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm mb-6" style={{ color: "#51564E" }}>
                  {plan.description}
                </p>

                {/* CTA */}
                <button
                  className="w-full rounded-xl py-3 text-sm font-semibold mb-6 transition-opacity hover:opacity-80"
                  style={
                    plan.featured
                      ? { backgroundColor: "#3A7326", color: "white" }
                      : {
                          backgroundColor: "white",
                          color: "#3A7326",
                          border: "1.5px solid #C5E0B8",
                        }
                  }
                  aria-label={`Get started with ${plan.name} plan`}
                >
                  Get Started
                </button>

                {/* Divider */}
                <div
                  className="border-t mb-6"
                  style={{ borderColor: "#C5E0B8", borderStyle: "dashed" }}
                />

                {/* Features */}
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-black">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#D4EAC8" }}
                      >
                        <Check size={11} color="#3A7326" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
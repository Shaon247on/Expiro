"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Users, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { subscribeToPlanAction } from "@/actions/admin/subscription.action";
import type { BillingCycle, SubscriptionPlan, SubscriptionPlanType } from "@/types/subscription.type";
import type { SessionUser } from "@/app/pricing/page";

interface PricingSectionProps {
  plans: SubscriptionPlan[];
  user: SessionUser | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function formatCurrency(currency: string, value: string | null) {
  if (value == null) return null;

  const amount = Number(value);
  if (Number.isNaN(amount)) return value;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getDisplayPrice(plan: SubscriptionPlan, billing: BillingCycle) {
  if (plan.plan_type === "enterprise") {
    return { price: "Custom", period: "quote" };
  }

  if (plan.plan_type === "free") {
    return { price: "Free", period: "forever" };
  }

  const raw =
    billing === "monthly"
      ? formatCurrency(plan.currency, plan.price_monthly)
      : formatCurrency(plan.currency, plan.price_yearly);

  return {
    price: raw ?? "Custom",
    period: billing === "monthly" ? "month" : "year",
  };
}

function getPlanDescription(plan: SubscriptionPlan) {
  if (plan.plan_type === "enterprise") {
    return "Tailored pricing and infrastructure for large organizations.";
  }

  if (plan.plan_type === "free") {
    return "Start free and explore the platform with essential limits.";
  }

  return plan.support;
}

function getFeatureList(plan: SubscriptionPlan) {
  if (plan.plan_type === "enterprise") {
    return plan.features.map(() => "Custom");
  }

  const extras = [
    plan.products_limit != null
      ? `Up to ${plan.products_limit} products`
      : null,
    plan.users_limit != null ? `Up to ${plan.users_limit} users` : null,
    plan.locations_limit != null ? `${plan.locations_limit} locations` : null,
    plan.monthly_sales_limit != null
      ? `Monthly sales limit ${plan.monthly_sales_limit}`
      : null,
    plan.alerts_per_week != null
      ? `${plan.alerts_per_week} alerts per week`
      : null,
    plan.traceability ? "Traceability enabled" : null,
  ].filter(Boolean) as string[];

  return Array.from(new Set([...plan.features, ...extras])).slice(0, 8);
}

export default function PricingSection({ plans, user }: PricingSectionProps) {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const router = useRouter();

  const activePlans = useMemo(
    () => plans.filter((plan) => plan.is_active),
    [plans],
  );

  const isLoggedIn = !!user;
  const currentPlanType = user?.plan_type ?? null;

  const handleSelectPlan = (
    plan: SubscriptionPlan
  ) => {
    if (!isLoggedIn) {
      router.push(`/login?next=/pricing`);
      return;
    }

    if (currentPlanType === plan.plan_type) {
      return;
    }

    setPendingPlan(plan.id);

    startTransition(async () => {
      try {
        const result = await subscribeToPlanAction({
          plan_type: plan.plan_type as SubscriptionPlanType,
          billing_cycle: billing,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        // ✅ FREE PLAN FLOW
        if (plan.plan_type === "free") {
          toast.success("Free plan activated");

          window.location.href = "/dashboard";
          router.refresh(); // re-fetch session
          return;
        }
        console.log(result)

        // ✅ PAID PLAN FLOW
        if (result?.checkout_url) {
          window.location.href = result.checkout_url;
        }
      } catch {
        toast.error("Something went wrong.");
      }                                                                                          finally {
        setPendingPlan(null);
      }
    });
  };

  return (
    <section ref={ref} className="w-full py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
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

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={3}
          className="flex justify-center mb-10"
        >
          <div
            className="inline-flex items-center rounded-full p-1 gap-1 flex-wrap justify-center"
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
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling("yearly")}
              className="rounded-full px-5 py-2 text-sm font-medium transition-all"
              style={
                billing === "yearly"
                  ? { backgroundColor: "#3A7326", color: "white" }
                  : { color: "#51564E" }
              }
            >
              Yearly
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {activePlans.map((plan, i) => {
            const { price, period } = getDisplayPrice(plan, billing);
            const features = getFeatureList(plan);
            const loading = isPending && pendingPlan === plan.id;
            const isCurrentPlan = !!user && currentPlanType === plan.plan_type;

            let buttonLabel = "Purchase";
            if (plan.plan_type === "enterprise") buttonLabel = "Contact Us";
            else if (!isLoggedIn) buttonLabel = "Login to Continue";
            else if (isCurrentPlan) buttonLabel = "Current Plan";
            else if (plan.plan_type === "free") buttonLabel = "Free Plan";

            return (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={i + 4}
                className="flex flex-col rounded-2xl p-6 md:p-7"
                style={{
                  backgroundColor: plan.is_recommended ? "#EEF3EA" : "white",
                  border: isCurrentPlan
                    ? "1.5px solid #1D4ED8"
                    : plan.is_recommended
                      ? "1.5px solid #3A7326"
                      : "1.5px solid #D4EAC8",
                  boxShadow: plan.is_recommended
                    ? "0 4px 24px rgba(58,115,38,0.12)"
                    : "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <p
                    className="text-base font-semibold"
                    style={{
                      color: plan.is_recommended ? "#3A7326" : "#51564E",
                    }}
                  >
                    {plan.name}
                  </p>

                  <div className="flex flex-col items-end gap-2">
                    {plan.is_recommended ? (
                      <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-[#D4EAC8] text-[#3A7326]">
                        Recommended
                      </span>
                    ) : null}

                    {isCurrentPlan ? (
                      <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700">
                        Ongoing
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-black">
                    {price}
                  </span>
                  <span className="text-sm" style={{ color: "#51564E" }}>
                    / {period}
                  </span>
                </div>

                <p className="text-sm mb-6" style={{ color: "#51564E" }}>
                  {getPlanDescription(plan)}
                </p>

                {plan.plan_type === "enterprise" ? (
                  <Link
                    href="/contact"
                    className="w-full rounded-xl py-3 text-sm font-semibold mb-6 text-center transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: "white",
                      color: "#3A7326",
                      border: "1.5px solid #C5E0B8",
                    }}
                  >
                    {buttonLabel}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={loading || isCurrentPlan}
                    className="w-full rounded-xl py-3 text-sm font-semibold mb-6 transition-opacity hover:opacity-80 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={
                      plan.is_recommended
                        ? { backgroundColor: "#3A7326", color: "white" }
                        : {
                            backgroundColor: "white",
                            color: "#3A7326",
                            border: "1.5px solid #C5E0B8",
                          }
                    }
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      buttonLabel
                    )}
                  </button>
                )}

                <div
                  className="border-t mb-6"
                  style={{ borderColor: "#C5E0B8", borderStyle: "dashed" }}
                />

                <ul className="flex flex-col gap-3">
                  {features.map((feat, idx) => (
                    <li
                      key={`${plan.id}-${feat}-${idx}`}
                      className="flex items-center gap-3 text-sm text-black"
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#D4EAC8" }}
                      >
                        <Check
                          size={11}
                          color="#3A7326"
                          strokeWidth={3}
                          aria-hidden="true"
                        />
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

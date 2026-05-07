"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  subscribeToPlanAction,
} from "@/actions/admin/subscription.action";
import type {
  SubscriptionPlan,
  SubscriptionPlanType,
} from "@/types/subscription.type";

interface Props {
  plans: SubscriptionPlan[];
}

export default function PlansClient({ plans }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSelectPlan = (
    planType: SubscriptionPlanType
  ) => {
    startTransition(async () => {
      try {
        const result = await subscribeToPlanAction({
          plan_type: planType as any,
          billing_cycle: "monthly",
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        // 🟢 FREE PLAN FLOW
        if (planType === "free") {
          toast.success("Free plan activated");

          // refresh server state + middleware session
          router.refresh();

          // redirect to dashboard
          router.push("/dashboard");
          return;
        }

        // 💳 PAID PLAN FLOW
        if (result.data?.checkout_url) {
          window.location.href = result.data.checkout_url;
        }
      } catch {
        toast.error("Something went wrong.");
      }
    });
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-[#F7FCF9]">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-10">
          Choose Your Plan
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isFree = plan.plan_type === "free";

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border bg-white p-6 shadow-sm flex flex-col justify-between ${
                  plan.is_recommended
                    ? "border-green-500 ring-2 ring-green-200"
                    : "border-gray-100"
                }`}
              >
                {/* Header */}
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    {plan.name}
                  </h2>

                  <p className="text-sm text-gray-500 mb-4">
                    {typeof plan.display_price === "string"
                      ? plan.display_price
                      : `€${plan.display_price.monthly}/mo`}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 text-sm text-gray-600">
                    {plan.features.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button
                  disabled={isPending}
                  onClick={() =>
                    handleSelectPlan(plan.plan_type)
                  }
                  className="mt-6 w-full h-10 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isFree ? "Start Free" : "Get Started"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
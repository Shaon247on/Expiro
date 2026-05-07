import { getSubscriptionPlansAction } from "@/actions/admin/subscription.action";
import PricingSection from "@/components/landing/pricing/PricingSection";
import { cookies } from "next/headers";
import { COOKIE } from "@/lib/auth/cookies";
import type { SessionUser } from "@/app/pricing/page";

export const metadata = {
  title: "Choose Your Plan — Expiro",
};

export default async function PlansPage() {
  const [result, cookieStore] = await Promise.all([
    getSubscriptionPlansAction(),
    cookies(),
  ]);

  // ✅ Extract session
  const session = cookieStore.get(COOKIE.session)?.value;

  let user: SessionUser | null = null;

  if (session) {
    try {
      user = JSON.parse(session) as SessionUser;
    } catch {
      user = null; // fallback safety
    }
  }

  if (!result.success) {
    return (
      <div className="p-6 text-sm text-red-500">
        {result.message}
      </div>
    );
  }

  return <PricingSection plans={result.data} user={user} />;
}
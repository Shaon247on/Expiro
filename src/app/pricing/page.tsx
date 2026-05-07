import { cookies } from "next/headers";
import { getSubscriptionPlansAction } from "@/actions/admin/subscription.action";
import { COOKIE } from "@/lib/auth/cookies";
import PricingSection from "@/components/landing/pricing/PricingSection";

export const metadata = {
  title: "Pricing — Expiro",
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "staff" | "admin";
  profile_image: string;
  shop_category: "restaurant" | "super_market" | null;
  is_active: boolean;
  plan_type: "free" | "starter" | "professional" | "enterprise";
};

export default async function PricingPage() {
  const result = await getSubscriptionPlansAction();

  const cookieStore = await cookies();
  const rawSession = cookieStore.get(COOKIE.session)?.value;

  let user: SessionUser | null = null;

  if (rawSession) {
    try {
      user = JSON.parse(rawSession) as SessionUser;
    } catch {
      user = null;
    }
  }

  if (!result.success) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="rounded-2xl border border-red-100 bg-white p-6 text-sm text-red-500 shadow-sm">
          {result.message}
        </div>
      </div>
    );
  }

  return <PricingSection plans={result.data} user={user} />;
}
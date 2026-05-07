"use client";

import { useEffect, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { refreshSessionAction } from "@/actions/auth/refreshSession.action";

export default function PaymentSuccessPage() {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      await refreshSessionAction();
    });
  }, []);

  return (
    <div className="min-h-[70vh] px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl border border-green-100 bg-white shadow-sm p-8 text-center">
        
        <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Successful
        </h1>

        <p className="text-sm md:text-base text-gray-600 mb-8">
          Your subscription has been updated successfully.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#3A7326]"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/pricing"
            className="px-6 py-3 rounded-xl text-sm font-semibold border"
          >
            Back to Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
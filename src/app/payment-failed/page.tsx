import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = {
  title: "Payment Failed — Expiro",
};

export default function PaymentFailedPage() {
  return (
    <div className="min-h-[70vh] px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl border border-red-100 bg-white shadow-sm p-8 text-center">
        <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <XCircle className="w-9 h-9 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Failed
        </h1>

        <p className="text-sm md:text-base text-gray-600 mb-8">
          Your payment could not be completed. Please try again or contact
          support if the issue persists.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pricing"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#3A7326] hover:opacity-90 transition-opacity"
          >
            Try Again
          </Link>

          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
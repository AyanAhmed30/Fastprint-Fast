"use client";

import { useRouter } from "next/navigation";

const PaymentCancel = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#2A428C]">Payment Cancelled</h1>

          <p className="text-sm md:text-base text-gray-700 max-w-xl">
            You cancelled the payment. If this was a mistake you can try again or contact support for help.
          </p>

          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
            <button
              onClick={() => router.push("/design-project")}
              className="flex-1 bg-gradient-to-r from-[#016AB3] to-[#0096CD] hover:from-[#005f98] hover:to-[#007fae] text-white font-semibold py-3 rounded-full shadow-md transition"
            >
              Try Again
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-white border border-[#0096CD] text-[#0096CD] font-semibold py-3 rounded-full shadow-sm hover:bg-[#f0fbff] transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
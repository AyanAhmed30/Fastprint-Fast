"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/services/baseUrl";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    const sendThankYouEmail = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          await axios.post(
            `${BASE_URL}api/send-thank-you-email/`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Thank you email sent successfully");
        }
      } catch (error) {
        console.error("Error sending thank you email:", error);
        // Not critical to show to user
      }
    };

    sendThankYouEmail();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC] flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 6L9 17l-5-5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#2A428C]">Payment Successful!</h1>

          <p className="text-sm md:text-base text-gray-700 max-w-xl">
            Thank you for your purchase. Your payment has been completed successfully.
            <br />
            If you need help with your order, contact us at
            <span className="text-[#0096CD] font-semibold"> +1 469-277-7489</span>
          </p>

          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-gradient-to-r from-[#016AB3] to-[#0096CD] hover:from-[#005f98] hover:to-[#007fae] text-white font-semibold py-3 rounded-full shadow-md transition"
            >
              Back to Home
            </button>

            <button
              onClick={() => router.push("/orders")}
              className="flex-1 bg-white border border-[#0096CD] text-[#0096CD] font-semibold py-3 rounded-full shadow-sm hover:bg-[#f0fbff] transition"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
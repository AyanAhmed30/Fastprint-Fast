"use client";
import Image from "next/image";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/services/baseUrl";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCardForm from "@/components/StripeCardForm";
import { deleteCartItem } from "@/services/cartService";

const stripePromise = loadStripe(
  "pk_test_51QbTz6RxiPcxiXelLov7aonk68MVy3OVLHYOsdTyOaTH1pQ3FfSql0TjE4WNd0pgzs5qyJUaBXtd3ar5GLP4ESP400FHqiRJF9"
);

const Payment = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [projectData, setProjectData] = useState(null);

  // Load project data from localStorage
  useEffect(() => {
    const fetchLocalStorageData = () => {
      try {
        const data = localStorage.getItem("previewProjectData");
        if (data) {
          const parsedData = JSON.parse(data);
          setProjectData(parsedData);
        }
      } catch (e) {
        console.warn("Error accessing localStorage");
      }
    };

    fetchLocalStorageData();
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  // Get payment data from localStorage (passed from Shop)
  const [initialData, setInitialData] = useState({
    previewProject: "",
    bookPrice: 0,
    productQuantity: 1,
    subtotal: 0,
    shippingRate: 0,
    tax: 0,
    totalAmount: 0,
    selectedService: null,
    taxRate: "0.00%",
    accountType: "individual",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("paymentData");
      if (saved) {
        setInitialData(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("No valid payment data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const {
    previewProject = "",
    bookPrice = 0,
    productQuantity = 1,
    subtotal = 0,
    shippingRate = 0,
    tax = 0,
    totalAmount = 0,
    selectedService = null,
    taxRate = "0.00%",
    accountType = "individual",
  } = initialData;

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPayPalLoading, setIsPayPalLoading] = useState(false);
  const [paypalError, setPaypalError] = useState(null);

  // Construct line items for Stripe, in cents, quantity as integer
  const lineItems = [];

  // Add Book item if price > 0
  if (bookPrice > 0) {
    lineItems.push({
      name: "Book",
      unit_amount: Math.round(bookPrice * 100),
      quantity: productQuantity,
    });
  }

  // Add shipping if cost > 0
  if (shippingRate > 0) {
    lineItems.push({
      name: selectedService
        ? `Shipping (${selectedService.courier_name})`
        : "Shipping",
      unit_amount: Math.round(shippingRate * 100),
      quantity: 1,
    });
  }

  // Add tax if cost > 0
  if (tax > 0) {
    lineItems.push({
      name: taxRate && taxRate !== "0.00%" ? `Tax (${taxRate})` : "Tax",
      unit_amount: Math.round(tax * 100),
      quantity: 1,
    });
  }

  // Stripe button handler
  const handleClick = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const stripe = await stripePromise;
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setErrorMessage("You need to be logged in to complete your purchase.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}api/create-checkout-session/`,
        {
          items: lineItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const session = response.data;

      if (session.error) {
        setErrorMessage(session.error);
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      if (err.response?.status === 401) {
        setErrorMessage("Authentication failed. Please log in again.");
      } else {
        setErrorMessage(
          "Currently This Payment Method is Disabled Please Use Another Method"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // PayPal checkout handler
  const handlePayPalCheckout = async () => {
    if (!totalAmount || totalAmount <= 0) {
      setPaypalError("Invalid amount");
      return;
    }

    setIsPayPalLoading(true);
    setPaypalError(null);

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Please log in to continue");
      }

      // Create PayPal payment
      const response = await axios.post(
        `${BASE_URL}api/paypal/create-payment/`,
        {
          amount: totalAmount.toFixed(2),
          currency: "USD",
          return_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { payment_id, approval_url } = response.data;

      if (approval_url) {
        // Store payment ID and order details for later use
        localStorage.setItem("paypal_payment_id", payment_id);
        localStorage.setItem(
          "order_details",
          JSON.stringify({
            subtotal,
            shipping: shippingRate,
            tax,
            total: totalAmount,
            selectedService,
          })
        );

        // Redirect to PayPal for approval
        window.location.href = approval_url;
      } else {
        throw new Error("No approval URL received from PayPal");
      }
    } catch (error) {
      console.error("PayPal checkout error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to initiate PayPal checkout";
      setPaypalError(errorMessage);
    } finally {
      setIsPayPalLoading(false);
    }
  };

  // After payment success:
  const handleOrderAfterPayment = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const pendingOrder = JSON.parse(localStorage.getItem("pendingOrderData"));
      if (!pendingOrder) {
        alert("Missing order data. Please go back to Shop.");
        router.push("/shop");
        return;
      }

      const formData = new FormData();
      const design = JSON.parse(pendingOrder.previewForm);
      const project = JSON.parse(pendingOrder.previewProject);

      // Prefer using existing uploaded project to avoid requiring files after re-login
      const existingProjectId = project?.projectId || project?.id;
      if (existingProjectId) {
        formData.append("book_project_id", String(existingProjectId));
      } else {
        // Fallback: include full project metadata and files (legacy path)
        const bookFile = window.tempBookFileForSubmission;
        const coverFile = window.tempCoverFileForSubmission;

        formData.append("title", project.projectTitle || "");
        formData.append("category", project.category);
        formData.append("language", project.language);
        formData.append("pdf_file", bookFile);
        if (coverFile) formData.append("cover_file", coverFile);
      }

      const drop = JSON.parse(localStorage.getItem("previewDropdowns") || "{}");
      const findName = (arr, id) => {
        if (!arr || !id) return "";
        const m = (arr || []).find((o) => String(o.id) === String(id));
        return m?.dbName || m?.name || "";
      };

      // Only send spec fields if creating a new project (no existing id)
      if (!existingProjectId) {
        formData.append("binding_type", findName(drop.bindings, design.binding_id));
        formData.append("cover_finish", findName(drop.cover_finishes, design.cover_finish_id));
        formData.append("interior_color", findName(drop.interior_colors, design.interior_color_id));
        formData.append("paper_type", findName(drop.paper_types, design.paper_type_id));
        if (project.category !== "Calendar" && project.category !== "Calender") {
          formData.append("trim_size", findName(drop.trim_sizes, design.trim_size_id));
        }
        formData.append("page_count", design.page_count || 1);
      }

      // Shipping + account details
      Object.entries(pendingOrder.form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Shipping outcome
      if (pendingOrder.selectedService) formData.append("selected_service", JSON.stringify(pendingOrder.selectedService));
      if (pendingOrder.courierName) formData.append("courier_name", pendingOrder.courierName);
      if (pendingOrder.estimatedDelivery) formData.append("estimated_delivery", pendingOrder.estimatedDelivery);

      const toMoney = (v) => (v === null || v === undefined || isNaN(v) ? "" : Number(v).toFixed(2));
      if (pendingOrder.shippingRate !== null) formData.append("shipping_rate", toMoney(pendingOrder.shippingRate));
      if (pendingOrder.tax !== null) formData.append("tax", toMoney(pendingOrder.tax));

      // Pricing summary
      formData.append("product_quantity", String(pendingOrder.productQuantity));
      formData.append("product_price", toMoney(pendingOrder.productPrice || 0));
      formData.append("subtotal", toMoney(pendingOrder.subtotal || 0));
      formData.append("order_status", "paid");

      // Save the order
      await axios.post(
        `${BASE_URL}api/book/save-order/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ NEW: Delete the cart item from backend after successful order
      await deleteCartItem(pendingOrder.id);

      // Clean up localStorage
      localStorage.removeItem("pendingOrderData");
      localStorage.removeItem("paymentData");

      // Redirect to success
      router.push("/success");
    } catch (error) {
      console.error("Order save after payment error:", error.response?.data || error.message);
      alert("Failed to save order after payment. Please contact support.");
    }
  };

  // Cancel button handlers
  const handleEditClick = () => {
    router.back();
  };

  const handleEditClickCancel = () => {
    router.push("/start-project");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="w-full h-[51px] flex items-center px-4 sm:px-6"
        style={{
          background:
            "linear-gradient(90deg, #016AB3 16.41%, #0096CD 60.03%, #00AEDC 87.93%)",
        }}
      >
        <h1 className="text-white text-lg font-semibold">Checkout Page</h1>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] px-4 py-6 sm:px-8 sm:py-10 font-sans">
        <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Section - Payment Info */}
          <div className="w-full lg:w-[58%] bg-gradient-to-br from-[#f2f9ff] via-white to-[#fff0f5] rounded-2xl shadow-xl p-6 md:p-10 flex flex-col justify-between min-h-[600px]">
            <div>
              <h2 className="text-2xl font-bold text-[#2A428C] mb-1">Payment Info</h2>
              <p className="text-sm text-gray-600 mb-6">All transactions are secure and encrypted</p>

              {/* Credit Card Option */}
              <div className="border p-4 rounded-lg mb-3 hover:bg-gray-50 cursor-pointer flex items-center">
                <label className="flex items-center gap-3 cursor-pointer w-full">
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">Credit Card</span>
                  <div className="flex gap-2 ml-auto">
                    <img
                      src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg"
                      alt="Visa"
                      className="h-5 md:h-6"
                    />
                    <img
                      src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"
                      alt="Mastercard"
                      className="h-5 md:h-6"
                    />
                  </div>
                </label>
              </div>

              {/* PayPal Option */}
              <div className="border p-4 rounded-lg mb-5 hover:bg-gray-50 cursor-pointer flex items-center">
                <label className="flex items-center gap-3 cursor-pointer w-full">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">PayPal</span>
                  
                </label>
                <Image
  src="data:image/webp;base64,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"
  alt="PayPal Logo"
  width={40}
  height={25}
  className="object-contain"
/>
              </div>

              {/* Error Display */}
              {(errorMessage || paypalError) && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center">
                  <span>{errorMessage || paypalError}</span>
                </div>
              )}

              {/* Stripe Elements Card Form - Only show when Credit Card is selected */}
              {paymentMethod === "credit_card" && (
                <Elements stripe={stripePromise}>
                  <StripeCardForm
                    amount={totalAmount}
                    onSuccess={() => {
                      // Add project to Orders (localStorage cart) only after payment
                      if (projectData) {
                        const user = JSON.parse(localStorage.getItem('user'));
                        const cartKey = `cart_${user?.id || 'guest'}`;
                        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
                        cart.push({ ...projectData, paid: true, paidAt: new Date().toISOString() });
                        localStorage.setItem(cartKey, JSON.stringify(cart));
                      }
                      // Call handleOrderAfterPayment() after payment is successful (Stripe/PayPal onSuccess callback)
                      handleOrderAfterPayment();
                    }}
                    onError={(error) => setErrorMessage(error)}
                    disabled={!totalAmount || totalAmount <= 0}
                  />
                </Elements>
              )}

              {/* PayPal Info - Only show when PayPal is selected */}
              {paymentMethod === "paypal" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <h4 className="text-blue-800 font-semibold text-sm md:text-base">PayPal Checkout</h4>
                  </div>
                  <p className="text-xs md:text-sm text-blue-700">
                    You'll be redirected to PayPal to complete your payment securely.
                    After payment, you'll be redirected back to our site.
                  </p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleEditClickCancel}
                className="w-full sm:w-1/2 py-3 bg-gray-200 text-black font-medium text-base rounded-full shadow hover:shadow-lg transition-all duration-200 border border-gray-300"
              >
                Cancel
              </button>
              <div className="w-full sm:w-1/2 flex items-center">
                {paymentMethod === "paypal" && (
                  <button
                    onClick={handlePayPalCheckout}
                    disabled={isPayPalLoading || !totalAmount || totalAmount <= 0}
                    className={`
                      w-full py-3 px-4 md:px-6 rounded-full font-semibold text-white transition-all duration-200 text-base
                      ${isPayPalLoading || !totalAmount || totalAmount <= 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#0070ba] hover:bg-[#005ea6] active:bg-[#004c87] shadow-md hover:shadow-lg'
                      }
                    `}
                  >
                    {isPayPalLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a9.124 9.124 0 0 1-.045.289c-1.07 5.455-4.665 7.314-9.244 7.314H9.942a.641.641 0 0 0-.633.74l-.678 4.299-.191 1.207a.33.33 0 0 0 .326.384h2.292c.459 0 .85-.334.924-.788l.038-.207.730-4.625.047-.253c.074-.454.465-.788.924-.788h.582c3.729 0 6.646-1.514 7.49-5.895.354-1.837.171-3.373-.645-4.483-.302-.412-.714-.744-1.202-.99z" />
                        </svg>
                        <span>Confirm & Place Order</span>
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Amount display for PayPal */}
            {paymentMethod === "paypal" && totalAmount > 0 && (
              <div className="text-center text-xs md:text-sm text-gray-600 mt-3">
                Total: ${totalAmount.toFixed(2)} USD
              </div>
            )}
          </div>

          {/* Right Section - Cart Summary */}
          <div className="w-full lg:w-[42%] flex items-stretch">
            <div className="w-full h-auto bg-gradient-to-br from-[#e0f3ff] via-white to-[#ffe4ec] rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[600px]">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#2A428C] text-lg md:text-xl font-semibold">Cart Summary</h3>
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-1 md:gap-2 text-[#2A428C] font-semibold text-sm md:text-base cursor-pointer hover:text-blue-600 transition-colors focus:outline-none"
                  aria-label="Edit cart"
                >
                  <span>Edit</span>
                  <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                  </svg>
                </button>
              </div>

              {/* Project Info Card */}
              <div className="bg-[#E5FBFF] rounded-xl p-4 mb-6">
                <h4 className="text-[#2A428C] font-bold text-base md:text-lg mb-2">
                  Project Title: {(() => {
                    try {
                      const parsed = typeof previewProject === "string" ? JSON.parse(previewProject) : previewProject;
                      return parsed?.projectTitle || '—';
                    } catch {
                      return '—';
                    }
                  })()}
                </h4>

                <div className="space-y-1.5 text-sm md:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold text-black">  ${(
                      (bookPrice || 0) +
                      (shippingRate || 0) +
                      (tax || 0)
                    ).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-bold text-[#2A428C]">{productQuantity}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="text-xs md:text-sm space-y-2.5 mb-6">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-[#2A428C] font-bold">${subtotal ? subtotal.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600">
                    Shipping {selectedService && `(${selectedService.courier_name})`}
                  </span>
                  <span className="text-gray-900 font-bold">${shippingRate ? shippingRate.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600">
                    Taxes {taxRate && taxRate !== "0.00%" && `(${taxRate})`}
                  </span>
                  <span className="text-gray-900 font-bold">${tax ? tax.toFixed(2) : '0.00'}</span>
                </div>
                <hr className="border-gray-200 my-2" />
                <div className="flex justify-between font-bold text-base md:text-lg">
                  <span className="text-[#2A428C]">Total</span>
                  <span className="text-[#2A428C]">${totalAmount ? totalAmount.toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
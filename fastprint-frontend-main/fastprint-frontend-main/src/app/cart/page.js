"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit3, ShoppingBag, ArrowRight, Package } from "lucide-react";

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
      if (items.length === 0) {
        return;
      }
      setCartItems(items);
    } catch (e) {
      console.error("Failed to load cart items", e);
      router.push("/shop");
    }
  }, [router]);

  const handleProceedToPayment = (item) => {
    localStorage.setItem("pendingOrderData", JSON.stringify(item));
    localStorage.setItem(
      "paymentData",
      JSON.stringify({
        bookPrice: item.displayTotalCost || 0,
        productQuantity: item.productQuantity || 1,
        subtotal: item.subtotal || 0,
        shippingRate: item.shippingRate || 0,
        tax: item.tax || 0,
        totalAmount: (item.subtotal || 0) + (item.shippingRate || 0) + (item.tax || 0),
        selectedService: item.selectedService,
        taxRate: item.taxRate,
        accountType: item.accountType,
      })
    );
    router.push("/payment");
  };

  const handleEditItem = (item) => {
    localStorage.setItem("previewFormData", item.previewForm);
    localStorage.setItem("previewProjectData", item.previewProject);

    try {
      const form = JSON.parse(item.previewForm);
      const project = JSON.parse(item.previewProject);
      const dropdowns = JSON.parse(localStorage.getItem("previewDropdowns") || "{}");

      const findName = (arr, id) => {
        if (!arr || !id) return "";
        const m = (arr || []).find((o) => String(o.id) === String(id));
        return m?.dbName || m?.name || "";
      };

      const shopBookDetails = {
        trim_size: findName(dropdowns.trim_sizes, form.trim_size_id),
        page_count: form.page_count,
        interior_color: findName(dropdowns.interior_colors, form.interior_color_id),
        paper_type: findName(dropdowns.paper_types, form.paper_type_id),
        binding_typr: findName(dropdowns.bindings, form.binding_id),
        cover_finish: findName(dropdowns.cover_finishes, form.cover_finish_id),
      };

      localStorage.setItem("shopBookDetails", JSON.stringify(shopBookDetails));
    } catch (e) {
      console.warn("Could not reconstruct shopBookDetails for edit", e);
    }

    localStorage.setItem(
      "shopData",
      JSON.stringify({
        originalTotalCost: item.subtotal,
        finalTotalCost: item.subtotal,
        totalCost: item.subtotal,
        productQuantity: item.productQuantity,
        costPerBook: item.productPrice,
      })
    );

    router.push("/shop");
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Your cart is empty.</p>

          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
            <button
              onClick={() => router.push("/")}
              className="flex-1 px-10 bg-gradient-to-r from-[#016AB3] to-[#0096CD] hover:from-[#005f98] hover:to-[#007fae] text-white font-semibold py-3 rounded-full shadow-md transition"
            >
              Back to Home
            </button>

            <button
              onClick={() => router.push("/orders")}
              className="flex-1 px-10 bg-white border border-[#0096CD] text-[#0096CD] font-semibold py-3 rounded-full shadow-sm hover:bg-[#f0fbff] transition"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-white" />
            <h1 className="text-white text-2xl font-bold tracking-tight">Shopping Cart</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#016AB3]" />
                  Cart Items ({cartItems.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const projectData = JSON.parse(item.previewProject);
                  const formData = JSON.parse(item.previewForm);

                  return (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Book Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            {projectData?.projectTitle || "Untitled Book"}
                          </h3>

                          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 font-medium">Quantity:</span>
                              <span className="text-gray-900 font-semibold">{item.productQuantity || 1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 font-medium">Pages:</span>
                              <span className="text-gray-900">{formData?.page_count || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 font-medium">Price/Unit:</span>
                              <span className="text-gray-900">${item.productPrice?.toFixed(2) || "0.00"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 font-medium">Service:</span>
                              <span className="text-gray-900 capitalize">
                                {item.selectedService?.service_name || item.selectedService?.courier_name || "Standard"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                          <div className="text-center md:text-right flex-1 md:flex-none">
                            <div className="text-xs text-gray-500 mb-1">Total</div>
                            <div className="text-2xl font-bold text-[#016AB3]">
                              ${item.subtotal?.toFixed(2) || "0.00"}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#016AB3] hover:text-[#016AB3] hover:bg-blue-50 transition-all duration-200 font-medium text-sm"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleProceedToPayment(item)}
                              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#016AB3] to-[#0096CD] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm"
                            >
                              Pay Now
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Items in cart</span>
                  <span className="font-semibold text-gray-900">{cartItems.length}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total books</span>
                  <span className="font-semibold text-gray-900">
                    {cartItems.reduce((sum, item) => sum + (item.productQuantity || 1), 0)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Subtotal</span>
                    <span className="text-2xl font-bold text-[#016AB3]">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Shipping and taxes calculated at checkout
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800 font-medium">
                    💡 Tip: Review your items before proceeding to payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
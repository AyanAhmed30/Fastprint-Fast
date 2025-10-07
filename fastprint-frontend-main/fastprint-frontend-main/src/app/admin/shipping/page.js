"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { BASE_URL } from "@/services/baseUrl";
import axios from "axios";

const ShippingPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipmentOrders = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`${BASE_URL}api/book/admin/shipment-orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Failed to load shipment orders", err);
        alert("Failed to load shipment orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchShipmentOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">Loading shipment orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/admin/orders")}
          className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6" /> Shipment Orders
            </h1>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No orders prepared for shipment.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.user_email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.phone_number || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.first_name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.last_name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.courier_name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.subtotal != null
                          ? `$${parseFloat(order.subtotal).toFixed(2)}`
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {order.status === 'in_cart' ? 'In Cart' : 
                           order.status === 'cancelled' ? 'Cancelled' : 'Shipped'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
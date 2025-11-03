"use client";

import { useState, useEffect, useRef } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { BASE_URL } from "@/services/baseUrl";

// Import location data
import {
  COUNTRIES,
  US_STATES,
  CANADIAN_PROVINCES,
  AUSTRALIAN_STATES,
  GERMAN_STATES,
  FRENCH_REGIONS,
  ITALIAN_REGIONS,
  SPANISH_REGIONS,
  BRAZILIAN_STATES,
  MEXICAN_STATES,
  INDIAN_STATES,
  CHINESE_PROVINCES,
  JAPANESE_PREFECTURES,
  UK_REGIONS,
  DUTCH_PROVINCES,
  BELGIAN_PROVINCES,
  SWISS_CANTONS,
  AUSTRIAN_STATES,
  SWEDISH_COUNTIES,
  NORWEGIAN_COUNTIES,
  DANISH_REGIONS,
  FINNISH_REGIONS,
  ICELANDIC_REGIONS,
  IRISH_COUNTIES,
  PORTUGUESE_REGIONS,
  POLISH_VOIVODESHIPS,
  CZECH_REGIONS,
  SOUTH_KOREAN_REGIONS,
  ARGENTINE_PROVINCES,
  COLOMBIAN_DEPARTMENTS,
  SOUTH_AFRICAN_PROVINCES,
  EGYPTIAN_GOVERNORATES,
  MOROCCAN_REGIONS,
  ZIMBABWEAN_PROVINCES,
  PAKISTANI_REGIONS,
} from "@/lib/locationData";

const StripeCardForm = ({ amount, onSuccess, onError, disabled }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [sameAsAccount, setSameAsAccount] = useState(null);

  const [billingForm, setBillingForm] = useState({
    name: "",
    email: "",
    address: "",
    apt_floor: "",
    country: "",
    state: "",
    city: "",
    postal_code: "",
  });

  const [availableStates, setAvailableStates] = useState([]);
  const skipStateClearRef = useRef(false);

  const inputClass =
    "w-full p-2 md:p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  // Load profile from localStorage
  const loadAccountProfileFromLocalStorage = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      const userObj = JSON.parse(userStr);
      const email = userObj?.email;
      if (!email) return null;
      const saved = localStorage.getItem(`user_profile_${email}`);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      return null;
    }
  };

  // Apply account profile to billing form
  const applyAccountProfileToBilling = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to use your account address.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.get(
        `${BASE_URL}api/userprofiles/profiles/me/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const profile = response.data;
      if (profile?.email) {
        localStorage.setItem(`user_profile_${profile.email}`, JSON.stringify(profile));
      }
      skipStateClearRef.current = true;
      setBillingForm({
        name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "",
        email: profile.email || "",
        address: profile.address || "",
        apt_floor: "",
        country: profile.country || "",
        state: profile.state || "",
        city: profile.city || "",
        postal_code: profile.postal_code || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      const fallback = loadAccountProfileFromLocalStorage();
      if (fallback) {
        skipStateClearRef.current = true;
        setBillingForm({
          name: `${fallback.first_name || ""} ${fallback.last_name || ""}`.trim() || "",
          email: fallback.email || "",
          address: fallback.address || "",
          apt_floor: "",
          country: fallback.country || "",
          state: fallback.state || "",
          city: fallback.city || "",
          postal_code: fallback.postal_code || "",
        });
      } else {
        alert("No saved account address found. Please update your Account Settings.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear billing fields
  const clearBillingFields = () => {
    setBillingForm({
      name: "",
      email: "",
      address: "",
      apt_floor: "",
      country: "",
      state: "",
      city: "",
      postal_code: "",
    });
    setAvailableStates([]);
  };

  // Country → State logic (same as Shop.js)
  useEffect(() => {
    let states = [];
    switch (billingForm.country) {
      case "US":
        states = US_STATES;
        break;
      case "CA":
        states = CANADIAN_PROVINCES;
        break;
      case "AU":
        states = AUSTRALIAN_STATES;
        break;
      case "DE":
        states = GERMAN_STATES;
        break;
      case "FR":
        states = FRENCH_REGIONS;
        break;
      case "IT":
        states = ITALIAN_REGIONS;
        break;
      case "ES":
        states = SPANISH_REGIONS;
        break;
      case "BR":
        states = BRAZILIAN_STATES;
        break;
      case "MX":
        states = MEXICAN_STATES;
        break;
      case "IN":
        states = INDIAN_STATES;
        break;
      case "CN":
        states = CHINESE_PROVINCES;
        break;
      case "JP":
        states = JAPANESE_PREFECTURES;
        break;
      case "GB":
        states = UK_REGIONS;
        break;
      case "NL":
        states = DUTCH_PROVINCES;
        break;
      case "BE":
        states = BELGIAN_PROVINCES;
        break;
      case "CH":
        states = SWISS_CANTONS;
        break;
      case "AT":
        states = AUSTRIAN_STATES;
        break;
      case "SE":
        states = SWEDISH_COUNTIES;
        break;
      case "NO":
        states = NORWEGIAN_COUNTIES;
        break;
      case "DK":
        states = DANISH_REGIONS;
        break;
      case "FI":
        states = FINNISH_REGIONS;
        break;
      case "IS":
        states = ICELANDIC_REGIONS;
        break;
      case "IE":
        states = IRISH_COUNTIES;
        break;
      case "PT":
        states = PORTUGUESE_REGIONS;
        break;
      case "PL":
        states = POLISH_VOIVODESHIPS;
        break;
      case "CZ":
        states = CZECH_REGIONS;
        break;
      case "KR":
        states = SOUTH_KOREAN_REGIONS;
        break;
      case "AR":
        states = ARGENTINE_PROVINCES;
        break;
      case "CO":
        states = COLOMBIAN_DEPARTMENTS;
        break;
      case "ZA":
        states = SOUTH_AFRICAN_PROVINCES;
        break;
      case "EG":
        states = EGYPTIAN_GOVERNORATES;
        break;
      case "MA":
        states = MOROCCAN_REGIONS;
        break;
      case "ZW":
        states = ZIMBABWEAN_PROVINCES;
        break;
      case "PK":
        states = PAKISTANI_REGIONS;
        break;
      default:
        states = [];
    }
    setAvailableStates(states);

    if (skipStateClearRef.current) {
      skipStateClearRef.current = false;
    } else {
      setBillingForm((prev) => ({ ...prev, state: "" }));
    }
  }, [billingForm.country]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingForm({ ...billingForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    const requiredFields = ["name", "email", "address", "country", "city", "postal_code"];
    for (let field of requiredFields) {
      if (!billingForm[field]?.trim()) {
        setError("Please fill all required billing fields.");
        setIsProcessing(false);
        return;
      }
    }
    if (!billingForm.state && availableStates.length > 0) {
      setError("Please select a state/province.");
      setIsProcessing(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("You need to be logged in to complete your purchase.");
        setIsProcessing(false);
        return;
      }

      const res = await axios.post(
        `${BASE_URL}api/create-payment-intent/`,
        { amount: Math.round(amount * 100), currency: "usd" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const clientSecret = res.data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingForm.name,
            email: billingForm.email,
            address: {
              line1: billingForm.address,
              line2: billingForm.apt_floor || undefined,
              city: billingForm.city,
              state: billingForm.state,
              postal_code: billingForm.postal_code,
              country: billingForm.country,
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        onError && onError(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        onSuccess && onSuccess(result.paymentIntent);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Payment failed");
      onError && onError(err.response?.data?.error || err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Same-as-account prompt */}
      <div className="mb-4 p-3 bg-white/60 rounded-lg border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="text-sm md:text-base text-gray-800">
          <strong>Is your billing address the same as your customer address?</strong>
          <div className="text-xs text-gray-500">
            (Use the address from your Account Settings)
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={async () => {
              setSameAsAccount(true);
              await applyAccountProfileToBilling();
            }}
            className={`py-2 px-3 rounded-full font-medium text-sm ${
              sameAsAccount === true
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => {
              setSameAsAccount(false);
              clearBillingFields();
            }}
            className={`py-2 px-3 rounded-full font-medium text-sm ${
              sameAsAccount === false
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Card Details</label>
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Name on Card */}
      <input
        type="text"
        name="name"
        value={billingForm.name}
        onChange={handleInputChange}
        placeholder="Name on Card"
        className={inputClass}
        required
      />

      {/* Email */}
      <input
        type="email"
        name="email"
        value={billingForm.email}
        onChange={handleInputChange}
        placeholder="Email"
        className={inputClass}
        required
      />

      {/* Address */}
      <input
        type="text"
        name="address"
        value={billingForm.address}
        onChange={handleInputChange}
        placeholder="Street Address"
        className={inputClass}
        required
      />

      {/* Apt/Floor */}
      <input
        type="text"
        name="apt_floor"
        value={billingForm.apt_floor}
        onChange={handleInputChange}
        placeholder="Apt/Floor/Suite (Optional)"
        className={inputClass}
      />

      {/* Country & State */}
      <div className="flex flex-col md:flex-row gap-4">
        <select
          name="country"
          value={billingForm.country}
          onChange={handleInputChange}
          className={`${inputClass} md:w-1/2`}
          required
        >
          <option value="">Select Country</option>
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>

        {availableStates.length > 0 ? (
          <select
            name="state"
            value={billingForm.state}
            onChange={handleInputChange}
            className={`${inputClass} md:w-1/2`}
            required
          >
            <option value="">Select State/Province</option>
            {availableStates.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="state"
            value={billingForm.state}
            onChange={handleInputChange}
            placeholder="State/Province"
            className={`${inputClass} md:w-1/2`}
            required={!billingForm.country || availableStates.length === 0}
          />
        )}
      </div>

      {/* City & Postal Code */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          name="city"
          value={billingForm.city}
          onChange={handleInputChange}
          placeholder="City"
          className={`${inputClass} md:w-1/2`}
          required
        />
        <input
          type="text"
          name="postal_code"
          value={billingForm.postal_code}
          onChange={handleInputChange}
          placeholder="Postal Code"
          className={`${inputClass} md:w-1/2`}
          required
        />
      </div>

      {/* Error */}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing || disabled}
        className={`w-full py-3 px-6 rounded-full font-medium text-white transition-all duration-200 ${
          isProcessing || disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 active:from-blue-800 active:to-blue-950 shadow-md hover:shadow-lg"
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <span>Confirm & Place Order</span>
        )}
      </button>
    </form>
  );
};

export default StripeCardForm;
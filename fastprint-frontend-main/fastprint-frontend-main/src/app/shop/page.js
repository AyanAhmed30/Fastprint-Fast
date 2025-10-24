"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/services/baseUrl";
// Pricing calculators/config used to reconstruct shopData if it's missing in production
import {
  BOOK_SIZES,
  OPTIONS_CONFIG_BOOK,
  COMIC_TRIM_SIZES,
  OPTIONS_CONFIG_SIMPLE,
  CALENDAR_SIZES,
} from "@/calculators/config";
import {
  calculatePriceBook,
  calculatePriceComic,
  calculatePriceSimple,
  calculatePriceCalendar,
} from "@/calculators/pricing";

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
} from "../../lib/locationData";

const Shop = () => {
  const router = useRouter();
  const [projectData, setProjectData] = useState(null);

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

  const [initialData, setInitialData] = useState({
    originalTotalCost: 0,
    finalTotalCost: 0,
    totalCost: 0,
    productQuantity: 1,
    costPerBook: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("shopData");
    const tryParse = (s) => {
      try {
        return JSON.parse(s);
      } catch (e) {
        return null;
      }
    };

    const applyShopData = (data) => {
      setInitialData({
        originalTotalCost: data.originalTotalCost ?? 0,
        finalTotalCost: data.finalTotalCost ?? 0,
        totalCost: data.totalCost ?? 0,
        productQuantity: data.productQuantity ?? 1,
        costPerBook: data.costPerBook ?? 0,
      });
    };

    const reconstructShopData = () => {
      const previewFormRaw = localStorage.getItem("previewFormData");
      const previewProjectRaw = localStorage.getItem("previewProjectData");
      const dropdownsRaw = localStorage.getItem("previewDropdowns");
      const previewForm = tryParse(previewFormRaw) || null;
      const previewProject = tryParse(previewProjectRaw) || null;
      const dropdowns = tryParse(dropdownsRaw) || {};

      if (!previewForm || !previewProject) return null;

      const category = previewProject.category;
      const qty = Number(previewForm.quantity) || 1;

      const findName = (arr, id) => {
        if (!arr || !id) return "";
        const found = arr.find((o) => String(o.id) === String(id));
        return found?.dbName || found?.name || "";
      };

      let calc = null;
      try {
        if (category === "Print Book" || category === "Photo Book") {
          const trimName = findName(dropdowns.trim_sizes || [], previewForm.trim_size_id);
          calc = calculatePriceBook({
            bookSize: trimName,
            page_count: Number(previewForm.page_count),
            binding_id: findName(dropdowns.bindings || [], previewForm.binding_id),
            interior_color_id: findName(dropdowns.interior_colors || [], previewForm.interior_color_id),
            paper_type_id: findName(dropdowns.paper_types || [], previewForm.paper_type_id),
            cover_finish_id: findName(dropdowns.cover_finishes || [], previewForm.cover_finish_id),
            quantity: qty,
          });
        } else if (category === "Comic Book") {
          calc = calculatePriceComic({
            trim_size_id: previewForm.trim_size_id,
            page_count: Number(previewForm.page_count),
            binding_id: findName(dropdowns.bindings || [], previewForm.binding_id),
            interior_color_id: findName(dropdowns.interior_colors || [], previewForm.interior_color_id),
            paper_type_id: findName(dropdowns.paper_types || [], previewForm.paper_type_id),
            cover_finish_id: findName(dropdowns.cover_finishes || [], previewForm.cover_finish_id),
            quantity: qty,
          });
        } else if (category === "Magazine" || category === "Year Book") {
          calc = calculatePriceSimple({
            page_count: Number(previewForm.page_count),
            binding_id: findName(dropdowns.bindings || [], previewForm.binding_id),
            interior_color_id: findName(dropdowns.interior_colors || [], previewForm.interior_color_id),
            paper_type_id: findName(dropdowns.paper_types || [], previewForm.paper_type_id),
            cover_finish_id: findName(dropdowns.cover_finishes || [], previewForm.cover_finish_id),
            quantity: qty,
          });
        } else if (category === "Calender" || category === "Calendar") {
          calc = calculatePriceCalendar({
            binding_id: findName(dropdowns.bindings || [], previewForm.binding_id),
            interior_color_id: findName(dropdowns.interior_colors || [], previewForm.interior_color_id),
            paper_type_id: findName(dropdowns.paper_types || [], previewForm.paper_type_id),
            cover_finish_id: findName(dropdowns.cover_finishes || [], previewForm.cover_finish_id),
            quantity: qty,
          });
        }
      } catch (err) {
        console.warn("Reconstruction calc failed:", err);
        calc = null;
      }

      if (!calc) return null;

      const reconstructed = {
        originalTotalCost: calc.totalPrice ?? calc.original_total_cost ?? 0,
        finalTotalCost: calc.finalPrice ?? calc.total_cost ?? 0,
        totalCost: calc.finalPrice ?? calc.total_cost ?? calc.totalPrice ?? 0,
        productQuantity: qty,
        costPerBook: calc.unitPrice ?? 0,
      };
      try {
        localStorage.setItem("shopData", JSON.stringify(reconstructed));
      } catch (err) {
        console.warn("Failed to persist reconstructed shopData", err);
      }
      return reconstructed;
    };

    const parsed = tryParse(saved);
    if (parsed && (parsed.finalTotalCost || parsed.totalCost || parsed.originalTotalCost)) {
      applyShopData(parsed);
      return;
    }

    const reconstructed = reconstructShopData();
    if (reconstructed) {
      applyShopData(reconstructed);
      return;
    }
  }, []);

  const {
    originalTotalCost = 0,
    finalTotalCost = 0,
    totalCost = 0,
    productQuantity = 1,
    costPerBook = 0,
  } = initialData;

  const displayTotalCost = finalTotalCost || totalCost || originalTotalCost;
  const calculatedCostPerBook =
    displayTotalCost && productQuantity
      ? displayTotalCost / productQuantity
      : costPerBook;

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    company: "",
    address: "",
    apt_floor: "",
    country: "",
    state: "",
    city: "",
    postal_code: "",
    phone_number: "",
    account_type: "individual",
    has_resale_cert: false,
  });

  const [sameAsAccount, setSameAsAccount] = useState(null);
  const skipStateClearRef = useRef(false);

  const loadAccountProfileFromLocalStorage = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      const userObj = JSON.parse(userStr);
      const email = userObj?.email;
      if (!email) return null;
      const saved = localStorage.getItem(`user_profile_${email}`);
      if (!saved) return null;
      return JSON.parse(saved);
    } catch (err) {
      console.error("Error reading account profile from localStorage:", err);
      return null;
    }
  };

  const applyAccountProfileToShipping = async () => {
    const token = getToken();
    if (!token) {
      alert("You must be logged in to use your account address.");
      router.push("/login");
      return;
    }

    setIsLoading(true); // Optional: show loading state
    try {
      // 1. Try to fetch fresh profile from backend
      const response = await axios.get(
        `${BASE_URL}api/userprofiles/profiles/me/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const profile = response.data;

      // Save to localStorage (like AccountSettings does)
      if (profile?.email) {
        try {
          localStorage.setItem(`user_profile_${profile.email}`, JSON.stringify(profile));
        } catch (err) {
          console.warn("Failed to save profile to localStorage", err);
        }
      }

      // Apply to form
      skipStateClearRef.current = true;
      setForm((prev) => ({
        ...prev,
        first_name: profile.first_name || prev.first_name,
        last_name: profile.last_name || prev.last_name,
        company: profile.username || prev.company,
        address: profile.address || prev.address,
        country: profile.country || prev.country,
        state: profile.state || prev.state,
        city: profile.city || prev.city,
        postal_code: profile.postal_code || prev.postal_code,
        phone_number: profile.phone_number || prev.phone_number,
        account_type: profile.account_type === "business" ? "business" : "individual",
      }));

      resetShippingData();
    } catch (error) {
      console.error("Failed to fetch profile from API:", error);

      // 2. Fallback to localStorage (offline or API down)
      const fallbackProfile = loadAccountProfileFromLocalStorage();
      if (fallbackProfile) {
        skipStateClearRef.current = true;
        setForm((prev) => ({
          ...prev,
          first_name: fallbackProfile.first_name || prev.first_name,
          last_name: fallbackProfile.last_name || prev.last_name,
          company: fallbackProfile.username || prev.company,
          address: fallbackProfile.address || prev.address,
          country: fallbackProfile.country || prev.country,
          state: fallbackProfile.state || prev.state,
          city: fallbackProfile.city || prev.city,
          postal_code: fallbackProfile.postal_code || prev.postal_code,
          phone_number: fallbackProfile.phone_number || prev.phone_number,
          account_type: fallbackProfile.account_type === "business" ? "business" : "individual",
        }));
        resetShippingData();
      } else {
        alert("No saved account address found. Please update your Account Settings first.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearShippingAddressFields = () => {
    setForm((prev) => ({
      ...prev,
      address: "",
      apt_floor: "",
      company: "",
      country: "",
      state: "",
      city: "",
      postal_code: "",
      phone_number: "",
    }));
    setAvailableStates([]);
    resetShippingData();
  };

  const resetShippingData = () => {
    setShippingRate(null);
    setTax(null);
    setTaxRate(null);
    setTaxReason(null);
    setAvailableServices([]);
    setSelectedService(null);
    setShippingError(null);
  };

  const [shippingRate, setShippingRate] = useState(null);
  const [tax, setTax] = useState(null);
  const [taxRate, setTaxRate] = useState(null);
  const [taxReason, setTaxReason] = useState(null);
  const [accountType, setAccountType] = useState("individual");
  const [courierName, setCourierName] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingError, setShippingError] = useState(null);
  const [lastFetchSuccess, setLastFetchSuccess] = useState(false); // to prevent retries on error

  const [availableStates, setAvailableStates] = useState([]);
  useEffect(() => {
    let states = [];
    switch (form.country) {
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
      setForm((prev) => ({ ...prev, state: "" }));
      resetShippingData();
    }
  }, [form.country]);

  const productPrice = calculatedCostPerBook;
  const subtotal = finalTotalCost;

  const calculateTotal = () => {
    let total = subtotal;
    if (shippingRate !== null) total += shippingRate;
    if (tax !== null) total += tax;
    return total;
  };

  const getToken = () => {
    return localStorage.getItem("accessToken");
  };

  const deliveryHandler = async () => {
    const token = getToken();
    if (!token) {
      alert("You need to be logged in to proceed. Redirecting to login...");
      router.push("/login");
      return;
    }

    if (
      !form.first_name ||
      !form.last_name ||
      !form.address ||
      !form.country ||
      !form.city ||
      !form.phone_number
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!selectedService) {
      alert("Please wait for shipping options to load and select one.");
      return;
    }

    try {
      const previewForm = localStorage.getItem("previewFormData");
      const previewProject = localStorage.getItem("previewProjectData");
      const bookFile = window.tempBookFileForSubmission;
      const coverFile = window.tempCoverFileForSubmission;
      if (!previewForm || !previewProject || !bookFile) {
        alert("Missing design or file data. Please go back to Design Project.");
        router.push("/design-project");
        return;
      }

      localStorage.setItem(
        "pendingOrderData",
        JSON.stringify({
          previewForm,
          previewProject,
          bookFile: null,
          coverFile: null,
          form,
          shippingRate,
          tax,
          taxRate,
          taxReason,
          accountType,
          courierName,
          estimatedDelivery,
          selectedService,
          productQuantity,
          productPrice,
          subtotal,
          displayTotalCost,
        })
      );
      localStorage.setItem(
        "paymentData",
        JSON.stringify({
          bookPrice: displayTotalCost || 0,
          productQuantity: productQuantity,
          subtotal: displayTotalCost || 0,
          shippingRate: shippingRate || 0,
          tax: tax || 0,
          totalAmount: calculateTotal(),
          selectedService: selectedService,
          taxRate: taxRate,
          accountType: accountType,
        })
      );
      router.push("/payment");
    } catch (error) {
      console.error("Shipping save error:", error);
      alert("Failed to save shipping info. Please try again.");
    }
  };

  const fetchShippingRate = async () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const { country, state, city, postal_code } = form;
    if (!country || !state || !city || !postal_code) {
      return;
    }

    setIsLoading(true);
    setShippingError(null);

    try {
      const res = await axios.post(
        `${BASE_URL}api/shipping-rate/`,
        {
          country: country.trim().toUpperCase(),
          state: state.trim().toUpperCase(),
          city: city.trim(),
          postal_code: postal_code.trim(),
          account_type: form.account_type,
          has_resale_cert: form.has_resale_cert,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10s timeout
        }
      );

      const {
        shipping_rate = 0,
        tax: resTax = 0,
        tax_rate = "0.00%",
        tax_reason = "",
        account_type: resAccountType = "individual",
        courier_name = "",
        estimated_delivery = "",
        available_services = [],
      } = res.data;

      const doubledShippingRate = shipping_rate * 2;

      setShippingRate(doubledShippingRate);
      setTax(resTax);
      setTaxRate(tax_rate);
      setTaxReason(tax_reason);
      setAccountType(resAccountType);
      setCourierName(courier_name);
      setEstimatedDelivery(estimated_delivery);

      const modifiedServices = (available_services || []).map((service) => ({
        ...service,
        total_charge: service.total_charge * 2,
      }));
      setAvailableServices(modifiedServices);

      if (modifiedServices.length > 0) {
        const cheapestService = modifiedServices.reduce((prev, current) =>
          prev.total_charge < current.total_charge ? prev : current
        );
        setSelectedService(cheapestService);
      }

      setLastFetchSuccess(true);
    } catch (error) {
      console.error("Shipping API error:", error);
      setLastFetchSuccess(false);
      let errorMessage = "Failed to fetch shipping rates. Please try again later.";

      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please check your connection.";
      } else if (error.response) {
        // If response is HTML (like Django error page), detect it
        if (typeof error.response.data === "string" && error.response.data.includes("<html")) {
          errorMessage = "Shipping service is temporarily unavailable. Please try again soon.";
        } else if (error.response.status === 401) {
          errorMessage = "Session expired. Please log in again.";
          router.push("/login");
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      }

      setShippingError(errorMessage);
      resetShippingData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelection = (service) => {
    setSelectedService(service);
    setShippingRate(service.total_charge);
    setCourierName(service.courier_name);
    setEstimatedDelivery(service.delivery_time);
    const newTax = shippingRate
      ? (tax / shippingRate) * service.total_charge
      : tax;
    setTax(newTax);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });

    if (["country", "state", "city", "postal_code", "account_type", "has_resale_cert"].includes(name)) {
      resetShippingData();
    }
  };

  // ✅ Auto-fetch shipping with debounce and error guard
  useEffect(() => {
    const { country, state, city, postal_code } = form;
    const hasRequiredFields = country.trim() && state.trim() && city.trim() && postal_code.trim();

    if (hasRequiredFields && !isLoading && lastFetchSuccess === false) {
      const timer = setTimeout(() => {
        fetchShippingRate();
      }, 600);
      return () => clearTimeout(timer);
    } else if (!hasRequiredFields) {
      resetShippingData();
    }
  }, [form.country, form.state, form.city, form.postal_code, isLoading]);

  const inputClass =
    "w-full p-2 md:p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const buttonClass =
    "w-full py-2 md:py-3 text-white font-medium text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200";

  const handleEditClick = () => {
    router.push("/design-project");
  };

  // ✅ Determine button text and state
  const isReadyForCheckout = selectedService && !isLoading && shippingRate !== null;
  const buttonText = isReadyForCheckout ? "Checkout" : (isLoading ? "Calculating Shipping..." : "Check Delivery Method");

  return (
    <>
      <div
        className="w-full h-[51px] flex items-center px-4 md:px-6"
        style={{
          background:
            "linear-gradient(90deg, #016AB3 16.41%, #0096CD 60.03%, #00AEDC 87.93%)",
        }}
      >
        <h1 className="text-white text-base md:text-lg font-semibold">Cart</h1>
      </div>

      <div className="w-full min-h-screen bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] px-4 md:px-6 py-6 md:py-10 font-sans relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-10 relative">
          {/* Left Section */}
          <div className="w-full lg:w-[60%] bg-gradient-to-br from-[#f2f9ff] via-white to-[#fff0f5] rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 lg:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#2A428C] mb-4">
              Enter Your Shipping Address
            </h2>
            <hr className="mb-4 md:mb-6 border-[#2A428C]" />

            {/* Same-as-account prompt */}
            <div className="mb-4 p-3 bg-white/60 rounded-lg border border-gray-200 flex items-center justify-between">
              <div className="text-sm md:text-base text-gray-800">
                <strong>Is your shipping address the same as your customer address?</strong>
                <div className="text-xs text-gray-500">(Use the address from your Account Settings)</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    setSameAsAccount(true);
                    await applyAccountProfileToShipping();
                  }}
                  className={`py-2 px-3 rounded-full font-medium text-sm transition-colors ${sameAsAccount === true ? "bg-blue-600 text-white" : "bg-white border border-gray-300 text-gray-700"}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSameAsAccount(false);
                    clearShippingAddressFields();
                  }}
                  className={`py-2 px-3 rounded-full font-medium text-sm transition-colors ${sameAsAccount === false ? "bg-blue-600 text-white" : "bg-white border border-gray-300 text-gray-700"}`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleInputChange}
                placeholder="First Name"
                className={`${inputClass} md:w-1/2`}
              />
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleInputChange}
                placeholder="Last Name"
                className={`${inputClass} md:w-1/2`}
              />
            </div>

            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleInputChange}
              placeholder="Company/Organization Name (Optional)"
              className={`${inputClass} mb-4`}
            />
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder="Street Address"
              className={`${inputClass} mb-4`}
            />
            <input
              type="text"
              name="apt_floor"
              value={form.apt_floor}
              onChange={handleInputChange}
              placeholder="Apt/Floor/Suite (Optional)"
              className={`${inputClass} mb-4`}
            />

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
              <select
                name="country"
                value={form.country}
                onChange={handleInputChange}
                className={`${inputClass} md:w-1/2`}
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
                  value={form.state}
                  onChange={handleInputChange}
                  className={`${inputClass} md:w-1/2`}
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
                  placeholder="State/Province"
                  value={form.state}
                  onChange={handleInputChange}
                  className={`${inputClass} md:w-1/2`}
                />
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleInputChange}
                placeholder="City"
                className={`${inputClass} md:w-1/2`}
              />
              <input
                type="text"
                name="postal_code"
                value={form.postal_code}
                onChange={handleInputChange}
                placeholder="Postal Code"
                className={`${inputClass} md:w-1/2`}
              />
            </div>

            <input
              type="text"
              name="phone_number"
              value={form.phone_number}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className={`${inputClass} mb-4`}
            />

            {/* Error Message */}
            {shippingError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm md:text-base">
                {shippingError}
              </div>
            )}

            {/* Available Services */}
            {availableServices.length > 0 && (
              <div className="mb-4 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-base md:text-lg font-semibold text-[#2A428C] mb-2 md:mb-3">
                  Available Shipping Services
                </h3>
                <div className="space-y-2">
                  {availableServices.map((service, index) => (
                    <label
                      key={index}
                      className="flex items-center p-2 md:p-3 border rounded-lg hover:bg-blue-100 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="selected_service"
                        checked={
                          selectedService?.courier_name === service.courier_name &&
                          selectedService?.service_name === service.service_name
                        }
                        onChange={() => handleServiceSelection(service)}
                        className="mr-2 md:mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <span className="font-medium text-sm md:text-base">
                            {service.courier_name}
                          </span>
                          <span className="font-bold text-[#2A428C] text-sm md:text-base">
                            ${service.total_charge.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          {service.service_name && <span>{service.service_name} • </span>}
                          <span>Delivery: {service.delivery_time}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Info Display */}
            {selectedService && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm md:text-base">
                <p><strong>Selected Service:</strong> {selectedService.courier_name}</p>
                <p><strong>Service Type:</strong> {selectedService.service_name || "Standard"}</p>
                <p><strong>Estimated Delivery:</strong> {selectedService.delivery_time}</p>
              </div>
            )}

            {/* ✅ Dynamic Button */}
            <button
              className={`${buttonClass} ${isReadyForCheckout
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                : "bg-gradient-to-r from-[#0a79f8] to-[#1e78ee] hover:from-[#0968d9] hover:to-[#1560d5]"
                }`}
              onClick={deliveryHandler}
              disabled={isLoading || !isReadyForCheckout}
            >
              {buttonText}
            </button>
          </div>

          {/* Right Section - Cart Summary */}
          <div className="w-full lg:w-[40%]">
            <div className="sticky top-30 z-10 bg-gradient-to-br from-[#e0f3ff] via-white to-[#ffe4ec] rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-[#2A428C] text-lg md:text-xl font-semibold">Cart Summary</h3>
                <div
                  className="flex items-center gap-2 text-[#2A428C] font-semibold text-lg md:text-xl cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={handleEditClick}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                  </svg>
                </div>
              </div>

              <div className="bg-[#E5FBFF] rounded-xl p-3 md:p-4 flex gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="flex flex-col justify-center">
                  <h4 className="text-[#2A428C] font-bold text-lg md:text-xl mb-1">
                    {projectData?.projectTitle || "Book"}
                  </h4>
                  <p className="text-[#2A428C] text-base md:text-lg font-semibold">
                    Total Price: ${displayTotalCost ? displayTotalCost.toFixed(2) : "0.00"}
                  </p>
                </div>
              </div>

              <div className="text-sm space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-[#2A428C]">${displayTotalCost ? displayTotalCost.toFixed(2) : "0.00"}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600">Quantity</span>
                  <span className="text-[#2A428C]">{productQuantity ?? 1}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600">
                    Shipping {selectedService && `(${selectedService.courier_name})`}
                  </span>
                  <span className={shippingRate !== null ? "text-gray-900" : "text-gray-400"}>
                    {shippingRate !== null ? `$${shippingRate.toFixed(2)}` : "Calculating..."}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600">Taxes {taxRate && `(${taxRate})`}</span>
                  <span className={tax !== null ? "text-gray-900" : "text-gray-400"}>
                    {tax !== null ? `$${tax.toFixed(2)}` : "Calculating..."}
                  </span>
                </div>
                {taxReason && <div className="text-xs text-gray-500 italic pl-2">{taxReason}</div>}
                <hr className="border-gray-200" />
                <div className="flex justify-between font-bold text-base md:text-lg">
                  <span className="text-[#2A428C]">Total</span>
                  <span className="text-[#2A428C]">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {isReadyForCheckout && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 md:p-3 mb-3 md:mb-4">
                  <p className="text-xs md:text-sm text-green-800">
                    <strong>Ready to checkout!</strong> {selectedService.courier_name} shipping selected.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
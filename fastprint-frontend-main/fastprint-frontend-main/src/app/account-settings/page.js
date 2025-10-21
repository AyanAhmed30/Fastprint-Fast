"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import PersonalIcon from "@/assets/images/newsletter.png";
import BusinessIcon from "@/assets/images/newsletter.png";
import { BASE_URL } from "@/services/baseUrl";
import Image from "next/image";
import { hasCompletedAccountSettings } from "@/utils/profileUtils";

const API_BASE_URL = `${BASE_URL}api/userprofiles`;

// Country and State data
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "CO", name: "Colombia" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "MA", name: "Morocco" },
  { code: "ZW", name: "Zimbabwe" },
  { code: "PK", name: "Pakistan" },
];

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

const CANADIAN_PROVINCES = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "YT", name: "Yukon" },
];

const INDIAN_STATES = [
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CT", name: "Chhattisgarh" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OR", name: "Odisha" },
  { code: "PB", name: "Punjab" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TS", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "UT", name: "Uttarakhand" },
  { code: "WB", name: "West Bengal" },
];

const PAKISTANI_REGIONS = [
  { code: "PB", name: "Punjab" },
  { code: "SD", name: "Sindh" },
  { code: "KP", name: "Khyber Pakhtunkhwa" },
  { code: "BA", name: "Balochistan" },
  { code: "GB", name: "Gilgit-Baltistan" },
];

const getStatesByCountry = (countryCode) => {
  const stateMap = {
    US: US_STATES,
    CA: CANADIAN_PROVINCES,
    IN: INDIAN_STATES,
    PK: PAKISTANI_REGIONS,
  };
  return stateMap[countryCode] || [];
};

// Save entire form data to localStorage
const saveFormDataToLocalStorage = (data) => {
  if (typeof window === "undefined" || !data?.email) return;
  try {
    localStorage.setItem(`user_profile_${data.email}`, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving form data to localStorage:", error);
  }
};

// Load entire form data from localStorage
const loadFormDataFromLocalStorage = (email) => {
  if (typeof window === "undefined" || !email) return null;
  try {
    const saved = localStorage.getItem(`user_profile_${email}`);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error loading form data from localStorage:", error);
    return null;
  }
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="relative">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div
        className="absolute top-0 left-0 w-8 h-8 border-4 border-transparent border-r-blue-400 rounded-full animate-spin"
        style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
      ></div>
    </div>
  </div>
);

// Floating Label Input Component
const FloatingLabelInput = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  disabled,
  placeholder,
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative group">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ""}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-sm sm:text-base bg-white/70 backdrop-blur-sm
          ${
            focused || hasValue
              ? "border-blue-400 shadow-lg ring-4 ring-blue-100 transform scale-[1.02]"
              : "border-gray-300 hover:border-gray-400 hover:shadow-md"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white"}
          focus:outline-none peer
        `}
        disabled={disabled}
      />
      <label
        htmlFor={name}
        className={`absolute left-4 transition-all duration-300 pointer-events-none select-none
          ${
            focused || hasValue
              ? "top-0 text-xs font-semibold text-blue-600 bg-white px-2 rounded transform -translate-y-1/2"
              : "top-1/2 text-sm text-gray-500 transform -translate-y-1/2"
          }
        `}
      >
        {label}
        {name === "password" && (
          <span className="text-gray-400 text-xs ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            (leave blank to keep current)
          </span>
        )}
      </label>
    </div>
  );
};

export default function AccountSettings() {
  const { user, token } = useAuth();
  const apiService = {
    getHeaders() {
      if (typeof window === "undefined") return {};
      // Support multiple token keys (modern apps store accessToken)
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        null;
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      return headers;
    },

    async getProfileMe() {
      try {
        const response = await fetch(`${API_BASE_URL}/profiles/me/`, {
          method: "GET",
          headers: this.getHeaders(),
        });
        if (!response.ok) {
          // Not authenticated or not found
          return null;
        }
        const data = await response.json();
        return data || null;
      } catch (error) {
        console.error("Error fetching profile (me):", error);
        return null;
      }
    },

    async getProfileByEmail(email) {
      try {
        const response = await fetch(`${API_BASE_URL}/profiles/?search=${encodeURIComponent(email)}`, {
          method: "GET",
          headers: this.getHeaders(),
          // Avoid stale caches in some production setups
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) {
          console.error("Profile fetch failed:", data);
          return null;
        }
        // Expect either an array (list endpoint) or a single object
        if (Array.isArray(data)) return data.length > 0 ? data[0] : null;
        return data;
      } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
    },

    async saveSettings(data) {
      const response = await fetch(`${API_BASE_URL}/save-settings/`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (!response.ok)
        throw new Error(resData.message || "Failed to save profile");
      return resData;
    },

    async deleteAccount(profileId) {
      const response = await fetch(
        `${API_BASE_URL}/delete-account/${profileId}/`,
        {
          method: "DELETE",
          headers: this.getHeaders(),
        }
      );
      const resData = await response.json();
      if (!response.ok)
        throw new Error(resData.message || "Failed to delete account");
      return resData;
    },
  };
  

  // Load user profile
    const router = useRouter();

    // Component state (was missing and caused ReferenceError)
    const [formData, setFormData] = useState({
      id: null,
      first_name: "",
      last_name: "",
      username: "",
      email: user?.email || "",
      password: "",
      phone_number: "",
      country: "",
      state: "",
      city: "",
      postal_code: "",
      address: "",
      account_type: "personal",
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [availableStates, setAvailableStates] = useState([]);

    // Show entrance animation
    useEffect(() => {
      setIsVisible(true);
    }, []);

    // Update available states when country changes
    useEffect(() => {
      setAvailableStates(getStatesByCountry(formData.country));
    }, [formData.country]);

  const loadUserProfile = useCallback(async () => {
    if (!user?.email) {
      console.log("No user email available yet");
      setInitialLoading(false);
      return;
    }

    console.log("Loading profile for:", user.email);
    setLoading(true);

    try {
      // Try authenticated endpoint first (when logged in and token present)
      let profile = null;
      if (token) {
        profile = await apiService.getProfileMe();
      }
      // Fallback to search-by-email if /me/ didn't return a profile
      if (!profile) {
        profile = await apiService.getProfileByEmail(user.email);
      }
      const savedFormData = loadFormDataFromLocalStorage(user.email);

      console.log("Profile loaded:", profile);
      console.log("Saved form data:", savedFormData);

      if (profile) {
        const mergedData = {
          id: profile.id,
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          username: profile.username || "",
          email: profile.email || "",
          password: "",
          country: profile.country || "",
          phone_number: profile.phone_number || "",
          city: profile.city || "",
          postal_code: profile.postal_code || "",
          state: (savedFormData?.state) || profile.state || "",
          address: profile.address || "",
          account_type: profile.account_type || "personal",
        };
        
        setFormData(mergedData);
        setIsSaved(true);
        setProfileLoaded(true);
        saveFormDataToLocalStorage(mergedData);
        console.log("Profile data set successfully");
      } else {
        console.log("No existing profile found, creating new form");
        const newFormData = {
          ...formData,
          email: user.email,
          username: user.username || "",
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          state: (savedFormData?.state) || "",
          country: (savedFormData?.country) || "",
          city: (savedFormData?.city) || "",
          postal_code: (savedFormData?.postal_code) || "",
          address: (savedFormData?.address) || "",
          phone_number: (savedFormData?.phone_number) || "",
        };
        
        setFormData(newFormData);
        setIsSaved(false);
        setProfileLoaded(true);
        saveFormDataToLocalStorage(newFormData);
      }
    } catch (err) {
      console.error("Load profile error:", err);
      setMessage(`Failed to load profile: ${err.message}`);
      const savedFormData = loadFormDataFromLocalStorage(user.email);
      
      const fallbackData = {
        ...formData,
        email: user.email,
        ...(savedFormData || {}),
      };
      
      setFormData(fallbackData);
      setIsSaved(false);
      setProfileLoaded(true);
      saveFormDataToLocalStorage(fallbackData);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [user?.email, token]);

  // Note: Removed automatic redirect to allow users to access their profile settings
  // when they explicitly navigate to this page (e.g., from header dropdown)

  // Load profile when user is available
  useEffect(() => {
    if (user?.email && !profileLoaded) {
      console.log("Triggering profile load");
      loadUserProfile();
    }
  }, [user?.email, profileLoaded, loadUserProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    
    setFormData(updatedFormData);
    
    // Save all form data to localStorage whenever any field changes
    saveFormDataToLocalStorage(updatedFormData);

    setIsSaved(false);
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      account_type: e.target.value,
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const { id, password, ...profileData } = formData;
      const dataToSend = {
        ...profileData,
        ...(password && password.trim() && { password }),
      };

      console.log("Saving profile data:", dataToSend);
      const res = await apiService.saveSettings(dataToSend);
      console.log("Save response:", res);

      // Use backend response as canonical saved data when available
      // API returns { success, message, data }
      const canonical = (res && (res.data || res)) || dataToSend;

      const canonicalForm = {
        id: canonical.id || formData.id || null,
        first_name: canonical.first_name || profileData.first_name || "",
        last_name: canonical.last_name || profileData.last_name || "",
        username: canonical.username || profileData.username || "",
        email: canonical.email || profileData.email || user.email || "",
        password: "",
        country: canonical.country || profileData.country || "",
        phone_number: canonical.phone_number || profileData.phone_number || "",
        city: canonical.city || profileData.city || "",
        postal_code: canonical.postal_code || profileData.postal_code || "",
        state: canonical.state || profileData.state || "",
        address: canonical.address || profileData.address || "",
        account_type: canonical.account_type || profileData.account_type || "personal",
      };

      // Persist canonical to localStorage and to state
      saveFormDataToLocalStorage(canonicalForm);
      setFormData(canonicalForm);
      setMessage(res.message || "Profile saved successfully!");
      setIsSaved(true);

      // Give UI a moment, then reload profile to ensure fresh data
      setTimeout(async () => {
        await loadUserProfile();
        setMessage("Profile saved and reloaded successfully!");
        setTimeout(() => {
          router.push("/");
        }, 800);
      }, 300);
    } catch (err) {
      console.error("Save error:", err);
      setMessage(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!formData.id) {
      setMessage("No profile to delete");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await apiService.deleteAccount(formData.id);
      setMessage("Account deleted successfully");

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(`user_profile_${formData.email}`);
        } catch (error) {
          console.error("Error clearing localStorage:", error);
        }
      }

      setFormData({
        id: null,
        first_name: "",
        last_name: "",
        username: "",
        email: user?.email || "",
        password: "",
        country: "",
        city: "",
        postal_code: "",
        state: "",
        address: "",
        account_type: "personal",
      });
      setProfileLoaded(false);
      setIsSaved(false);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      console.error("Delete error:", err);
    }

    setLoading(false);
  };

  if (initialLoading) {
    return (
      <>
        <div className="w-full h-12 sm:h-14 md:h-16 flex items-center px-4 sm:px-6 bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC]">
          <h1 className="text-white text-base sm:text-lg md:text-xl font-semibold">
            Account Settings
          </h1>
        </div>
        <div className="w-full min-h-screen py-12 px-4 flex items-center justify-center bg-gradient-to-br from-[#eef4ff] via-[#f8faff] to-[#fef6fb]">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-blue-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full h-12 sm:h-14 md:h-16 flex items-center px-4 sm:px-6 bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse"></div>
        <h1 className="text-white text-base sm:text-lg md:text-xl font-semibold relative z-10 animate-fade-in">
          Account Settings
        </h1>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
        </div>
      </div>

      <div className="w-full min-h-screen py-4 sm:py-6 md:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#eef4ff] via-[#f8faff] to-[#fef6fb] relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl animate-pulse"></div>

        <div
          className={`max-w-4xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl flex flex-col gap-6 sm:gap-8 lg:gap-10 bg-gradient-to-r from-[#ffe4ec] via-[#fdfdfd] to-[#e0f3ff] backdrop-blur-sm border border-white/50 relative z-10 transition-all duration-700 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {message && (
            <div
              className={`p-4 rounded-xl text-center font-medium transition-all duration-500 transform animate-slide-down text-sm sm:text-base shadow-lg border-2 ${
                message.includes("Error") || message.includes("Failed")
                  ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-300 shadow-red-100"
                  : "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-300 shadow-green-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {message.includes("Error") || message.includes("Failed") ? (
                  <svg className="w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {message}
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center text-blue-600 font-medium text-sm sm:text-base py-4">
              <LoadingSpinner />
              <p className="mt-2 animate-pulse">Processing your request...</p>
            </div>
          )}

          <div className="w-full transform transition-all duration-500 hover:scale-[1.01]">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#016AB3] to-[#00AEDC] rounded-full animate-pulse"></div>
              <h2 className="text-[#2A428C] font-bold text-xl sm:text-2xl lg:text-3xl">
                Profile Details
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#2A428C]/30 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                ["first_name", "First Name"],
                ["last_name", "Last Name"],
                ["username", "User Name"],
                ["email", "Email Address"],
              ].map(([name, label, type = "text"], index) => {
                const isEmailField = name === "email";
                return (
                  <div
                    key={name}
                    className="transform transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <FloatingLabelInput
                      name={name}
                      label={label}
                      type={type}
                      value={formData[name]}
                      onChange={handleInputChange}
                      disabled={loading || isEmailField}
                      placeholder={`Enter your ${label.toLowerCase()}`}
                    />
                  </div>
                );
              })}

              {/* Password and Phone Number in the same row */}
              <div className="transform transition-all duration-300">
                <FloatingLabelInput
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Enter new password"
                />
              </div>

              <div className="transform transition-all duration-300">
                <FloatingLabelInput
                  name="phone_number"
                  label="Phone Number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          <div className="w-full transform transition-all duration-500 hover:scale-[1.01]">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#016AB3] to-[#00AEDC] rounded-full animate-pulse"></div>
              <h2 className="text-[#2A428C] font-bold text-xl sm:text-2xl lg:text-3xl">
                Address Information
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#2A428C]/30 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                ["country", "Country"],
                ["state", "State"],

                ["city", "City"],

                ["postal_code", "Postal Code"],
                ["address", "Address"],
              ].map(([name, label], index) => (
                <div
                  key={name}
                  className={`${name === "address" ? "sm:col-span-2" : ""} transform transition-all duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {name === "country" ? (
                    <div className="relative group">
                      <select
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        disabled={loading}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-sm sm:text-base bg-white/70 backdrop-blur-sm
                          ${
                            formData[name]
                              ? "border-blue-400 shadow-lg ring-4 ring-blue-100"
                              : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                          }
                          ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-white"}
                          focus:outline-none peer
                        `}
                      >
                        <option value="">Select Country</option>
                        {COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      <label className="absolute left-4 top-0 text-xs font-semibold text-blue-600 bg-white px-2 rounded transform -translate-y-1/2 pointer-events-none select-none">
                        {label}
                      </label>
                    </div>
                  ) : name === "state" && availableStates.length > 0 ? (
                    <div className="relative group">
                      <select
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        disabled={loading}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-sm sm:text-base bg-white/70 backdrop-blur-sm
                          ${
                            formData[name]
                              ? "border-blue-400 shadow-lg ring-4 ring-blue-100"
                              : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                          }
                          ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-white"}
                          focus:outline-none peer
                        `}
                      >
                        <option value="">Select State/Province</option>
                        {availableStates.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      <label className="absolute left-4 top-0 text-xs font-semibold text-blue-600 bg-white px-2 rounded transform -translate-y-1/2 pointer-events-none select-none">
                        {label}
                      </label>
                    </div>
                  ) : (
                    <FloatingLabelInput
                      name={name}
                      label={label}
                      value={formData[name]}
                      onChange={handleInputChange}
                      disabled={loading}
                      placeholder={`Enter your ${label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-[#016AB3] to-[#00AEDC] rounded-full animate-pulse"></div>
              <h2 className="text-[#2A428C] font-bold text-xl sm:text-2xl lg:text-3xl">
                Account Category
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#2A428C]/30 to-transparent"></div>
            </div>
            <hr className="border-black/20 mb-4 sm:mb-6" />
            <div className="flex flex-col gap-3 sm:gap-4">
              {[
                {
                  value: "personal",
                  label: "Personal",
                  description: "I print books for personal use or as gifts.",
                  icon: PersonalIcon,
                },
                {
                  value: "business",
                  label: "Business",
                  description: "I publish books for business or resale.",
                  icon: BusinessIcon,
                },
              ].map(({ value, label, description, icon }, index) => (
                <label
                  key={value}
                  className={`w-full border-2 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group ${
                    formData.account_type === value
                      ? "border-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 shadow-blue-200 ring-4 ring-blue-100"
                      : "border-gray-200 hover:border-gray-300 hover:bg-white"
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="relative">
                      <input
                        type="radio"
                        name="account_type"
                        value={value}
                        checked={formData.account_type === value}
                        onChange={handleRadioChange}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        disabled={loading}
                      />
                      {formData.account_type === value && (
                        <div className="absolute inset-0 w-5 h-5 bg-blue-600 rounded-full animate-ping opacity-30"></div>
                      )}
                    </div>
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src={icon}
                        alt={label}
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-all duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  <div className="flex-1 ml-6 sm:ml-0">
                    <h3 className="text-black font-semibold text-sm sm:text-base mb-1 transition-colors duration-300 group-hover:text-blue-700">
                      {label}
                    </h3>
                    <p className="text-black/70 text-xs sm:text-sm transition-colors duration-300 group-hover:text-black">
                      {description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center gap-3 mb-2">
            
            </div>
            <hr className="border-black/20 mb-4 sm:mb-6" />
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              {!isSaved && (
                <button
                  disabled={loading}
                  onClick={handleSave}
                  className={`group relative w-full sm:max-w-md text-white text-base sm:text-lg lg:text-xl font-bold capitalize py-3 sm:py-4 px-6 rounded-full shadow-xl bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading && <LoadingSpinner />}
                    {loading ? "Saving..." : "Save Changes"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              )}

              {isSaved && (
                <button
                  disabled={loading || !formData.id}
                  onClick={handleDelete}
                  className={`group relative w-full sm:max-w-md text-[#D15D9E] border-2 border-[#D15D9E] text-base sm:text-lg lg:text-xl font-bold capitalize py-3 sm:py-4 px-6 rounded-full shadow-lg hover:bg-gradient-to-r hover:from-[#fce9f1] hover:to-[#fdf2f8] transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden ${
                    loading || !formData.id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading && <LoadingSpinner />}
                    {loading ? "Deleting..." : "Delete Account"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D15D9E]/10 via-transparent to-[#D15D9E]/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-180deg);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
          animation-delay: 0s;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
}
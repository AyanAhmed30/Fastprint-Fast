"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/assets/images/fastlogo.svg";
import singup from "@/assets/images/signup.png";
import Image from "next/image";
import { BASE_URL } from "@/services/baseUrl";

const ForgetPassword = () => {
  const [form, setForm] = useState({ email: "" });
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        router.push("/login");
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [success, router]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError(""); // Clear global error on change
    if (success) setSuccess(false);
  };

  const handleBlur = (e) => {
    const { value } = e.target;
    setFocusedField("");
    // Optional: validate on blur and show in global error
    if (!value) {
      setError("Email is required.");
    } else if (!validateEmail(value)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate before API call
    if (!form.email) {
      setError("Email is required.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${BASE_URL}api/users/request-reset-password/`, {
        email: form.email,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setSuccess(false);

      if (err.response?.data?.email) {
        setError(err.response.data.email[0]); // e.g., "This email is not registered."
      } else if (err.response?.data && typeof err.response.data === "object") {
        const firstError = Object.values(err.response.data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError("Failed to send reset instructions. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side */}
      <div
        className={`w-full lg:w-1/2 relative flex items-center justify-center h-56 sm:h-72 md:h-96 lg:h-auto transition-all duration-1000 ease-out ${
          mounted ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
        style={{ backgroundColor: "rgba(4, 22, 67, 1)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/20 animate-pulse"></div>
        <div className="relative z-20 flex items-center justify-center w-full h-full">
          <Image
            src={singup}
            alt="Studying People Illustration"
            className="max-w-[180px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-md object-contain animate-pulse-slow"
            style={{ animationTimingFunction: "ease-in-out" }}
          />
        </div>
        <div
          className={`absolute top-4 left-4 sm:left-6 z-30 transition-all duration-700 delay-300 ${
            mounted ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          <Image
            src={Logo}
            alt="Logo"
            className="w-14 sm:w-16 md:w-20 h-auto object-contain hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Right Side */}
      <div
        className={`w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 py-8 transition-all duration-1000 ease-out relative ${
          mounted ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        style={{ backgroundColor: "rgba(229, 251, 255, 1)" }}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-sm mx-auto w-full">
          <div
            className={`flex flex-col items-center mb-8 transition-all duration-800 delay-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text">
              {success ? "Check Your Email!" : "Reset Password"}{" "}
              <span className="inline-block text-2xl sm:text-3xl">
                {success ? "📬" : "🔑"}
              </span>
            </h1>
            <div className="relative">
              <div
                className={`h-[3px] rounded-full transition-all duration-1000 delay-500 ${
                  mounted ? "w-[150px] sm:w-[180px]" : "w-0"
                }`}
                style={{ backgroundColor: "rgba(1, 106, 179, 1)" }}
              ></div>
              <div
                className={`mt-2 h-[2px] rounded-full mx-auto transition-all duration-1000 delay-700 ${
                  mounted ? "w-[75px] sm:w-[90px]" : "w-0"
                }`}
                style={{ backgroundColor: "rgba(1, 106, 179, 1)" }}
              ></div>
            </div>
          </div>

          {success ? (
            <div className="text-center py-6">
              <p className="text-green-600 font-medium">
                Password reset instructions sent!
              </p>
              <p className="text-gray-600 mt-2">
                If an account exists for <strong>{form.email}</strong>, you’ll
                receive an email shortly.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-6"
              noValidate
            >
              {/* Email Input */}
              <div className="relative group">
                <h2>Email</h2>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={handleBlur}
                  placeholder="Email"
                  required
                  disabled={isLoading}
                  className={`w-full h-12 rounded-xl border-2 px-4 text-base transition-all duration-300 bg-white/70 backdrop-blur-sm
                    ${
                      focusedField === "email" || form.email
                        ? "border-blue-400 shadow-lg shadow-blue-100 scale-[1.02]"
                        : error
                        ? "border-red-400"
                        : "border-gray-200 hover:border-gray-300"
                    }
                    ${
                      isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md"
                    }
                    focus:outline-none focus:ring-0`}
                  aria-invalid={!!error}
                />
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 transition-opacity duration-300 pointer-events-none ${
                    focusedField === "email" ? "opacity-100" : "opacity-0"
                  }`}
                ></div>
                {/* ❌ Removed field-level error */}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`relative h-12 rounded-full text-base font-medium text-white overflow-hidden transition-all duration-300 transform
                  ${
                    isLoading
                      ? "scale-95 opacity-80 cursor-not-allowed"
                      : "hover:scale-105 hover:shadow-xl hover:shadow-blue-200 active:scale-95"
                  }`}
                style={{ backgroundColor: "rgba(0, 150, 205, 1)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending reset link...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </span>
              </button>
            </form>
          )}

          {/* ✅ Global error banner (now shows all errors including validation) */}
          {error && !success && (
            <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg transition-all duration-300 animate-shake">
              <p className="text-red-600 text-sm text-center flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
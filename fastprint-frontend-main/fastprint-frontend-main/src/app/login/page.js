"use client";

import React, { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/assets/images/fastlogo.svg";
import signup from "@/assets/images/loginUI.jpg";
import Image from "next/image";
import { hasCompletedAccountSettings } from "@/utils/profileUtils";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError("");
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: !value
          ? "Email is required."
          : validateEmail(value)
            ? ""
            : "Please enter a valid email address.",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFocusedField("");
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: !value
          ? "Email is required."
          : validateEmail(value)
            ? ""
            : "Please enter a valid email address.",
      }));
    }
  };

  const isFormValid = () => validateEmail(form.email) && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const emailError = !form.email
      ? "Email is required."
      : validateEmail(form.email)
        ? ""
        : "Please enter a valid email address.";

    setErrors({ email: emailError });

    if (emailError) {
      setIsLoading(false);
      return;
    }

    try {
      const user = await login(form);
      if (user?.is_admin) {
        router.push("/admin");
      } else {
        // Check if user has completed account settings
        const hasCompleted = await hasCompletedAccountSettings(user.email, localStorage.getItem('accessToken'));
        if (hasCompleted) {
          router.push("/");
        } else {
          router.push("/account-settings");
        }
      }
    } catch {
      setError(
        "Invalid email or password. Please try with correct credentials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side */}
      <div
        className={`w-full lg:w-1/2 flex items-center justify-center bg-[#041643] transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="relative w-full h-full">
          <Link href={"/"}>
            <Image
              src={Logo}
              alt="Fast Print Guys Logo"
              width={100}
              height={100}
              className="z-50 absolute top-5 blur-none left-5"
            />
          </Link>
          <Image
            src={signup}
            alt="Signup Illustration"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Right Side */}
      <div
        className={`w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 py-8 transition-all duration-1000 ease-out relative ${mounted ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        style={{ backgroundColor: "rgba(229, 251, 255, 1)" }}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-sm mx-auto w-full">
          <div
            className={`flex flex-col items-center mb-8 transition-all duration-800 delay-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text">
              Welcome Back{" "}
              <span className="inline-block text-2xl sm:text-3xl animate-wave">
                👋
              </span>
            </h1>
            <div className="relative">
              <div
                className={`h-[3px] rounded-full transition-all duration-1000 delay-500 ${mounted ? "w-[150px] sm:w-[180px]" : "w-0"
                  }`}
                style={{ backgroundColor: "rgba(1, 106, 179, 1)" }}
              ></div>
              <div
                className={`mt-2 h-[2px] rounded-full mx-auto transition-all duration-1000 delay-700 ${mounted ? "w-[75px] sm:w-[90px]" : "w-0"
                  }`}
                style={{ backgroundColor: "rgba(1, 106, 179, 1)" }}
              ></div>
            </div>
          </div>

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
                  ${focusedField === "email" || form.email
                    ? "border-blue-400 shadow-lg shadow-blue-100 scale-[1.02]"
                    : "border-gray-200 hover:border-gray-300"
                  }
                  ${isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-md"
                  }
                  focus:outline-none focus:ring-0`}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 transition-opacity duration-300 pointer-events-none ${focusedField === "email" ? "opacity-100" : "opacity-0"
                  }`}
              ></div>
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-black">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative group">
              <h2>Password</h2>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Password"
                  required
                  disabled={isLoading}
                  className={`w-full h-12 rounded-xl border-2 px-4 text-base transition-all duration-300 bg-white/70 backdrop-blur-sm pr-12
                    ${focusedField === "password" || form.password
                      ? "border-blue-400 shadow-lg shadow-blue-100 scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300"
                    }
                    ${isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-md"
                    }
                    focus:outline-none focus:ring-0`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.5a10.45 10.45 0 01-2.057 5.276M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`relative h-12 rounded-full text-base font-medium text-white overflow-hidden transition-all duration-300 transform
                ${isLoading
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
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </span>
            </button>
          </form>

          {error && (
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

          <p className="mt-8 text-gray-690 text-sm text-center">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold hover:underline transition-all duration-300 hover:scale-105 inline-block"
              style={{ color: "rgba(1, 106, 179, 1)" }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { BASE_URL } from "@/services/baseUrl";
import Logo from "@/assets/images/fastlogo.svg";
import singup from "@/assets/images/signup.png";

// ✅ Password requirement line component
const PasswordRequirement = ({ label, valid }) => (
  <li className="flex items-center space-x-2">
    <span
      className={`flex items-center justify-center w-4 h-4 rounded-full border text-xs font-bold transition-all duration-300 ${
        valid
          ? "bg-green-500 border-green-500 text-white"
          : "border-gray-400 text-gray-400"
      }`}
    >
      {valid ? "✓" : "•"}
    </span>
    <span
      className={`transition-colors duration-300 ${
        valid ? "text-green-600" : "text-gray-600"
      }`}
    >
      {label}
    </span>
  </li>
);

const ResetPassword = () => {
  const router = useRouter();
  const params = useParams();
  const { uidb64, token } = params || {};

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&#^()\-_=+]/.test(password);

    if (!password) return "Password is required.";
    if (!minLength) return "Password must be at least 8 characters long.";
    if (!hasUppercase) return "Password must contain an uppercase letter.";
    if (!hasLowercase) return "Password must contain a lowercase letter.";
    if (!hasNumber) return "Password must contain a number.";
    if (!hasSpecialChar)
      return "Password must contain a special character.";

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess(false);

    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value !== form.password
            ? "Passwords do not match."
            : validatePassword(value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const passwordError = validatePassword(form.password);
    const confirmPasswordError =
      form.confirmPassword !== form.password
        ? "Passwords do not match."
        : validatePassword(form.confirmPassword);

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    if (passwordError || confirmPasswordError) {
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${BASE_URL}api/users/reset-password/${uidb64}/${token}/`, {
        password: form.password,
      });

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to reset password. The link may be invalid or expired.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!uidb64 || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">Invalid reset link.</p>
      </div>
    );
  }

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
        <div className="relative z-10 max-w-sm mx-auto w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">
            {success ? "Password Updated ✅" : "Set New Password 🔒"}
          </h1>

          {success ? (
            <div className="text-center py-6">
              <p className="text-green-600 font-medium">
                Your password has been successfully updated!
              </p>
              <p className="text-gray-500 mt-2">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6" noValidate>
              {/* New Password (no validation box) */}
              <div className="relative group">
                <h2>New Password</h2>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    placeholder="Enter new password"
                    disabled={isLoading}
                    className={`w-full h-12 rounded-xl border-2 px-4 pr-10 text-base transition-all duration-300 bg-white/70 backdrop-blur-sm
                      ${
                        focusedField === "password" || form.password
                          ? "border-blue-400 shadow-lg shadow-blue-100 scale-[1.02]"
                          : "border-gray-200 hover:border-gray-300"
                      }
                      ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
                      focus:outline-none focus:ring-0`}
                  />
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
              </div>

              {/* Confirm Password (with validation + match check) */}
              <div className="relative group">
                <h2>Confirm Password</h2>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirmPassword")}
                    placeholder="Confirm new password"
                    disabled={isLoading}
                    className={`w-full h-12 rounded-xl border-2 px-4 pr-10 text-base transition-all duration-300 bg-white/70 backdrop-blur-sm
                      ${
                        focusedField === "confirmPassword" || form.confirmPassword
                          ? "border-blue-400 shadow-lg shadow-blue-100 scale-[1.02]"
                          : "border-gray-200 hover:border-gray-300"
                      }
                      ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
                      focus:outline-none focus:ring-0`}
                  />
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>

                {/* ✅ Real-time Password Requirements & Match Check */}
                {(focusedField === "confirmPassword" ||
                  form.confirmPassword.length > 0) && (
                  <div className="mt-3 p-3 rounded-lg bg-white shadow-md border border-gray-200 animate-fadeIn">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Password must contain:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <PasswordRequirement
                        label="At least 8 characters"
                        valid={form.confirmPassword.length >= 8}
                      />
                      <PasswordRequirement
                        label="Lowercase letter (a-z)"
                        valid={/[a-z]/.test(form.confirmPassword)}
                      />
                      <PasswordRequirement
                        label="Uppercase letter (A-Z)"
                        valid={/[A-Z]/.test(form.confirmPassword)}
                      />
                      <PasswordRequirement
                        label="Number (0-9)"
                        valid={/\d/.test(form.confirmPassword)}
                      />
                      <PasswordRequirement
                        label="Special character (!@#$%^&*)"
                        valid={/[^A-Za-z0-9]/.test(form.confirmPassword)}
                      />
                    </ul>
                    {/* ❌ Password Match Validation */}
                    {form.confirmPassword &&
                      form.password !== form.confirmPassword && (
                        <p className="text-red-500 text-sm mt-2 font-medium">
                          ❌ Passwords do not match
                        </p>
                      )}
                  </div>
                )}
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
                <span className="relative z-10">
                  {isLoading ? "Updating password..." : "Update Password"}
                </span>
              </button>
            </form>
          )}

          {error && (
            <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg transition-all duration-300 animate-shake">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
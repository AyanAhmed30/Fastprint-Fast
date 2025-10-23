"use client";

import React, { useState, useEffect } from "react";
import { register } from "@/services/authService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/assets/images/fastlogo.svg";
import signup from "@/assets/images/loginUI.jpg";

// import signup from "@/assets/images/signup.png";
import Image from "next/image";

const Signup = () => {
  const [form, setForm] = useState({ email: "", name: "", password: "" });
  const [agreedToTerms, setAgreedToTerms] = useState(false); // ✅ NEW STATE
  const [message, setMessage] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    name: "",
    password: "",
    terms: "", // ✅ NEW ERROR FIELD
  });

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateName = (name) => {
    return name.trim().length >= 3;
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return re.test(password);
  };

  const passwordErrorList = [
    "At least 8 characters",
    "Include uppercase letter",
    "Include lowercase letter",
    "Include number",
    "Include special character",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (message) setMessage("");

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "email") {
        if (!value) {
          newErrors.email = "Email is required.";
        } else if (!validateEmail(value)) {
          newErrors.email = "Please Enter your email in the correct format";
        } else {
          newErrors.email = "";
        }
      } else if (name === "name") {
        if (!value) {
          newErrors.name = "Name is required.";
        } else if (!validateName(value)) {
          newErrors.name = "Name must be at least 3 characters.";
        } else {
          newErrors.name = "";
        }
      } else if (name === "password") {
        if (!value) {
          newErrors.password = "Password is required.";
        } else if (!validatePassword(value)) {
          newErrors.password = passwordErrorList.join("\n");
        } else {
          newErrors.password = "";
        }
      }
      return newErrors;
    });
  };

  // ✅ Handle Terms Checkbox Change
  const handleTermsChange = (e) => {
    setAgreedToTerms(e.target.checked);
    if (e.target.checked) {
      setErrors((prev) => ({ ...prev, terms: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFocusedField("");
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "email") {
        if (!value) {
          newErrors.email = "Email is required.";
        } else if (!validateEmail(value)) {
          newErrors.email = "Please enter a valid email address.";
        } else {
          newErrors.email = "";
        }
      } else if (name === "name") {
        if (!value) {
          newErrors.name = "Name is required.";
        } else if (!validateName(value)) {
          newErrors.name = "Name must be at least 3 characters.";
        } else {
          newErrors.name = "";
        }
      } else if (name === "password") {
        if (!value) {
          newErrors.password = "Password is required.";
        } else if (!validatePassword(value)) {
          newErrors.password = passwordErrorList.join("\n");
        } else {
          newErrors.password = "";
        }
      }
      return newErrors;
    });
  };

  const isFormValid = () => {
    return (
      validateName(form.name) &&
      validateEmail(form.email) &&
      validatePassword(form.password) &&
      agreedToTerms && // ✅ ADD THIS CONDITION
      !formDisabled
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    const nameError = !form.name
      ? "Name is required."
      : validateName(form.name)
      ? ""
      : "Name must be at least 3 characters.";
    const emailError = !form.email
      ? "Email is required."
      : validateEmail(form.email)
      ? ""
      : "Please enter a valid email address.";
    const passwordError = !form.password
      ? "Password is required."
      : validatePassword(form.password)
      ? ""
      : passwordErrorList.join("\n");
    const termsError = !agreedToTerms
      ? "You must agree to the Terms & Conditions and Privacy Policy."
      : ""; // ✅ VALIDATE TERMS

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      terms: termsError, // ✅ SET TERMS ERROR
    });

    if (nameError || emailError || passwordError || termsError) {
      return;
    }

    setFormDisabled(true);

    try {
      await register(form);
      setMessage(
        "Registered successfully! Please check your email to verify your account."
      );
      setIsSuccess(true);
      setFormDisabled(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        "Registration failed. Please try again.";
      setMessage(errorMsg);
      setFormDisabled(false);
    }
  };

  // ✅ Small reusable component for requirement line
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side - Image */}
      <div
        className={`w-full lg:w-1/2 flex items-center justify-center bg-[#041643] transition-opacity duration-1000 ${
          mounted ? "opacity-100" : "opacity-0"
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

      {/* Right Side - Form */}
      <div
        className={`w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 md:px-8 py-12 bg-[#e5fbff] transition-opacity duration-1000 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-40 sm:h-40 md:w-64 md:h-64 bg-cyan-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto">
          <div
            className={`flex flex-col items-center mb-8 transition-all duration-800 delay-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text">
              Join Us Today{" "}
              <span className="inline-block text-xl sm:text-2xl md:text-3xl animate-wave">
                🚀
              </span>
            </h1>
            <div className="relative">
              <div
                className={`h-[3px] rounded-full transition-all duration-1000 delay-500 ${
                  mounted ? "w-[100px] sm:w-[150px] md:w-[180px]" : "w-0"
                }`}
                style={{ backgroundColor: "rgba(1, 106, 179, 1)" }}
              ></div>
              <div
                className={`mt-2 h-[2px] rounded-full mx-auto transition-all duration-1000 delay-700 ${
                  mounted ? "w-[50px] sm:w-[75px] md:w-[90px]" : "w-0"
                }`}
                style={{ backgroundColor: "rgba(1, 106, 179, 1)" }}
              ></div>
            </div>
          </div>

          <div
            className={`transition-all duration-800 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-8 text-center">
              Create Your Account
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-6"
              noValidate
            >
              {/* Name Input */}
              <div className="relative group">
                <h2 className="text-sm font-medium text-gray-700 mb-1">
                  Username
                </h2>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={handleBlur}
                  placeholder="Username"
                  required
                  disabled={formDisabled}
                  className={`w-full h-12 rounded-xl border-2 px-4 text-base transition-all duration-300 bg-white/70 backdrop-blur-sm
                    ${
                      focusedField === "name" || form.name
                        ? "border-blue-400 shadow-lg shadow-blue-100 scale-[1.02]"
                        : "border-gray-200 hover:border-gray-300"
                    } 
                    ${
                      formDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md"
                    }
                    focus:outline-none focus:ring-0`}
                  aria-invalid={!!errors.name}
                  aria-describedby="name-error"
                />
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 transition-opacity duration-300 pointer-events-none
                    ${focusedField === "name" ? "opacity-100" : "opacity-0"}`}
                ></div>
                {errors.name && (
                  <p id="name-error" className="mt-1 text-xs text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="relative group">
                <h2 className="text-sm font-medium text-gray-700 mb-1">
                  Email
                </h2>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={handleBlur}
                  placeholder="Email"
                  required
                  disabled={formDisabled}
                  className={`w-full h-12 rounded-xl border-2 px-4 text-base transition-all duration-300 bg-white/70 backdrop-blur-sm
                    ${
                      focusedField === "email" || form.email
                        ? "border-blue-400 shadow-lg shadow-blue-100 scale-[1.02]"
                        : "border-gray-200 hover:border-gray-300"
                    } 
                    ${
                      formDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md"
                    }
                    focus:outline-none focus:ring-0`}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                />
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 transition-opacity duration-300 pointer-events-none
                    ${focusedField === "email" ? "opacity-100" : "opacity-0"}`}
                ></div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative group">
                <h2 className="text-sm font-medium text-gray-700 mb-1">
                  Password
                </h2>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={handleBlur}
                    placeholder="Password"
                    required
                    disabled={formDisabled}
                    className={`w-full h-12 rounded-xl border-2 px-4 pr-12 text-base transition-all duration-300 bg-white/70 backdrop-blur-sm
                      ${
                        focusedField === "password" || form.password
                          ? "border-blue-400 shadow-lg shadow-blue-100 scale-[1.02]"
                          : "border-gray-200 hover:border-gray-300"
                      } 
                      ${
                        formDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow-md"
                      }
                      focus:outline-none focus:ring-0`}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-error"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-gray-800 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24M10.73 5.08A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.96 9.96 0 01-4.58 5.818M6.42 6.42A9.96 9.96 0 002.458 12c1.274 4.057 5.065 7 9.542 7 .845 0 1.668-.104 2.458-.3"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 transition-opacity duration-300 pointer-events-none
                    ${
                      focusedField === "password" ? "opacity-100" : "opacity-0"
                    }`}
                ></div>
                {focusedField === "password" && (
                  <div className="mt-3 p-3 rounded-lg bg-white shadow-md border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Password must contain:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <PasswordRequirement
                        label="At least 8 characters"
                        valid={form.password.length >= 8}
                      />
                      <PasswordRequirement
                        label="Lowercase letter (a-z)"
                        valid={/[a-z]/.test(form.password)}
                      />
                      <PasswordRequirement
                        label="Uppercase letter (A-Z)"
                        valid={/[A-Z]/.test(form.password)}
                      />
                      <PasswordRequirement
                        label="Number (0-9)"
                        valid={/\d/.test(form.password)}
                      />
                      <PasswordRequirement
                        label="Special character (!@#$%^&*)"
                        valid={/[^A-Za-z0-9]/.test(form.password)}
                      />
                    </ul>
                  </div>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="relative group">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={handleTermsChange}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    aria-invalid={!!errors.terms}
                    aria-describedby="terms-error"
                  />
                  <span className="text-sm text-gray-700 leading-tight">
                    I have read and agree to Fast Print Guys'{" "}
                    <Link
                      target="_blank"
                      href="/terms-and-conditions"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      target="_blank"
                      href="/privacy-policy"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {errors.terms && (
                  <p id="terms-error" className="mt-1 text-xs text-red-600">
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formDisabled || !isFormValid()}
                className={`relative h-12 rounded-full text-base font-medium text-white overflow-hidden transition-all duration-300 transform
                  ${
                    formDisabled || !isFormValid()
                      ? "scale-95 opacity-80 cursor-not-allowed"
                      : "hover:scale-105 hover:shadow-xl hover:shadow-blue-200 active:scale-95"
                  }`}
                style={{ backgroundColor: "rgba(0, 150, 205, 1)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  {formDisabled ? (
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
                      Creating Account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </span>
              </button>
            </form>

            {/* Message */}
            {message && (
              <div
                className={`mt-6 p-3 border rounded-lg ${
                  isSuccess
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p
                  className={`text-sm text-center flex items-center justify-center ${
                    isSuccess ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isSuccess ? (
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
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
                  )}
                  {message}
                </p>
              </div>
            )}

            {/* Login Link */}
            <p className="mt-8 text-gray-700 text-sm text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold hover:underline"
                style={{ color: "rgba(1, 106, 179, 1)" }}
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
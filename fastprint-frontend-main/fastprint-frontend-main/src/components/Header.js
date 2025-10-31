"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiSettings } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import useAuth from "../hooks/useAuth";
import Image from "next/image";
import FastPrintLogo from "@/assets/images/fastlogo.svg";
import axios from "axios";
import { BASE_URL } from "@/services/baseUrl";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // ✅ Now reflects cart item count

  const resourceRef = useRef();
  const profileRef = useRef();
  const mobileProfileRef = useRef();

  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // 🔁 Fetch CART items count (not paid orders)
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setCartCount(0);
        return;
      }

      axios
        .get(`${BASE_URL}api/cart/items/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          // Assuming response.data is an array of cart items
          const cartItems = Array.isArray(response.data) ? response.data : response.data?.data || [];
          setCartCount(cartItems.length);

          // Optional: Save to localStorage for consistency
          const cartCountKey = `cart_count_${user.id}`;
          localStorage.setItem(cartCountKey, JSON.stringify(cartItems.length));

          // Clean up old order-based cart key if needed
          localStorage.removeItem("cart");
        })
        .catch((error) => {
          console.error("Failed to fetch cart items:", error);
          setCartCount(0);
        });
    } else {
      setCartCount(0);
    }
  }, [user]); // Re-run when user changes

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resourceRef.current && !resourceRef.current.contains(event.target)) {
        setResourceOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(event.target)) {
        setMobileProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMobileLinkClick = () => {
    setMenuOpen(false);
    setResourceOpen(false);
    setMobileProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
    setMenuOpen(false);
    setProfileOpen(false);
    setMobileProfileOpen(false);
  };

  const handleCartClick = () => {
    router.push(user ? "/cart" : "/login");
    setMenuOpen(false);
  };

  const handleProfileNavigation = (path) => {
    router.push(path);
    setProfileOpen(false);
    setMobileProfileOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={FastPrintLogo}
              alt="Fast Print Guys Logo"
              className="w-16 h-16 sm:w-20 transition-transform duration-200 hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-gray-700 text-sm xl:text-base">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About Us" },
              { href: "/products", label: "Products" },
              { href: "/calculator/printbook", label: "Pricing" },
              { href: "/print-shop", label: "Print Shop" },
              { href: "/portfolio", label: "Portfolio" },
              { href: "/services", label: "Services" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-blue-600 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div
              className="relative"
              ref={resourceRef}
              onMouseEnter={() => setResourceOpen(true)}
              onMouseLeave={() => setResourceOpen(false)}
            >
              <button className="hover:text-blue-600 flex items-center gap-1 transition-colors duration-200">
                Resources{" "}
                <IoIosArrowDown
                  className={`transition-transform duration-200 ${resourceOpen ? "rotate-180" : ""}`}
                />
              </button>
              {resourceOpen && (
                <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg z-20 min-w-52 border border-gray-100">
                  <div className="py-2">
                    {[
                      "guide-templates",
                      "blogs",
                      "publishing",
                      "contact-resources",
                      "hire-professional",
                      "plan-project",
                    ].map((slug) => (
                      <Link
                        key={slug}
                        href={`/resources/${slug}`}
                        className="block px-4 py-2 hover:bg-gray-50 transition-colors duration-200 text-sm"
                      >
                        {slug
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 xl:px-6 py-2 text-xs xl:text-sm font-medium border rounded-full transition-all duration-300 text-[#0096CD] border-[#0096CD] bg-white hover:bg-[#2A428C] hover:text-white hover:border-[#2A428C]"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 xl:px-6 py-2 text-xs xl:text-sm font-medium border rounded-full transition-all duration-300 text-[#0096CD] border-[#0096CD] bg-white hover:bg-[#2A428C] hover:text-white hover:border-[#2A428C]"
              >
                Login
              </Link>
            )}

            {/* Cart Icon with Badge — now shows cart item count */}
            <div
              className="relative cursor-pointer"
              onClick={handleCartClick}
              title="Your Cart"
            >
              <AiOutlineShoppingCart
                size={25}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center text-[10px] font-bold text-white bg-red-600 rounded-full w-4 h-4 min-w-[16px]">
                  {cartCount}
                </span>
              )}
            </div>

            {/* Profile Dropdown */}
            {user && (
              <div className="relative" ref={profileRef}>
                <FiUser
                  size={20}
                  className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                  title="Profile"
                  onClick={() => setProfileOpen(!profileOpen)}
                />
                {profileOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl z-20 min-w-[220px] border border-gray-100 ring-1 ring-black ring-opacity-5">
                    <div className="py-3">
                      <div className="px-4 py-4 border-b border-gray-100">
                        <div className="text-base font-bold text-gray-800">Fast Print Guys</div>
                        <div className="text-sm text-gray-500 mt-1 truncate">{user?.email}</div>
                      </div>
                      <div className="flex flex-col py-2">
                        <button
                          onClick={() => handleProfileNavigation("/userdashboard")}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 text-sm text-left text-gray-700"
                        >
                          <MdDashboard size={20} className="text-gray-600" />
                          <span className="leading-5">User Dashboard</span>
                        </button>
                        <button
                          onClick={() => handleProfileNavigation("/account-settings")}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 text-sm text-left text-gray-700"
                        >
                          <FiSettings size={20} className="text-gray-600" />
                          <span className="leading-5">Account Settings</span>
                        </button>
                        <button
                          onClick={() => handleProfileNavigation("/orders")}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 text-sm text-left text-gray-700"
                        >
                          <HiOutlineShoppingBag size={20} className="text-gray-600" />
                          <span className="leading-5">Order History</span>
                        </button>
                        <button
                          onClick={() => handleProfileNavigation("/resources/contact-resources")}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 text-sm text-left text-gray-700"
                        >
                          <FiPhone size={20} className="text-gray-600" />
                          <span className="leading-5">Contact Support</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!user && (
              <div className="cursor-pointer" onClick={() => router.push("/login")}>
                <FiUser
                  size={20}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  title="Login"
                />
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-3">
            <div
              className="relative cursor-pointer"
              onClick={handleCartClick}
              title="Your Cart"
            >
              <HiOutlineShoppingBag
                size={18}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center text-[9px] font-bold text-white bg-red-600 rounded-full w-3.5 h-3.5 min-w-[14px]">
                  {cartCount}
                </span>
              )}
            </div>

            {user && (
              <div className="relative" ref={mobileProfileRef}>
                <FiUser
                  size={20}
                  className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                  title="Profile"
                  onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                />
                {mobileProfileOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl z-20 min-w-[220px] border border-gray-100 ring-1 ring-black ring-opacity-5">
                    <div className="py-3">
                      <div className="px-4 py-4 border-b border-gray-100">
                        <div className="text-sm font-semibold text-gray-800">Fast Print Guys</div>
                        <div className="text-sm text-gray-500 mt-1 truncate">{user?.email}</div>
                      </div>
                      <div className="flex flex-col py-2">
                        <button
                          onClick={() => handleProfileNavigation("/userdashboard")}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 text-sm text-left text-gray-700"
                        >
                          <MdDashboard size={20} className="text-gray-600" />
                          <span className="leading-5">User Dashboard</span>
                        </button>
                        <button
                          onClick={() => handleProfileNavigation("/account-settings")}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 text-sm text-left text-gray-700"
                        >
                          <FiSettings size={20} className="text-gray-600" />
                          <span className="leading-5">Account Settings</span>
                        </button>
                        <button
                          onClick={() => handleProfileNavigation("/orders")}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 text-sm text-left text-gray-700"
                        >
                          <HiOutlineShoppingBag size={20} className="text-gray-600" />
                          <span className="leading-5">Order History</span>
                        </button>
                        <button
                          onClick={() => handleProfileNavigation("/resources/contact-resources")}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 text-sm text-left text-gray-700"
                        >
                          <FiPhone size={20} className="text-gray-600" />
                          <span className="leading-5">Contact Support</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            }`}
        >
          <nav className="py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/products", label: "Products" },
                { href: "/calculator/printbook", label: "Pricing" },
                { href: "/print-shop", label: "Print Shop" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/services", label: "Services" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                  onClick={handleMobileLinkClick}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={() => setResourceOpen(!resourceOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                >
                  <span>Resources</span>
                  <IoIosArrowDown
                    className={`transition-transform duration-200 ${resourceOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${resourceOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                >
                  <div className="pl-4 space-y-1">
                    {[
                      "guide-templates",
                      "blogs",
                      "publishing",
                      "contact-resources",
                      "hire-professional",
                      "plan-project",
                    ].map((slug) => (
                      <Link
                        key={slug}
                        href={`/resources/${slug}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                        onClick={handleMobileLinkClick}
                      >
                        {slug
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 px-4">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm font-medium border rounded-full transition-all duration-300 text-[#0096CD] border-[#0096CD] bg-white"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full px-4 py-2 text-sm font-medium border rounded-full text-center transition-all duration-300 text-[#0096CD] border-[#0096CD] bg-white"
                    onClick={handleMobileLinkClick}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className="w-full h-1.5 bg-gradient-to-r from-pink-400 to-purple-600"></div>
    </header>
  );
};

export default Header;
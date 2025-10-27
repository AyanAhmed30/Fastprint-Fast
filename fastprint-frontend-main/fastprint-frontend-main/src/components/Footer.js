"use client";

import {
  FaHome,
  FaBoxOpen,
  FaBlog,
  FaPhoneAlt,
  FaPaperPlane,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaInfoCircle,
  FaBriefcase,
  FaConciergeBell,
  FaUserTie,
  FaUsers,
  FaHeadset,
  FaYoutube,
  FaBell,
} from "react-icons/fa";
import { FaTiktok, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { useState } from "react";

const Footer = () => {
  const [communityOpen, setCommunityOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Optional: Add real API integration here later
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 5000); // Auto-hide after 5s
    }
  };

  return (
    <footer className="w-full bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC] text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-10 md:gap-0">
        {/* Left Section */}
        <div className="flex flex-col gap-6 md:w-1/2">
          {/* Navigation Links */}
          <div className="flex flex-wrap gap-6 text-base font-medium">
            <div>
              <Link href="/about" className="flex items-center gap-2 cursor-pointer hover:underline">
                <FaInfoCircle /> <span>About</span>
              </Link>
            </div>
            <div>
              <Link href="/" className="flex items-center gap-2 cursor-pointer hover:underline">
                <FaHome /> <span>Home</span>
              </Link>
            </div>
            <div>
              <Link href="/products" className="flex items-center gap-2 cursor-pointer hover:underline">
                <FaBoxOpen /> <span>Products</span>
              </Link>
            </div>
            <div>
              <Link href="/services" className="flex items-center gap-2 cursor-pointer hover:underline">
                <FaBell /> <span>Services</span>
              </Link>
            </div>
            <div>
              <Link href="/portfolio" className="flex items-center gap-2 cursor-pointer hover:underline">
                <FaBriefcase /> <span>Portfolio</span>
              </Link>
            </div>
            <div>
              <Link href="/careers" className="flex items-center gap-2 cursor-pointer hover:underline">
                <FaUserTie /> <span>Careers</span>
              </Link>
            </div>
            <div>
              <Link href="/resources/blogs" className="flex items-center gap-2 cursor-pointer hover:underline">
                <FaBlog /> <span>Blog</span>
              </Link>
            </div>

            {/* Community Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCommunityOpen(true)}
              onMouseLeave={() => setCommunityOpen(false)}
            >
              <button
                className="flex items-center gap-2 cursor-pointer hover:underline focus:outline-none"
                aria-haspopup="true"
                aria-expanded={communityOpen}
              >
                <FaUsers /> <span>Community</span>
              </button>
              {communityOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
                  <a
                    href="https://www.youtube.com/@FastPrintGuys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Videos
                  </a>
                  <Link
                    href="/resources/blogs"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Blogs
                  </Link>
                </div>
              )}
            </div>

            {/* Help Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setHelpOpen(true)}
              onMouseLeave={() => setHelpOpen(false)}
            >
              <button
                className="flex items-center gap-2 cursor-pointer hover:underline focus:outline-none"
                aria-haspopup="true"
                aria-expanded={helpOpen}
              >
                <FaHeadset /> <span>Help</span>
              </button>
              {helpOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
                  <Link
                    href="/resources/contact-resources"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Contact Support
                  </Link>
                  <Link
                    href="/resources/contact-resources"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Raise a Ticket
                  </Link>
                  <Link
                    href="/resources/hire-professional"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Hire a Professional
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-6 text-2xl mt-2">
            <a
              href="https://x.com/Fast_Print_Guys"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="cursor-pointer hover:text-yellow-400 transition"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.instagram.com/fastprintguys/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="cursor-pointer hover:text-yellow-400 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/fastprintguys/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="cursor-pointer hover:text-yellow-400 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.linkedin.com/company/fast-print-guys"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="cursor-pointer hover:text-yellow-400 transition"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://www.youtube.com/@FastPrintGuys"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="cursor-pointer hover:text-yellow-400 transition"
            >
              <FaYoutube />
            </a>
            <a
              href="https://www.tiktok.com/@fastprintguys?lang=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="cursor-pointer hover:text-yellow-400 transition"
            >
              <FaTiktok />
            </a>
          </div>

          {/* Contact Info */}
          <div className="flex items-center gap-3 mt-4">
            <FaPhoneAlt />
            <a href="tel:+14692777489" className="hover:underline">+1 469-277-7489</a>
          </div>
          <div className="flex items-center gap-3">
            <FaPaperPlane />
            <a href="mailto:info@fastprintguys.com" className="hover:underline">info@fastprintguys.com</a>
          </div>
        </div>

        {/* Right Section – Subscribe */}
        <div className="flex flex-col gap-4 md:w-1/3">
          <p className="text-base leading-relaxed max-w-md">
            Subscribe now for exclusive offers and fast, top-quality printing services delivered to your door!
          </p>

          <h4 className="text-lg font-semibold mt-4">Subscribe Our Newsletter</h4>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <div className="w-full sm:w-auto flex-grow">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="p-3 w-full bg-white rounded-full outline-none text-black text-sm"
                aria-label="Email Address"
                required
              />
              {isSubmitted && (
                <p className="mt-2 text-green-300 text-sm">Thank you! You're subscribed successfully.</p>
              )}
            </div>
            <button
              type="submit"
              className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
              aria-label="Subscribe"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t-4 border-yellow-400 mt-2" />

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 text-white text-sm max-w-7xl mx-auto gap-4 md:gap-0">
        <span>
          © 2025 Fast Print Guys, Texas Global Traders & Distributors, Inc. All rights reserved.
        </span>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
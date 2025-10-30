"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import maskgroup from "@/assets/images/hire-mask-group.png";
import bannerimg from "@/assets/images/banner/contact-svg.svg";
import ourBlogBGImg from "@/assets/images/our-blog-bg-img.png";
import ContactFooterImg from "@/assets/images/contact-footer-img.png";

import { IoLocationOutline, IoMailOpenOutline } from "react-icons/io5";
import { FiPhoneCall } from "react-icons/fi";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

const cards = [
  {
    title: "Visit our office",
    icon: <IoLocationOutline size={40} />,
    content: ["2828 W Parker Rd Suite B103, Plano, TX 75075, United States"],
  },
  {
    title: "Mail Us",
    icon: <IoMailOpenOutline size={40} />,
    content: ["info@fastprintguys.com", "hr@fastprintguys.com"],
  },
  {
    title: "Call Us",
    icon: <FiPhoneCall size={40} />,
    content: ["+1 469-277-7489", "(Mon–Tue) at 9 a.m to 6 p.m"],
  },
];

const ContactResources = () => {
  const [fileName, setFileName] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "",
    subject: "",
    businessLine: "",
    message: "",
    helpWith: "",
    orderId: "",
    trackingId: "",
    projectId: "",
    projectTitle: "",
    isbn: "",
  });

  // ⚙️ Web3Forms Configuration
  const WEB3FORMS_ACCESS_KEY = "f3c1f7c7-ed2b-4739-a1de-9fd98eb23b25";
  const RECEIVER_EMAIL = "ayan3092003@gmail.com";

  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });

    if (!formData.firstName || !formData.email) {
      setFormStatus({
        type: "error",
        message: "Please fill in required fields (First Name, Email).",
      });
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      setIsSubmitting(false);
      return;
    }

    if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
      setFormStatus({
        type: "error",
        message: "⚠️ Web3Forms access key not configured. Get it at https://web3forms.com",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const emailBody = `
═══════════════════════════════════
FASTPRINT GUYS — GENERAL INQUIRY
═══════════════════════════════════
CONTACT:
• Name: ${formData.firstName} ${formData.lastName}
• Email: ${formData.email}
• Service: ${formData.service || "Not specified"}
• Subject: ${formData.subject || "N/A"}

DETAILS:
• Line of Business: ${formData.businessLine || "N/A"}
• Help Needed With: ${formData.helpWith || "N/A"}
• Order/Project/Tracking/ISBN:
  - Order ID: ${formData.orderId || "N/A"}
  - Tracking ID: ${formData.trackingId || "N/A"}
  - Project ID: ${formData.projectId || "N/A"}
  - Project Title: ${formData.projectTitle || "N/A"}
  - ISBN: ${formData.isbn || "N/A"}

MESSAGE:
${formData.message || "No message provided."}
═══════════════════════════════════
Submitted via Fast Print Guys Contact Page
      `;

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `📩 Contact Form: ${formData.subject || "General Inquiry"}`,
          from_name: `${formData.firstName} ${formData.lastName}`.trim() || "Anonymous",
          from_email: formData.email,
          to_email: RECEIVER_EMAIL,
          message: emailBody,
          ...formData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setFormStatus({
          type: "success",
          message: "✅ Your message has been sent! We’ll reply soon.",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          service: "",
          subject: "",
          businessLine: "",
          message: "",
          helpWith: "",
          orderId: "",
          trackingId: "",
          projectId: "",
          projectTitle: "",
          isbn: "",
        });
        setFileName(null);
        setTimeout(() => setFormStatus({ type: "", message: "" }), 5000);
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setFormStatus({
        type: "error",
        message: "❌ Failed to send. Please try again or email us directly at " + RECEIVER_EMAIL,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Banner */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative bg-[#2C0319] border-purple-500 overflow-hidden"
      >
        <Image
          src={maskgroup}
          alt="Mask Group"
          fill
          style={{ objectFit: "cover" }}
          priority
        />

        <motion.div
          className="relative px-6 py-12 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto"
          variants={fadeInUp}
        >
          <motion.div
            className="flex-1 mb-8 md:mb-0"
            variants={slideInFromLeft}
          >
            <motion.h1 
              className="text-3xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="text-yellow-400">Contact</span>
              <span className="text-white"> Us</span>
            </motion.h1>
            <motion.p 
              className="text-white text-sm md:text-base leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Custom book printing with 3,000+ size, paper, and binding options.
            </motion.p>
          </motion.div>

          <motion.div
            className="flex-1 flex items-center justify-end"
            variants={slideInFromRight}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={bannerimg}
                alt="Guide and Template Illustration"
                className="h-75"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Features */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="relative bg-white overflow-hidden border-t-4 border-blue-600"
      >
        <Image
          src={ourBlogBGImg}
          alt="Gradient Background"
          fill
          className="object-cover opacity-100"
          priority
        />

        <div className="relative z-10 my-10">
          <motion.div 
            className="mb-20"
            variants={fadeInUp}
          >
            <motion.h2 
              className="sm:text-4xl text-2xl font-bold text-center mb-2"
              variants={fadeInUp}
            >
              Get in Touch
            </motion.h2>

            <motion.p 
              className="text-center sm:mx-16"
              variants={fadeInUp}
            >
              Have questions or ready to start your project? <br /> Get in
              touch with us today — we're here to help every step of the way.
            </motion.p>
          </motion.div>

          {/* Process */}
          <motion.div 
            className="min-h-screen sm:mx-20 flex items-center justify-center"
            variants={staggerContainer}
          >
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Form Section */}
              <motion.div 
                className="bg-[#E9E9E9] shadow-lg rounded-xl p-6 space-y-4"
                variants={slideInFromLeft}
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex gap-3">
                    <motion.input
                      type="text"
                      placeholder="First Name"
                      className="w-full placeholder-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd]"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                    <motion.input
                      type="text"
                      placeholder="Last Name"
                      className="w-full placeholder-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd]"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3">
                    <motion.input
                      type="email"
                      placeholder="Email Address"
                      className="w-full placeholder-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd]"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <motion.select 
                      className="w-full text-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd]"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    >
                      <option value="">Select Service</option>
                      <option value="Book Printing">Book Printing</option>
                      <option value="E-Book">E-Book</option>
                      <option value="Book Cover Design">Book Cover Design</option>
                      <option value="Book Publishing">Book Publishing</option>
                      <option value="Book Writing">Book Writing</option>
                    </motion.select>
                  </div>

                  <motion.input
                    type="text"
                    placeholder="Subject"
                    className="w-full placeholder-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd]"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />

                  <motion.select 
                    className="w-full text-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd]"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    value={formData.businessLine}
                    onChange={(e) => setFormData({ ...formData, businessLine: e.target.value })}
                  >
                    <option value="">Line of Business</option>
                    <option value="fastprintguys.com">fastprintguys.com</option>
                    <option value="otherbusiness.com">otherbusiness.com</option>
                    <option value="example.com">example.com</option>
                  </motion.select>

                  <motion.textarea
                    placeholder="Describe Your Issue"
                    className="w-full placeholder-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd] h-24 resize-none"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />

                  <motion.div
                    onClick={() => document.getElementById("customFileInput")?.click()}
                    className="w-full h-24 border-2 border-dashed border-blue-400 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-gray-600">
                      {fileName ? fileName : "Attach a File"}
                    </span>
                    <input
                      id="customFileInput"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </motion.div>

                  <motion.select 
                    className="w-full text-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd]"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    value={formData.helpWith}
                    onChange={(e) => setFormData({ ...formData, helpWith: e.target.value })}
                  >
                    <option value="">I Need Help With</option>
                    <option value="Buying/My Order">Buying/My Order</option>
                    <option value="The Printed Product(s) I received">The Printed Product(s) I received</option>
                    <option value="My Account">My Account</option>
                    <option value="Creating/Publishing">Creating/Publishing</option>
                    <option value="Selling/Global Distribution">Selling/Global Distribution</option>
                    <option value="My Creattor Revenue">My Creattor Revenue</option>
                    <option value="Report Content/Review">Report Content/Review</option>
                  </motion.select>

                  <motion.input
                    type="text"
                    placeholder="Order or Print Job ID"
                    className="w-full placeholder-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd]"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  />

                  <motion.input
                    type="text"
                    placeholder="Order Tracking ID"
                    className="w-full placeholder-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd]"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    value={formData.trackingId}
                    onChange={(e) => setFormData({ ...formData, trackingId: e.target.value })}
                  />

                  <motion.input
                    type="text"
                    placeholder="Project ID"
                    className="w-full placeholder-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd]"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  />

                  <motion.input
                    type="text"
                    placeholder="Project Title"
                    className="w-full placeholder-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd]"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  />

                  <motion.input
                    type="text"
                    placeholder="ISBN"
                    className="w-full placeholder-[#868E96] bg-[#F7F8F9] border rounded-md p-3 border-[#dadbdd]"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  />

                  {/* Status Message */}
                  {formStatus.message && (
                    <div
                      className={`p-3 rounded-md text-sm font-medium ${
                        formStatus.type === "success"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {formStatus.message}
                    </div>
                  )}

                  <motion.button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`p-5 custom-btn-gradient text-white py-3 rounded-md transition ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
                    whileHover={isSubmitting ? {} : { scale: 1.05 }}
                    whileTap={isSubmitting ? {} : { scale: 0.95 }}
                  >
                    {isSubmitting ? "Sending..." : "Submit Form"}
                  </motion.button>
                </form>
              </motion.div>

              {/* Right Section */}
              <motion.div 
                className="space-y-6"
                variants={slideInFromRight}
              >
                <motion.iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d428111.5324349668!2d-96.749806!3d33.040105!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c228286c32671%3A0x35e34154e76fb48a!2s2828%20W%20Parker%20Rd%20Suite%20B103%2C%20Plano%2C%20TX%2075075!5e0!3m2!1sen!2sus!4v1756746829398!5m2!1sen!2sus"
                  width="600"
                  height="450"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                ></motion.iframe>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-wrap my-20 justify-center gap-6 p-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                className="bg-[#001b48] flex flex-col justify-center text-white rounded-xl px-6 py-16 w-full sm:w-[90%] md:w-[45%] lg:w-[30%] text-center shadow-md"
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="flex justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {card.icon}
                </motion.div>
                <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
                <div className="w-6 h-0.5 bg-white mx-auto mb-4" />
                {card.content.map((line, idx) => (
                  <p key={idx} className="text-lg">
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div 
            className="relative mt-16 mx-10 rounded-xl overflow-hidden"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Image
              src={ContactFooterImg}
              alt="Contact section background"
              fill
              className="object-cover"
              priority
            />
            <div className="relative px-6 py-24 text-center z-10">
              <motion.h3 
                className="text-2xl capitalize md:text-5xl font-bold mb-10 text-white"
                variants={fadeInUp}
              >
                Are you ready to take our service?
              </motion.h3>
              <motion.button 
                className="custom-btn-gradient text-white text-sm md:text-base font-medium px-10 py-3 rounded-full transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default ContactResources;
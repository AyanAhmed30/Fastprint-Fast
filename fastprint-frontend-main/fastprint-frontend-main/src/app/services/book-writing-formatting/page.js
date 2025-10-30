"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Testimonials from "@/components/Testimonials";
import {
  PenTool,
  Type,
  CheckCircle,
  Users,
  Award,
  Clock,
  BookOpen,
  FileText,
  Sparkles,
  GraduationCap,
  Layers,
  Star,
   Mail,
  User,
  Phone,
  MapPin,
  Send,
} from "lucide-react";


const BookWritingFormatting = () => {
  // ⚙️ CONFIGURATION: Web3Forms Access Key
const WEB3FORMS_ACCESS_KEY = "f3c1f7c7-ed2b-4739-a1de-9fd98eb23b25"; // ⬅️ Same as before
const RECEIVER_EMAIL = "ayan3092003@gmail.com";

// Contact Form State
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  country: "",
  serviceType: "",
  genre: "",
  wordCount: "",
  deadlineWeeks: "",
  message: "",
});

const [formStatus, setFormStatus] = useState({ type: "", message: "" });
const [isSubmitting, setIsSubmitting] = useState(false);

// Handle input changes
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setFormStatus({ type: "", message: "" });

  // Validation
  if (!formData.name || !formData.email || !formData.phone || !formData.serviceType) {
    setFormStatus({
      type: "error",
      message: "Please fill in all required fields (Name, Email, Phone, Service Type)",
    });
    setIsSubmitting(false);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setFormStatus({
      type: "error",
      message: "Please enter a valid email address",
    });
    setIsSubmitting(false);
    return;
  }

  if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
    setFormStatus({
      type: "error",
      message: "⚠️ Web3Forms access key not configured. Please get your free key from https://web3forms.com",
    });
    setIsSubmitting(false);
    return;
  }

  try {
    const emailBody = `
═══════════════════════════════════
FASTPRINT GUYS
BOOK WRITING / FORMATTING REQUEST
═══════════════════════════════════
CONTACT INFORMATION:
────────────────────
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Country: ${formData.country || "Not provided"}

PROJECT DETAILS:
────────────────
• Service Type: ${formData.serviceType}
• Genre: ${formData.genre || "Not specified"}
• Word Count: ${formData.wordCount || "Not specified"}
• Deadline: ${formData.deadlineWeeks ? formData.deadlineWeeks + " weeks" : "Flexible"}

ADDITIONAL MESSAGE:
──────────────────
${formData.message || "No additional message"}
═══════════════════════════════════
Submitted via Fast Print Guys Website
    `;

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: ` Writing/Formatting Request from ${formData.name}`,
        from_name: formData.name,
        from_email: formData.email,
        to_email: RECEIVER_EMAIL,
        message: emailBody,
        phone: formData.phone,
        country: formData.country,
        serviceType: formData.serviceType,
        genre: formData.genre,
        wordCount: formData.wordCount,
        deadlineWeeks: formData.deadlineWeeks,
      }),
    });

    const result = await response.json();
    if (result.success) {
      setFormStatus({
        type: "success",
        message: "✅ Your inquiry has been sent successfully!",
      });
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          country: "",
          serviceType: "",
          genre: "",
          wordCount: "",
          deadlineWeeks: "",
          message: "",
        });
        setFormStatus({ type: "", message: "" });
      }, 5000);
    } else {
      throw new Error(result.message || "Failed to send email");
    }
  } catch (error) {
    console.error("Form submission error:", error);
    setFormStatus({
      type: "error",
      message: `❌ Failed to send your inquiry. Please try again or email us directly at ${RECEIVER_EMAIL}`,
    });
  } finally {
    setIsSubmitting(false);
  }
};
  
  const router = useRouter();
  const [isVisible, setIsVisible] = useState({});
  const [hasAnimatedStats, setHasAnimatedStats] = useState(false);
  const [countValues, setCountValues] = useState([0, 0, 0, 0]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Stats
  const stats = [
    { icon: Users, number: "1200+", label: "Authors Assisted" },
    { icon: BookOpen, number: "850+", label: "Books Written" },
    { icon: Award, number: "99%", label: "Client Satisfaction" },
    { icon: Clock, number: "24/7", label: "Writing Support" },
  ];

  const animateCount = (end, duration = 2000, index) => {
    const start = 0;
    const totalFrames = duration / 16;
    const increment = end / totalFrames;
    let frame = 0;

    const step = () => {
      frame++;
      const current = Math.min(start + increment * frame, end);
      setCountValues((prev) => {
        const newValues = [...prev];
        newValues[index] = Math.floor(current);
        return newValues;
      });
      if (frame < totalFrames) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (isVisible["stats"] && !hasAnimatedStats) {
      setHasAnimatedStats(true);
      stats.forEach((stat, index) => {
        if (stat.number.includes("/")) return;
        const cleanNum = stat.number.replace(/[^0-9]/g, "");
        const num = parseInt(cleanNum, 10);
        if (!isNaN(num)) {
          animateCount(num, 1500, index);
        }
      });
    }
  }, [isVisible["stats"], hasAnimatedStats]);

  // Services: Writing & Formatting
  const services = [
    {
      icon: PenTool,
      title: "Professional Ghostwriting",
      description: "Turn your ideas into a compelling, publish-ready manuscript with expert writers.",
      features: ["Idea to Manuscript", "Genre Specialists", "Confidential Process", "Royalty Options"],
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: GraduationCap,
      title: "Editing & Rewriting",
      description: "Polish, restructure, or completely rewrite your draft for clarity and impact.",
      features: ["Developmental Edit", "Line Editing", "Tone Refinement", "Audience Alignment"],
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Type,
      title: "Book Formatting",
      description: "Flawless interior layout for print and eBook—optimized for every platform.",
      features: ["KDP & Ingram Ready", "ePub & Mobi", "TOC, Headers, Page Numbers", "Image Placement"],
      gradient: "from-orange-500 to-orange-600",
    },
    {
      icon: FileText,
      title: "Academic & Business Docs",
      description: "Theses, reports, whitepapers, and business books with professional structure.",
      features: ["APA/MLA/Chicago", "Executive Summaries", "Data Integration", "Brand Voice"],
      gradient: "from-green-500 to-green-600",
    },
  ];

  // Core Features
  const features = [
    { icon: PenTool, title: "Native English Writers", desc: "Professional authors with publishing experience" },
    { icon: BookOpen, title: "All Genres Covered", desc: "Fiction, memoir, business, academic, children’s" },
    { icon: Layers, title: "Print + Digital Ready", desc: "Formatted for Amazon KDP, IngramSpark, Apple Books" },
    { icon: Award, title: "Plagiarism-Free Guarantee", desc: "100% original content with certificate" },
    { icon: Clock, title: "Fast Turnaround", desc: "Drafts in 7–14 days, formatting in 3–5 days" },
    { icon: Sparkles, title: "Unlimited Revisions", desc: "Until your manuscript is perfect" },
  ];

  // Process Steps
  const processSteps = [
    { step: "1", title: "Consultation", desc: "Discuss your vision, timeline, and goals." },
    { step: "2", title: "Outline & Draft", desc: "Receive chapter outline and first draft." },
    { step: "3", title: "Review & Revise", desc: "Provide feedback; we refine until perfect." },
    { step: "4", title: "Final Delivery", desc: "Get manuscript + formatted files ready to publish." },
  ];

  return (
    <div className="book-writing-formatting-container">
      {/* Hero Section */}
      <section className="relative w-full py-24 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center text-white space-y-8">
            <div
              id="hero-content"
              data-animate
              className={`transition-all duration-1000 ${
                isVisible["hero-content"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium mb-4">
                Writing & Formatting Services
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                From Idea to{" "}
                <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Perfect Manuscript
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Whether you need a ghostwriter to bring your story to life or professional formatting for publishing, our team delivers polished, publication-ready books—on time, every time.
              </p>
            </div>

            <div
              id="hero-buttons"
              data-animate
              className={`flex flex-wrap gap-4 justify-center transition-all duration-1000 delay-300 ${
                isVisible["hero-buttons"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
           
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div
            id="stats"
            data-animate
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 ${
              isVisible["stats"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number.includes("/")
                    ? stat.number
                    : `${countValues[index].toLocaleString()}${stat.number.includes('%') ? '%' : '+'}`}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div
            id="services-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible["services-header"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
              <Star className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-700">Our Services</span>
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="text-gray-900">Writing + Formatting </span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From blank page to bookstore-ready manuscript—we handle every word and every page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                id={`service-${index}`}
                data-animate
                className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 border border-white/50 ${
                  isVisible[`service-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-3xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <service.icon className="w-10 h-10 text-white transform group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div
            id="features-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible["features-header"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
              <span className="text-gray-900">Why Authors Choose </span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Writing Team
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                data-animate
                className={`group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                  isVisible[`feature-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div
            id="process-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible["process-header"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              Your Writing Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Collaborative, transparent, and stress-free—from concept to final file
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={index}
                id={`step-${index}`}
                data-animate
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center transition-all duration-1000 ${
                  isVisible[`step-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      {/* Contact Form Section */}
<section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
  </div>
  <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
    <div
      id="contact-header"
      data-animate
      className={`text-center mb-12 transition-all duration-1000 ${
        isVisible["contact-header"]
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
    >
      <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
        <Mail className="w-4 h-4 text-blue-600 mr-2" />
        <span className="text-sm font-semibold text-blue-700">Get in Touch</span>
      </span>
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
        <span className="text-gray-900">Start Your </span>
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
          Writing Project
        </span>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Tell us about your book, and we’ll craft a custom plan with a transparent quote
      </p>
    </div>

    <div
      id="contact-form"
      data-animate
      className={`transition-all duration-1000 ${
        isVisible["contact-form"]
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                Email Address <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                Phone Number <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+92 300 1234567"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="e.g., United States"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <PenTool className="w-5 h-5 mr-2 text-purple-600" />
              Project Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 bg-white"
                  required
                >
                  <option value="">Select a service</option>
                  <option value="Ghostwriting">Ghostwriting</option>
                  <option value="Editing & Rewriting">Editing & Rewriting</option>
                  <option value="Book Formatting">Book Formatting</option>
                  <option value="Academic/Business Docs">Academic or Business Document</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Genre / Category
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 bg-white"
                >
                  <option value="">Select genre</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Memoir / Biography">Memoir / Biography</option>
                  <option value="Business">Business</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Academic">Academic</option>
                  <option value="Children’s">Children’s</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Estimated Word Count
                </label>
                <input
                  type="number"
                  name="wordCount"
                  value={formData.wordCount}
                  onChange={handleInputChange}
                  placeholder="e.g., 50000"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Desired Deadline (Weeks)
                </label>
                <input
                  type="number"
                  name="deadlineWeeks"
                  value={formData.deadlineWeeks}
                  onChange={handleInputChange}
                  placeholder="e.g., 6"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Additional Message */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Project Description or Special Requests
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              placeholder="Describe your book idea, target audience, tone, or any specific requirements..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 resize-none"
            ></textarea>
          </div>

          {/* Status Message */}
          {formStatus.message && (
            <div
              className={`p-4 rounded-xl ${
                formStatus.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              <p className="text-sm font-medium">{formStatus.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              <span>{isSubmitting ? "Sending..." : "Send Inquiry"}</span>
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
     
    </div>
  );
};

export default BookWritingFormatting;
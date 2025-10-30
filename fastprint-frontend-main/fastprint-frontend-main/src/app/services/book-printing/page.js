
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Testimonials from "@/components/Testimonials";
import {
  BookOpen,
  CheckCircle,
  Users,
  Award,
  Clock,
  Printer,
  FileText,
  Layers,
  Sparkles,
  Package,
  Truck,
  Shield,
  Palette,
  Star,
  Send,
  Mail,
  User,
  Phone,
  MapPin,
} from "lucide-react";

const BookPrinting = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState({});
  const [hasAnimatedStats, setHasAnimatedStats] = useState(false);
  const [countValues, setCountValues] = useState([0, 0, 0, 0]);

  // ⚙️ CONFIGURATION: Web3Forms Access Key (Get yours free at https://web3forms.com)
  const WEB3FORMS_ACCESS_KEY = "f3c1f7c7-ed2b-4739-a1de-9fd98eb23b25"; // ⬅️ Replace with your Web3Forms access key
  const RECEIVER_EMAIL = "ayan3092003@gmail.com";

  // Contact Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bookTitle: "",
    bookType: "Paperback",
    pages: "",
    quantity: "",
    paperType: "80gsm White",
    bindingType: "Perfect Binding",
    coverFinish: "Matte",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Stats data
  const stats = [
    { icon: Users, number: "5000+", label: "Happy Authors" },
    { icon: BookOpen, number: "15000+", label: "Books Printed" },
    { icon: Award, number: "99%", label: "Quality Guarantee" },
    { icon: Clock, number: "24/7", label: "Support Team" },
  ];

  // Animate counter (only for numeric stats)
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

  // Book types
  const bookTypes = [
    {
      icon: BookOpen,
      title: "Hardcover Books",
      description: "Premium quality hardcover printing with durable binding and professional finishing.",
      features: ["Case Binding", "Dust Jacket", "Premium Paper", "Foil Stamping"],
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: FileText,
      title: "Paperback Books",
      description: "Affordable and flexible paperback printing perfect for novels and general publications.",
      features: ["Perfect Binding", "Glossy/Matte Cover", "Various Sizes", "Quick Turnaround"],
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Layers,
      title: "Coil Bound Books",
      description: "Practical coil binding ideal for workbooks, manuals, and educational materials.",
      features: ["Lay-Flat Design", "Durable Coils", "Custom Colors", "Easy to Use"],
      gradient: "from-orange-500 to-orange-600",
    },
    {
      icon: Sparkles,
      title: "Special Editions",
      description: "Custom designed special editions with unique finishes and premium materials.",
      features: ["Leather Binding", "Gold Foiling", "Custom Embossing", "Limited Runs"],
      gradient: "from-green-500 to-green-600",
    },
  ];

  // Core features
  const features = [
    { icon: Package, title: "No Minimum Orders", desc: "Print from 1 to 10,000+ copies" },
    { icon: Truck, title: "International Shipping", desc: "Delivery to 50+ countries worldwide" },
    { icon: Shield, title: "Quality Guarantee", desc: "100% satisfaction or money back" },
    { icon: Clock, title: "Fast Turnaround", desc: "Production in 5-7 business days" },
    { icon: Award, title: "Premium Materials", desc: "High-quality paper and binding" },
    { icon: Palette, title: "Full Color Printing", desc: "CMYK & Pantone color options" },
  ];

  // Specifications
  const specifications = [
    {
      category: "Paper Options",
      items: ["80gsm - 170gsm Weight", "Matte or Glossy Finish", "Cream or White Color", "Eco-Friendly Options"]
    },
    {
      category: "Binding Types",
      items: ["Perfect Binding", "Case Binding", "Coil/Spiral Binding", "Saddle Stitch"]
    },
    {
      category: "Cover Options",
      items: ["Soft Cover (Paperback)", "Hard Cover (Hardback)", "Dust Jackets", "Lamination Available"]
    },
    {
      category: "Custom Features",
      items: ["Foil Stamping", "Embossing/Debossing", "Spot UV", "Custom Sizes"]
    }
  ];

  // Why choose us list
  const whyChoose = [
    "Archival-quality paper & inks",
    "Full-color interior printing",
    "Matte, glossy, or soft-touch covers",
    "ISBN assignment support",
    "Barcode generation included",
    "Free proofing before final print",
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission with Web3Forms
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      setFormStatus({
        type: "error",
        message: "Please fill in all required fields (Name, Email, Phone)",
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        type: "error",
        message: "Please enter a valid email address",
      });
      setIsSubmitting(false);
      return;
    }

    // Check if access key is configured
    if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
      setFormStatus({
        type: "error",
        message: "⚠️ Web3Forms access key not configured. Please get your free key from https://web3forms.com",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare formatted message for email
      const emailBody = `
      
═══════════════════════════════════

FASTPRINT GUYS
BOOK PRINTING REQUEST
═══════════════════════════════════

CONTACT INFORMATION:
────────────────────
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Address: ${formData.address || "Not provided"}

BOOK DETAILS:
─────────────
• Book Title: ${formData.bookTitle || "Not specified"}
• Book Type: ${formData.bookType}
• Number of Pages: ${formData.pages || "Not specified"}
• Quantity: ${formData.quantity || "Not specified"}

PRINTING SPECIFICATIONS:
────────────────────────
• Paper Type: ${formData.paperType}
• Binding Type: ${formData.bindingType}
• Cover Finish: ${formData.coverFinish}

ADDITIONAL MESSAGE:
──────────────────
${formData.message || "No additional message"}

═══════════════════════════════════
Submitted via Fast Print Guys Website
      `;

      // Send via Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `📚 Book Printing Inquiry from ${formData.name}`,
          from_name: formData.name,
          from_email: formData.email,
          to_email: RECEIVER_EMAIL,
          message: emailBody,
          // Additional form data for reference
          phone: formData.phone,
          address: formData.address,
          bookTitle: formData.bookTitle,
          bookType: formData.bookType,
          pages: formData.pages,
          quantity: formData.quantity,
          paperType: formData.paperType,
          bindingType: formData.bindingType,
          coverFinish: formData.coverFinish,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus({
          type: "success",
          message: "✅ Your inquiry has been sent successfully!",
        });

        // Reset form after 5 seconds
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
            bookTitle: "",
            bookType: "Paperback",
            pages: "",
            quantity: "",
            paperType: "80gsm White",
            bindingType: "Perfect Binding",
            coverFinish: "Matte",
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
        message: "❌ Failed to send your inquiry. Please try again or email us directly at " + RECEIVER_EMAIL,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="book-printing-container">
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
              className={`transition-all duration-1000 ${isVisible["hero-content"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
                }`}
            >
              <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium mb-4">
                Professional Book Printing Services
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Print Your{" "}
                <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Book with Perfection
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                From single copies to bulk orders, we bring your words to life with premium quality printing,
                professional binding, and attention to every detail. No minimum orders required.
              </p>
            </div>

            <div
              id="hero-buttons"
              data-animate
              className={`flex flex-wrap gap-4 justify-center transition-all duration-1000 delay-300 ${isVisible["hero-buttons"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
                }`}
            >
              <button
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                onClick={() => {
                  const contactSection = document.getElementById('contact-section');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get a Free Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div
            id="stats"
            data-animate
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 ${isVisible["stats"]
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
                    : `${countValues[index].toLocaleString()}+`}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Types */}
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
            id="types-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${isVisible["types-header"]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
              }`}
          >
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
              <Star className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-700">Book Printing Options</span>
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="text-gray-900">Choose Your </span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Binding Style
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From classic hardcovers to practical coil-bound books, we offer various binding options
              to match your needs and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {bookTypes.map((type, index) => (
              <div
                key={index}
                id={`type-${index}`}
                data-animate
                className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 border border-white/50 ${isVisible[`type-${index}`]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
                  }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-3xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${type.gradient} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <type.icon className="w-10 h-10 text-white transform group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {type.description}
                  </p>
                  <ul className="space-y-3">
                    {type.features.map((feature, idx) => (
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
            className={`text-center mb-16 transition-all duration-1000 ${isVisible["features-header"]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
              }`}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
              <span className="text-gray-900">Why Choose </span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fast Print Guys
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                data-animate
                className={`group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${isVisible[`feature-${index}`]
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

      {/* Why Choose Us with Visual */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div
              id="why-content"
              data-animate
              className={`transition-all duration-1000 ${isVisible["why-content"]
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
                }`}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-center lg:text-left">
                <span className="text-gray-900">Why Authors Trust </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                  Fast Print Guys
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We combine cutting-edge technology with artisanal attention to detail—so your book looks and feels exceptional.
              </p>
              <ul className="space-y-4">
                {whyChoose.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700 transform hover:translate-x-2 transition-transform duration-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              id="why-visual"
              data-animate
              className={`transition-all duration-1000 ${isVisible["why-visual"]
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
                }`}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
                  <div className="space-y-6">
                    <div>
                      <BookOpen className="w-12 h-12 text-blue-400 mb-3" />
                      <h3 className="text-xl font-bold">Perfect Binding</h3>
                      <p className="text-gray-300 text-sm mt-1">
                        Lay-flat, durable, and professional—ideal for novels, memoirs, and workbooks.
                      </p>
                    </div>
                    <div>
                      <Printer className="w-12 h-12 text-green-400 mb-3" />
                      <h3 className="text-xl font-bold">Print-on-Demand</h3>
                      <p className="text-gray-300 text-sm mt-1">
                        Zero inventory risk. Print 1 or 1,000—same high quality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div
            id="specs-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${isVisible["specs-header"]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
              }`}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              Printing Specifications
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Customizable options to make your book exactly how you envision it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specifications.map((spec, index) => (
              <div
                key={index}
                id={`spec-${index}`}
                data-animate
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-1000 ${isVisible[`spec-${index}`]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
                  }`}
              >
                <h3 className="text-xl font-bold text-white mb-4">{spec.category}</h3>
                <ul className="space-y-2">
                  {spec.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-200 to-purple-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            id="cta"
            data-animate
            className={`transition-all duration-1000 ${isVisible["cta"]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
              }`}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="text-gray-900">Ready to Print Your </span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Masterpiece?
              </span>
            </h2>
            <p className="text-lg text-black/90 mb-8 max-w-2xl mx-auto">
              Get started today with a free quote. Our team is ready to help bring your book to life
              with professional quality printing and binding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-full hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
                onClick={() => router.push("/calculator/printbook")}
              >
                Get Free Quote
              </button>

            </div>
          </div>
        </div>
      </section>
       {/* Contact Form Section */}
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
  </div>

  <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
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
        <span className="text-gray-900">Contact Us for </span>
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
          Your Book Printing
        </span>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Fill out the form below and we'll get back to you with a customized quote for your book printing project
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
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* === Personal Info: 2x2 Grid === */}
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
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="City, Country"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* === Book Details === */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
              Book Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Book Title
                </label>
                <input
                  type="text"
                  name="bookTitle"
                  value={formData.bookTitle}
                  onChange={handleInputChange}
                  placeholder="Enter your book title"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Book Size
                </label>
                <select
                  name="bookType"
                  value={formData.bookType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 bg-white"
                >
                  <option value="Pocket Book (4.25 x 6.875 in / 108 x 175 mm)">Pocket Book</option>
                  <option value="Novella (5 x 8 in / 127 x 203 mm)">Novella</option>
                  <option value="Digest (5.5 x 8.5 in / 140 x 216 mm)">Digest</option>
                  <option value="A5 (5.83 x 8.27 in / 148 x 210 mm)">A5</option>
                  <option value="US Trade (6 x 9 in / 152 x 229 mm)">US Trade</option>
                  <option value="Royal (6.14 x 9.21 in / 156 x 234 mm)">Royal</option>
                  <option value="Executive (7 x 10 in / 178 x 254 mm)">Executive</option>
                  <option value="Crown Quarto (7.44 x 9.68 in / 189 x 246 mm)">Crown Quarto</option>
                  <option value="Small Square (7.5 x 7.5 in / 190 x 190 mm)">Small Square</option>
                  <option value="A4 (8.27 x 11.69 in / 210 x 297 mm)">A4</option>
                  <option value="Square (8.5 x 8.5 in / 216 x 216 mm)">Square</option>
                  <option value="US Letter (8.5 x 11 in / 216 x 279 mm)">US Letter</option>
                  <option value="Small Landscape (9 x 7 in / 229 x 178 mm)">Small Landscape</option>
                  <option value="US Letter Landscape (11 x 8.5 in / 279 x 216 mm)">US Letter Landscape</option>
                  <option value="A4 Landscape (11.69 x 8.27 in / 297 x 210 mm)">A4 Landscape</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Pages
                  </label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    placeholder="e.g., 200"
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 100"
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Paper Type
                </label>
                <select
                  name="paperType"
                  value={formData.paperType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 bg-white"
                >
                  <option value="60# Cream-Uncoated">60# Cream-Uncoated</option>
                  <option value="60# White-Uncoated">60# White-Uncoated</option>
                  <option value="80# White-Coated">80# White-Coated</option>
                  <option value="100# White-Coated">100# White-Coated</option>
                </select>
              </div>
            </div>
          </div>

          {/* === Printing Specs === */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Printer className="w-5 h-5 mr-2 text-purple-600" />
              Printing Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Binding Type
                </label>
                <select
                  name="bindingType"
                  value={formData.bindingType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 bg-white"
                >
                  <option value="Coil Bound (Paperback)">Coil Bound (Paperback)</option>
                  <option value="Saddle stitch (Paperback)">Saddle Stitch</option>
                  <option value="Perfect Bound (Paperback)">Perfect Bound</option>
                  <option value="Case Wrap (Hardcover)">Case Wrap (Hardcover)</option>
                  <option value="Linen Wrap (Hardcover)">Linen Wrap (Hardcover)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Cover Finish
                </label>
                <select
                  name="coverFinish"
                  value={formData.coverFinish}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 bg-white"
                >
                  <option value="Matte">Matte</option>
                  <option value="Glossy">Glossy</option>
                </select>
              </div>
            </div>
          </div>

          {/* === Message === */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Additional Requirements or Questions
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              placeholder="Tell us more about your project..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 resize-none"
            ></textarea>
          </div>

          {/* === Status & Submit === */}
          {formStatus.message && (
            <div
              className={`p-3 rounded-xl text-sm ${
                formStatus.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {formStatus.message}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

export default BookPrinting;
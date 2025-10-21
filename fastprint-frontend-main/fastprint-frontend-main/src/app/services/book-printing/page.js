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
} from "lucide-react";

const BookPrinting = () => {
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
        if (stat.number.includes("/")) return; // Skip "24/7"
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
              className={`transition-all duration-1000 ${
                isVisible["hero-content"]
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
              className={`flex flex-wrap gap-4 justify-center transition-all duration-1000 delay-300 ${
                isVisible["hero-buttons"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <button
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                onClick={() => router.push("/calculator/printbook")}
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
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible["types-header"]
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
                className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 border border-white/50 ${
                  isVisible[`type-${index}`]
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
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible["features-header"]
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

      {/* Why Choose Us with Visual */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div
              id="why-content"
              data-animate
              className={`transition-all duration-1000 ${
                isVisible["why-content"]
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
              className={`transition-all duration-1000 ${
                isVisible["why-visual"]
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
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible["specs-header"]
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
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-1000 ${
                  isVisible[`spec-${index}`]
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
            className={`transition-all duration-1000 ${
              isVisible["cta"]
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
    </div>
  );
};

export default BookPrinting;
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Testimonials from "@/components/Testimonials";
import {
  Palette,
  CheckCircle,
  Users,
  Award,
  Clock,
  BookOpen,
  Sparkles,
  Eye,
  Layers,
  Star,
  FileText,
  TrendingUp,
} from "lucide-react";

const BookCoverDesign = () => {
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
    { icon: Users, number: "2800+", label: "Authors Served" },
    { icon: Palette, number: "3500+", label: "Covers Designed" },
    { icon: Award, number: "98%", label: "Client Satisfaction" },
    { icon: Clock, number: "24/7", label: "Design Support" },
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

  // Genre-Based Cover Designs
  const coverGenres = [
    {
      icon: BookOpen,
      title: "Fiction & Novels",
      description: "Eye-catching, genre-specific covers that hook readers instantly.",
      features: ["Character Imagery", "Mood-Based Color", "Typography Focus", "Bestseller Style"],
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Sparkles,
      title: "Children's Books",
      description: "Vibrant, playful, and engaging covers that appeal to kids and parents.",
      features: ["Bold Colors", "Friendly Illustrations", "Large Text", "Whimsical Elements"],
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: FileText,
      title: "Non-Fiction & Memoirs",
      description: "Clean, professional, and authoritative designs that build trust.",
      features: ["Minimalist Layout", "Strong Typography", "Symbolic Imagery", "Brand-Aligned"],
      gradient: "from-orange-500 to-orange-600",
    },
    {
      icon: Eye,
      title: "Fantasy & Sci-Fi",
      description: "Immersive, detailed covers that transport readers to new worlds.",
      features: ["Custom Illustrations", "Epic Landscapes", "Mythical Elements", "Foil Effects"],
      gradient: "from-green-500 to-green-600",
    },
  ];

  // Design Features
  const designFeatures = [
    { icon: Palette, title: "Custom Illustrations", desc: "Original artwork tailored to your story" },
    { icon: Layers, title: "Print & eBook Ready", desc: "High-res files for all formats (KDP, Ingram, etc.)" },
    { icon: TrendingUp, title: "Market-Tested Designs", desc: "Covers optimized for your target audience" },
    { icon: Award, title: "Unlimited Revisions", desc: "Until you’re 100% satisfied" },
    { icon: BookOpen, title: "Genre Expertise", desc: "Designers specialized in your book category" },
    { icon: Sparkles, title: "Premium Finishes", desc: "Foil, embossing, spot UV mockups included" },
  ];

  // Design Process
  const processSteps = [
    { step: "1", title: "Brief & Vision", desc: "Share your story, genre, and cover ideas." },
    { step: "2", title: "Concept Drafts", desc: "Receive 2–3 unique cover concepts." },
    { step: "3", title: "Refinement", desc: "Refine typography, colors, and layout." },
    { step: "4", title: "Final Delivery", desc: "Get print-ready and eBook files instantly." },
  ];

  return (
    <div className="book-cover-design-container">
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
                Professional Cover Design
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Design a Cover That{" "}
                <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Sells Your Book
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Your cover is your #1 marketing tool. Our award-winning designers create stunning, genre-perfect covers that grab attention and drive sales—on shelves and online.
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

      {/* Genre-Based Covers */}
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
            id="genres-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible["genres-header"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
              <Star className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-700">Genre-Specific Design</span>
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="text-gray-900">Covers That Speak </span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Your Genre’s Language
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We don’t use templates. Every cover is custom-crafted to match your book’s tone, audience, and market expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {coverGenres.map((genre, index) => (
              <div
                key={index}
                id={`genre-${index}`}
                data-animate
                className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 border border-white/50 ${
                  isVisible[`genre-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-3xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${genre.gradient} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <genre.icon className="w-10 h-10 text-white transform group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600">
                    {genre.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {genre.description}
                  </p>
                  <ul className="space-y-3">
                    {genre.features.map((feature, idx) => (
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

      {/* Design Features */}
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
              <span className="text-gray-900">Why Our Covers </span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Stand Out
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designFeatures.map((feature, index) => (
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

      {/* Design Process */}
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
              Our Cover Design Process
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple, collaborative, and fast—usually delivered in 5–7 days
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

  
    </div>
  );
};

export default BookCoverDesign;
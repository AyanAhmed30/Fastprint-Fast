"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star } from "lucide-react"; // ⭐ star icon
import image37 from "@/assets/images/image37.png";
import image38 from "@/assets/images/image38.png";
import image_37 from "@/assets/images/image-37.jpg";
import image_38 from "@/assets/images/image-38.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Michael T.",
      role: "Author",
      img: image37,
      text: "Having self-published, I have used several printers. The best mix of speed, cost, and quality among Fast Print Guys is found here. My books look great!",
      rating: 4.5,
    },
    {
      name: "Sarah",
      role: "Director of Marketing",
      img: image38,
      text: "Fast Print Guys rescued my event! In six hours, I needed 500 flyers, and they produced PERFECT printing on schedule. Unbelievably excellent service!",
      rating: 4.9,
    },
    {
      name: "James L.",
      role: "Small Business Owner",
      img: image_37,
      text: "Their attention to detail and fast turnaround made all the difference for my product launch. Highly recommend!",
      rating: 4.7,
    },
    {
      name: "Priya M.",
      role: "Event Planner",
      img: image_38,
      text: "From brochures to banners, everything was crisp and on-brand. Will definitely use them again!",
      rating: 5.0,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [cardsPerView, setCardsPerView] = useState(1);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) setCardsPerView(2);
      else setCardsPerView(1);
    };
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        (currentIndex + cardsPerView) %
        Math.ceil(testimonials.length / cardsPerView);
      scrollToIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, cardsPerView]);

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.scrollWidth /
        Math.ceil(testimonials.length / cardsPerView);
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  // ⭐ Render dynamic stars with partial fill
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const fillPercentage = Math.min(Math.max(rating - (i - 1), 0), 1);
      stars.push(
        <div key={i} className="relative w-4 h-4">
          <Star size={16} className="absolute top-0 left-0 text-gray-300" />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${fillPercentage * 100}%` }}
          >
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
          </div>
        </div>
      );
    }
    return stars;
  };

  return (
    <div className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-6 leading-tight animate-bounceIn">
          <span className="text-gray-900">What Our </span>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
            Client Says
          </span>
        </h2>
        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12 px-2 sm:px-0 animate-fadeInUp stagger-2">
          Not only should you rely on our word-of-mouth recommendations; here
          are comments from customers on our printing capabilities:
        </p>

        {/* ✅ Slider section */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
            onScroll={() => {
              if (scrollContainerRef.current) {
                const cardWidth =
                  scrollContainerRef.current.scrollWidth /
                  Math.ceil(testimonials.length / cardsPerView);
                const scrollLeft = scrollContainerRef.current.scrollLeft;
                const index = Math.round(scrollLeft / cardWidth);
                setCurrentIndex(index);
              }
            }}
          >
            {testimonials.map((client, i) => (
              <div
                key={i}
                className={`snap-start flex-shrink-0 px-3 ${
                  cardsPerView === 2 ? "w-1/2" : "w-full"
                }`}
              >
                {/* ✅ Card layout with smooth hover lift + image zoom */}
                <div className="group my-5 flex flex-col sm:flex-row bg-gray-50 rounded-xl shadow-md overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                  {/* ✅ Image with zoom effect (still inside rounded corners) */}
                  <div className="relative w-full sm:w-48 h-56 sm:h-auto overflow-hidden flex-shrink-0">
                    <Image
                      src={client.img}
                      alt={client.name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 ease-in-out"></div>
                  </div>

                  {/* ✅ Text content */}
                  <div className="flex flex-col justify-center p-6 flex-grow">
                    <p className="text-gray-700 mb-4">{client.text}</p>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-semibold">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.role}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(client.rating)}
                        <span className="text-sm text-gray-600 ml-1">
                          {client.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({
              length: Math.ceil(testimonials.length / cardsPerView),
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
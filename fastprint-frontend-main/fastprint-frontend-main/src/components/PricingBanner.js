import React from "react";
import Book1 from "@/assets/images/book1.png"; // Adjust path as needed
import Book2 from "@/assets/images/Group.png"; // Adjust path as needed
import Image from "next/image";
import BackgroundImage from "@/assets/images/Pricingbanner.png"; // ✅ Add this

const PricingBanner = () => {
  return (
     <section className="relative w-full py-25 bg-gradient-to-br from-[#000000] via-[#000000] to-[#000000] overflow-hidden"
 >
   {/* Background Image */}
   <div
     className="absolute inset-0 bg-cover bg-center z-0 opacity-20"
     style={{
       backgroundImage: `url(${BackgroundImage.src})`, // Replace `YourBackgroundImage` with actual imported image
     }}
   ></div>
 
   {/* Animated Background Elements (Blur Circles) - Keep them */}
   <div className="absolute inset-0 z-10">
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
 
   {/* Content */}
   <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16 relative z-20">
     {/* Left Content */}
     <div className="flex-1 text-white space-y-8">
       <div className="scroll-animate slide-in-left">
         
         <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
           Pricing{" "}
           <span className="text-white">
             Calculator
           </span>
         </h1>
         <p className="text-xl text-white-300 leading-relaxed max-w-2xl">
         Easily calculate the printing cost of your book using our simple book cost calculator.


         </p>
       </div>
 
    
     </div>
 
 
   </div>
 </section>
  );
};

export default PricingBanner;

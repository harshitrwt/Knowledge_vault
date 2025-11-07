"use client";

export default function Footer() {
  return (
    <footer className="relative rounded-tl-[20vh] rounded-tr-[20vh] border-t bg-[#0A0A15] border-blue-400 text-gray-300 py-24 overflow-hidden">
      {/* Grid and Glow Layers */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(55,55,75,0.15) 0px, rgba(55,55,75,0.15) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(180deg, rgba(55,55,75,0.15) 0px, rgba(55,55,75,0.15) 1px, transparent 1px, transparent 64px)",
        }}
      />
      <div className="absolute w-[700px] h-[700px] bg-[#1a1a25] rounded-full blur-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" />

      {/* Center Branding */}
      <div className="relative text-center z-10">
        <h1 className="text-[7rem] md:text-[12rem] lg:text-[15rem] font-extrabold text-white/5 tracking-widest select-none leading-none mb-10">
          VAULT
        </h1>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <button className="px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-300 text-black font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
            Get Started
          </button>
          <button className="px-8 py-3 border border-gray-500 text-gray-300 rounded-full hover:text-white hover:border-gray-300 hover:scale-105 transition-transform duration-300">
            Learn More
          </button>
        </div>

        <div className="text-gray-500 text-sm">
          © 2025 Smart Vault. All rights reserved.
        </div>
      </div>

      {/* Subtle Reflection Line */}
      <div className="absolute bottom-0 w-full flex justify-center mt-10">
        <div className="w-[90%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-25"></div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-black py-12 text-center text-sm text-gray-500 border-t border-gray-800 overflow-hidden">
   
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-[10rem] md:text-[14rem] font-bold text-white opacity-10 select-none tracking-wider">
          Vault
        </h1>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
       
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-6 py-2 bg-white text-black font-semibold rounded-full shadow hover:bg-gray-200 transition">
            Get Started
          </button>
          <button className="px-6 py-2 border border-gray-600 text-gray-300 rounded-full hover:border-white hover:text-white transition">
            Learn More
          </button>
        </div>

        
        <p className="text-gray-400 mt-4">
          &copy; 2025 Smart Vault. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

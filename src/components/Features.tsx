const Features = () => {
  return (
    <section className="relative bg-[#0A0A0A] py-20 text-white font-nunito">
      <div className="container mx-auto  px-6 md:px-20 flex flex-col md:flex-row max-w-7xl md:mt-22 mt-[-52px] items-center gap-10 md:gap-16">
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold text-blue-500 mb-6 transition-colors duration-300">
            Why Use Vault?
          </h2>
          <p className="text-gray-300 mb-6 max-w-lg text-lg md:text-2xl leading-relaxed">
            Stop wasting hours digging through files and repos. With our vault, you can
            store, search, share smart contract knowledge instantly.
          </p>

          <ul className="space-y-4 md:space-y-5">
            {[
              "AI-powered semantic search to find in seconds.",
              "Organized storage to keep everything in one place.",
              "Team collaboration with instant sharing & permissions.",
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-blue-400 text-xl md:text-2xl leading-none">➤</span>
                <span className="text-gray-300 text-sm md:text-xl">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 relative flex justify-center items-center mt-12 md:mt-0">
          <div className="absolute w-[270px] h-[250px] md:w-[320px] md:h-[320px] border-2 border-blue-500 rotate-6 transition-transform duration-500"></div>
          <div className="absolute w-[270px] h-[250px] md:w-[320px] md:h-[320px] border-2 border-blue-500 -rotate-6 transition-transform duration-500"></div>

          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFVT1MJAYGjsQQ1zjiuOZ3JhHlLlARGsv2K0O7UVFt4QAL6APHGpFt0xoAAAJNaYiZlWA&usqp=CAU"
            alt="Vault Illustration"
            className="w-[250px] md:w-[280px]  relative z-10 rounded-lg shadow-lg rotate-3 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;

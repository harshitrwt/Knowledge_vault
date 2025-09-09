"use client";

export default function AboutSection() {
  return (
    <section
      className= "relative bg-[#0A0A0A] py-24 text-white font-nuinto"
    >
      <div className="container mx-auto px-8 md:px-20 flex flex-col md:flex-row max-w-7xl md:mt-22 mt-10 items-center gap-16">
        
        <div className="relative flex justify-center">
          <img
            src="https://placedog.net/600/400"
            alt="About Smart Contract Vault"
            className="rounded-xl h-full w-full shadow-2xl border-2 border-blue-500 rotate-2"
            loading="lazy"
          />
        </div>

        
        <div className="text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-500 mb-6">
            About Smart Contract Vault
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Smart Contract Vault was built to make storing and discovering
            blockchain knowledge simple and intuitive. Instead of digging
            through endless repos or documents, you get a secure, AI-powered
            vault that grows with your team.
          </p>
          <p className="mt-6 text-gray-400">
            Think of it like a digital library for smart contracts — organized,
            searchable, and always available.
          </p>
        </div>
      </div>
    </section>
  );
}

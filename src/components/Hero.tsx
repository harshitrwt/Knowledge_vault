"use client";

import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-[#0A0A0A] py-20 sm:py-28 flex items-center">
      {/* Background Curvy Zigzag */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <svg className="w-full h-32" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#1E1E1E" d="M0,256L48,213.3C96,171,192,85,288,80C384,75,480,171,576,186.7C672,203,768,181,864,144C960,107,1056,43,1152,21.3C1248,0,1344,32,1392,48L1440,64L1440,0L1392,0C1344,0,1248,0,1152,21.3C1056,43,960,107,864,144C768,181,672,203,576,186.7C480,171,384,75,288,80C192,85,96,171,48,213.3L0,256Z"></path>
        </svg>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 sm:px-12 z-20 relative text-center text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-blue-500 mb-6">
          Smart Contract Knowledge Vault
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-8">
          Upload your files. Search with AI. Share knowledge instantly. A second brain for your personal use or your whole team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Dashboard
          </Link>
          <Link
            href="/docs"
            className="px-6 py-3 rounded-lg border border-blue-600 text-blue-500 font-medium hover:bg-blue-50/10 transition-transform transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://i.pinimg.com/736x/e4/56/54/e456540b53dfe63390c5613e8f265520.jpg"
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
    </section>
  );
};

export default HeroSection;


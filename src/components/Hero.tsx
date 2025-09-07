"use client";

import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-[#0A0A0A] py-20 sm:py-28 flex items-center">
      
      <div className="absolute inset-x-0 bottom-[-6px] z-10 ">
  <svg
    className="w-full h-72 sm:h-96"
    viewBox="0 0 1440 320"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
  fill="black"
  d="M0,320L0,149.3C60,299,120,277,180,256C240,235,300,213,360,202.7C420,192,480,192,540,192C600,192,660,192,720,213.3C780,235,840,277,900,266.7C960,256,1020,192,1080,186.7C1140,181,1200,230,1260,240C1320,250,1380,230,1440,90L1440,320L1320,320C1260,320,1200,320,1140,320C1080,320,1020,320,960,320C900,320,840,320,780,320C720,320,660,320,600,320C540,320,480,320,420,320C360,320,300,320,240,320C180,320,120,320,60,320L0,320Z"
></path>
  </svg>
</div>


    
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

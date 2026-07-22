"use client";

import Navbar from "../components/Navbaar";
import Footer from "../components/Footer";
import HeroSection from "../components/Hero";
import Features from "../components/Features";
import AboutSection from "../components/AboutSection";
import HowItWorks from "../components/HowItWorks";

export default function Home() {
  return (
    <div className="vault-grid flex min-h-screen flex-col text-[var(--vault-ink)]">
      <Navbar />
      <HeroSection />
      <Features />
      <AboutSection />
      <HowItWorks />
      <Footer />
    </div>
  );
}

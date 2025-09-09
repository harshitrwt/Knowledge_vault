"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Navbar from "../components/Navbaar";
import Footer from "../components/Footer";
import HeroSection from "../components/Hero";
import Features from "../components/Features";
import AboutSection from "../components/AboutSection";
import HowItWorks from "../components/HowItWorks";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-[#171818] text-gray-100">
      <Navbar />
      <HeroSection />
      <Features />
      <AboutSection />
      <HowItWorks/>
      <Footer />
    </div>
  );
}

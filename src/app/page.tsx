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

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-[#0A0A0A] text-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-blue-500 mb-6">
            Smart Contract Knowledge Vault
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Upload your files. Search with AI. Share knowledge instantly.
            A second brain for your personal use or your whole team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/docs"
              className="px-6 py-3 rounded-lg border border-blue-600 text-blue-500 font-medium hover:bg-blue-50/10 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

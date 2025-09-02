'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white text-gray-800">
      
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md border border-gray-200 rounded-full shadow-lg px-6 py-2 flex gap-6 z-50">
        <Link href="/" className="font-semibold text-blue-600 hover:text-blue-800">Home</Link>
        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
        <Link href="/profile" className="text-gray-600 hover:text-blue-600">You</Link>
      </nav>

     
      <main className="flex flex-1 items-center justify-center bg-[#0A0A0A]">
        <div className="max-w-4xl text-center px-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-blue-600 mb-6">
            Smart Contract Knowledge Vault
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
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
              className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>

     
      <footer className="py-6 text-center text-sm text-gray-500 bg-[#0A0A0A]">
        Built with Next.js, Tailwind, Clerk, and Gemini
      </footer>
    </div>
  );
}

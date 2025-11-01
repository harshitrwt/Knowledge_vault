"use client";

import Link from "next/link";

const NAV_LINKS = [
  { name: "Product", href: "/" },
  { name: "AI Technology", href: "/ai" },
  { name: "Solutions", href: "/solutions" },
  { name: "Customers", href: "/customers" },
  { name: "Resources", href: "/resources" },
  { name: "Pricing", href: "/pricing" },
];

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-[#0a0a16] font-sans relative text-white overflow-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-[#232334] bg-[#0b0f19]/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded w-8 h-8 flex items-center justify-center text-black font-extrabold text-xl">⦿</div>
          <span className="text-lg font-bold tracking-wide">PDF ChatAI</span>
        </div>
        <div className="hidden md:flex gap-7">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} href={link.href} className="text-gray-300 hover:text-white text-sm font-medium transition">{link.name}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/signin" className="text-gray-400 hover:text-white text-xs px-3">
            Sign in
          </Link>
          <Link
            href="/start-trial"
            className="bg-white text-black font-semibold px-4 py-2 rounded hover:bg-gray-200 text-xs transition"
          >
            Start free trial
          </Link>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-20 pb-32 px-4 md:px-0">
        {/* Circuit/Blueprint BG */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(60,60,80,0.18) 0px, rgba(60,60,80,0.18) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(180deg, rgba(60,60,80,0.18) 0px, rgba(60,60,80,0.18) 1px, transparent 1px, transparent 64px)"
            }}
          ></div>
          <div className="absolute w-[600px] h-[600px] top-[-100px] left-[-160px] bg-black rounded-full blur-[180px]" />
          <div className="absolute w-[500px] h-[500px] bottom-[-120px] right-[-120px] bg-black rounded-full blur-[130px]" />
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.07] mb-4 tracking-tight">
            The <span className="text-[#faffff]/80">#1 AI Agent</span>
            <br />
            <span className="font-extralight text-gray-200">for resolving</span>
            <br />
            <span className="font-bold text-white">all your queries</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Instantly chat with your PDFs—ask questions, extract insights, and let AI tackle complex file analysis in seconds.
            No more endless scrolling—just upload and talk.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row justify-center mb-8">
            <Link
              href="/start-trial"
              className="px-7 py-3 bg-white text-black rounded font-semibold shadow-lg hover:scale-105 hover:bg-gray-100 transition"
            >
              Start free trial
            </Link>
            <Link
              href="/demo"
              className="px-7 py-3 border border-gray-400 text-gray-200 rounded font-semibold backdrop-blur-sm hover:bg-white/10 hover:text-white hover:scale-105 transition"
            >
              View demo
            </Link>
          </div>
        </div>
        {/* Floating Panels Example */}
        <div className="absolute top-1/3 left-1 md:left-16 z-0 hidden md:block">
          {/* Simulated floating case study/card */}
          <div className="bg-[#15192b] border-[0.5px] border-gray-700 rounded-lg shadow-xl px-6 py-4 w-[320px] rotate-[-6deg] opacity-90">
            <p className="text-xs text-gray-400 uppercase mb-2">ORDER EXAMINE</p>
            <div className="text-white font-semibold text-lg mb-1">What's the summary of section 4?</div>
            <div className="text-gray-300 text-sm">AI: Section 4 covers refund policies and dispute resolution steps ...</div>
          </div>
        </div>
        <div className="absolute top-[57%] right-1 md:right-16 z-0 hidden md:block">
          <div className="bg-[#181d32] border-[0.5px] border-gray-700 rounded-lg shadow-xl px-7 py-4 w-[360px] rotate-[5deg] opacity-90">
            <p className="text-xs text-gray-400 uppercase mb-2">INSTRUCTIONS</p>
            <ul className="list-disc list-inside text-gray-200 text-sm">
              <li>Upload any PDF or document</li>
              <li>Type or speak your question</li>
              <li>Get step-by-step, exact answers</li>
            </ul>
          </div>
        </div>
      </section>
      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center z-20">
        <div className="w-[90%] h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-25"></div>
      </div>
    </div>
  );
}

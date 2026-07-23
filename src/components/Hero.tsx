"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import {
  ArrowRight,
  BarChart2,
  Bot,
  FileSearch,
  Map,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";

const insightCards = [
  {
    label: "Analyze",
    title: "Document Intelligence",
    copy: "Extract risk summaries, clause analysis, and context instantly from dense PDFs.",
    icon: FileSearch,
  },
  {
    label: "Ask AI",
    title: "Grounded Q&A Chat",
    copy: "Ask pointed questions and get verified answers with source citations from your files.",
    icon: MessageSquareText,
  },
  {
    label: "Mind-Map",
    title: "Visual Knowledge Maps",
    copy: "Transform complex documents into visual mind-maps for faster comprehension.",
    icon: Map,
  },
];

export default function HeroSection() {
  const router = useRouter();

  const contentVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7 },
    },
  };

  return (
    <section className="relative px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      {/* Top Main Hero Showcase Box - Broadened max-w-7xl width */}
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="neu-extruded mx-auto w-full rounded-[32px] p-6 text-center sm:p-12 lg:p-16"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs font-extrabold text-[#6C63FF] neu-inset-sm">
            <Sparkles className="h-4 w-4" />
            <span>Document Intelligence Redesigned</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#3D4852] sm:text-5xl lg:text-7xl leading-[1.12]">
            Turn static PDFs into an active AI document workspace.
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-relaxed text-[#6B7280] sm:text-xl">
            Upload PDFs, ask pointed questions, and generate visual mind-maps with a calm, tactile Neumorphic workspace interface.
          </p>

          {/* Direct CTA Action Buttons (No email input) */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <SignedIn>
              <button
                onClick={() => router.push("/dashboard")}
                className="neu-btn-primary rounded-2xl px-8 py-3.5 text-base font-bold"
              >
                Open Workspace
                <ArrowRight className="h-4 w-4" />
              </button>
            </SignedIn>
            <SignedOut>
              <SignInButton fallbackRedirectUrl="/dashboard">
                <button className="neu-btn-primary rounded-2xl px-8 py-3.5 text-base font-bold">
                  Open Workspace
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SignInButton>
            </SignedOut>

            <button
              onClick={() => router.push("/askai")}
              className="neu-btn-secondary rounded-2xl px-8 py-3.5 text-base font-bold"
            >
              <Bot className="h-4 w-4 text-[#6C63FF]" />
              Try Ask AI
            </button>

            <button
              onClick={() => router.push("/uploads")}
              className="neu-btn-secondary rounded-2xl px-8 py-3.5 text-base font-bold"
            >
              <Upload className="h-4 w-4 text-[#38B2AC]" />
              Upload PDF
            </button>
          </div>
        </motion.div>
      </div>

      {/* Middle Interactive Feature Grid matching Image 2 style */}
      <div className="mx-auto mt-16 grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Left Column Text */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs font-extrabold text-[#6C63FF] neu-inset-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Private & Grounded</span>
          </div>

          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#3D4852] sm:text-4xl lg:text-5xl leading-[1.15]">
            Analyze documents, ask questions, and map ideas effortlessly.
          </h2>

          <p className="text-base font-medium leading-relaxed text-[#6B7280] sm:text-lg">
            Vault centralizes document processing into one quiet interface. Move seamlessly from file upload to AI document chat and mind-map extraction without losing context or mental momentum.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => router.push("/mindmap")}
              className="neu-btn-primary rounded-2xl px-7 py-3.5 text-sm font-bold"
            >
              <Map className="h-4 w-4" />
              Create Mind-Map
            </button>
            <button
              onClick={() => router.push("/askai")}
              className="neu-btn-secondary rounded-2xl px-7 py-3.5 text-sm font-bold"
            >
              Document Chat
            </button>
          </div>
        </motion.div>

        {/* Right Column Showcase Visual Card (3D Inset & Concentric Rings) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="neu-extruded relative rounded-[32px] p-6 sm:p-10"
        >
          {/* Top Right Floating Metric Pill */}
          <div className="absolute right-6 top-6 z-10 neu-extruded-sm flex h-11 w-11 items-center justify-center rounded-2xl text-[#6C63FF] animate-neu-float">
            <BarChart2 className="h-5 w-5" />
          </div>

          {/* Deep Carved Container */}
          <div className="neu-inset-deep relative flex min-h-[340px] w-full items-center justify-center rounded-[28px] p-6 sm:p-10">
            {/* Outer Concentric Raised Ring */}
            <div className="neu-extruded flex h-44 w-44 items-center justify-center rounded-full transition-transform duration-500 hover:scale-105 sm:h-52 sm:w-52">
              {/* Inner Inset Ring */}
              <div className="neu-inset flex h-28 w-28 items-center justify-center rounded-full sm:h-36 sm:w-36">
                {/* Center Glowing Violet Orb */}
                <div className="h-14 w-14 rounded-full bg-[#6C63FF] shadow-[0_0_24px_rgba(108,99,255,0.6)] sm:h-16 sm:w-16" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature Highlight Cards Grid */}
      <div className="mx-auto mt-16 max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {insightCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="neu-extruded neu-extruded-hover rounded-[32px] p-6 sm:p-8"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="neu-inset-deep flex h-13 w-13 items-center justify-center rounded-2xl text-[#6C63FF]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-xs font-extrabold uppercase text-[#6B7280]">
                    {card.label}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#3D4852]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#6B7280]">
                  {card.copy}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



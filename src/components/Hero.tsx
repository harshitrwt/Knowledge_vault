"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const CARDS: {
  label: string;
  question?: string;
  answer?: string;
  steps?: string[];
  position: Position;
}[] = [
  {
    label: "ORDER EXAMINE",
    question: "🤔 What's the summary of section 4?",
    answer: "AI: Section 4 covers refund policies and dispute resolution steps ...",
    position: "top-left",
  },
  {
    label: "INSTRUCTIONS",
    steps: [
      "🗂️ Upload any PDF or document",
      "💬 Type or speak your question",
      "✅ Get step-by-step, exact answers",
    ],
    position: "top-right",
  },
  {
    label: "QUICK INSIGHT",
    question: "🔍 Find total transactions for Q3?",
    answer: "AI: Q3 had 128,768 transactions, a 12.4% growth over Q2.",
    position: "bottom-left",
  },
  {
    label: "PDF MISSION",
    steps: [
      "📈 Extract analytics instantly",
      "📑 Summarize contract changes",
      "☑️ Validate legal compliance",
    ],
    position: "bottom-right",
  },
];

const scatterPositions: Record<Position, { x: number; y: number }> = {
  "top-left": { x: -550, y: -230 },
  "top-right": { x: 300, y: -160 },
  "bottom-left": { x: -600, y: 100 },
  "bottom-right": { x: 300, y: 150 },
};

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleProtectedNav = (path: string) => {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(path)}`);
    } else {
      router.push(path);
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div
      ref={containerRef}
      className="md:h-full h-[70vh] mb-13 font-sans relative text-white overflow-hidden bg-black"
    >
      {/* Luxurious grid background */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(55,55,75,0.18) 0px, rgba(55,55,75,0.18) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(180deg, rgba(55,55,75,0.18) 0px, rgba(55,55,75,0.18) 1px, transparent 1px, transparent 64px)",
        }}
      />

      {/* Subtle dark glows */}
      <div className="absolute w-[300px] h-[300px] bg-blue-300 rounded-full blur-[200px] top-[-100px] left-[-160px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-blue-400 rounded-full blur-[180px] top-[100px] right-[0px] pointer-events-none" />

      <section className="relative flex flex-col items-center justify-center pt-20 pb-32 px-4 md:px-0 mt-10 md:mt-22">
        <motion.div
          className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center md:mt-0 mt-14"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.07] mb-4 tracking-tight">
            The <span className="text-[#faffff]/80">#1 AI Agent</span>
            <br />
            <span className="font-extralight text-gray-200">for resolving</span>
            <br />
            <span className="font-bold text-white">all your queries</span>
          </h1>

          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Instantly chat with your PDFs—ask questions, extract insights, and let
            AI tackle complex file analysis in seconds. No more endless scrolling—just upload and talk.
          </p>

          <div className="flex gap-4 flex-col sm:flex-row justify-center mb-8">
            <button
              onClick={() => handleProtectedNav("/start-trial")}
              className="px-7 py-3 bg-white text-black cursor-pointerrounded font-semibold shadow-lg hover:scale-105 hover:bg-gray-100 transition"
            >
              Start free trial
            </button>

            <button
              onClick={() => handleProtectedNav("/demo")}
              className="px-7 py-3 border border-gray-400 cursor-pointer text-gray-200 rounded font-semibold backdrop-blur-sm hover:bg-white/10 hover:text-white hover:scale-105 transition"
            >
              View demo
            </button>
          </div>
        </motion.div>

        {/* Floating cards */}
        <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              drag
              dragConstraints={containerRef}
              dragMomentum={false}
              className="absolute z-20 w-[300px] bg-[#15192b]/90 border border-gray-700 rounded-2xl shadow-2xl px-6 py-5 opacity-95 select-none cursor-grab"
              initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: scatterPositions[card.position].x,
                y: scatterPositions[card.position].y,
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 22,
                  delay: 0.9,
                },
              }}
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "auto",
              }}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 0 48px 0 rgba(100,100,145,0.17)",
              }}
            >
              <p className="text-xs text-gray-400 uppercase mb-2">
                {card.label}
              </p>

              {card.question && (
                <>
                  <div className="text-white font-semibold text-lg mb-1">
                    {card.question}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {card.answer}
                  </div>
                </>
              )}

              {card.steps && (
                <ul className="list-disc list-inside text-gray-200 text-sm space-y-1">
                  {card.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

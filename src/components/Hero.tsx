"use client";

import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

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

const positionClass: Record<Position, string> = {
  "top-left": "top-1/3 left-1/6",
  "top-right": "top-1/3 right-1/6",
  "bottom-left": "bottom-1/3 left-1/6",
  "bottom-right": "bottom-1/3 right-1/6",
};

export default function HeroSection() {
  const controls = useAnimation();

  // Track if cards expanded from dots (for conditional rendering of dots vs card content)
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function sequence() {
      // Place 4 dots centered and small
      await controls.start({
        x: 0,
        y: 0,
        scale: 0.15,
        borderRadius: "50%",
        opacity: 1,
        rotate: 0,
        transition: { duration: 0.2 },
      });
      // Scatter dots outward diagonally
      await controls.start((i: number) => {
        const scatterPositions: Record<number, { x: number; y: number }> = {
          0: { x: -160, y: -120 },
          1: { x: 160, y: -150 },
          2: { x: -120, y: 120 },
          3: { x: 120, y: 150 },
        };
        return {
          x: scatterPositions[i].x,
          y: scatterPositions[i].y,
          scale: 0.15,
          borderRadius: "50%",
          rotate: 0,
          transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.5 },
        };
      });
      // Expand dots into full cards
      await controls.start((i: number) => ({
        scale: 1,
        borderRadius: "16px",
        opacity: 1,
        transition: { duration: 0.5, delay: i * 0.15 },
      }));
      setExpanded(true);
    }
    sequence();
  }, [controls]);

  return (
    <div className="min-h-screen font-sans relative text-white overflow-hidden bg-[#0a0a16]">
      <section className="relative flex flex-col items-center justify-center pt-20 pb-32 px-4 md:px-0 mt-10 md:mt-22">
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

        {CARDS.map((card, i) => (
          <motion.div
            key={i}
            custom={i}
            animate={controls}
            initial={{
              scale: 0.15,
              borderRadius: "50%",
              opacity: 0,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            className={`absolute z-20 w-[320px] bg-[#15192b] border-[0.5px] border-gray-700 shadow-xl px-6 py-5 opacity-95 ${positionClass[card.position]} hidden md:block`}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            {!expanded ? (
              <div className="w-6 h-6 bg-blue-600 rounded-full mx-auto mt-3" />
            ) : (
              <>
                <p className="text-xs text-gray-400 uppercase mb-2">{card.label}</p>
                {card.question && (
                  <>
                    <div className="text-white font-semibold text-lg mb-1">{card.question}</div>
                    <div className="text-gray-300 text-sm">{card.answer}</div>
                  </>
                )}
                {card.steps && (
                  <ul className="list-disc list-inside text-gray-200 text-sm space-y-1 mb-1">
                    {card.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </motion.div>
        ))}
      </section>
      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center z-20">
        <div className="w-[90%] h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-25"></div>
      </div>
    </div>
  );
}

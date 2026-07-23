"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { CheckCircle2, FileText, MessageSquareText, Search } from "lucide-react";

const workflow = [
  "Read upload context",
  "Surface exact answers",
  "Save useful conversations",
];

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      id="about"
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="relative px-4 py-24 sm:px-6 lg:px-8"
    >
      <motion.div
        className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16"
        variants={contentVariants}
      >
        <motion.div variants={childVariants}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-xs font-extrabold text-[#6C63FF] neu-inset-sm">
            <span>Product Architecture</span>
          </div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-[#3D4852] sm:text-5xl">
            From static PDFs to an active workspace.
          </h2>
          <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-[#6B7280] sm:text-lg">
            Vault presents your files with clear visual hierarchy, tactile affordances, and scannable surfaces designed for high-focus work.
          </p>
          <div className="mt-8 space-y-4">
            {workflow.map((item) => (
              <div key={item} className="flex items-center gap-3 font-display text-base font-bold text-[#3D4852]">
                <div className="neu-inset-sm flex h-8 w-8 items-center justify-center rounded-xl text-[#38B2AC]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={childVariants} className="neu-extruded rounded-[32px] p-8 sm:p-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="neu-inset-deep rounded-[24px] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="neu-inset-sm flex h-9 w-9 items-center justify-center rounded-xl text-[#6C63FF]">
                  <Search className="h-4 w-4" />
                </div>
                <p className="font-display text-base font-bold text-[#3D4852]">Source Explorer</p>
              </div>
              {["Clause summary", "Risk language", "Payment schedule", "Renewal window"].map((item) => (
                <div key={item} className="neu-extruded-sm mb-3 rounded-xl p-3.5 last:mb-0">
                  <p className="font-display text-sm font-bold text-[#3D4852]">{item}</p>
                  <div className="neu-inset-sm mt-2 h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>

            <div className="neu-inset-deep rounded-[24px] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="neu-inset-sm flex h-9 w-9 items-center justify-center rounded-xl text-[#6C63FF]">
                    <MessageSquareText className="h-4 w-4" />
                  </div>
                  <p className="font-display text-base font-bold text-[#3D4852]">AI Response</p>
                </div>
                <span className="neu-inset-sm rounded-full px-3 py-1 text-xs font-bold text-[#38B2AC]">
                  Saved
                </span>
              </div>
              <p className="text-sm font-medium leading-relaxed text-[#6B7280]">
                The agreement includes a 14-day notice period, a late fee after day 45, and a renewal clause for review.
              </p>
              <div className="neu-extruded-sm mt-6 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#6C63FF]" />
                  <p className="font-display text-xs font-bold text-[#3D4852]">Linked evidence</p>
                </div>
                <p className="mt-2 text-xs font-medium leading-normal text-[#6B7280]">
                  Section 4.2, page 8, source excerpt active.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}


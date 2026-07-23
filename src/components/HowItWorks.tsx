"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { FileUp, MessagesSquare, Network } from "lucide-react";

const steps = [
  {
    title: "Upload",
    desc: "Add a PDF from the workspace and keep the action close to the file list.",
    icon: FileUp,
  },
  {
    title: "Ask",
    desc: "Analyze the document and ask follow-up questions in a focused chat surface.",
    icon: MessagesSquare,
  },
  {
    title: "Map",
    desc: "Turn long-form context into a mind-map view for faster review sessions.",
    icon: Network,
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      id="howitworks"
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="relative px-4 py-24 sm:px-6 lg:px-8"
    >
      <motion.div variants={sectionVariants} className="mx-auto max-w-7xl">
        <motion.div variants={childVariants} className="mb-16 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-xs font-extrabold text-[#6C63FF] neu-inset-sm">
            <span>Workflow</span>
          </div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-[#3D4852] sm:text-5xl">
            Designed for short paths and clear next steps.
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-[#6B7280] sm:text-lg">
            Every page keeps the next useful action visible without changing how the existing product behaves.
          </p>
        </motion.div>

        <motion.div
          variants={{
            visible: {
              transition: { staggerChildren: 0.2, delayChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                variants={childVariants}
                className="neu-extruded neu-extruded-hover rounded-[32px] p-8"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="neu-inset-deep flex h-14 w-14 items-center justify-center rounded-2xl text-[#6C63FF]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-4xl font-extrabold text-[#6C63FF]/30">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#3D4852]">{step.title}</h3>
                <p className="mt-3 text-base font-medium leading-relaxed text-[#6B7280]">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}


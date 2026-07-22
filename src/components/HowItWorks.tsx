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
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="relative border-t border-[var(--vault-line)] bg-white/60 px-4 py-24 sm:px-6 lg:px-8"
    >
      <motion.div variants={sectionVariants} className="mx-auto max-w-7xl">
        <motion.div variants={childVariants} className="mb-12 max-w-3xl">
          <p className="vault-kicker mb-3">Workflow</p>
          <h2 className="text-3xl font-black tracking-normal text-[var(--vault-ink)] sm:text-4xl">
            Designed for short paths and clear next steps.
          </h2>
          <p className="mt-4 text-base font-semibold leading-7 text-[var(--vault-muted)] sm:text-lg">
            Every page keeps the next useful action visible without changing how the existing product behaves.
          </p>
        </motion.div>

        <motion.div
          variants={{
            visible: {
              transition: { staggerChildren: 0.2, delayChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                variants={childVariants}
                className="vault-panel-solid p-6 transition duration-300 hover:-translate-y-1"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-md bg-[var(--vault-brand-soft)] text-[var(--vault-brand)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-4xl font-black text-[var(--vault-line-strong)]">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[var(--vault-ink)]">{step.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-[var(--vault-muted)]">
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

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
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
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
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="relative border-t border-[var(--vault-line)] px-4 py-24 sm:px-6 lg:px-8"
    >
      <motion.div
        className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]"
        variants={contentVariants}
      >
        <motion.div variants={childVariants}>
          <p className="vault-kicker mb-3">Product Shape</p>
          <h2 className="text-3xl font-black tracking-normal text-[var(--vault-ink)] sm:text-4xl">
            From static PDFs to an active workspace.
          </h2>
          <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-[var(--vault-muted)] sm:text-lg">
            Vault keeps the familiar upload, analyze, and chat workflow, but presents it with cleaner hierarchy, stronger affordances, and more useful scanning surfaces.
          </p>
          <div className="mt-8 space-y-3">
            {workflow.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-extrabold text-[var(--vault-ink)]">
                <CheckCircle2 className="h-5 w-5 text-[var(--vault-success)]" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={childVariants} className="vault-panel p-4">
          <div className="grid gap-3 sm:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-lg border border-[var(--vault-line)] bg-[var(--vault-soft)] p-4">
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-[var(--vault-brand)]" />
                <p className="text-sm font-black text-[var(--vault-ink)]">Source Explorer</p>
              </div>
              {["Clause summary", "Risk language", "Payment schedule", "Renewal window"].map((item) => (
                <div key={item} className="mb-2 rounded-md border border-[var(--vault-line)] bg-white/80 p-3 last:mb-0">
                  <p className="text-sm font-extrabold text-[var(--vault-ink)]">{item}</p>
                  <div className="mt-2 h-1.5 rounded-sm bg-[var(--vault-brand-soft)]" />
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-[var(--vault-line)] bg-white/80 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="h-4 w-4 text-[var(--vault-accent)]" />
                  <p className="text-sm font-black text-[var(--vault-ink)]">AI Response</p>
                </div>
                <span className="rounded-md bg-[var(--vault-accent-soft)] px-2 py-1 text-xs font-extrabold text-[var(--vault-accent)]">
                  Saved
                </span>
              </div>
              <p className="text-sm font-semibold leading-6 text-[var(--vault-muted)]">
                The agreement includes a 14-day notice period, a late fee after day 45, and a renewal clause that should be reviewed before approval.
              </p>
              <div className="mt-5 rounded-lg border border-[var(--vault-line)] bg-[var(--vault-info-soft)] p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[var(--vault-info)]" />
                  <p className="text-sm font-black text-[var(--vault-ink)]">Linked evidence</p>
                </div>
                <p className="mt-2 text-xs font-bold leading-5 text-[var(--vault-muted)]">
                  Section 4.2, page 8, source excerpt available in chat context.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

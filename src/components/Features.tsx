"use client";

import { useRef } from "react";
import { motion, Variants, Transition, useInView } from "framer-motion";
import { BrainCircuit, LockKeyhole, Workflow } from "lucide-react";

const features = [
  {
    title: "Grounded Retrieval",
    desc: "Extract precise answers from dense files while keeping the source context close at hand.",
    icon: BrainCircuit,
  },
  {
    title: "Private Workspace",
    desc: "Authenticated flows, scoped uploads, and saved chats keep sensitive document work contained.",
    icon: LockKeyhole,
  },
  {
    title: "Actionable Flow",
    desc: "Move from upload to chat to mind map without switching mental modes or losing momentum.",
    icon: Workflow,
  },
];

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const cardTransition: Transition = { duration: 0.6, ease: "easeOut" };

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: cardTransition,
  },
};

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 80 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.9, ease: "easeOut" },
        },
      }}
      className="relative border-t border-[var(--vault-line)] bg-white/60 px-4 py-24 sm:px-6 lg:px-8"
    >
      <motion.div className="mx-auto mb-12 max-w-3xl text-center" variants={headerVariants}>
        <p className="vault-kicker mb-3">Core Capabilities</p>
        <h2 className="text-3xl font-black tracking-normal text-[var(--vault-ink)] sm:text-4xl">
          A sharper way to work through documents.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-[var(--vault-muted)] sm:text-lg">
          The new interface favors scannability, fast action, and a visual rhythm built for repeated daily use.
        </p>
      </motion.div>

      <motion.div
        className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={cardsContainerVariants}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              className="vault-panel-solid p-6 transition duration-300 hover:-translate-y-1"
            >
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-md bg-[var(--vault-brand-soft)] text-[var(--vault-brand)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-black text-[var(--vault-ink)]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-[var(--vault-muted)]">
                {feature.desc}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}

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
      id="features"
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" },
        },
      }}
      className="relative px-4 py-24 sm:px-6 lg:px-8"
    >
      <motion.div className="mx-auto mb-16 max-w-3xl text-center" variants={headerVariants}>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-xs font-extrabold text-[#6C63FF] neu-inset-sm">
          <span>Core Capabilities</span>
        </div>
        <h2 className="font-display text-4xl font-extrabold tracking-tight text-[#3D4852] sm:text-5xl">
          A sharper way to work through documents.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#6B7280] sm:text-lg">
          The interface favors scannability, fast action, and a visual rhythm built for repeated daily use.
        </p>
      </motion.div>

      <motion.div
        className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        variants={cardsContainerVariants}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              className="neu-extruded neu-extruded-hover rounded-[32px] p-8"
            >
              <div className="neu-inset-deep mb-6 grid h-14 w-14 place-items-center rounded-2xl text-[#6C63FF]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#3D4852]">
                {feature.title}
              </h3>
              <p className="mt-3 text-base font-medium leading-relaxed text-[#6B7280]">
                {feature.desc}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}


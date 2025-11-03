"use client";

import { motion, Variants, Transition } from "framer-motion";

const features = [
  {
    title: "Hyper-Intelligent Retrieval",
    desc: "Extract accurate insights from complex documents instantly, powered by adaptive AI cognition.",
    icon: "⚙️",
  },
  {
    title: "Secure Knowledge Architecture",
    desc: "Enterprise-grade encryption ensures your knowledge stays safe, synchronized, and private.",
    icon: "🔐",
  },
  {
    title: "Collaborative Intelligence",
    desc: "Real-time team access with layered permissions, fostering clarity and shared understanding.",
    icon: "🤝",
  },
];

// Use exact Variants type for variants object
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut", // Allowed easings: "linear", "easeIn", "easeOut", "easeInOut"
    },
  },
};

const cardsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Separate transition object to reuse type-safe easing
const cardTransition: Transition = {
  duration: 0.6,
  ease: "easeOut",
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: cardTransition,
  },
};

export default function Features() {
  return (
    <section className="relative py-32 px-6 md:px-12 text-white bg-[#0A0A15] flex flex-col justify-center items-center overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(55,55,75,0.18) 0px, rgba(55,55,75,0.18) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(180deg, rgba(55,55,75,0.18) 0px, rgba(55,55,75,0.18) 1px, transparent 1px, transparent 64px)",
        }}
      />

      {/* Accent Glows */}
      <div className="absolute w-[600px] h-[600px] bg-black rounded-full blur-[200px] top-[-100px] left-[-160px]" />
      <div className="absolute w-[500px] h-[500px] bg-black rounded-full blur-[180px] bottom-[-120px] right-[-120px]" />

      {/* Header Text */}
      <motion.div
        className="relative z-10 text-center max-w-3xl mb-20"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 tracking-tight">
          Intelligent Features
        </h2>
        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Unlock the next era of intelligent document processing with precise reasoning,
          contextual awareness, and seamless collaboration built for scale.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl w-full relative z-10 perspective-[1000px]"
        variants={cardsContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="group border-3 shadow-gray-600/70 border-gray-600/70 bg-[#14161e]/60 hover:bg-[#191c24]/70 transition-all duration-500 rounded-2xl p-10 flex flex-col items-center text-center shadow-[0_0_30px_rgba(0,0,0,0.25)] hover:shadow-[0_0_50px_rgba(255,255,255,0.08)]"
            style={{ transformStyle: "preserve-3d" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "rotateY(5deg) rotateX(3deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg)";
            }}
          >
            <div className="text-5xl mb-6">{feature.icon}</div>
            <h3 className="text-2xl font-semibold mb-3 text-white">{feature.title}</h3>
            <p className="text-gray-400 text-base leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute bottom-0 w-full flex justify-center mt-20">
        <div className="w-[85%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-20"></div>
      </div>
    </section>
  );
}

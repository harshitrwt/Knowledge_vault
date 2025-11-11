"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

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
      className="relative bg-black rounded-tl-[20vh] rounded-tr-[20vh] border-t border-blue-300 text-white py-32 overflow-hidden md:h-full h-[110vh]"
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(55,55,75,0.18) 0px, rgba(55,55,75,0.18) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(180deg, rgba(55,55,75,0.18) 0px, rgba(55,55,75,0.18) 1px, transparent 1px, transparent 64px)",
        }}
      />

      {/* Accent Glows */}
      <div className="absolute w-[300px] h-[300px] bg-blue-400 rounded-full blur-[200px] top-[-100px] left-[-160px]" />
      <div className="absolute w-[400px] h-[300px] bg-blue-300 rounded-full blur-[180px] top-[120px] right-[-120px]" />

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-8 md:px-20 text-center relative z-10 max-w-7xl"
        variants={contentVariants}
      >
        {/* Heading */}
        <motion.h2
          variants={childVariants}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8"
        >
          Vault
        </motion.h2>
        <motion.p
          variants={childVariants}
          className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-20"
        >
          Smart Contract Vault redefines blockchain knowledge discovery through adaptive intelligence, ensuring your documents evolve as your ecosystem grows.
        </motion.p>

        {/* Floating Card with Image and Text */}
        <motion.div
          variants={childVariants}
          className="relative grid md:grid-cols-2 gap-12 items-center "
        >
          {/* Left - Floating Image */}
          <div
            className="relative rounded-3xl transform transition-transform duration-700 hover:rotateY-6 hover:-rotateX-3"
            style={{ transformStyle: "preserve-3d", transform: "rotateY(0deg)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "rotateY(6deg) rotateX(3deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg)";
            }}
          >
            <img
              src="https://img.freepik.com/premium-vector/bank-vault-door-clipart-vector-art-illustration_761413-24107.jpg?w=360"
              alt="About Smart Contract Vault"
              className="rounded-3xl md:w-[40vh] md:h-[40vh] opacity-90 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A15]/80 via-transparent to-transparent" />
          </div>

          {/* Right - Description */}
          <motion.div
            variants={childVariants}
            className="flex flex-col justify-center text-left md:pl-10 space-y-6"
          >
            <h3 className="text-3xl font-semibold text-gray-100">
              Not Just Storage — Evolution
            </h3>
            <p className="text-gray-400 leading-relaxed">
              The Vault learns as your organization grows. It connects context, builds associations, and transforms raw blockchain data into living, intelligent archives.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Designed around privacy, precision, and progress, it brings the future of decentralized knowledge into your hands — effortlessly and beautifully.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Subtle Bottom Divider */}
      <div className="absolute bottom-0 w-full flex justify-center mt-20">
        <div className="w-[85%] h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-20"></div>
      </div>
    </motion.section>
  );
}

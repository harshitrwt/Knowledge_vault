"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

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

  const steps = [
    {
      title: "Upload",
      desc: "Add smart contracts, docs, or notes to your vault in seconds.",
      img: "https://static.vecteezy.com/system/resources/thumbnails/041/310/775/small/cloud-computing-concept-with-people-scene-in-flat-web-design-man-uploading-data-and-files-at-cloud-storage-and-using-secure-access-illustration-for-social-media-banner-marketing-material-vector.jpg",
    },
    {
      title: "Organize",
      desc: "Files are neatly structured and intelligently labeled for instant access.",
      img: "https://clipart.com/thumbs.php?f=/014/batch_01/Closet3_tnb.png",
    },
    {
      title: "Search & Share",
      desc: "Discover and share blockchain knowledge securely across your team.",
      img: "https://img.freepik.com/free-vector/hand-drawn-web-design-concept_23-2147839737.jpg?semt=ais_hybrid&w=740&q=80",
    },
  ];

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="relative md:rounded-tl-[20vh] rounded-tr-[20vh] border-t border-blue-300 bg-black py-32 text-white overflow-hidden"
    >
      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(55,55,75,0.18) 0px, rgba(55,55,75,0.18) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(180deg, rgba(55,55,75,0.18) 0px, rgba(55,55,75,0.18) 1px, transparent 1px, transparent 64px)",
        }}
      />
      <div className="absolute w-[300px] h-[300px] bg-blue-400 rounded-full blur-[200px] top-[-100px] left-[-160px]" />
      <div className="absolute w-[400px] h-[300px] bg-blue-300 rounded-full blur-[180px] top-[120px] right-[-120px]" />

      <motion.div
        variants={sectionVariants}
        className="max-w-7xl mx-auto px-6 md:px-16 text-center relative z-10"
      >
        <motion.h2
          variants={childVariants}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-10 tracking-tight"
        >
          How It Works
        </motion.h2>

        <motion.p
          variants={childVariants}
          className="text-gray-400 text-lg sm:text-xl mb-20"
        >
          Experience elegant workflow automation designed for intelligence, privacy, and scalability.
        </motion.p>

        <motion.div
          variants={{
            visible: {
              transition: { staggerChildren: 0.2, delayChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 perspective-[1000px]"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={childVariants}
              className="relative group border border-gray-600/70 bg-[#14161e]/60 hover:bg-[#191c24]/70 transition-all duration-700 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.08)] overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateY(0deg)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "rotateY(5deg) rotateX(4deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg)";
              }}
            >
              <div className="overflow-hidden rounded-2xl mb-6 relative">
                <img
                  src={step.img}
                  alt={step.title}
                  className="rounded-2xl object-cover w-full h-56 opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A15]/80 via-transparent to-transparent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 w-full flex justify-center mt-20">
        <div className="w-[85%] h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-20"></div>
      </div>
    </motion.section>
  );
}

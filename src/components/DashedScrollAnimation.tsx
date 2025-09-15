'use client'
import { motion, useScroll, useTransform } from 'framer-motion';

export function DashedScrollAnimation() {
  const { scrollYProgress } = useScroll();
  const draw = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const rotateLeft = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const rotateRight = useTransform(scrollYProgress, [0, 1], [5, -5]);
  const scaleLeft = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const scaleRight = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-visible z-1">
      <motion.svg
        width="500"
        height="500"
        className="absolute left-2 top-20 sm:top-24 md:top-28 ml-[-40vh]"
        style={{ rotate: rotateLeft, scale: scaleLeft }}
      >
        <motion.circle
          cx="250" cy="250" r="220"
          stroke="#3b82f6" strokeWidth="8"
          strokeDasharray="40 25" strokeLinecap="round" fill="none"
          style={{ pathLength: draw, opacity: draw }}
        />
        <motion.circle
          cx="250" cy="250" r="180"
          stroke="#3b82f6" strokeWidth="6"
          strokeDasharray="30 20" strokeLinecap="round" fill="none"
          style={{ pathLength: draw, opacity: draw }}
        />
        <motion.circle
          cx="250" cy="250" r="150"
          stroke="#3b82f6" strokeWidth="5"
          strokeDasharray="20 20" strokeLinecap="round" fill="none"
          style={{ pathLength: draw, opacity: draw }}
        />
        <motion.circle
          cx="250" cy="250" r="120"
          stroke="#3b82f6" strokeWidth="3"
          strokeDasharray="12 15" strokeLinecap="round" fill="none"
          style={{ pathLength: draw, opacity: draw }}
        />
      </motion.svg>

      {/* RIGHT full circles */}
      <motion.svg
        width="450"
        height="450"
        className="absolute right-2 top-60 sm:top-64 md:top-72 mr-[-30vh]"
        style={{ rotate: rotateRight, scale: scaleRight }}
      >
        <motion.circle
          cx="225" cy="225" r="200"
          stroke="#2563eb" strokeWidth="7"
          strokeDasharray="36 24" strokeLinecap="round" fill="none"
          style={{ pathLength: draw, opacity: draw }}
        />
        <motion.circle
          cx="225" cy="225" r="170"
          stroke="#2563eb" strokeWidth="6"
          strokeDasharray="28 20" strokeLinecap="round" fill="none"
          style={{ pathLength: draw, opacity: draw }}
        />
        <motion.circle
          cx="225" cy="225" r="140"
          stroke="#2563eb" strokeWidth="4"
          strokeDasharray="16 16" strokeLinecap="round" fill="none"
          style={{ pathLength: draw, opacity: draw }}
        />
        <motion.circle
          cx="225" cy="225" r="110"
          stroke="#2563eb" strokeWidth="3"
          strokeDasharray="10 12" strokeLinecap="round" fill="none"
          style={{ pathLength: draw, opacity: draw }}
        />
      </motion.svg>
    </div>
  );
}

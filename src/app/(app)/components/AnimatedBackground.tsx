"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            background: `radial-gradient(circle at ${50 + index * 20}% ${
              50 + index * 20
            }%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

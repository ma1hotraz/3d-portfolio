"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10"
      >
        <h1 className="text-5xl md:text-8xl font-medium tracking-tight mb-4">
          Creative Developer
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 tracking-wide uppercase">
          A Cinematic Portfolio Experience
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 text-neutral-500 text-sm tracking-widest uppercase"
      >
        <span>Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-neutral-700 animate-pulse" />
      </motion.div>
    </section>
  );
}

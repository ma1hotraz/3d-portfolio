"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="relative min-h-[80vh] w-full flex flex-col justify-end pt-32 pb-12 px-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           viewport={{ once: true }}
           className="text-center mb-24"
        >
          <p className="text-neutral-400 uppercase tracking-widest text-sm mb-6">Let's build something</p>
          <a href="mailto:malhotrazmr@gmail.com" className="inline-block">
            <h2 className="text-6xl md:text-[10rem] font-bold tracking-tighter hover:text-neutral-400 transition-colors duration-500">
              CONNECT
            </h2>
          </a>
        </motion.div>

        <div className="w-full flex border-t border-neutral-200 pt-8 mt-auto flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-500 uppercase tracking-widest">
          <div className="flex gap-6">
            <a href="mailto:malhotrazmr@gmail.com" className="hover:text-black transition-colors">Email</a>
            <a href="https://linkedin.com/in/malhotraz" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">LinkedIn</a>
            <span className="hover:text-black transition-colors cursor-default">+91-9115513782</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Shashank Malhotra.
          </div>
        </div>
      </div>
    </section>
  );
}

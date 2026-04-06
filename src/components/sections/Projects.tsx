"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  { id: 1, title: "B2B SaaS Platform", category: "React / Prisma" },
  { id: 2, title: "Freightmate", category: "Vue.js / Tailwind" },
  { id: 3, title: "EnerFrog", category: "React.js" },
  { id: 4, title: "MIS-Smartz", category: "Fullstack Tool" },
];

export default function Projects() {
  return (
    <section className="relative min-h-screen w-full py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           className="mb-16 md:mb-32 flex justify-between items-end"
        >
          <h2 className="text-4xl md:text-7xl font-medium tracking-tight">Selected Work</h2>
          <p className="hidden md:block text-neutral-500 uppercase tracking-widest text-sm pb-2">(2023 - 2026)</p>
        </motion.div>

        <div className="flex flex-col border-t border-neutral-200">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative flex items-center justify-between py-8 md:py-16 border-b border-neutral-200 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-neutral-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
                <span className="text-neutral-500 font-mono text-sm">0{project.id}</span>
                <h3 className="text-3xl md:text-6xl font-medium group-hover:px-6 transition-all duration-500 ease-out">{project.title}</h3>
              </div>

              <div className="relative z-10 flex items-center gap-6">
                <span className="text-neutral-500 capitalize hidden md:block">{project.category}</span>
                <div className="h-12 w-12 rounded-full border border-neutral-300 flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors duration-500">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

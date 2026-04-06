"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center py-32 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-sm tracking-[0.3em] text-neutral-500 uppercase mb-6">About</h2>
          <p className="text-3xl md:text-5xl leading-tight font-medium text-neutral-800">
            Frontend Engineer with 3 years of experience designing scalable web applications. Passionate about leveraging AI-assisted workflows to radically accelerate full-stack delivery.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
           viewport={{ once: true, margin: "-100px" }}
           className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-neutral-200"
        >
          <div>
            <h3 className="text-lg font-medium mb-4 text-black">Experience</h3>
            <div className="text-neutral-600 leading-relaxed mb-6">
              <h4 className="font-semibold text-neutral-800">Software Engineer</h4>
              <p className="text-sm">Netsmartz (July 2023 – Dec 2025)</p>
              <p className="mt-2">Spearheaded the MIS-Smartz system, boosting data efficiency by 30%. Led role-based auth, streamlined tracking, and implemented AI-driven features while mentoring junior developers for code quality.</p>
            </div>
            <div className="text-neutral-600 leading-relaxed">
              <h4 className="font-semibold text-neutral-800">Software Engineer Intern</h4>
              <p className="text-sm">Netsmartz (Jan 2023 – June 2023)</p>
              <p className="mt-2">Delivered functional UI components for internal tools, working alongside senior engineers to craft responsive React.js solutions.</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4 text-black">Technical Skills</h3>
            <ul className="text-neutral-600 space-y-3 leading-relaxed">
              <li><strong>Languages & Frameworks:</strong> JavaScript (ES6+), TypeScript, React.js, Vue.js, Next.js</li>
              <li><strong>UI Libraries:</strong> Tailwind CSS, MUI, Bootstrap, PrimeVue, Shadcn</li>
              <li><strong>AI & DevTools:</strong> Cursor, GitHub Copilot, Anti-Gravity, Gemini Vision</li>
              <li><strong>Testing & DevOps:</strong> Vitest, Playwright, Postman, Jest, Git, Jira</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

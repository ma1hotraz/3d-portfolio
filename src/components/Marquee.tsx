"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const skills = [
  "FRONTEND ENGINEER",
  "NEXT.JS DEVELOPER",
  "PERFORMANCE OPTIMIZATION",
  "REACT.JS",
  "VUE.JS",
  "TYPESCRIPT",
  "ENTERPRISE SOLUTIONS",
  "CLEAN ARCHITECTURE",
  "WEB ACCESSIBILITY",
  "TAILWIND CSS",
  "PLAYWRIGHT",
  "VITEST"
];

export default function Marquee() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollElement = scrollRef.current;
      if (!scrollElement) return;

      const [first, second] = Array.from(scrollElement.children) as HTMLElement[];
      
      const tl = gsap.to([first, second], {
        xPercent: -100,
        repeat: -1,
        duration: 20,
        ease: "none",
      });

      // Optional: React to global scroll speed (via window scroll)
      const handleScroll = () => {
        const scrollSpeed = Math.abs(window.scrollY - (window as any).lastScrollY || 0);
        (window as any).lastScrollY = window.scrollY;
        
        gsap.to(tl, {
          timeScale: 1 + Math.min(scrollSpeed * 0.05, 5),
          duration: 0.5,
          ease: "power2.out"
        });
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-black/90 backdrop-blur-md py-1.5 md:py-2 border-b border-neutral-800 z-[100] pointer-events-auto shadow-2xl">
      <div ref={scrollRef} className="flex whitespace-nowrap">
        <div className="flex items-center gap-6 px-4">
          {skills.map((skill, i) => (
            <span key={i} className="text-xs md:text-sm font-bold tracking-[0.2em] text-white uppercase flex items-center gap-6">
              <span className={i % 2 === 0 ? "text-white" : "text-neutral-500"}>{skill}</span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
            </span>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex items-center gap-6 px-4">
          {skills.map((skill, i) => (
            <span key={i} className="text-xs md:text-sm font-bold tracking-[0.2em] text-white uppercase flex items-center gap-6">
              <span className={i % 2 === 0 ? "text-white" : "text-neutral-500"}>{skill}</span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Marquee from "@/components/Marquee";


const FRAME_COUNT = 240;

export default function CanvasScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const frames = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const preloadImages = async () => {
      let loaded = 0;
      const loadPromises = [];

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const id = i.toString().padStart(3, "0");
        const img = new Image();
        img.src = `/frames/ezgif-frame-${id}.jpg`;
        const promise = new Promise<void>((resolve) => {
          img.onload = () => {
            loaded++;
            setLoadingProgress(Math.round((loaded / FRAME_COUNT) * 100));
            resolve();
          };
        });
        frames.current.push(img);
        loadPromises.push(promise);
      }

      await Promise.all(loadPromises);
      setImagesLoaded(true);
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (index: number) => {
      const img = frames.current[index];
      if (!img) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      const isMobile = canvasWidth < 768;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        // On mobile, pin to top to avoid cutting the head; on desktop, center vertically
        offsetY = isMobile ? 0 : (canvasHeight - drawHeight) / 2;
      } else {
        drawWidth = canvasHeight * imgRatio;
        drawHeight = canvasHeight;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      // Canvas matches its CSS container: 50vh on mobile, full vh on desktop
      const height = isMobile ? window.innerHeight * 0.5 : window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      render(0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const obj = { frame: 0 };
    const maxFrame = FRAME_COUNT - 1;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      animation: gsap.to(obj, {
        frame: maxFrame,
        snap: "frame",
        ease: "none",
        onUpdate: () => {
          render(Math.round(obj.frame));
        },
      }),
    });

    const fadeSt = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "75% top",
      end: "90% top",
      scrub: true,
      onUpdate: (self) => {
        if (canvasRef.current) {
          canvasRef.current.style.opacity = (1 - self.progress).toString();
        }
      }
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      st.kill();
      fadeSt.kill();
    };
  }, [imagesLoaded]);

  return (
    <section ref={containerRef} className="relative w-full bg-white text-black h-[600vh]">
      <motion.div 
        animate={{ opacity: imagesLoaded ? 0 : 1, pointerEvents: imagesLoaded ? "none" : "all" }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 flex flex-col items-center justify-center z-[200] bg-black text-white px-10 md:px-0"
      >
        <div className="flex flex-col items-center gap-12 w-full max-w-sm">
          <div className="flex flex-col items-center gap-4">
             <motion.p 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-neutral-500 uppercase tracking-[0.5em] text-[10px] font-bold"
             >
               Loading Experience
             </motion.p>
             <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-none text-center">
               OPTIMIZING <br/> SYSTEMS.
             </h2>
          </div>
          
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full h-[1px] bg-neutral-900 overflow-hidden relative">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: `${loadingProgress - 100}%` }}
                className="absolute inset-0 bg-white"
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase flex justify-between w-full">
              <span>Initializing</span>
              <span>{loadingProgress}%</span>
            </p>
          </div>

          <div className="flex flex-col items-center opacity-30">
            <p className="text-[9px] uppercase tracking-[0.3em] font-medium text-neutral-400">SHASHANK MALHOTRA / 2026</p>
          </div>
        </div>
      </motion.div>
      
      {/* Fixed Header Marquee */}
      <div className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
        <Marquee />
      </div>

      <div className="sticky top-[50vh] md:top-0 h-[50vh] md:h-screen w-full overflow-hidden z-0 bg-white">
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
        />
      </div>

      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
        
        {/* Slide 1: Hero */}
        <div className="min-h-screen md:h-screen w-full relative">
          <div className="sticky top-0 min-h-[50vh] h-auto md:h-full md:relative bg-white md:bg-transparent px-6 md:p-16 pt-20 md:pt-16 flex flex-col md:flex-row justify-between w-full overflow-visible md:overflow-visible pb-12 md:pb-0">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col justify-center h-auto md:h-full w-full md:w-1/3 pointer-events-auto"
            >
              <h1 className="text-4xl md:text-7xl lg:text-[6rem] font-semibold tracking-tighter text-black leading-[0.9]">
                Shashank<br />Malhotra.
              </h1>
              <div className="mt-4 md:mt-8 space-y-1 md:space-y-2">
                <a href="mailto:malhotrazmr@gmail.com" className="block text-[10px] md:text-sm tracking-wider uppercase text-neutral-500 hover:text-black hover:underline transition-all">malhotrazmr@gmail.com</a>
                <p className="block text-[10px] md:text-sm tracking-wider uppercase text-neutral-500 hover:text-black transition-all">+91-9115513782</p>
                <p className="block text-[10px] md:text-sm tracking-wider uppercase text-neutral-500 hover:text-black transition-all">Chandigarh, India</p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex items-start md:items-center justify-start md:justify-end h-auto md:h-full w-full md:w-1/3 text-left md:text-right pointer-events-auto mt-12 md:mt-0"
            >
              <div className="flex flex-col items-start md:items-end gap-3 md:gap-6">
                <div className="flex flex-col items-start md:items-end">
                  <p className="text-[10px] md:text-sm font-bold uppercase tracking-[0.4em] text-black">
                    FRONTEND ENGINEER
                  </p>
                  <div className="w-6 md:w-12 h-[1px] bg-black mt-2 md:mt-4"></div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-neutral-500 italic font-light text-lg md:text-xl tracking-tight leading-none">
                    Elevating <span className="text-black not-italic font-medium">the web</span>
                  </p>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400 mt-2">through scalable engineering</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slide 2: Master Technical Stack */}
        <div className="h-screen w-full relative">
          <div className="sticky top-0 h-[55vh] md:h-full md:relative bg-white md:bg-transparent px-6 md:p-16 pt-12 md:pt-16 flex flex-col md:flex-row items-center justify-between w-full overflow-y-auto md:overflow-visible pb-8 md:pb-0">
             
             {/* Left Column */}
             <div className="w-full md:w-[35%] flex flex-col gap-4 md:gap-16">
                <p className="text-neutral-400 uppercase tracking-widest text-[9px] md:text-xs mb-0 font-bold border-b border-black pb-1 inline-block self-start">Core Engineering</p>
                {[
                  { cat: "Apps & Logic", items: "JavaScript (ES6+), TypeScript, React, Vue, Next.js" },
                  { cat: "UI & Architecture", items: "Tailwind, MUI, PrimeVue, Shadcn, HTML5, CSS3" }
                ].map((group, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative text-left"
                  >
                    <p className="text-lg md:text-2xl font-bold tracking-tight text-black mb-1">{group.cat}</p>
                    <p className="text-neutral-500 text-[8px] md:text-xs leading-relaxed font-medium uppercase tracking-widest">{group.items}</p>
                  </motion.div>
                ))}
             </div>

             {/* Right Column */}
             <div className="w-full md:w-[35%] flex flex-col gap-4 md:gap-16 mt-8 md:mt-0 text-left md:text-right">
                <p className="text-neutral-400 uppercase tracking-widest text-[9px] md:text-xs mb-0 font-bold border-b border-black pb-1 inline-block self-start md:self-end">Productivity & Quality</p>
                {[
                  { cat: "AI & Productivity", items: "Cursor, GitHub Copilot, Antigravity, Gemini" },
                  { cat: "Engineering Stability", items: "Vitest, Playwright, Postman, Jest" },
                  { cat: "Collaboration", items: "Git, GitHub, GitLab, Jira, Figma" }
                ].map((group, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative text-left md:text-right"
                  >
                    <p className="text-lg md:text-2xl font-bold tracking-tight text-black mb-1">{group.cat}</p>
                    <p className="text-neutral-500 text-[8px] md:text-xs leading-relaxed font-medium uppercase tracking-widest">{group.items}</p>
                  </motion.div>
                ))}
             </div>

          </div>
        </div>

        {/* Slide 3: Professional Experience (Netsmartz) */}
        <div className="h-screen w-full relative">
          <div className="sticky top-0 h-[55vh] md:h-full md:relative bg-white md:bg-transparent px-6 md:p-16 pt-16 md:pt-16 flex flex-col md:flex-row justify-between w-full overflow-y-auto md:overflow-visible pb-8 md:pb-0">
            
            {/* Left Column: Experience Details */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full md:w-[35%] text-left pointer-events-auto flex-shrink-0"
            >
              <p className="text-neutral-400 uppercase tracking-widest text-[9px] md:text-xs mb-2 md:mb-8 font-bold border-b border-black pb-1 inline-block">Experience Highlights</p>
              <div className="relative">
                <p className="text-neutral-400 uppercase tracking-[0.2em] text-[8px] mb-1">Netsmartz | Jan 2023 – Dec 2025</p>
                <p className="text-2xl md:text-5xl font-semibold tracking-tight text-black mb-3 leading-tight">Software Engineer</p>
                <ul className="space-y-3 text-neutral-600 text-xs md:text-lg font-light list-none">
                  <li className="flex items-start gap-3">
                    <span className="text-black font-bold mt-0.5">→</span>
                    <p>Spearheaded <span className="text-black font-medium">MIS-Smartz</span> with a 30% efficiency boost.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black font-bold mt-0.5">→</span>
                    <p>Engineered <span className="text-black font-medium">AI interview modules</span> and mock assessments.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black font-bold mt-0.5">→</span>
                    <p>Orchestrated <span className="text-black font-medium">Role-Based Authorization</span> for enterprise users.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black font-bold mt-0.5">→</span>
                    <p>Mentored developers via <span className="text-black font-medium">structured code reviews</span>.</p>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right Column: Impact Metrics */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="w-full md:w-[35%] ml-auto text-left md:text-right pointer-events-auto flex flex-col items-start md:items-end mt-4 md:mt-0 flex-shrink-0"
            >
              <p className="text-neutral-400 uppercase tracking-widest text-[9px] md:text-xs mb-2 md:mb-8 font-bold border-b border-black pb-1 inline-block">Impact Metrics</p>
              <div className="space-y-4 w-full flex flex-col items-start md:items-end pb-12">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-12 w-full">
                  <div className="text-left md:text-right">
                    <span className="text-3xl md:text-7xl font-bold tracking-tighter text-black">100%</span>
                    <p className="text-neutral-500 uppercase text-[8px] tracking-[0.3em] mt-0.5 font-bold leading-none">On-Time</p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-3xl md:text-7xl font-bold tracking-tighter text-black">30%</span>
                    <p className="text-neutral-500 uppercase text-[8px] tracking-[0.3em] mt-0.5 font-bold leading-none">Efficiency</p>
                  </div>
                  <div className="text-left md:text-right col-span-2 md:col-span-1">
                    <span className="text-3xl md:text-7xl font-bold tracking-tighter text-black">20%</span>
                    <p className="text-neutral-500 uppercase text-[8px] tracking-[0.3em] mt-0.5 font-bold leading-none">Productivity</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slide 4: Key Projects Showreel */}
        <div className="h-screen w-full relative">
          <div className="sticky top-0 h-[55vh] md:h-full md:relative bg-white md:bg-transparent px-6 md:p-16 pt-8 md:pt-16 flex flex-col md:flex-row justify-between w-full overflow-y-auto md:overflow-visible pb-8 md:pb-0">
            
            {/* Left Project */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-[35%] text-left pointer-events-auto flex-shrink-0 mb-6 md:mb-0"
            >
              <p className="text-neutral-400 uppercase tracking-widest text-[9px] md:text-xs mb-2 md:mb-8 font-bold border-b border-black pb-1 inline-block">Enterprise Systems</p>
              <div className="relative">
                <h3 className="text-lg md:text-5xl font-semibold tracking-tighter text-black mb-1 md:mb-4">MIS-Smartz</h3>
                {/* Desktop Text */}
                <p className="hidden md:block text-neutral-600 text-lg font-light leading-relaxed mb-6">
                  Spearheaded core efficiency redesign replacing legacy <span className="text-black font-medium">Excel and SharePoint</span> workflows, 
                  resulting in a 30% improvement in data management efficiency.
                </p>
                {/* Mobile Text */}
                <p className="block md:hidden text-neutral-600 text-[11px] font-light leading-relaxed mb-2">
                  Spearheaded core efficiency redesign replacing legacy workflows with a 30% boost. 
                </p>
                <div className="flex gap-4 md:gap-8">
                  <div>
                    <span className="text-xl md:text-5xl font-bold tracking-tighter text-black">30%</span>
                    <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Efficiency</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Projects Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full md:w-[35%] ml-auto text-left md:text-right pointer-events-auto flex flex-col items-start md:items-end mt-0 md:mt-0 flex-shrink-0"
            >
              <p className="text-neutral-400 uppercase tracking-widest text-[9px] md:text-xs mb-4 md:mb-12 font-bold border-b border-black pb-1 inline-block">Modernization & Perf</p>
              
              <div className="space-y-6 md:space-y-16">
                <div className="relative text-left md:text-right">
                  <h3 className="text-lg md:text-5xl font-semibold tracking-tighter text-black mb-1 md:mb-4">Freightmate</h3>
                  {/* Desktop Text */}
                  <p className="hidden md:block text-neutral-600 text-lg font-light leading-relaxed mb-4 text-right">
                    Migrated legacy Bootstrap to <span className="text-black font-medium">Tailwind & PrimeVue</span>. 
                    Decreased code duplication by 25% with reusable UI components.
                  </p>
                  {/* Mobile Text */}
                  <p className="block md:hidden text-neutral-600 text-[11px] font-light leading-relaxed mb-1 text-left">
                    Migrated Bootstrap to <span className="text-black font-medium">Tailwind</span>. Decreased duplication by 25%.
                  </p>
                  <div className="flex justify-start md:justify-end gap-6">
                    <span className="text-sm md:text-2xl font-bold tracking-tighter text-black">85% Test Coverage</span>
                  </div>
                </div>

                <div className="relative pt-4 md:pt-8 text-left md:text-right">
                  <div className="w-12 md:w-24 h-[1px] bg-neutral-100 mb-6 md:mb-12 ml-auto hidden md:block" />
                  <h3 className="text-lg md:text-5xl font-semibold tracking-tighter text-black mb-1 md:mb-4">EnerFrog</h3>
                  {/* Desktop Text */}
                  <p className="hidden md:block text-neutral-600 text-lg font-light leading-relaxed mb-4 text-right">
                    Optimized dashboard performance by reducing unnecessary state updates. 
                    Architected advanced filtering for <span className="text-black font-medium">large-scale datasets</span>.
                  </p>
                  {/* Mobile Text */}
                  <p className="block md:hidden text-neutral-600 text-[11px] font-light leading-relaxed mb-1 text-left">
                    Optimized performance with advanced filtering and state management.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>



        {/* Slide 6: Education & Global Recognition */}
        <div className="h-screen w-full relative">
          <div className="sticky top-0 h-[55vh] md:h-full md:relative bg-white md:bg-transparent px-6 md:p-16 pt-16 md:pt-16 flex flex-col md:flex-row items-center justify-center w-full overflow-y-auto md:overflow-visible pb-12 md:pb-0">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full md:w-[45%] mr-auto text-left pointer-events-auto flex-shrink-0"
            >
              <p className="text-neutral-400 uppercase tracking-widest text-[9px] md:text-xs mb-2 font-bold border-b border-black pb-1 inline-block">Academic Foundation</p>
              <p className="text-neutral-400 uppercase tracking-[0.2em] text-[8px] mb-1 font-medium">B.Tech in CSE | 2019 – 2023</p>
              <p className="text-2xl md:text-5xl font-semibold tracking-tight text-black mb-1">I.K. Gujral PTU</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl md:text-6xl font-bold tracking-tighter text-black">8.12</span>
                <span className="text-sm md:text-2xl font-light text-neutral-400">CGPA</span>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="w-full md:w-[45%] ml-auto text-left md:text-right pointer-events-auto flex flex-col items-start md:items-end mt-8 md:mt-0 flex-shrink-0 pb-8 md:pb-0"
            >
              <p className="text-neutral-400 uppercase tracking-widest text-[9px] md:text-xs mb-2 font-bold border-b border-black pb-1 inline-block">Global Awards</p>
              <p className="text-neutral-400 uppercase tracking-[0.2em] text-[8px] mb-1">Team Extra Miler | Q4 2024</p>
              <p className="text-2xl md:text-5xl font-semibold tracking-tight text-black mb-2">Netsmartz</p>
              <p className="text-neutral-600 text-xs md:text-xl font-light italic text-left md:text-right max-w-sm">
                Recognized for <span className="text-black font-medium">outstanding initiative</span> and extraordinary contributions.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Slide 7: Connect / Signature Finale */}
        <div className="h-screen w-full bg-black flex flex-col justify-between p-6 md:p-16 pointer-events-auto overflow-hidden relative border-t border-neutral-900">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none overflow-hidden">
            <h2 className="text-[25vw] md:text-[20vw] font-bold text-white uppercase tracking-tighter whitespace-nowrap leading-none border-text">
              SHASHANK
            </h2>
          </div>
          <div className="flex justify-between items-start z-10 w-full relative pt-12 md:pt-0">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-neutral-500 uppercase tracking-[0.4em] text-[9px] md:text-[10px] font-bold">CONNECT</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-neutral-500 uppercase tracking-widest text-[8px] md:text-[9px] font-medium">AVAILABLE — 2026</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 z-10 flex-grow items-center w-full relative">
            <div className="md:col-span-7">
              <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tighter text-white leading-[0.85]">
                Let’s build <br className="hidden md:block" /> <span className="text-neutral-500 italic font-light">something.</span>
              </motion.h2>
            </div>
            <div className="md:col-span-5 h-full flex flex-col justify-center border-t md:border-t-0 md:border-l border-neutral-800/50 pt-8 md:pt-0 md:pl-12">
              <div className="space-y-8 md:space-y-12">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                  <p className="text-neutral-600 uppercase tracking-widest text-[9px] md:text-[10px] mb-4 font-bold border-b border-neutral-900 pb-2 inline-block">Professional</p>
                  <div className="flex flex-col gap-3 md:gap-4">
                    <a href="mailto:malhotrazmr@gmail.com" className="text-xl md:text-3xl lg:text-4xl font-light text-white hover:text-neutral-400 transition-all hover:translate-x-2 inline-block break-all">malhotrazmr@gmail.com</a>
                    <a href="https://linkedin.com/in/malhotraz" target="_blank" rel="noopener noreferrer" className="text-lg md:text-2xl text-neutral-400 hover:text-white transition-all underline decoration-neutral-800 underline-offset-8">linkedin.com/in/malhotraz</a>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                  <p className="text-neutral-600 uppercase tracking-widest text-[9px] md:text-[10px] mb-4 font-bold border-b border-neutral-900 pb-2 inline-block">Inquiry</p>
                  <p className="text-xl md:text-3xl font-light text-white leading-none">+91-9115513782</p>
                  <p className="text-neutral-500 text-[9px] mt-2 font-mono uppercase tracking-widest underline underline-offset-4 decoration-neutral-800">Chandigarh, IN</p>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 border-t border-neutral-900 z-10 w-full relative gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-neutral-500 text-[9px] md:text-[10px] uppercase tracking-widest">© 2026 SHASHANK MALHOTRA</p>
            </div>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-4 group pointer-events-auto">
              <span className="text-neutral-500 text-[9px] md:text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">BACK TO TOP</span>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-neutral-800 flex items-center justify-center group-hover:border-white transition-colors group-hover:-translate-y-1 duration-300">
                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 md:w-3 md:h-3">
                  <path d="M6 1V11M6 1L1 6M6 1L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

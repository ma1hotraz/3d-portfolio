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
  const frames = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const preloadImages = async () => {
      const loadPromises = [];

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const id = i.toString().padStart(3, "0");
        const img = new Image();
        img.src = `/frames/ezgif-frame-${id}.jpg`;
        const promise = new Promise<void>((resolve) => {
          img.onload = () => resolve();
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

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = canvasWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
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
    <section ref={containerRef} className="relative w-full bg-[#FAFAFA] text-black h-[500vh]">
      {!imagesLoaded && (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-neutral-400 bg-white tracking-widest uppercase text-sm">
          Loading 3D Environment...
        </div>
      )}
      
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0 bg-white">
        <canvas
          ref={canvasRef}
          className="block h-full w-full object-cover"
        />
      </div>

      {/* Fixed Header Marquee */}
      <div className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
        <Marquee />
      </div>

      {/* Scrolling Text Content Layers */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
        
        {/* Slide 1: Hero */}
        <div className="h-screen w-full flex flex-col md:flex-row justify-between p-6 md:p-16 pt-12 md:pt-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-start md:justify-center h-full w-full md:w-1/3 pt-12 md:pt-0 pointer-events-auto"
          >
            <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-semibold tracking-tighter text-black leading-[0.9]">
              Shashank<br />Malhotra.
            </h1>
            <div className="mt-8 space-y-2">
              <a href="mailto:malhotrazmr@gmail.com" className="block text-sm tracking-wider uppercase text-neutral-500 hover:text-black hover:underline transition-all">malhotrazmr@gmail.com</a>
              <p className="block text-sm tracking-wider uppercase text-neutral-500 hover:text-black transition-all">+91-9115513782</p>
              <p className="block text-sm tracking-wider uppercase text-neutral-500 hover:text-black transition-all">Chandigarh, India</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex items-end md:items-center justify-end h-full w-full md:w-1/3 pb-12 md:pb-0 text-right pointer-events-auto"
          >
            <div>
              <p className="text-xl md:text-3xl font-light text-neutral-800 tracking-tight">
                Frontend Engineer
              </p>
              <p className="text-neutral-400 uppercase tracking-widest text-xs mt-2 font-medium">Elevating the Web</p>
            </div>
          </motion.div>
        </div>

        {/* Slide 3: Technical Skills & Experience Combined */}
        <div className="h-screen w-full flex flex-col md:flex-row items-center justify-between p-6 md:p-16 gap-4 relative">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-1/3 lg:w-[30%] xl:w-[25%] max-w-sm mr-auto text-left pointer-events-auto self-center md:self-start md:mt-12"
          >
            <p className="text-neutral-400 uppercase tracking-widest text-xs mb-8 font-medium border-b border-black pb-2 inline-block">Core Stack</p>
            <div className="space-y-6 w-full pr-4">
              {[
                { title: "Languages & Frameworks", items: "JavaScript (ES6+), TypeScript, React.js, Vue.js, Next.js, HTML5, CSS3" },
                { title: "UI Libraries", items: "Tailwind CSS, Material UI, Bootstrap, PrimeVue, Shadcn" },
                { title: "Tools & Platforms", items: "Git, GitHub, GitLab, Jira, Confluence, Figma" },
                { title: "AI & Productivity", items: "Cursor, GitHub Copilot, Google AI Studio" },
                { title: "Testing", items: "Vitest, Playwright, Postman" }
              ].map((group, idx) => (
                <div key={idx} className={`relative ${idx !== 0 ? 'pt-6 border-t border-neutral-200' : ''} text-left w-full`}>
                  <p className="text-xl font-semibold tracking-tight text-black mb-1">{group.title}</p>
                  <p className="text-neutral-600 text-sm leading-relaxed font-light">{group.items}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-[45%] ml-auto text-right pointer-events-auto flex flex-col items-end self-center md:self-end md:mb-12"
          >
            <p className="text-neutral-400 uppercase tracking-widest text-xs mb-8 font-medium border-b border-black pb-2 inline-block">Professional Experience</p>
            <div className="space-y-10 w-full flex flex-col items-end">
              <div className="relative text-right max-w-sm">
                <p className="text-3xl font-semibold tracking-tight text-black mb-1">Software Engineer</p>
                <p className="text-neutral-400 uppercase tracking-widest text-xs mb-4">Netsmartz | July 2023 – Dec 2025</p>
                <p className="text-neutral-600 text-sm leading-relaxed font-light mb-4">
                  Delivered highly scalable enterprise web applications utilizing Vue.js and React.js. Led the implementation of robust role-based authorization ensuring stringent enterprise-grade security across internal portals.
                </p>
                <p className="text-neutral-800 font-medium uppercase text-xs tracking-wider">Enterprise Security</p>
              </div>
              <div className="relative pt-6 border-t border-neutral-200 text-right max-w-sm w-full">
                <p className="text-2xl font-medium tracking-tight text-neutral-800 mb-1">Intern</p>
                <p className="text-neutral-400 uppercase tracking-widest text-xs mb-4">Jan 2023 – June 2023</p>
                <p className="text-neutral-600 text-sm leading-relaxed font-light mb-4 text-right">
                  Delivered precision UI components resolving critical agile roadblocks alongside senior engineers.
                </p>
                <div className="flex items-baseline gap-2 justify-end mb-2 mt-4">
                  <span className="text-6xl font-bold tracking-tighter leading-none text-black">100</span>
                  <span className="text-2xl font-light text-neutral-400">%</span>
                </div>
                <p className="text-neutral-800 font-medium uppercase text-xs tracking-wider">On-Time Delivery</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Slide 5: Projects */}
        <div className="h-screen w-full flex flex-col md:flex-row items-center justify-between p-6 md:p-16 gap-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-[40%] mr-auto text-left pointer-events-auto self-start md:mt-24"
          >
            <div className="mb-12">
              <p className="text-neutral-400 uppercase tracking-widest text-xs mb-4 font-medium border-b border-black pb-2 inline-block">Enterprise System</p>
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">MIS-Smartz</h3>
              <div className="flex items-baseline gap-2 justify-start mb-2 mt-4">
                <span className="text-5xl font-bold tracking-tighter leading-none text-black">30</span>
                <span className="text-2xl font-light text-neutral-400">%</span>
              </div>
              <p className="text-neutral-800 font-medium leading-snug mb-2">Efficiency Improvement</p>
              <p className="text-neutral-600 text-sm font-light leading-relaxed mb-4 max-w-sm">
                Spearheaded the complete development of the MIS-Smartz system to successfully replace and modernize legacy Excel and SharePoint workflows.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-neutral-300 rounded-full">React.js</span>
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-neutral-300 rounded-full">MUI</span>
              </div>
            </div>
            <div>
              <p className="text-neutral-400 uppercase tracking-widest text-xs mb-4 font-medium border-b border-black pb-2 inline-block">App Optimization</p>
              <h3 className="text-3xl font-semibold tracking-tight mb-3">EnerFrog</h3>
              <p className="text-neutral-600 text-sm font-light leading-relaxed max-w-sm mb-4">
                Optimized React platform performance by reducing unnecessary state rendering.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-neutral-300 rounded-full">React.js</span>
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-neutral-300 rounded-full">Bootstrap</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full md:w-[40%] ml-auto text-right pointer-events-auto self-end md:mb-24 flex flex-col items-end"
          >
            <p className="text-neutral-400 uppercase tracking-widest text-xs mb-4 font-medium border-b border-black pb-2 inline-block">Architecture Redesign</p>
            <h3 className="text-4xl font-semibold tracking-tight mb-6">Freightmate</h3>
            <div className="flex gap-12 justify-end w-full mb-6 relative">
               <div className="text-right border-r border-neutral-200 pr-6">
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-5xl font-bold tracking-tighter text-black">25</span>
                  <span className="text-xl text-neutral-400">%</span>
                </div>
                <p className="text-xs uppercase tracking-widest text-neutral-500 mt-1">Less Code Duplication</p>
               </div>
               <div className="text-right">
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-5xl font-bold tracking-tighter text-black">85</span>
                  <span className="text-xl text-neutral-400">%</span>
                </div>
                <p className="text-xs uppercase tracking-widest text-neutral-500 mt-1">Test Suite Coverage</p>
               </div>
            </div>
            <p className="text-neutral-600 text-sm font-light leading-relaxed mb-4 max-w-md text-right">
              Meticulously led the complete refactoring of an interstate freight management engine.
            </p>
            <div className="flex gap-2 justify-end">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-neutral-300 rounded-full">Vue.js</span>
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-neutral-300 rounded-full">PrimeVue</span>
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-neutral-300 rounded-full">Playwright</span>
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-neutral-300 rounded-full">Vitest</span>
            </div>
          </motion.div>
        </div>

        {/* Slide 6: Education & Awards */}
        <div className="h-screen w-full flex flex-col md:flex-row items-center justify-between p-6 md:p-16 gap-8 relative">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-[40%] mr-auto text-left pointer-events-auto self-center md:self-start md:mt-24"
          >
            <p className="text-neutral-400 uppercase tracking-widest text-xs mb-8 font-medium border-b border-black pb-2 inline-block">Education</p>
            <div className="relative text-left max-w-sm">
                <p className="text-3xl font-semibold tracking-tight text-black mb-1">B.Tech CSE</p>
                <p className="text-neutral-400 uppercase tracking-widest text-xs mb-4">IKG Punjab Technical University</p>
                <div className="flex items-baseline gap-2 justify-start mb-2 mt-4 text-left">
                  <span className="text-6xl font-bold tracking-tighter leading-none text-black">8.12</span>
                  <span className="text-2xl font-light text-neutral-400">CGPA</span>
                </div>
              </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-[45%] ml-auto text-right pointer-events-auto flex flex-col items-end self-center md:self-end md:mb-24"
          >
            <p className="text-neutral-400 uppercase tracking-widest text-xs mb-8 font-medium border-b border-black pb-2 inline-block">Professional Recognition</p>
            <div className="relative text-right max-w-sm w-full">
                <p className="text-3xl font-semibold tracking-tight text-black mb-1">Team Extra Miler</p>
                <p className="text-neutral-400 uppercase tracking-widest text-xs mb-4">Netsmartz Award</p>
                <p className="text-neutral-600 text-sm font-light leading-relaxed mb-6 text-right">
                  Officially recognized for outstanding initiative, out-of-the-box thinking, and extraordinary contributions to critical project deliveries.
                </p>
                <div className="flex items-baseline gap-2 justify-end mb-2 mt-4">
                  <span className="text-6xl font-bold tracking-tighter leading-none text-black">Q4</span>
                </div>
                <p className="text-neutral-800 font-medium uppercase text-xs tracking-wider">Exceptional Achievement</p>
                <p className="text-neutral-400 text-xs mt-1">2024 Recognition</p>
              </div>
          </motion.div>
        </div>

        {/* Slide 7: Connect / Signature Finale */}
        <div className="h-screen w-full bg-black flex flex-col justify-between p-6 md:p-16 pointer-events-auto overflow-hidden relative border-t border-neutral-900">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none overflow-hidden">
            <h2 className="text-[20vw] font-bold text-white uppercase tracking-tighter whitespace-nowrap leading-none border-text">
              SHASHANK MALHOTRA
            </h2>
          </div>
          <div className="flex justify-between items-start z-10 w-full relative">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-neutral-500 uppercase tracking-[0.4em] text-[10px] font-bold">CONNECT</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-neutral-500 uppercase tracking-widest text-[9px] font-medium">AVAILABLE FOR PROJECTS — 2026</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 z-10 flex-grow items-center w-full relative">
            <div className="md:col-span-7">
              <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tighter text-white leading-[0.85]">
                Let’s build <br /> <span className="text-neutral-500 italic font-light">something.</span>
              </motion.h2>
            </div>
            <div className="md:col-span-5 h-full flex flex-col justify-center border-l border-neutral-900 pl-8 md:pl-12">
              <div className="space-y-12">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                  <p className="text-neutral-600 uppercase tracking-widest text-[10px] mb-4 font-bold border-b border-neutral-800 pb-2 inline-block">Professional</p>
                  <div className="flex flex-col gap-4">
                    <a href="mailto:malhotrazmr@gmail.com" className="text-2xl md:text-4xl font-light text-white hover:text-neutral-400 transition-all hover:translate-x-2 inline-block">malhotrazmr@gmail.com</a>
                    <a href="https://linkedin.com/in/malhotraz" target="_blank" rel="noopener noreferrer" className="text-xl md:text-2xl text-neutral-400 hover:text-white transition-all underline decoration-neutral-800 underline-offset-8">linkedin.com/in/malhotraz</a>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                  <p className="text-neutral-600 uppercase tracking-widest text-[10px] mb-4 font-bold border-b border-neutral-800 pb-2 inline-block">Inquiry</p>
                  <p className="text-2xl md:text-3xl font-light text-white leading-none">+91-9115513782</p>
                  <p className="text-neutral-500 text-[10px] mt-2 font-mono uppercase tracking-widest">Chandigarh, IN</p>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center pt-8 border-t border-neutral-900 z-10 w-full relative">
            <div className="flex flex-col gap-1">
              <p className="text-neutral-500 text-[10px] uppercase tracking-widest">© 2026 SHASHANK MALHOTRA</p>
            </div>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-6 md:mt-0 flex items-center gap-4 group pointer-events-auto">
              <span className="text-neutral-500 text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">BACK TO TOP</span>
              <div className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center group-hover:border-white transition-colors group-hover:-translate-y-1 duration-300">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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

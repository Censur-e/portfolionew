import React, { useEffect, useRef } from "react";
import { HERO } from "../../mock";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const bgRef = useRef(null);

  // Subtle parallax on mouse move for the abstract background.
  useEffect(() => {
    const onMove = (e) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      bgRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden noise">
      {/* Abstract reactive background */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-0 transition-transform duration-300 ease-out will-change-transform"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -left-32 w-[640px] h-[640px] rounded-full bg-white/[0.04] blur-3xl float-1" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-white/[0.05] blur-3xl float-2" />
        <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-white/[0.03] blur-3xl float-3" />
        {/* Geometric outlines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <circle cx="1200" cy="220" r="260" stroke="white" strokeWidth="0.6" />
          <circle cx="1200" cy="220" r="180" stroke="white" strokeWidth="0.6" />
          <circle cx="1200" cy="220" r="100" stroke="white" strokeWidth="0.6" />
          <line x1="0" y1="720" x2="1440" y2="720" stroke="white" strokeWidth="0.6" />
          <line x1="160" y1="0" x2="160" y2="900" stroke="white" strokeWidth="0.6" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1640px] px-6 md:px-10 pt-40 md:pt-44 pb-24 min-h-screen flex flex-col justify-between">
        {/* Top meta row */}
        <div className="flex flex-wrap items-start justify-between gap-6 reveal in-view">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
            <div>Portfolio — Vol. 07</div>
            <div className="mt-1">{HERO.role}</div>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 max-w-[260px] text-right">
            {HERO.status}
          </div>
        </div>

        {/* Massive headline */}
        <h1 className="font-display text-white font-semibold leading-[0.86] tracking-[-0.045em] text-[15vw] md:text-[12vw] lg:text-[10.5vw]">
          <span className="block reveal in-view">{HERO.headlineLine1}</span>
          <span className="block pl-[6vw] reveal in-view">
            <span className="text-outline">{HERO.headlineLine2}</span>
          </span>
          <span className="block reveal in-view">{HERO.headlineLine3}</span>
          <span className="block pl-[12vw] reveal in-view">{HERO.headlineLine4}</span>
        </h1>

        {/* Bottom row — spinning ring + caption */}
        <div className="mt-16 flex flex-wrap items-end justify-between gap-10">
          <p className="max-w-md text-white/60 text-sm md:text-base leading-relaxed reveal in-view">
            An independent practice at the seam of design & engineering. Building interfaces with a script, motion as a language, and detail as devotion.
          </p>

          <a href="#about" data-cursor="hover" className="relative w-[140px] h-[140px] flex items-center justify-center group">
            <svg className="absolute inset-0 spin-slow" viewBox="0 0 200 200">
              <defs>
                <path id="ring" d="M 100, 100 m -78, 0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
              </defs>
              <text className="font-mono fill-white/70" fontSize="12" letterSpacing="6">
                <textPath href="#ring">SCROLL — EXPLORE — SCROLL — EXPLORE — </textPath>
              </text>
            </svg>
            <span className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
              <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

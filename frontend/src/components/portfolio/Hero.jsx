import React, { useContext, useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { SiteContext } from "./Portfolio";
import { DEFAULT_CONTENT, UI_TRANSLATIONS } from "../../mock";
import ScrambleText from "./ScrambleText";

const Hero = () => {
  const context = useContext(SiteContext) || {};
  const hero = context.hero || DEFAULT_CONTENT.hero;
  const translations = context.translations || UI_TRANSLATIONS.fr;
  const bgRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      bgRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="hero" className="relative min-h-[92vh] md:min-h-screen w-full overflow-hidden noise bg-[#0b0b0b]">
      {/* Ambient breathing halo glows & technical coordinate grid */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-0 transition-transform duration-500 ease-out will-change-transform pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[520px] rounded-full bg-white/[0.04] blur-[150px] halo-breathe pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-white/[0.025] blur-[120px] float-1" />
        <div className="absolute bottom-10 right-10 w-[480px] h-[480px] rounded-full bg-white/[0.02] blur-[100px] float-2" />

        {/* Minimal grid & axis markings */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <circle cx="1180" cy="240" r="280" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="1180" cy="240" r="160" stroke="white" strokeWidth="0.5" />
          <line x1="0" y1="740" x2="1440" y2="740" stroke="white" strokeWidth="0.5" />
          <line x1="180" y1="0" x2="180" y2="900" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1640px] px-6 md:px-10 pt-24 md:pt-32 pb-20 min-h-[90vh] md:min-h-screen flex flex-col justify-between">
        {/* Top Meta info */}
        <div className="flex flex-wrap items-start justify-between gap-6 reveal in-view">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 cursor-pointer">
              <span className="text-white/80 font-sans font-medium">{translations.portfolio}</span>
              <span className="mx-2 text-white/20">/</span>
              <ScrambleText text={hero.role || "UI Designer & Scripter"} />
            </div>
          </div>
        </div>

        {/* Headline Typography (Bachuki style editorial pairing) */}
        <div className="my-auto py-12 md:py-16">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 mb-4 flex items-center gap-2 cursor-pointer">
            <span className="w-6 h-px bg-white/30" />
            <ScrambleText text={`Bonjour, je suis ${hero.name || "Censure"}`} />
          </div>

          <h1 className="leading-[0.88] tracking-[-0.04em] text-[13vw] md:text-[10.5vw] lg:text-[9.2vw] text-white">
            <span className="block font-sans font-bold tracking-tighter reveal in-view hover:translate-x-2 transition-transform duration-300">
              {hero.headlineLine1 || "Designer"}
            </span>
            <span className="block pl-[4vw] md:pl-[6vw] reveal in-view">
              <span className="font-serif italic font-normal tracking-tight text-white/90 glow-title inline-block hover:scale-[1.02] transition-transform duration-300">
                {hero.headlineLine2 || "l'interface."}
              </span>
            </span>
            <span className="block font-sans font-bold tracking-tighter reveal in-view hover:translate-x-2 transition-transform duration-300">
              {hero.headlineLine3 || "Scripter"}
            </span>
            <span className="block pl-[8vw] md:pl-[12vw] reveal in-view">
              <span className="font-serif italic font-normal tracking-tight text-white/90 glow-title inline-block hover:scale-[1.02] transition-transform duration-300">
                {hero.headlineLine4 || "l'expérience."}
              </span>
            </span>
          </h1>
        </div>

        {/* Bottom bar with intro paragraph and scroll ring */}
        <div className="flex flex-wrap items-end justify-between gap-10 pt-8 border-t border-white/[0.07]">
          <div className="max-w-lg space-y-2 reveal in-view">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Roblox Studio &bull; Luau &bull; Figma
            </div>
            <p className="text-white/60 text-sm md:text-base leading-relaxed font-sans font-light">
              {translations.heroIntro}
            </p>
          </div>

          <a
            href="#about"
            data-cursor="hover"
            className="relative w-[130px] h-[130px] flex items-center justify-center group select-none shrink-0"
            aria-label="Défiler vers la section À propos"
          >
            <svg className="absolute inset-0 spin-slow" viewBox="0 0 200 200">
              <defs>
                <path id="ring" d="M 100, 100 m -76, 0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0" />
              </defs>
              <text className="font-mono fill-white/50 group-hover:fill-white text-[11px] tracking-[5px] transition-colors">
                <textPath href="#ring">{translations.scroll}{translations.scroll}</textPath>
              </text>
            </svg>
            <span className="w-12 h-12 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
              <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

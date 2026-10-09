import React, { useContext, useEffect, useState } from "react";
import {
  Terminal as TerminalIcon,
  Sparkles,
  GraduationCap,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { SiteContext } from "./Portfolio";
import { DEFAULT_CONTENT, UI_TRANSLATIONS } from "../../mock";
import ScrambleText from "./ScrambleText";
import { sound } from "../../lib/sound";

const FAQ_ITEMS = [
  {
    q: "Qu’est-ce que je recherche ?",
    a: "Je recherche des collaborations stimulantes sur Roblox et au-delà : jeux PvP, univers d'exploration, projets communautaires exigeants où la qualité du design fait la différence.",
  },
  {
    q: "Qu’est-ce que j’apporte concrètement à une équipe ?",
    a: "La couture complète entre Figma et Roblox : des maquettes interactives testées en amont, une intégration UI au pixel près, et des scripts Luau propres et performants.",
  },
  {
    q: "Comment est-ce que je travaille sur un projet ?",
    a: "Étape par étape : analyse du gameplay, prototypage des parcours dans Figma, validation du style visuel, puis intégration dans Roblox Studio avec animations TweenService calibrées à la frame.",
  },
  {
    q: "Quelle est ma vision du design & du gameplay ?",
    a: "Ce qui est beau doit être jouable, ce qui est jouable doit être beau. Une bonne interface ne se contente pas d'informer : elle plonge le joueur dans l'univers.",
  },
];

const About = () => {
  const context = useContext(SiteContext) || {};
  const about = context.about || DEFAULT_CONTENT.about;
  const translations = context.translations || UI_TRANSLATIONS.fr;
  const [printed, setPrinted] = useState([]);
  const [done, setDone] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    setPrinted([]);
    setDone(false);
    const timers = [];
    let observer;
    const start = () => {
      about.terminalLines.forEach((line, i) => {
        const t = setTimeout(() => {
          setPrinted((p) => [...p, line]);
          if (i === about.terminalLines.length - 1) setDone(true);
        }, i * 340);
        timers.push(t);
      });
    };
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    const el = document.getElementById("about");
    if (el) observer.observe(el);
    return () => {
      timers.forEach(clearTimeout);
      observer && observer.disconnect();
    };
  }, [about.terminalLines]);

  const runCommand = (cmd) => {
    sound.playClick();
    if (cmd === "clear") {
      setPrinted([]);
      setDone(true);
      return;
    }
    if (cmd === "whoami") {
      setPrinted((prev) => [...prev, "$ whoami", "censure — développeur roblox & ui designer"]);
    } else if (cmd === "stack") {
      setPrinted((prev) => [...prev, "$ stack --core", "luau · roblox studio · roact · figma · tweenservice"]);
    } else if (cmd === "contact") {
      setPrinted((prev) => [...prev, "$ contact", "discord : cen_sure (dispo pour collaborations)"]);
    }
    setDone(true);
  };

  const toggleFaq = (idx) => {
    sound.playSwitch();
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section id="about" className="relative w-full py-28 md:py-36 bg-[#0b0b0b]">
      <div className="mx-auto max-w-[1640px] px-6 md:px-10">
        {/* Section Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-doto text-base text-white/50 glow-number">01</span>
          <span className="w-6 h-px bg-white/20" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 cursor-pointer">
            <ScrambleText text={translations.aboutEyebrow || "À propos"} />
          </span>
        </div>

        {/* Section Heading (Bachuki style editorial serif title) */}
        <div className="mb-14 md:mb-20">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold tracking-tight text-white leading-[1.05]">
            {translations.aboutTitleBefore || "À propos "}
            <span className="font-serif italic font-normal text-white/90 glow-title inline-block">
              {translations.aboutTitleEmphasis || "de moi,"}
            </span>
            {translations.aboutTitleAfter || ""}
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          {/* Bento Card 1: Bio & Vision (7 cols) */}
          <div className="lg:col-span-7 luxury-card p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6 cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 text-white/60" />
                <ScrambleText text="Démarche & Vision" />
              </div>
              <div className="space-y-5 text-white/75 text-base md:text-lg leading-relaxed font-light">
                {about.bio.map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Key Meta Metrics */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {about.meta.map((m) => (
                <div key={m.k} className="space-y-1.5 cursor-pointer">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    <ScrambleText text={m.k} />
                  </div>
                  <div className="text-white font-sans font-medium text-sm md:text-base">
                    {m.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bento Card 2: Interactive Terminal (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="luxury-card overflow-hidden flex flex-col flex-1">
              {/* Terminal Chrome Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">
                  <TerminalIcon className="w-3 h-3 text-white/30" />
                  <ScrambleText text="~/censure — zsh" />
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-6 font-mono text-xs md:text-sm text-white/80 min-h-[280px] flex-1 flex flex-col justify-between leading-relaxed bg-[#0e0e11]">
                <div className="space-y-2">
                  {printed.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.startsWith("$")
                          ? "text-white font-medium flex items-center gap-2"
                          : "text-white/60 pl-4 border-l border-white/10"
                      }
                    >
                      {line}
                    </div>
                  ))}
                  <span className="caret inline-block w-2 h-3.5 bg-white align-middle ml-1" />
                </div>

                {done && (
                  <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2.5">
                    <div className="text-[11px] text-emerald-400/80 font-mono flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{translations.processInactive || "Session active"}</span>
                      </div>
                      <span className="text-[10px] text-white/30">clique une commande</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { label: "whoami", cmd: "whoami" },
                        { label: "stack", cmd: "stack" },
                        { label: "contact", cmd: "contact" },
                        { label: "clear", cmd: "clear" },
                      ].map((item) => (
                        <button
                          key={item.cmd}
                          type="button"
                          onClick={() => runCommand(item.cmd)}
                          className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/15 border border-white/10 text-[10px] font-mono text-white/70 hover:text-white transition-all active:scale-95"
                        >
                          ${item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bento Card 3: Formation / Études */}
            <div className="luxury-card p-6 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    <ScrambleText text={translations.currentStudy || "Études actuelles"} />
                  </div>
                  <div className="text-white font-medium text-sm md:text-base mt-0.5">
                    {about.study || "Réseaux et Télécommunications"}
                  </div>
                </div>
              </div>
              <span className="font-mono text-[11px] text-white/40 border border-white/10 px-2.5 py-1 rounded-full group-hover:border-white/30 transition-colors">
                IUT
              </span>
            </div>
          </div>
        </div>

        {/* Bachuki-style Accordion: Réponses à vos questions */}
        <div className="luxury-card p-8 md:p-12">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 mb-8 cursor-pointer">
            <HelpCircle className="w-3.5 h-3.5 text-white/60" />
            <ScrambleText text="Réponses à vos questions" />
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-white/20 bg-white/[0.03]"
                      : "border-white/[0.07] hover:border-white/15 bg-transparent"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-white text-base md:text-lg font-medium tracking-tight font-sans"
                  >
                    <span>{item.q}</span>
                    <span
                      className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 ml-4 transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-white text-black" : "text-white/60"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-white/65 text-sm md:text-base leading-relaxed font-light animate-in fade-in duration-200">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

import React, { useContext } from "react";
import { Layout, Terminal, Sparkles } from "lucide-react";
import { SiteContext } from "./Portfolio";
import { DEFAULT_CONTENT, UI_TRANSLATIONS } from "../../mock";
import ScrambleText from "./ScrambleText";

const MarqueeRow = ({ items, animClass, outline = false }) => {
  if (!items || items.length === 0) return null;
  const loop = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden whitespace-nowrap py-1">
      <div className={`inline-flex ${animClass}`}>
        {loop.map((s, i) => (
          <span
            key={i}
            className={`font-sans font-bold tracking-tight text-[10vw] md:text-[7vw] leading-[1] mx-6 md:mx-10 select-none ${
              outline ? "text-outline opacity-70" : "text-white/90"
            }`}
          >
            {s}
            <span className="inline-block mx-6 md:mx-10 align-middle text-white/20 text-[6vw] font-light">
              &bull;
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

const Skills = () => {
  const context = useContext(SiteContext) || {};
  const skillsRow1 = context.skillsRow1 || DEFAULT_CONTENT.skillsRow1;
  const skillsRow2 = context.skillsRow2 || DEFAULT_CONTENT.skillsRow2;
  const skillsRow3 = context.skillsRow3 || DEFAULT_CONTENT.skillsRow3;
  const translations = context.translations || UI_TRANSLATIONS.fr;

  const categories = [
    {
      num: "01",
      title: "Interface & Systèmes UI",
      desc: "Conception de maquettes haute-fidélité dans Figma, ergonomie des HUD et intégration au pixel près sur Roblox.",
      icon: Layout,
      tags: skillsRow1 || ["Design d'interface", "Figma", "Systèmes UI", "Prototypage"],
    },
    {
      num: "02",
      title: "Scripting & Architecture Luau",
      desc: "Développement orienté objet et modulaire sous Luau : TweenService fluide, Roact, gestion des lobbies et logique in-game.",
      icon: Terminal,
      tags: skillsRow2 || ["Luau", "Roblox Studio", "TweenService", "Roact", "Animations"],
    },
    {
      num: "03",
      title: "Direction Artistique & Game Feel",
      desc: "Création d'une identité forte pour chaque univers : typographies sur mesure, effets d'ambiance et micro-animations.",
      icon: Sparkles,
      tags: skillsRow3 || ["Direction artistique", "Motion", "Game Design", "UX Produit"],
    },
  ];

  return (
    <section id="skills" className="relative w-full py-28 md:py-36 bg-[#0b0b0b] overflow-hidden">
      {/* Ambient background halo */}
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[140px] halo-breathe pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1640px] px-6 md:px-10">
        {/* Section Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-doto text-base text-white/50 glow-number">03</span>
          <span className="w-6 h-px bg-white/20" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 cursor-pointer">
            <ScrambleText text={translations.skillsEyebrow || "Compétences"} />
          </span>
        </div>

        {/* Section Heading */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold tracking-tight text-white leading-[1.05]">
            Mes{" "}
            <span className="font-serif italic font-normal text-white/90 glow-title inline-block">
              compétences,
            </span>
          </h2>
          <p className="mt-4 text-white/50 text-sm md:text-base max-w-lg font-light">
            Une boîte à outils affûtée au fil des années pour donner vie à des expériences Roblox percutantes et mémorables.
          </p>
        </div>

        {/* Categorized Bento Cards (Bachuki style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.num}
                className="luxury-card p-8 flex flex-col justify-between hover:-translate-y-2 transition-all duration-500"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-doto text-3xl font-bold text-white glow-number">
                      {cat.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-sans text-xl font-bold text-white tracking-tight mb-3">
                    <ScrambleText text={cat.title} />
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed font-light mb-8">
                    {cat.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-6 border-t border-white/10">
                  {cat.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/75 hover:border-white/30 transition-colors cursor-pointer"
                    >
                      <ScrambleText text={tag} />
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Infinite Marquee Rows */}
      <div className="space-y-1 my-10 overflow-hidden border-y border-white/[0.07] py-6 bg-white/[0.01]">
        {skillsRow1 && <MarqueeRow items={skillsRow1} animClass="marquee-track-l" />}
        {skillsRow2 && <MarqueeRow items={skillsRow2} animClass="marquee-track-r" outline />}
        {skillsRow3 && <MarqueeRow items={skillsRow3} animClass="marquee-track-slow" />}
      </div>
    </section>
  );
};

export default Skills;

import React, { useContext } from "react";
import { SiteContext } from "./Portfolio";

const Row = ({ items, animClass, outline = false }) => {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className={`inline-flex ${animClass}`}>
        {loop.map((s, i) => (
          <span
            key={i}
            className={`font-display font-semibold tracking-[-0.04em] text-[14vw] md:text-[10vw] leading-[0.95] mx-8 md:mx-12 ${
              outline ? "text-outline" : "text-white"
            }`}
          >
            {s}
            <span className="inline-block mx-6 md:mx-10 align-middle text-white/40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const Skills = () => {
  const { skillsRow1, skillsRow2, skillsRow3, translations } = useContext(SiteContext);
  return (
    <section id="skills" className="relative w-full py-28 md:py-40">
      <div className="mx-auto max-w-[1640px] px-6 md:px-10">
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 mb-10">
          <span className="w-8 h-px bg-white/40" />
          {translations.skillsEyebrow}
        </div>
      </div>

      <div className="space-y-2 md:space-y-3">
        <Row items={skillsRow1} animClass="marquee-track-l" />
        <Row items={skillsRow2} animClass="marquee-track-r" outline />
        <Row items={skillsRow3} animClass="marquee-track-slow" />
      </div>

      <div className="mx-auto max-w-[1640px] px-6 md:px-10 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/60 text-sm md:text-base">
        <p>
          Une boîte à outils assemblée au fil des années — affûtée par la pratique. Les outils changent ; le goût s'accumule.
        </p>
        <p className="md:col-start-3 md:text-right">
          Toujours en train d'apprendre. En ce moment : Roact avancé, animations chaînées, et game feel.
        </p>
      </div>
    </section>
  );
};

export default Skills;

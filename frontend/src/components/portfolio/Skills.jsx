import React from "react";
import { SKILLS_ROW_1, SKILLS_ROW_2, SKILLS_ROW_3 } from "../../mock";

const Row = ({ items, animClass, outline = false }) => {
  // Duplicate the items for seamless loop
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
  return (
    <section id="skills" className="relative w-full py-28 md:py-40">
      <div className="mx-auto max-w-[1640px] px-6 md:px-10">
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 mb-10">
          <span className="w-8 h-px bg-white/40" />
          (03) Expertise
        </div>
      </div>

      <div className="space-y-2 md:space-y-3">
        <Row items={SKILLS_ROW_1} animClass="marquee-track-l" />
        <Row items={SKILLS_ROW_2} animClass="marquee-track-r" outline />
        <Row items={SKILLS_ROW_3} animClass="marquee-track-slow" />
      </div>

      <div className="mx-auto max-w-[1640px] px-6 md:px-10 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/60 text-sm md:text-base">
        <p>
          A toolkit assembled across years — sharpened on shipping. Tools change; taste compounds.
        </p>
        <p className="md:col-start-3 md:text-right">
          Always learning. Currently dabbling in shaders, spatial UI, and on-device AI affordances.
        </p>
      </div>
    </section>
  );
};

export default Skills;

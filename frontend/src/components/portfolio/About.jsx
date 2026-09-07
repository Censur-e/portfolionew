import React, { useContext, useEffect, useState } from "react";
import { SiteContext } from "./Portfolio";

const About = () => {
  const { about, translations } = useContext(SiteContext);
  const [printed, setPrinted] = useState([]);
  const [done, setDone] = useState(false);

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
        }, i * 380);
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
      { threshold: 0.3 }
    );
    const el = document.getElementById("about");
    if (el) observer.observe(el);
    return () => {
      timers.forEach(clearTimeout);
      observer && observer.disconnect();
    };
  }, [about.terminalLines]);

  return (
    <section id="about" className="relative w-full py-32 md:py-44">
      <div className="mx-auto max-w-[1640px] px-6 md:px-10">
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 mb-12">
          <span className="w-8 h-px bg-white/40" />
          {translations.aboutEyebrow}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 lg:col-start-1">
            <div className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
              <h2 className="font-display text-white text-4xl md:text-6xl font-semibold leading-[0.95] tracking-[-0.03em]">
                {translations.aboutTitleBefore}
                <span className="text-outline">{translations.aboutTitleEmphasis}</span>
                {translations.aboutTitleAfter}
              </h2>
              <div className="mt-8 space-y-5 max-w-2xl">
                {about.bio.map((p, i) => (
                  <p key={i} className="text-white/70 text-base md:text-lg leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {about.meta.map((m) => (
                  <div key={m.k}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{m.k}</div>
                    <div className="mt-2 text-white text-sm md:text-base">{m.v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{translations.currentStudy}</div>
                <div className="mt-2 text-white text-sm md:text-base">{about.study}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:mt-16">
            <div className="rounded-2xl border border-white/10 bg-black overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">~/censure — zsh</span>
              </div>
              <div className="p-6 font-mono text-sm text-white/85 min-h-[360px] leading-relaxed">
                {printed.map((line, i) => (
                  <div key={i} className={line.startsWith("$") ? "text-white" : "text-white/60 pl-3"}>
                    {line}
                  </div>
                ))}
                <span className="caret inline-block w-2 h-4 align-middle bg-white ml-1" aria-hidden="true" />
                {done && (
                  <div className="mt-4 text-white/30 text-[11px]">{translations.processInactive}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

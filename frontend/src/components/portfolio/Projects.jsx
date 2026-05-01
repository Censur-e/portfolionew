import React, { useContext, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteContext } from "./Portfolio";

const Projects = () => {
  const { projects } = useContext(SiteContext);
  const scrollerRef = useRef(null);

  const onWheel = (e) => {
    if (!scrollerRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <section id="work" className="relative w-full py-28 md:py-40">
      <div className="mx-auto max-w-[1640px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 mb-6">
              <span className="w-8 h-px bg-white/40" />
              (02) Travaux
            </div>
            <h2 className="font-display text-white text-5xl md:text-7xl lg:text-[8.5vw] font-semibold leading-[0.9] tracking-[-0.04em]">
              Ce que j&rsquo;ai <br className="hidden md:block" />
              <span className="text-outline">conçu &amp; lancé.</span>
            </h2>
          </div>
          <p className="max-w-sm text-white/55 text-sm md:text-base">
            Une sélection de travaux récents — lobbies, HUD, identités, intros narratives. Glisse, scrolle ou swipe.
          </p>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onWheel={onWheel}
        className="mt-14 md:mt-20 flex gap-6 md:gap-10 overflow-x-auto no-scrollbar px-6 md:px-10 pb-10 snap-x snap-mandatory"
      >
        {projects.map((p) => (
          <article
            key={p.id}
            data-cursor="hover"
            className="project-card group relative shrink-0 w-[88vw] md:w-[68vw] lg:w-[56vw] xl:w-[46vw] snap-center"
          >
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[16/10] bg-white/5">
              <img src={p.image} alt={p.title} className="project-img w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute top-5 left-6 right-6 flex items-start justify-between text-white/80">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em]">{p.index} / {String(projects.length).padStart(2, "0")}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em]">{p.year}</span>
              </div>
              <div className="absolute bottom-5 left-6 right-6">
                <h3 className="project-title font-display text-white font-semibold text-4xl md:text-6xl tracking-[-0.04em] leading-[0.95]">
                  {p.title}
                </h3>
              </div>
            </div>

            <div className="mt-6 flex items-start justify-between gap-6">
              <div>
                <div className="text-white text-base md:text-lg">{p.subtitle}</div>
                <div className="mt-1 text-white/50 text-sm">{p.description}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/15 text-white/65">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href="#contact"
                data-cursor="hover"
                className="shrink-0 mt-1 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-black transition-colors"
                aria-label={`Ouvrir ${p.title}`}
              >
                <ArrowUpRight className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </article>
        ))}
        <div className="shrink-0 w-[20vw]" aria-hidden="true" />
      </div>
    </section>
  );
};

export default Projects;

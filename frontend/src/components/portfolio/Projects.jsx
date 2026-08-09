import React, { useContext, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteContext } from "./Portfolio";

// Convert YouTube / Vimeo watch URLs to embed URLs
const toEmbedUrl = (raw) => {
  if (!raw) return "";
  try {
    const url = new URL(raw);
    // YouTube full
    if (url.hostname.includes("youtube.com") && url.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${url.searchParams.get("v")}?autoplay=0&rel=0`;
    }
    // youtu.be short
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
    }
    // Vimeo
    if (url.hostname.includes("vimeo.com") && !url.hostname.includes("player")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return raw; // already an embed URL or other
  } catch (e) {
    return raw;
  }
};

const ProjectMedia = ({ project }) => {
  const { image, mediaType = "image", title } = project;

  if (mediaType === "video") {
    return (
      <video
        src={image}
        className="project-img w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }
  if (mediaType === "embed") {
    return (
      <iframe
        src={toEmbedUrl(image)}
        title={title}
        className="project-img w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <img
      src={image}
      alt={title}
      className="project-img w-full h-full object-cover"
      loading="lazy"
    />
  );
};

const Projects = () => {
  const { projects } = useContext(SiteContext);
  const scrollerRef = useRef(null);
  const [category, setCategory] = useState("created");

  // Split by category (default undefined = "created")
  const filtered = useMemo(
    () => projects.filter((p) => (p.category || "created") === category),
    [projects, category]
  );

  const onWheel = (e) => {
    if (!scrollerRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollerRef.current.scrollLeft += e.deltaY;
    }
  };

  const tabs = [
    { key: "created", label: "Mes créations" },
    { key: "collab", label: "Collaborations" },
  ];

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

        {/* Toggle Créations / Collaborations */}
        <div className="mt-10 md:mt-14 inline-flex items-center gap-1 rounded-full border border-white/15 p-1 bg-white/[0.02]">
          {tabs.map((t) => {
            const active = category === t.key;
            const count = projects.filter((p) => (p.category || "created") === t.key).length;
            return (
              <button
                key={t.key}
                onClick={() => setCategory(t.key)}
                data-cursor="hover"
                className={`px-5 md:px-7 py-2.5 rounded-full text-sm md:text-base transition-colors flex items-center gap-2 ${
                  active
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                    active ? "bg-black/15 text-black" : "bg-white/10 text-white/60"
                  }`}
                >
                  {String(count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mx-auto max-w-[1640px] px-6 md:px-10 mt-12">
          <p className="text-white/40 text-sm">Aucun projet dans cette catégorie pour le moment.</p>
        </div>
      ) : (
        <div
          ref={scrollerRef}
          onWheel={onWheel}
          className="mt-14 md:mt-20 flex gap-6 md:gap-10 overflow-x-auto no-scrollbar px-6 md:px-10 pb-10 snap-x snap-mandatory"
        >
          {filtered.map((p, i) => (
            <article
              key={p.id}
              data-cursor="hover"
              className="project-card group relative shrink-0 w-[88vw] md:w-[68vw] lg:w-[56vw] xl:w-[46vw] snap-center"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[16/10] bg-white/5">
                <ProjectMedia project={p} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                <div className="absolute top-5 left-6 right-6 flex items-start justify-between text-white/80">
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em]">
                    {String(i + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
                  </span>
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
                      <span
                        key={t}
                        className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/15 text-white/65"
                      >
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
      )}
    </section>
  );
};

export default Projects;

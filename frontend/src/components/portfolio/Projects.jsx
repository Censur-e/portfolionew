import React, { useContext, useMemo, useState } from "react";
import { ArrowUpRight, Play, ExternalLink, Maximize2 } from "lucide-react";
import { SiteContext } from "./Portfolio";
import { sound } from "../../lib/sound";
import { DEFAULT_CONTENT, UI_TRANSLATIONS } from "../../mock";
import ScrambleText from "./ScrambleText";
import ProjectModal from "./ProjectModal";

// Convert YouTube / Vimeo watch URLs to embed URLs
const toEmbedUrl = (raw) => {
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.hostname.includes("youtube.com") && url.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${url.searchParams.get("v")}?autoplay=0&rel=0`;
    }
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
    }
    if (url.hostname.includes("vimeo.com") && !url.hostname.includes("player")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return raw;
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
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      loading="lazy"
    />
  );
};

const Projects = () => {
  const context = useContext(SiteContext) || {};
  const projects = Array.isArray(context.projects) ? context.projects : DEFAULT_CONTENT.projects;
  const translations = context.translations || UI_TRANSLATIONS.fr;
  const [category, setCategory] = useState("created");
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = useMemo(
    () => projects.filter((p) => (p.category || "created") === category),
    [projects, category]
  );

  const tabs = [
    { key: "created", label: translations.createdProjects || "Mes créations" },
    { key: "collab", label: translations.collabProjects || "Collaborations" },
  ];

  const handleTabChange = (key) => {
    sound.playSwitch();
    setCategory(key);
  };

  return (
    <section id="work" className="relative w-full py-28 md:py-36 bg-[#0b0b0b] overflow-hidden">
      {/* Ambient background halo */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.025] blur-[150px] halo-breathe pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1640px] px-6 md:px-10">
        {/* Section Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-doto text-base text-white/50 glow-number">02</span>
          <span className="w-6 h-px bg-white/20" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 cursor-pointer">
            <ScrambleText text={translations.projectsEyebrow || "Projets"} />
          </span>
        </div>

        {/* Section Heading & Category Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 md:mb-20">
          <div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold tracking-tight text-white leading-[1.05]">
              {translations.projectsTitleBefore || "Mes "}
              <span className="font-serif italic font-normal text-white/90">
                {translations.projectsTitleEmphasis || "projets,"}
              </span>
            </h2>
            <p className="mt-4 text-white/50 text-sm md:text-base max-w-lg font-light">
              {translations.projectsIntro ||
                "Une sélection de travaux récents — interfaces Roblox, HUD, lobbies compétitifs et systèmes visuels."}
            </p>
          </div>

          {/* Frosted Glass Tabs */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 self-start lg:self-end">
            {tabs.map((t) => {
              const active = category === t.key;
              const count = projects.filter((p) => (p.category || "created") === t.key).length;
              return (
                <button
                  key={t.key}
                  onClick={() => handleTabChange(t.key)}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-sans transition-all flex items-center gap-2.5 ${
                    active
                      ? "bg-white text-black font-semibold shadow-md"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{t.label}</span>
                  <span
                    className={`font-doto text-[11px] px-1.5 py-0.5 rounded-md ${
                      active ? "bg-black/15 text-black font-bold" : "bg-white/10 text-white/50"
                    }`}
                  >
                    {String(count).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid (Bachuki Style Luxury Cards) */}
        {filtered.length === 0 ? (
          <div className="luxury-card p-12 text-center text-white/40 font-mono text-sm">
            {translations.emptyProjects || "Aucun projet dans cette catégorie pour le moment."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {filtered.map((p, i) => (
              <article
                key={p.id || i}
                className="luxury-card group overflow-hidden flex flex-col justify-between transition-all hover:border-white/30"
              >
                {/* Media Container with Click to Expand */}
                <div
                  onClick={() => {
                    sound.playPop();
                    setSelectedProject(p);
                  }}
                  className="relative aspect-[16/10] overflow-hidden bg-black/40 border-b border-white/10 cursor-pointer"
                >
                  <ProjectMedia project={p} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                  {/* Top floating badges */}
                  <div className="absolute top-4 left-5 right-5 flex items-center justify-between pointer-events-none">
                    <span className="font-doto text-base text-white font-bold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 glow-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[11px] text-white/80 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15">
                      {p.year || "2025"}
                    </span>
                  </div>

                  {/* In-Media Title */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1">
                      {p.role || "Roblox & UI"}
                    </div>
                    <h3 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      <ScrambleText text={p.title} />
                    </h3>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between gap-6">
                  <div>
                    {p.subtitle && (
                      <div className="font-serif italic text-lg text-white/90 mb-2">
                        {p.subtitle}
                      </div>
                    )}
                    <p className="text-white/60 text-sm leading-relaxed font-light">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags?.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:border-white/30 transition-colors cursor-pointer"
                        >
                          <ScrambleText text={t} />
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          sound.playPop();
                          setSelectedProject(p);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 active:scale-95"
                        title="Ouvrir la vue détaillée"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Aperçu</span>
                      </button>

                      <a
                        href="#contact"
                        onClick={() => sound.playClick()}
                        className="inline-flex items-center gap-1 text-xs font-mono text-white/60 hover:text-white transition-colors"
                      >
                        <span>Contact</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Immersive Project Modal */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            allProjects={filtered}
            onClose={() => setSelectedProject(null)}
            onSelectProject={setSelectedProject}
          />
        )}
      </div>
    </section>
  );
};

export default Projects;

import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, ArrowUpRight, Calendar, Sparkles, Layers } from "lucide-react";
import { sound } from "../../lib/sound";
import ScrambleText from "./ScrambleText";

// YouTube / Vimeo embed URL converter
const toEmbedUrl = (raw) => {
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.hostname.includes("youtube.com") && url.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${url.searchParams.get("v")}?autoplay=1&rel=0`;
    }
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.hostname.includes("vimeo.com") && !url.hostname.includes("player")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return raw;
  } catch (e) {
    return raw;
  }
};

export const ProjectModal = ({
  project,
  allProjects,
  onClose,
  onSelectProject,
}) => {
  const currentIndex = allProjects.findIndex((p) => (p.id || p.title) === (project?.id || project?.title));

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      sound.playSwitch();
      onSelectProject(allProjects[currentIndex - 1]);
    }
  }, [currentIndex, allProjects, onSelectProject]);

  const handleNext = useCallback(() => {
    if (currentIndex < allProjects.length - 1) {
      sound.playSwitch();
      onSelectProject(allProjects[currentIndex + 1]);
    }
  }, [currentIndex, allProjects, onSelectProject]);

  // Keyboard navigation, lock body scroll & add modal-open class
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        sound.playPop();
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove("modal-open");
    };
  }, [onClose, handlePrev, handleNext]);

  if (!project) return null;

  const { title, subtitle, description, year, role, tags = [], image, mediaType = "image" } = project;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playPop();
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col luxury-card bg-[#111111] border border-white/20 shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="font-doto text-base text-white/60 glow-number font-bold">
              {String(currentIndex + 1).padStart(2, "0")} / {String(allProjects.length).padStart(2, "0")}
            </span>
            <span className="w-4 h-px bg-white/20" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
              {role || "UI & Roblox"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev / Next controls */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              aria-label="Projet précédent"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition disabled:opacity-20 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= allProjects.length - 1}
              aria-label="Projet suivant"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition disabled:opacity-20 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-white/15 mx-1" />
            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              aria-label="Fermer la vue détaillée"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          {/* Media Player / Container */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-black/60 border border-white/10 shadow-inner">
            {mediaType === "video" ? (
              <video
                src={image}
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
              />
            ) : mediaType === "embed" ? (
              <iframe
                src={toEmbedUrl(image)}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Titles & Meta */}
          <div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-white/30" />
                <span>{year || "2025"}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-white/30" />
                <span>{project.category === "collab" ? "Collaboration" : "Création Personnelle"}</span>
              </span>
            </div>

            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              <ScrambleText text={title} />
            </h2>
            {subtitle && (
              <p className="font-serif italic text-xl sm:text-2xl text-white/80 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 text-white/70 text-sm sm:text-base leading-relaxed font-light">
            {description}
          </div>

          {/* Tags */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-white/40" />
              <span>Technologies & Spécialités</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs font-mono uppercase tracking-[0.15em] text-white/80"
                >
                  <ScrambleText text={t} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-xs text-white/40 hidden sm:inline">
            Appuyez sur <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 text-[10px]">Échap</kbd> pour fermer
          </span>

          <a
            href="#contact"
            onClick={() => {
              sound.playClick();
              onClose();
              const el = document.getElementById("contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-black font-sans font-medium text-xs sm:text-sm hover:bg-white/90 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <span>Discuter d'un projet similaire</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;

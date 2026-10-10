import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Home,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Mail,
} from "lucide-react";
import { sound } from "../../lib/sound";
import { SiteContext } from "./Portfolio";

const SECTIONS = [
  { id: "hero", label: "accueil" },
  { id: "about", label: "à-propos" },
  { id: "work", label: "projets" },
  { id: "skills", label: "compétences" },
  { id: "contact", label: "contact" },
];

export const BrowserDock = ({ translations, language, changeLanguage }) => {
  const context = useContext(SiteContext) || {};
  const pseudo = (context.hero?.name || "censure").toLowerCase();

  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMuted] = useState(() => sound.isMuted());
  const dockRef = useRef(null);
  const popupRef = useRef(null);

  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Light dismiss popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen &&
        dockRef.current &&
        !dockRef.current.contains(e.target) &&
        popupRef.current &&
        !popupRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const scrollToSection = (id) => {
    sound.playClick();
    setMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navigateRelative = (dir) => {
    sound.playClick();
    const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
    const nextIndex = Math.max(0, Math.min(SECTIONS.length - 1, currentIndex + dir));
    scrollToSection(SECTIONS[nextIndex].id);
  };

  const toggleSound = () => {
    const newMuted = sound.toggleMute();
    setMuted(newMuted);
  };

  const toggleLanguage = () => {
    sound.playSwitch();
    changeLanguage(language === "fr" ? "en" : "fr");
  };

  const activeObj = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  return (
    <div
      ref={dockRef}
      className="browser-dock-container fixed left-1/2 z-50 select-none animate-dock-entrance w-[calc(100%-20px)] sm:w-auto max-w-[calc(100vw-20px)] sm:max-w-none"
    >
      {/* Floating Anchor & Settings Popup (Frosted Glass with Pure Categories) */}
      {menuOpen && (
        <div
          ref={popupRef}
          className="browser-dock-popup absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] max-w-[280px] p-2 text-white text-xs animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="space-y-1">
            {SECTIONS.map((sec) => {
              const isCur = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all font-mono text-xs text-left ${
                    isCur
                      ? "bg-white/20 text-white font-semibold shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-white/30 text-[11px]">#</span>
                    <span className="capitalize">{sec.label}</span>
                  </span>
                  {isCur && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Dock Capsule (Enlarged Luxury Base) */}
      <nav
        aria-label="Barre de navigation principale"
        className="browser-dock w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1 sm:gap-2.5 p-1 sm:p-2.5 text-white shadow-2xl"
      >
        {/* Home Button to return to top */}
        <button
          type="button"
          onClick={() => scrollToSection("hero")}
          title="Retour au début"
          aria-label="Retour au début de la page"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-[14px] flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-white/80 hover:text-white active:scale-95 transition-all shrink-0"
        >
          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Previous / Next Arrow Controls */}
        <div className="hidden sm:flex items-center bg-white/[0.06] border border-white/10 rounded-[14px] p-1 shrink-0">
          <button
            type="button"
            onClick={() => navigateRelative(-1)}
            disabled={activeSection === SECTIONS[0].id}
            title="Section précédente"
            aria-label="Section précédente"
            className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <div className="w-px h-3.5 bg-white/15 mx-0.5" />
          <button
            type="button"
            onClick={() => navigateRelative(1)}
            disabled={activeSection === SECTIONS[SECTIONS.length - 1].id}
            title="Section suivante"
            aria-label="Section suivante"
            className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Address Bar Capsule with dynamic pseudo.lol / #... */}
        <button
          type="button"
          onClick={() => {
            sound.playSwitch();
            setMenuOpen(!menuOpen);
          }}
          className={`flex items-center justify-between gap-1.5 sm:gap-3 px-2 sm:px-5 py-2 sm:py-2.5 rounded-[10px] sm:rounded-[14px] text-xs font-sans transition-all duration-200 border min-w-0 flex-1 sm:flex-initial sm:min-w-[240px] md:min-w-[260px] ${
            menuOpen
              ? "bg-white/20 border-white/25 text-white"
              : "bg-white/[0.08] hover:bg-white/[0.14] border-white/10 text-white/90"
          }`}
          title="Ouvrir le menu de navigation"
        >
          <span className="font-mono text-[10px] sm:text-xs tracking-tight flex items-center gap-1 sm:gap-1.5 min-w-0 truncate">
            <span className="text-white font-semibold shrink-0">{pseudo}.lol</span>
            <span className="text-white/30 shrink-0">/</span>
            <span className="text-white/40 font-mono shrink-0">#</span>
            <span className="text-white font-medium truncate">{activeObj.label}</span>
          </span>
          <span
            className={`ml-0.5 sm:ml-1 text-[10px] sm:text-[11px] text-white/40 shrink-0 transition-transform duration-200 ${
              menuOpen ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>

        {/* Animated Modern Language Switch Button (FR / EN Sliding Pill) */}
        <button
          type="button"
          onClick={toggleLanguage}
          title={`Langue actuelle: ${language.toUpperCase()} (cliquer pour basculer)`}
          aria-label={`Langue actuelle: ${language.toUpperCase()}, cliquer pour passer en ${language === "fr" ? "anglais" : "français"}`}
          className="relative h-8 sm:h-10 px-0.5 sm:px-1 rounded-[10px] sm:rounded-[14px] flex items-center bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 active:scale-95 transition-all select-none shrink-0"
        >
          <div className="relative flex items-center text-[9px] sm:text-[10px] font-mono font-bold uppercase">
            {/* Sliding Pill Indicator */}
            <div
              className={`absolute top-0 bottom-0 w-5 sm:w-7 bg-white rounded-[7px] sm:rounded-[10px] shadow-sm transition-transform duration-300 ease-out ${
                language === "fr" ? "translate-x-0" : "translate-x-5 sm:translate-x-7"
              }`}
            />
            <span
              className={`relative z-10 w-5 sm:w-7 h-7 sm:h-8 flex items-center justify-center transition-colors duration-200 ${
                language === "fr" ? "text-black" : "text-white/45 hover:text-white"
              }`}
            >
              FR
            </span>
            <span
              className={`relative z-10 w-5 sm:w-7 h-7 sm:h-8 flex items-center justify-center transition-colors duration-200 ${
                language === "en" ? "text-black" : "text-white/45 hover:text-white"
              }`}
            >
              EN
            </span>
          </div>
        </button>

        {/* Audio FX Toggle (with Red Mute State) */}
        <button
          type="button"
          onClick={toggleSound}
          title={muted ? "Activer les sons d'interface" : "Désactiver les sons d'interface"}
          aria-label={muted ? "Activer le son" : "Couper le son"}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-[14px] flex items-center justify-center transition-all duration-200 border shrink-0 ${
            muted
              ? "bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25"
              : "bg-white/[0.06] hover:bg-white/[0.14] border-white/10 text-white/80 hover:text-white"
          }`}
        >
          {muted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        {/* Direct Contact Button */}
        <button
          type="button"
          onClick={() => scrollToSection("contact")}
          title="Prendre contact"
          aria-label="Aller à la section contact"
          className="w-8 h-8 sm:w-auto sm:h-10 sm:px-4 md:sm:px-5 rounded-[10px] sm:rounded-[14px] bg-white text-black hover:bg-white/90 active:scale-95 transition flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-medium font-sans shrink-0"
        >
          <Mail className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Contact</span>
        </button>
      </nav>
    </div>
  );
};

export default BrowserDock;

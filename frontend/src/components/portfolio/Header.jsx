import React, { useEffect, useState } from "react";
import { MagneticLink } from "./CustomCursor";
import { SiteContext } from "./Portfolio";
import { UI_TRANSLATIONS } from "../../mock";
import ScrambleText from "./ScrambleText";
import { sound } from "../../lib/sound";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const context = React.useContext(SiteContext) || {};
  const translations = context.translations || UI_TRANSLATIONS.fr;
  const language = context.language || "fr";
  const changeLanguage = context.changeLanguage || (() => {});

  useEffect(() => {
    const onScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
      setScrolled(currentScroll > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: translations.nav.home, href: "#hero" },
    { label: translations.nav.about, href: "#about" },
    { label: translations.nav.work, href: "#work" },
    { label: translations.nav.contact, href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3 bg-black/40 backdrop-blur-md border-b border-white/[0.06]" : "py-6"
      }`}
    >
      {/* Scroll Reading Progress Bar */}
      <div
        className="absolute top-0 left-0 h-[1.5px] bg-gradient-to-r from-white/20 via-white/80 to-white shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-[width] duration-100 ease-out pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-[1640px] px-6 md:px-10 flex items-center justify-between">
        <MagneticLink
          href="#hero"
          strength={0.25}
          className="text-white flex items-center gap-2.5 group"
        >
          <span className="w-2 h-2 rounded-full bg-white group-hover:scale-125 transition-transform" />
          <span className="font-serif italic text-2xl md:text-3xl tracking-tight text-white">
            <ScrambleText text="Censure" />
          </span>
        </MagneticLink>

        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          <span className="hidden sm:inline text-white/40">{translations.volume}</span>
          <div className="flex items-center gap-1 border border-white/15 bg-white/[0.04] rounded-full p-1" aria-label="Language selector">
            {["fr", "en"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  sound.playSwitch();
                  changeLanguage(option);
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] transition-colors ${
                  language === option
                    ? "bg-white text-black font-semibold"
                    : "hover:text-white text-white/50"
                }`}
                aria-pressed={language === option}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

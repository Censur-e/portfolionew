import React, { useEffect, useState } from "react";
import { MagneticLink } from "./CustomCursor";
import { SiteContext } from "./Portfolio";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { translations, language, changeLanguage } = React.useContext(SiteContext);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
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
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div className="mx-auto max-w-[1640px] px-6 md:px-10 flex items-center justify-between">
        <MagneticLink
          href="#hero"
          strength={0.25}
          className="font-display text-white text-xl md:text-2xl font-semibold tracking-tight"
        >
          <span className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            Censure
          </span>
        </MagneticLink>

        <nav className="hidden md:flex items-center gap-2">
          {links.map((l) => (
            <MagneticLink
              key={l.label}
              href={l.href}
              strength={0.3}
              className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              {l.label}
            </MagneticLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span>{translations.volume}</span>
          <div className="flex items-center gap-1 border border-white/15 rounded-full p-1" aria-label="Language selector">
            {["fr", "en"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => changeLanguage(option)}
                className={`px-2 py-1 rounded-full transition-colors ${language === option ? "bg-white text-black" : "hover:text-white"}`}
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

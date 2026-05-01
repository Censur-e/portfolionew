import React, { useEffect, useState } from "react";
import { MagneticLink } from "./CustomCursor";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    const updateTime = () => {
      const d = new Date();
      const opts = { hour: "2-digit", minute: "2-digit", hour12: false };
      setTime(d.toLocaleTimeString("en-GB", opts) + " UTC");
    };
    updateTime();
    const t = setInterval(updateTime, 30000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(t);
    };
  }, []);

  const links = [
    { label: "Index", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div className="mx-auto max-w-[1640px] px-6 md:px-10 flex items-center justify-between">
        <MagneticLink href="#hero" strength={0.25} className="font-display text-white text-xl md:text-2xl font-semibold tracking-tight">
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

        <div className="hidden md:flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>Online — {time}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

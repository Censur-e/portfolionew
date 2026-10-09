import React, { useContext, useEffect, useState } from "react";
import { Copy, Check, ArrowUpRight, Clock } from "lucide-react";
import { SiteContext } from "./Portfolio";
import { sound } from "../../lib/sound";
import { DEFAULT_CONTENT, UI_TRANSLATIONS } from "../../mock";
import ScrambleText from "./ScrambleText";

const Footer = () => {
  const context = useContext(SiteContext) || {};
  const contact = context.contact || DEFAULT_CONTENT.contact;
  const socials = Array.isArray(context.socials) ? context.socials : DEFAULT_CONTENT.socials;
  const translations = context.translations || UI_TRANSLATIONS.fr;
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const copyHandle = async () => {
    try {
      await navigator.clipboard.writeText(contact.primary || "cen_sure");
      sound.playPop();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  const marqueeText = "PRENONS CONTACT &bull; DISPONIBLE POUR PROJETS &bull; ";
  const marqueeItems = Array(8).fill("PRENONS CONTACT");

  return (
    <footer id="contact" className="relative w-full pt-20 md:pt-28 pb-32 md:pb-36 bg-[#0b0b0b] border-t border-white/10">
      {/* Infinite Marquee Ribbon (Bachuki Style) */}
      <div className="overflow-hidden whitespace-nowrap py-4 border-b border-white/[0.08] bg-white/[0.015] mb-20 select-none">
        <div className="inline-flex marquee-track-l">
          {marqueeItems.concat(marqueeItems).map((text, i) => (
            <span
              key={i}
              className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-white/50 mx-6 flex items-center gap-6"
            >
              <span>{text}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 glow-number" />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1640px] px-6 md:px-10">
        {/* Section Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-doto text-base text-white/50 glow-number">04</span>
          <span className="w-6 h-px bg-white/20" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 cursor-pointer">
            <ScrambleText text={translations.contactEyebrow || "Contact"} />
          </span>
        </div>

        <div className="mb-14">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold tracking-tight text-white leading-[1.05]">
            Prenons{" "}
            <span className="font-serif italic font-normal text-white/90">
              contact,
            </span>
          </h2>
          <p className="mt-4 text-white/50 text-base md:text-lg max-w-xl font-light">
            {contact.caption || "Un projet, une question ou une opportunité ? Écris-moi en message privé."}
          </p>
        </div>

        {/* Large Interactive Copy Handle Card */}
        <button
          type="button"
          onClick={copyHandle}
          className="luxury-card group w-full text-left p-8 sm:p-12 md:p-16 mb-16 relative overflow-hidden transition-all duration-300 hover:border-white/30"
          aria-label={translations.copy || "Copier le contact"}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 mb-3">
                <span>{contact.primaryLabel || "Discord"}</span>
                <span>&bull;</span>
                <span className="group-hover:text-white transition-colors">
                  {copied ? translations.copied || "Copié dans le presse-papier !" : translations.copyHint || "Clique pour copier"}
                </span>
              </div>
              <div className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors break-all">
                <ScrambleText text={contact.primary || "cen_sure"} />
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs uppercase tracking-[0.2em] group-hover:bg-white group-hover:text-black transition-all">
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 group-hover:text-black" />
                  <span>{translations.copied || "Copié"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{translations.copy || "Copier"}</span>
                </>
              )}
            </div>
          </div>
        </button>

        {/* Socials Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mb-20">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="luxury-card p-5 sm:p-6 flex flex-col justify-between min-h-[120px] group transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                  {s.label}
                </span>
                <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div className="text-white font-sans font-medium text-base sm:text-lg mt-4 truncate group-hover:underline underline-offset-4">
                <ScrambleText text={s.handle} />
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Metadata bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-white/40">
          <div>{contact.copyright || "© 2025 Censure — Tous droits réservés."}</div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-white/30" />
            <span>{translations.localTime || "Heure locale"} — {time}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useContext, useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { SiteContext } from "./Portfolio";

const Footer = () => {
  const { contact, socials, translations } = useContext(SiteContext);
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
      await navigator.clipboard.writeText(contact.primary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      // ignore
    }
  };

  return (
    <footer id="contact" className="relative w-full pt-32 md:pt-40 pb-10 border-t border-white/10">
      <div className="mx-auto max-w-[1640px] px-6 md:px-10">
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 mb-10">
          <span className="w-8 h-px bg-white/40" />
          {translations.contactEyebrow}
        </div>
        <p className="max-w-2xl text-white/60 text-base md:text-lg">{translations.contactCaption}</p>
      </div>

      <button
        onClick={copyHandle}
        data-cursor="hover"
        className="group block w-full text-left mt-12 md:mt-16 px-6 md:px-10 py-10 md:py-16 border-y border-white/10 hover:bg-white hover:text-black transition-colors duration-500"
        aria-label={translations.copy}
      >
        <div className="flex items-start justify-between gap-6 max-w-[1640px] mx-auto">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60 mb-3">
              {contact.primaryLabel} — {translations.copyHint}
            </div>
            <div className="font-display font-semibold tracking-[-0.05em] leading-[0.85] text-[14vw] md:text-[12vw] lg:text-[10.5vw] break-all">
              {contact.primary}
            </div>
          </div>
          <div className="shrink-0 mt-4 hidden md:flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] opacity-70">
            {copied ? (
              <>
                <Check className="w-4 h-4" strokeWidth={1.5} /> {translations.copied}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" strokeWidth={1.5} /> {translations.copy}
              </>
            )}
          </div>
        </div>
      </button>

      <div className="mx-auto max-w-[1640px] px-6 md:px-10 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              data-cursor="hover"
              className="group flex items-center justify-between border-t border-white/10 pt-5"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{s.label}</div>
                <div className="mt-2 text-white text-base md:text-lg group-hover:underline underline-offset-4">{s.handle}</div>
              </div>
              <span className="text-white/40 group-hover:text-white transition-colors">↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1640px] px-6 md:px-10 mt-16 flex flex-wrap items-center justify-between gap-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{contact.copyright}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{translations.localTime} — {time}</div>
      </div>
    </footer>
  );
};

export default Footer;

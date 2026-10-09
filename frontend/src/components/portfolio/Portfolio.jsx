import React, { useEffect, useState } from "react";
import CustomCursor from "./CustomCursor";
import Hero from "./Hero";
import About from "./About";
import Projects from "./Projects";
import Skills from "./Skills";
import Footer from "./Footer";
import BrowserDock from "./BrowserDock";
import { DEFAULT_CONTENT, UI_TRANSLATIONS } from "../../mock";
import { contentApi } from "../../lib/api";

export const SiteContext = React.createContext(DEFAULT_CONTENT);

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[1.5px] bg-gradient-to-r from-white/20 via-white/80 to-white shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-[width] duration-100 ease-out pointer-events-none"
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
};

const Portfolio = () => {
  const [content, setContent] = React.useState(DEFAULT_CONTENT);
  const [loaded, setLoaded] = React.useState(false);
  const [language, setLanguage] = React.useState(() => localStorage.getItem("censure_language") || "fr");
  const activeData =
    (content && typeof content === "object" && content.translations?.[language]) ||
    content ||
    DEFAULT_CONTENT;
  const safeData =
    activeData && typeof activeData === "object" && activeData.hero
      ? activeData
      : DEFAULT_CONTENT;

  const localizedContent = {
    ...DEFAULT_CONTENT,
    ...safeData,
    hero: { ...DEFAULT_CONTENT.hero, ...(safeData.hero || {}) },
    about: { ...DEFAULT_CONTENT.about, ...(safeData.about || {}) },
    projects: Array.isArray(safeData.projects) ? safeData.projects : DEFAULT_CONTENT.projects,
    skillsRow1: Array.isArray(safeData.skillsRow1) ? safeData.skillsRow1 : DEFAULT_CONTENT.skillsRow1,
    skillsRow2: Array.isArray(safeData.skillsRow2) ? safeData.skillsRow2 : DEFAULT_CONTENT.skillsRow2,
    skillsRow3: Array.isArray(safeData.skillsRow3) ? safeData.skillsRow3 : DEFAULT_CONTENT.skillsRow3,
    socials: Array.isArray(safeData.socials) ? safeData.socials : DEFAULT_CONTENT.socials,
    contact: { ...DEFAULT_CONTENT.contact, ...(safeData.contact || {}) },
  };

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem("censure_language", nextLanguage);
  };

  React.useEffect(() => {
    let mounted = true;
    contentApi
      .get()
      .then((res) => {
        if (mounted && res?.data && typeof res.data === "object" && res.data.hero) {
          setContent(res.data);
        }
      })
      .catch(() => {
        // fallback to defaults already set
      })
      .finally(() => mounted && setLoaded(true));
    return () => {
      mounted = false;
    };
  }, []);

  // Stagger reveal
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("in-view"), i * 60);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [loaded]);

  // Smooth in-page anchor scroll
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <SiteContext.Provider
      value={{
        ...localizedContent,
        language,
        translations: UI_TRANSLATIONS[language] || UI_TRANSLATIONS.fr,
        changeLanguage,
      }}
    >
      <main className="relative bg-[#0b0b0b] text-[#e5e5e5] min-h-screen selection:bg-white selection:text-black">
        <ScrollProgressBar />
        <CustomCursor />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Footer />
        <BrowserDock
          translations={UI_TRANSLATIONS[language] || UI_TRANSLATIONS.fr}
          language={language}
          changeLanguage={changeLanguage}
        />
      </main>
    </SiteContext.Provider>
  );
};

export default Portfolio;

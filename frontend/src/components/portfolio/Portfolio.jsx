import React, { useEffect } from "react";
import CustomCursor from "./CustomCursor";
import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Projects from "./Projects";
import Skills from "./Skills";
import Footer from "./Footer";
import { DEFAULT_CONTENT, UI_TRANSLATIONS } from "../../mock";
import { contentApi } from "../../lib/api";

export const SiteContext = React.createContext(DEFAULT_CONTENT);

const Portfolio = () => {
  const [content, setContent] = React.useState(DEFAULT_CONTENT);
  const [loaded, setLoaded] = React.useState(false);
  const [language, setLanguage] = React.useState(() => localStorage.getItem("censure_language") || "fr");

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem("censure_language", nextLanguage);
  };

  React.useEffect(() => {
    let mounted = true;
    contentApi
      .get()
      .then((res) => {
        if (mounted && res.data) setContent(res.data);
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
    <SiteContext.Provider value={{ ...content, language, translations: UI_TRANSLATIONS[language], changeLanguage }}>
      <main className="relative bg-[#050505] text-white">
        <CustomCursor />
        <Header />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Footer />
      </main>
    </SiteContext.Provider>
  );
};

export default Portfolio;

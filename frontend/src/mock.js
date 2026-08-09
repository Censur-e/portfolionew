// Default site content (French / Roblox-Luau-Figma).
// Used as a fallback if the API is unreachable. The backend seeds the same defaults on first run.

export const DEFAULT_CONTENT = {
  hero: {
    name: "Censure",
    role: "UI Designer & Scripter Roblox",
    headlineLine1: "Designer",
    headlineLine2: "l'interface.",
    headlineLine3: "Scripter",
    headlineLine4: "l'expérience.",
    status: "Disponible pour collaborations sélectionnées — 2025",
  },
  about: {
    bio: [
      "Je suis Censure — développeur Roblox Studio et UI Designer indépendant.",
      "Je conçois mes interfaces dans Figma, puis je leur donne vie sur Roblox avec Luau — menus, HUD, systèmes de lobby, animations, tout ce qui rend un jeu vivant.",
      "Je travaille à la couture du design et du gameplay : ce qui est beau doit être jouable, ce qui est jouable doit être beau.",
    ],
    meta: [
      { k: "Basé", v: "Roblox / À distance" },
      { k: "Focus", v: "UI Roblox · Luau · Figma" },
      { k: "Années", v: "07" },
    ],
    terminalLines: [
      "$ whoami",
      "censure — développeur roblox & ui designer",
      "$ stack --core",
      "luau · roblox studio · roact",
      "$ stack --design",
      "figma",
      "$ philosophie",
      "\"le détail, c'est la dévotion.\"",
      "$ statut",
      "j'accepte 2 projets ce trimestre ▍",
    ],
  },
  projects: [
    {
      id: 1, index: "01", title: "Apex Lobby",
      subtitle: "Système de lobby compétitif",
      year: "2025", role: "UI · Luau",
      tags: ["Roblox", "UI", "Luau"],
      image: "https://images.unsplash.com/photo-1700665654047-1c11a46efd6b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxVSSUyMGRlc2lnbnxlbnwwfHx8YmxhY2t8MTc3NzY3NTE3MXww&ixlib=rb-4.1.0&q=85",
      description: "Un lobby modulaire pour un jeu PvP : matchmaking, classements, vitrine de skins. Pensé dans Figma, scripé en Luau.",
      category: "created", mediaType: "image",
    },
    {
      id: 2, index: "02", title: "Null Sector",
      subtitle: "Identité visuelle d'un univers SF",
      year: "2024", role: "Direction artistique",
      tags: ["Roblox", "Brand", "World"],
      image: "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMDNEfGVufDB8fHxibGFja3wxNzc3Njc1MTcxfDA&ixlib=rb-4.1.0&q=85",
      description: "Identité graphique complète d'un univers Roblox : logo, HUD, typographies in-game, gabarits Figma exportés en assets.",
      category: "created", mediaType: "image",
    },
    {
      id: 3, index: "03", title: "Halcyon",
      subtitle: "HUD apaisant pour jeu d'exploration",
      year: "2024", role: "UI · Prototypage",
      tags: ["Roblox", "HUD", "Mobile"],
      image: "https://images.unsplash.com/photo-1703944159188-ab7298c6d793?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHw0fHxtb2JpbGUlMjBhcHAlMjBkYXJrfGVufDB8fHxibGFja3wxNzc3Njc1MTY1fDA&ixlib=rb-4.1.0&q=85",
      description: "Un HUD minimal sans surcharge : transitions calées sur la respiration, palette sombre, lisible sur mobile.",
      category: "created", mediaType: "image",
    },
    {
      id: 4, index: "04", title: "Monolith",
      subtitle: "Intro narrative typographique",
      year: "2023", role: "Motion · Luau",
      tags: ["Roblox", "Motion", "Type"],
      image: "https://images.unsplash.com/photo-1649015931204-15a3c789e6ea?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxicnV0YWxpc3QlMjB0eXBvZ3JhcGh5fGVufDB8fHxibGFja3wxNzc3Njc1MTY1fDA&ixlib=rb-4.1.0&q=85",
      description: "Une intro brutaliste pour un jeu narratif Roblox : typographie massive, TweenService calé à la frame.",
      category: "created", mediaType: "image",
    },
  ],
  skillsRow1: ["Design d'interface", "Motion", "Luau", "Roblox Studio", "Systèmes UI", "Prototypage"],
  skillsRow2: ["Typographie", "TweenService", "Roact", "Figma", "Animation", "Direction artistique"],
  skillsRow3: ["UX Produit", "Systèmes de marque", "Game Design", "Narration", "Front-end"],
  socials: [
    { label: "Discord", handle: "cen_sure", href: "#" },
    { label: "Roblox", handle: "censure", href: "#" },
    { label: "X / Twitter", handle: "@censure", href: "#" },
    { label: "Figma", handle: "censure", href: "#" },
  ],
  contact: {
    primary: "cen_sure",
    primaryLabel: "Discord",
    caption: "Un projet ? Écris-moi en DM. Je lis tout.",
    copyright: "© 2025 Censure — Chaque pixel est intentionnel.",
  },
};

export const NAV_LABELS = {
  home: "Accueil",
  about: "À propos",
  work: "Projets",
  contact: "Contact",
};

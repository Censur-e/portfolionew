import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, contentApi } from "../lib/api";
import { DEFAULT_CONTENT } from "../mock";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { Loader2, LogOut, Save, Plus, Trash2, RefreshCw, ExternalLink } from "lucide-react";

const TOKEN_KEY = "censure_token";

const LoginScreen = ({ onLogin }) => {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { toast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await authApi.login(u, p);
      localStorage.setItem(TOKEN_KEY, res.data.token);
      toast({ title: "Connecté", description: "Bienvenue, Censure." });
      onLogin();
    } catch (e) {
      setErr("Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 mb-3">
            Tableau de bord
          </div>
          <h1 className="font-display text-5xl font-semibold tracking-[-0.04em] leading-[0.95]">
            Connexion <span className="text-outline">privée.</span>
          </h1>
          <p className="mt-4 text-white/50 text-sm">
            Réservé à l'administrateur du site Censure.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5 glass rounded-2xl p-6">
          <div>
            <Label htmlFor="u" className="text-white/70 text-xs uppercase tracking-[0.2em]">Identifiant</Label>
            <Input
              id="u"
              value={u}
              onChange={(e) => setU(e.target.value)}
              autoComplete="username"
              className="mt-2 bg-black/40 border-white/15 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="p" className="text-white/70 text-xs uppercase tracking-[0.2em]">Mot de passe</Label>
            <Input
              id="p"
              type="password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              autoComplete="current-password"
              className="mt-2 bg-black/40 border-white/15 text-white"
              required
            />
          </div>
          {err && <div className="text-red-400 text-sm">{err}</div>}
          <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-white/90 h-11">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Se connecter"}
          </Button>
        </form>

        <a href="/" className="mt-8 inline-flex items-center gap-2 text-white/50 hover:text-white text-sm">
          <ExternalLink className="w-4 h-4" /> Retour au site
        </a>
      </div>
      <Toaster />
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", textarea = false }) => (
  <div className="space-y-2">
    <Label className="text-white/60 text-[11px] uppercase tracking-[0.2em]">{label}</Label>
    {textarea ? (
      <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} className="bg-black/40 border-white/15 text-white min-h-[80px]" />
    ) : (
      <Input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="bg-black/40 border-white/15 text-white" />
    )}
  </div>
);

const ListEditor = ({ label, items, onChange, placeholder = "" }) => (
  <div className="space-y-2">
    <Label className="text-white/60 text-[11px] uppercase tracking-[0.2em]">{label}</Label>
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={it}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="bg-black/40 border-white/15 text-white"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="border-white/20 text-white hover:bg-white hover:text-black"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...items, ""])}
        className="border-white/20 text-white hover:bg-white hover:text-black"
      >
        <Plus className="w-4 h-4 mr-2" /> Ajouter
      </Button>
    </div>
  </div>
);

const Editor = ({ onLogout }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await contentApi.get();
      setContent(res.data || DEFAULT_CONTENT);
    } catch (e) {
      setContent(DEFAULT_CONTENT);
      toast({ title: "Erreur", description: "Impossible de charger le contenu." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await contentApi.update(content);
      toast({ title: "Sauvegardé", description: "Le site a été mis à jour." });
    } catch (e) {
      toast({ title: "Erreur", description: e?.response?.data?.detail || "Sauvegarde échouée." });
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!window.confirm("Réinitialiser tout le contenu aux valeurs par défaut ?")) return;
    try {
      const res = await contentApi.reset();
      setContent(res.data);
      toast({ title: "Réinitialisé", description: "Contenu remis aux valeurs par défaut." });
    } catch (e) {
      toast({ title: "Erreur", description: "Réinitialisation échouée." });
    }
  };

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const update = (path, value) => {
    setContent((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      let cur = next;
      const parts = path.split(".");
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const updateProject = (idx, key, value) => {
    const next = [...content.projects];
    next[idx] = { ...next[idx], [key]: value };
    update("projects", next);
  };

  const addProject = (category = "created") => {
    const newId = (content.projects[content.projects.length - 1]?.id || 0) + 1;
    update("projects", [
      ...content.projects,
      {
        id: newId,
        index: String(content.projects.length + 1).padStart(2, "0"),
        title: "Nouveau projet",
        subtitle: "",
        year: String(new Date().getFullYear()),
        role: "",
        tags: [],
        image: "",
        description: "",
        category,
        mediaType: "image",
      },
    ]);
  };

  const removeProject = (idx) => {
    if (!window.confirm("Supprimer ce projet ?")) return;
    update("projects", content.projects.filter((_, i) => i !== idx));
  };

  const updateSocial = (idx, key, value) => {
    const next = [...content.socials];
    next[idx] = { ...next[idx], [key]: value };
    update("socials", next);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-black/80 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <div className="font-display text-lg font-semibold">Censure / Tableau de bord</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/")} className="border-white/20 text-white hover:bg-white hover:text-black">
              <ExternalLink className="w-4 h-4 mr-2" /> Voir le site
            </Button>
            <Button variant="outline" onClick={reset} className="border-white/20 text-white hover:bg-white hover:text-black">
              <RefreshCw className="w-4 h-4 mr-2" /> Réinitialiser
            </Button>
            <Button onClick={save} disabled={saving} className="bg-white text-black hover:bg-white/90">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Sauvegarder
            </Button>
            <Button variant="outline" onClick={onLogout} className="border-white/20 text-white hover:bg-white hover:text-black">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-10">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 mb-8 overflow-x-auto flex w-full justify-start">
            <TabsTrigger value="hero" className="data-[state=active]:bg-white data-[state=active]:text-black">Accueil</TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-white data-[state=active]:text-black">À propos</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-white data-[state=active]:text-black">Projets</TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-white data-[state=active]:text-black">Compétences</TabsTrigger>
            <TabsTrigger value="socials" className="data-[state=active]:bg-white data-[state=active]:text-black">Réseaux</TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-white data-[state=active]:text-black">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-5">
            <h2 className="font-display text-2xl font-semibold mb-2">Section Accueil</h2>
            <Field label="Nom" value={content.hero.name} onChange={(v) => update("hero.name", v)} />
            <Field label="Rôle" value={content.hero.role} onChange={(v) => update("hero.role", v)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Titre — ligne 1" value={content.hero.headlineLine1} onChange={(v) => update("hero.headlineLine1", v)} />
              <Field label="Titre — ligne 2" value={content.hero.headlineLine2} onChange={(v) => update("hero.headlineLine2", v)} />
              <Field label="Titre — ligne 3" value={content.hero.headlineLine3} onChange={(v) => update("hero.headlineLine3", v)} />
              <Field label="Titre — ligne 4" value={content.hero.headlineLine4} onChange={(v) => update("hero.headlineLine4", v)} />
            </div>
            <Field label="Statut / disponibilité" value={content.hero.status} onChange={(v) => update("hero.status", v)} textarea />
          </TabsContent>

          <TabsContent value="about" className="space-y-5">
            <h2 className="font-display text-2xl font-semibold mb-2">Section À propos</h2>
            <Field label="Études actuelles" value={content.about.study} onChange={(v) => update("about.study", v)} />
            <ListEditor label="Bio (un paragraphe par ligne)" items={content.about.bio} onChange={(v) => update("about.bio", v)} />
            <div>
              <Label className="text-white/60 text-[11px] uppercase tracking-[0.2em]">Méta (clé / valeur)</Label>
              <div className="space-y-2 mt-2">
                {content.about.meta.map((m, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-2">
                    <Input value={m.k} onChange={(e) => {
                      const next = [...content.about.meta];
                      next[i] = { ...next[i], k: e.target.value };
                      update("about.meta", next);
                    }} placeholder="Clé" className="bg-black/40 border-white/15 text-white" />
                    <Input value={m.v} onChange={(e) => {
                      const next = [...content.about.meta];
                      next[i] = { ...next[i], v: e.target.value };
                      update("about.meta", next);
                    }} placeholder="Valeur" className="bg-black/40 border-white/15 text-white" />
                    <Button type="button" variant="outline" onClick={() => update("about.meta", content.about.meta.filter((_, idx) => idx !== i))} className="border-white/20 text-white hover:bg-white hover:text-black">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => update("about.meta", [...content.about.meta, { k: "", v: "" }])} className="border-white/20 text-white hover:bg-white hover:text-black">
                  <Plus className="w-4 h-4 mr-2" /> Ajouter une méta
                </Button>
              </div>
            </div>
            <ListEditor label="Lignes du terminal (une par ligne, $ = commande)" items={content.about.terminalLines} onChange={(v) => update("about.terminalLines", v)} />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold">Projets</h2>
              <div className="flex gap-2">
                <Button onClick={() => addProject("created")} className="bg-white text-black hover:bg-white/90">
                  <Plus className="w-4 h-4 mr-2" /> Nouvelle création
                </Button>
                <Button onClick={() => addProject("collab")} variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black">
                  <Plus className="w-4 h-4 mr-2" /> Nouvelle collab
                </Button>
              </div>
            </div>
            <p className="text-white/50 text-sm">
              Les projets sont regroupés sur le site en 2 onglets : <b>Mes créations</b> & <b>Collaborations</b>. Choisis la catégorie et le type de média (image, vidéo directe MP4 ou lien YouTube/Vimeo) pour chacun.
            </p>
            {content.projects.map((p, i) => {
              const cat = p.category || "created";
              const mtype = p.mediaType || "image";
              const mediaLabel = mtype === "video" ? "URL de la vidéo (.mp4)" : mtype === "embed" ? "Lien YouTube / Vimeo" : "URL de l'image";
              return (
                <div key={p.id} className="rounded-2xl border border-white/10 p-5 space-y-4 bg-white/[0.02]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="font-display text-xl">{p.index} — {p.title}</div>
                      <span className={`font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full ${cat === "collab" ? "bg-white/10 text-white/70" : "bg-white text-black"}`}>
                        {cat === "collab" ? "Collaboration" : "Création"}
                      </span>
                    </div>
                    <Button variant="outline" onClick={() => removeProject(i)} className="border-white/20 text-white hover:bg-white hover:text-black">
                      <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                    </Button>
                  </div>

                  {/* Category + MediaType selectors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/60 text-[11px] uppercase tracking-[0.2em]">Catégorie</Label>
                      <div className="mt-2 inline-flex rounded-lg border border-white/15 p-1 bg-black/40">
                        {[
                          { k: "created", label: "Ma création" },
                          { k: "collab", label: "Collaboration" },
                        ].map((c) => (
                          <button
                            key={c.k}
                            type="button"
                            onClick={() => updateProject(i, "category", c.k)}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${cat === c.k ? "bg-white text-black" : "text-white/70 hover:text-white"}`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/60 text-[11px] uppercase tracking-[0.2em]">Type de média</Label>
                      <div className="mt-2 inline-flex rounded-lg border border-white/15 p-1 bg-black/40">
                        {[
                          { k: "image", label: "Image" },
                          { k: "video", label: "Vidéo (MP4)" },
                          { k: "embed", label: "YouTube / Vimeo" },
                        ].map((c) => (
                          <button
                            key={c.k}
                            type="button"
                            onClick={() => updateProject(i, "mediaType", c.k)}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mtype === c.k ? "bg-white text-black" : "text-white/70 hover:text-white"}`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Index (ex: 01)" value={p.index} onChange={(v) => updateProject(i, "index", v)} />
                    <Field label="Année" value={p.year} onChange={(v) => updateProject(i, "year", v)} />
                    <Field label="Titre" value={p.title} onChange={(v) => updateProject(i, "title", v)} />
                    <Field label="Sous-titre" value={p.subtitle} onChange={(v) => updateProject(i, "subtitle", v)} />
                    <Field label="Rôle" value={p.role} onChange={(v) => updateProject(i, "role", v)} />
                    <Field label={mediaLabel} value={p.image} onChange={(v) => updateProject(i, "image", v)} />
                  </div>
                  <Field label="Description" value={p.description} onChange={(v) => updateProject(i, "description", v)} textarea />
                  <ListEditor label="Tags" items={p.tags} onChange={(v) => updateProject(i, "tags", v)} placeholder="ex: Roblox" />
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="skills" className="space-y-5">
            <h2 className="font-display text-2xl font-semibold mb-2">Compétences (3 lignes du marquee)</h2>
            <ListEditor label="Ligne 1" items={content.skillsRow1} onChange={(v) => update("skillsRow1", v)} />
            <ListEditor label="Ligne 2 (style outline)" items={content.skillsRow2} onChange={(v) => update("skillsRow2", v)} />
            <ListEditor label="Ligne 3" items={content.skillsRow3} onChange={(v) => update("skillsRow3", v)} />
          </TabsContent>

          <TabsContent value="socials" className="space-y-5">
            <h2 className="font-display text-2xl font-semibold mb-2">Réseaux</h2>
            {content.socials.map((s, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr_auto] gap-2 items-end">
                <div>
                  <Label className="text-white/60 text-[11px] uppercase tracking-[0.2em]">Label</Label>
                  <Input value={s.label} onChange={(e) => updateSocial(i, "label", e.target.value)} className="mt-2 bg-black/40 border-white/15 text-white" />
                </div>
                <div>
                  <Label className="text-white/60 text-[11px] uppercase tracking-[0.2em]">Pseudo</Label>
                  <Input value={s.handle} onChange={(e) => updateSocial(i, "handle", e.target.value)} className="mt-2 bg-black/40 border-white/15 text-white" />
                </div>
                <div>
                  <Label className="text-white/60 text-[11px] uppercase tracking-[0.2em]">Lien (URL)</Label>
                  <Input value={s.href} onChange={(e) => updateSocial(i, "href", e.target.value)} className="mt-2 bg-black/40 border-white/15 text-white" />
                </div>
                <Button variant="outline" onClick={() => update("socials", content.socials.filter((_, idx) => idx !== i))} className="border-white/20 text-white hover:bg-white hover:text-black">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => update("socials", [...content.socials, { label: "", handle: "", href: "#" }])} className="border-white/20 text-white hover:bg-white hover:text-black">
              <Plus className="w-4 h-4 mr-2" /> Ajouter un réseau
            </Button>
          </TabsContent>

          <TabsContent value="contact" className="space-y-5">
            <h2 className="font-display text-2xl font-semibold mb-2">Contact</h2>
            <Field label="Label principal (ex: Discord)" value={content.contact.primaryLabel} onChange={(v) => update("contact.primaryLabel", v)} />
            <Field label="Pseudo / contact principal (texte géant)" value={content.contact.primary} onChange={(v) => update("contact.primary", v)} />
            <Field label="Légende au-dessus" value={content.contact.caption} onChange={(v) => update("contact.caption", v)} textarea />
            <Field label="Copyright bas de page" value={content.contact.copyright} onChange={(v) => update("contact.copyright", v)} />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  );
};

const Dashboard = () => {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  const verify = async () => {
    setChecking(true);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setAuthed(false);
      setChecking(false);
      return;
    }
    try {
      await authApi.me();
      setAuthed(true);
    } catch (e) {
      localStorage.removeItem(TOKEN_KEY);
      setAuthed(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    verify();
  }, []);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return authed ? <Editor onLogout={logout} /> : <LoginScreen onLogin={verify} />;
};

export default Dashboard;

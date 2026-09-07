from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta
from pathlib import Path
import os
import jwt
import logging

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Detect if running on Vercel (or other prod env)
IS_VERCEL = bool(os.environ.get("VERCEL"))

MONGO_URL = os.environ.get("MONGO_URL", "") or "mongodb://localhost:27017"
DB_NAME = os.environ.get("DB_NAME", "censure_portfolio")
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "CensureSiteWeb")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "14621462aBaB")
JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret")
JWT_ALGO = "HS256"
JWT_EXP_HOURS = 24 * 7  # 1 week

MONGO_URL_IS_BAD_FOR_PROD = IS_VERCEL and ("localhost" in MONGO_URL or "127.0.0.1" in MONGO_URL)

# Build client lazily — never fail at import time so /_health always responds
client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=8000)
db = client[DB_NAME]
content_col = db.site_content
CONTENT_ID = "default"

app = FastAPI()
api = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ---------- Models ----------
class LoginIn(BaseModel):
    username: str
    password: str

class TokenOut(BaseModel):
    token: str
    expires_in: int

class MetaItem(BaseModel):
    k: str
    v: str

class HeroData(BaseModel):
    name: str
    role: str
    headlineLine1: str
    headlineLine2: str
    headlineLine3: str
    headlineLine4: str
    status: str

class AboutData(BaseModel):
    bio: List[str]
    meta: List[MetaItem]
    terminalLines: List[str]
    study: str = "Réseau et Télécommunicationé"

class ProjectData(BaseModel):
    id: int
    index: str
    title: str
    subtitle: str
    year: str
    role: str
    tags: List[str]
    image: str
    description: str
    category: Optional[str] = "created"  # "created" or "collab"
    mediaType: Optional[str] = "image"  # "image" | "video" | "embed"

class SocialItem(BaseModel):
    label: str
    handle: str
    href: str

class ContactData(BaseModel):
    primary: str
    primaryLabel: str
    caption: str
    copyright: str

class SiteContent(BaseModel):
    hero: HeroData
    about: AboutData
    projects: List[ProjectData]
    skillsRow1: List[str]
    skillsRow2: List[str]
    skillsRow3: List[str]
    socials: List[SocialItem]
    contact: ContactData

# ---------- Defaults (French / Roblox / Luau / Figma) ----------
DEFAULT_CONTENT = {
    "hero": {
        "name": "Censure",
        "role": "UI Designer & Scripter Roblox",
        "headlineLine1": "Designer",
        "headlineLine2": "l'interface.",
        "headlineLine3": "Scripter",
        "headlineLine4": "l'expérience.",
        "status": "Disponible pour collaborations sélectionnées — 2025",
    },
    "about": {
        "bio": [
            "Je suis Censure — développeur Roblox Studio et UI Designer indépendant.",
            "Je conçois mes interfaces dans Figma, puis je leur donne vie sur Roblox avec Luau — menus, HUD, systèmes de lobby, animations, tout ce qui rend un jeu vivant.",
            "Je travaille à la couture du design et du gameplay : ce qui est beau doit être jouable, ce qui est jouable doit être beau.",
        ],
        "meta": [
            {"k": "Basé", "v": "Roblox / À distance"},
            {"k": "Focus", "v": "UI Roblox · Luau · Figma"},
            {"k": "Années", "v": "07"},
        ],
        "study": "Réseau et Télécommunicationé",
        "terminalLines": [
            "$ whoami",
            "censure — développeur roblox & ui designer",
            "$ stack --core",
            "luau · roblox studio · roact",
            "$ stack --design",
            "figma",
            "$ philosophie",
            '"le détail, c\'est la dévotion."',
            "$ statut",
            "j'accepte 2 projets ce trimestre ▍",
        ],
    },
    "projects": [
        {
            "id": 1, "index": "01", "title": "Apex Lobby",
            "subtitle": "Système de lobby compétitif",
            "year": "2025", "role": "UI · Luau",
            "tags": ["Roblox", "UI", "Luau"],
            "image": "https://images.unsplash.com/photo-1700665654047-1c11a46efd6b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxVSSUyMGRlc2lnbnxlbnwwfHx8YmxhY2t8MTc3NzY3NTE3MXww&ixlib=rb-4.1.0&q=85",
            "description": "Un lobby modulaire pour un jeu PvP : matchmaking, classements, vitrine de skins. Pensé dans Figma, scripé en Luau.",
            "category": "created", "mediaType": "image",
        },
        {
            "id": 2, "index": "02", "title": "Null Sector",
            "subtitle": "Identité visuelle d'un univers SF",
            "year": "2024", "role": "Direction artistique",
            "tags": ["Roblox", "Brand", "World"],
            "image": "https://images.unsplash.com/photo-1632059368252-be6d65abc4e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMDNEfGVufDB8fHxibGFja3wxNzc3Njc1MTcxfDA&ixlib=rb-4.1.0&q=85",
            "description": "Identité graphique complète d'un univers Roblox : logo, HUD, typographies in-game, gabarits Figma exportés en assets.",
            "category": "created", "mediaType": "image",
        },
        {
            "id": 3, "index": "03", "title": "Halcyon",
            "subtitle": "HUD apaisant pour jeu d'exploration",
            "year": "2024", "role": "UI · Prototypage",
            "tags": ["Roblox", "HUD", "Mobile"],
            "image": "https://images.unsplash.com/photo-1703944159188-ab7298c6d793?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHw0fHxtb2JpbGUlMjBhcHAlMjBkYXJrfGVufDB8fHxibGFja3wxNzc3Njc1MTY1fDA&ixlib=rb-4.1.0&q=85",
            "description": "Un HUD minimal sans surcharge : transitions calées sur la respiration, palette sombre, lisible sur mobile.",
            "category": "created", "mediaType": "image",
        },
        {
            "id": 4, "index": "04", "title": "Monolith",
            "subtitle": "Intro narrative typographique",
            "year": "2023", "role": "Motion · Luau",
            "tags": ["Roblox", "Motion", "Type"],
            "image": "https://images.unsplash.com/photo-1649015931204-15a3c789e6ea?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxicnV0YWxpc3QlMjB0eXBvZ3JhcGh5fGVufDB8fHxibGFja3wxNzc3Njc1MTY1fDA&ixlib=rb-4.1.0&q=85",
            "description": "Une intro brutaliste pour un jeu narratif Roblox : typographie massive, TweenService calé à la frame.",
            "category": "created", "mediaType": "image",
        },
        {
            "id": 5, "index": "01", "title": "Vortex Arena",
            "subtitle": "Refonte UI en collaboration",
            "year": "2024", "role": "UI · Motion (collab)",
            "tags": ["Roblox", "Collab", "UI"],
            "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?crop=entropy&cs=srgb&fm=jpg&w=1600&q=85",
            "description": "Refonte complète du menu principal et du HUD d'un jeu d'arène — travail en équipe avec le studio propriétaire.",
            "category": "collab", "mediaType": "image",
        },
        {
            "id": 6, "index": "02", "title": "Neon District",
            "subtitle": "Systèmes UI + scripting client",
            "year": "2023", "role": "Scripteur UI (collab)",
            "tags": ["Roblox", "Collab", "Luau"],
            "image": "https://images.unsplash.com/photo-1520869562399-e772f042f422?crop=entropy&cs=srgb&fm=jpg&w=1600&q=85",
            "description": "Dev des systèmes d'inventaire, quêtes et notifications côté client pour un RPG cyberpunk d'un autre studio.",
            "category": "collab", "mediaType": "image",
        },
    ],
    "skillsRow1": ["Design d'interface", "Motion", "Luau", "Roblox Studio", "Systèmes UI", "Prototypage"],
    "skillsRow2": ["Typographie", "TweenService", "Roact", "Figma", "Animation", "Direction artistique"],
    "skillsRow3": ["UX Produit", "Systèmes de marque", "Game Design", "Narration", "Front-end"],
    "socials": [
        {"label": "Discord", "handle": "cen_sure", "href": "#"},
        {"label": "Roblox", "handle": "censure", "href": "#"},
        {"label": "X / Twitter", "handle": "@censure", "href": "#"},
        {"label": "Figma", "handle": "censure", "href": "#"},
    ],
    "contact": {
        "primary": "cen_sure",
        "primaryLabel": "Discord",
        "caption": "Un projet ? Écris-moi en DM. Je lis tout.",
        "copyright": "© 2025 Censure — Chaque pixel est intentionnel.",
    },
}

# ---------- Helpers ----------
def _make_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXP_HOURS),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def require_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> str:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Authentification requise")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except Exception:
        raise HTTPException(status_code=401, detail="Token invalide")


async def _get_or_seed_content() -> dict:
    doc = await content_col.find_one({"_id": CONTENT_ID})
    if not doc:
        await content_col.insert_one({"_id": CONTENT_ID, **DEFAULT_CONTENT})
        doc = await content_col.find_one({"_id": CONTENT_ID})
    doc.pop("_id", None)
    # Migration: fill missing category / mediaType on legacy projects
    for p in doc.get("projects", []):
        p.setdefault("category", "created")
        p.setdefault("mediaType", "image")
    doc.setdefault("about", {})
    doc["about"].setdefault("study", DEFAULT_CONTENT["about"]["study"])
    return doc

# ---------- Routes ----------
@api.get("/")
async def root():
    return {"message": "Censure portfolio API"}

@api.get("/_health")
async def health():
    """Diagnostic endpoint — shows env config (without secrets) and DB connectivity."""
    mongo_prefix = MONGO_URL.split("@")[-1].split("/")[0] if "@" in MONGO_URL else MONGO_URL
    info = {
        "is_vercel": IS_VERCEL,
        "mongo_host": mongo_prefix,
        "mongo_scheme": MONGO_URL.split("://")[0] if "://" in MONGO_URL else "?",
        "db_name": DB_NAME,
        "admin_user_set": bool(ADMIN_USERNAME),
        "jwt_secret_set": JWT_SECRET != "dev-secret",
    }
    try:
        await db.command("ping")
        info["db_status"] = "ok"
    except Exception as e:
        info["db_status"] = "error"
        info["db_error"] = str(e)[:300]
    return info

@api.post("/auth/login", response_model=TokenOut)
async def login(body: LoginIn):
    if body.username != ADMIN_USERNAME or body.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    token = _make_token(body.username)
    return TokenOut(token=token, expires_in=JWT_EXP_HOURS * 3600)

@api.get("/auth/me")
async def me(user: str = Depends(require_admin)):
    return {"username": user}

@api.get("/content")
async def get_content():
    if MONGO_URL_IS_BAD_FOR_PROD:
        raise HTTPException(
            status_code=503,
            detail=(
                "MONGO_URL on Vercel still points to localhost. "
                "Set MONGO_URL in Vercel Settings → Environment Variables "
                "to your MongoDB Atlas connection string (mongodb+srv://...) "
                "and redeploy."
            ),
        )
    try:
        return await _get_or_seed_content()
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Database error: {type(e).__name__}: {str(e)[:300]}",
        )

@api.put("/content")
async def update_content(body: SiteContent, user: str = Depends(require_admin)):
    data = body.model_dump()
    await content_col.update_one(
        {"_id": CONTENT_ID},
        {"$set": data},
        upsert=True,
    )
    doc = await content_col.find_one({"_id": CONTENT_ID})
    doc.pop("_id", None)
    return doc

@api.post("/content/reset")
async def reset_content(user: str = Depends(require_admin)):
    await content_col.update_one(
        {"_id": CONTENT_ID},
        {"$set": DEFAULT_CONTENT},
        upsert=True,
    )
    doc = await content_col.find_one({"_id": CONTENT_ID})
    doc.pop("_id", None)
    return doc

app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

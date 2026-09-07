# API Contracts — Censure Portfolio

## Goal
Allow the owner to fully customize the public portfolio (hero, about, projects, skills, socials, contact)
from a private `/dashboard` route — no code changes required.

## Auth
- Single admin user (no signup).
- Credentials (env): `ADMIN_USERNAME=CensureSiteWeb`, `ADMIN_PASSWORD=14621462aBaB`.
- Login endpoint returns a JWT (HS256) signed with `JWT_SECRET`.
- Token kept in `localStorage` (`censure_token`). Sent as `Authorization: Bearer <token>` for protected routes.

## Endpoints (all prefixed with `/api`)
| Method | Path             | Auth | Body                               | Returns                    |
|--------|------------------|------|------------------------------------|----------------------------|
| GET    | `/`              | no   | —                                  | `{message}`                |
| POST   | `/auth/login`    | no   | `{username, password}`             | `{token, expires_in}` or 401 |
| GET    | `/auth/me`       | yes  | —                                  | `{username}` or 401        |
| GET    | `/content`       | no   | —                                  | full SiteContent object    |
| PUT    | `/content`       | yes  | full SiteContent object            | updated SiteContent        |
| POST   | `/content/reset` | yes  | —                                  | default SiteContent        |

## Data Model — SiteContent
Stored in MongoDB `site_content` collection, single doc with `_id="default"`.
```
{
  hero: { name, role, headlineLine1, headlineLine2, headlineLine3, headlineLine4, status },
  about: { bio: [str], meta: [{k, v}], terminalLines: [str], study: str },
  projects: [ { id, index, title, subtitle, year, role, tags: [str], image, description } ],
  skillsRow1: [str], skillsRow2: [str], skillsRow3: [str],
  socials: [ { label, handle, href } ],
  contact: { primary, primaryLabel, caption, copyright }
}
```

## Frontend Integration
- `mock.js` keeps default French content used as fallback (and for first-time DB seeding).
- `Portfolio.jsx` fetches `GET /content` on mount; falls back to mock if API fails.
- `Dashboard.jsx`:
  - If no token → show login form → `POST /auth/login` → store token.
  - If token present → `GET /content` → render editable forms grouped by section.
  - Save button → `PUT /content` (full doc).
  - Logout clears token.

## Removed Mock Data (now sourced from backend)
- All keys in `mock.js` are now backend-served. The file remains as bootstrap defaults only.

<div align="center">
  <img src="public/logo.svg" alt="Zystem" width="96" height="96" />

  # Zystem

  **Your Level Up Partner.**
  Track habits, crush goals, level up — a brutalist, offline-first productivity OS.

  [![Live](https://img.shields.io/badge/live-zystem.app-000?style=flat-square)](https://zystem.app)
  [![Built with Lovable](https://img.shields.io/badge/built%20with-Lovable-000?style=flat-square)](https://lovable.dev)
  [![PWA](https://img.shields.io/badge/PWA-installable-000?style=flat-square)](#)
  [![License](https://img.shields.io/badge/license-MIT-000?style=flat-square)](LICENSE)
</div>

---

## Overview

Zystem is a personal operating system for self-improvement. It blends habit tracking, body metrics, notes, link libraries, deadline reminders, and social challenges behind a single brutalist, monospace interface. Built local-first, it works fully offline and installs as a PWA or native Android app.

## ✨ Features

- 🔥 **Elemental avatars** — Fire / Water / Air / Electric themes drive neon accents.
- ✅ **Habit tracking** — GitHub-style heatmap with 0–4 intensity, locked future dates.
- 📊 **Habit Radar** — Monthly & yearly analytics mapped to elemental axes.
- ⏱️ **Realtime clock & year countdown** — Customizable target date on the dashboard.
- 📝 **Todo list** — Deadline dates with red overdue / orange tomorrow highlights.
- 💧 **Water tracker** — 1L increment bottles with interactive UI.
- 💪 **Body metrics** — US Navy Method BMI / Body Fat with a morphing SVG silhouette.
- 🧠 **Muscle heatmap** — 15 muscle groups mapped to Purple/Gold/Green/Red.
- 📒 **Notes** — Dual-pane editor with debounced auto-save.
- 🔗 **Link libraries** — Categorized links with inline editing & multi-field search.
- 👥 **Social challenges** — Mutual challenges with 6-digit IDs & consistency grids.
- 🔥 **Streaks & revivals** — Streak tracking with revival power mechanics.
- 🔔 **Notifications** — Browser push for 8 PM logins and 1-day deadline warnings.
- 🕶️ **Guest mode** — Continue without an account; data lives on your device.
- 📴 **Offline-first** — Full PWA + Capacitor Android wrapper, no network required.

## 🛠️ Tech Stack

- **Frontend:** React 18 · TypeScript 5 · Vite 5 · Tailwind CSS · shadcn/ui
- **Backend:** Lovable Cloud (Supabase — Auth, Postgres with RLS, Realtime)
- **Auth:** Email/Password + Google OAuth
- **Mobile:** Capacitor (Android)
- **PWA:** `vite-plugin-pwa` with offline service worker
- **State / Data:** TanStack Query + local-first storage layer

## 🎨 Design

Pure white on black brutalism. Zero border radius. `IBM Plex Mono` everywhere. No frivolous animations — Zystem is a serious tool. Accent colors are driven by the user's elemental avatar.

## 🚀 Getting Started

Requires Node.js 18+ and Bun (or npm).

```bash
# Clone
git clone <your-repo-url>
cd zystem

# Install
bun install   # or: npm install

# Run dev
bun run dev   # or: npm run dev
```

App runs at `http://localhost:8080`.

### Environment

Lovable Cloud auto-provisions `.env` with:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```

### Android (Capacitor)

```bash
bun run build
npx cap sync android
npx cap open android
```

## 📁 Project Structure

```
src/
├── components/      # UI + feature components (brutalist shadcn)
├── hooks/           # Data hooks (Supabase + local-first branching)
├── pages/           # Routed views (Dashboard, Notes, Libraries, Friends…)
├── lib/             # localStore, dateUtils, importGuestData
├── integrations/    # Auto-generated Supabase client & types
└── index.css        # Design tokens (HSL semantic)
public/
├── logo.svg         # Brand mark
└── favicon.svg
supabase/            # Cloud config
```

## 🧪 Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start Vite dev server |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bunx vitest run` | Run tests |

## 🔐 Security

- Row-Level Security on every table.
- Roles stored in a dedicated `user_roles` table (never on profiles) with a `SECURITY DEFINER` `has_role()` function.
- Guest data stays on-device unless the user opts into import after sign-in.

## 🌐 Links

- **Live app:** https://zystem.app
- **Preview:** https://zystem.lovable.app
- **Lovable project:** https://lovable.dev/projects/9fb41315-7301-4bd0-8fae-17e5b130c2d0

## 📜 License

MIT © Zyphor

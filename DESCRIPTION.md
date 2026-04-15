# The Mortal Instruments — Interactive Reading Experience
## Project Description

---

## What It Is

A purpose-built web application for reading and exploring *The Mortal Instruments* series by Cassandra Clare. Rather than a generic e-reader, this is a fan-first experience: the complete six-book series wrapped in a dark gothic aesthetic with in-universe companion materials, interactive maps, and atmospheric visual effects.

The entire application runs in the browser. There is no backend, no account system, and no server required — it deploys as a static site.

---

## The Six Books

| # | Title | Year |
|---|-------|------|
| 1 | City of Bones | 2007 |
| 2 | City of Ashes | 2008 |
| 3 | City of Glass | 2009 |
| 4 | City of Fallen Angels | 2011 |
| 5 | City of Lost Souls | 2012 |
| 6 | City of Heavenly Fire | 2014 |

---

## Core Features

### Reading Experience
The reader presents chapter text in a centered column optimized for long-form reading. Users can adjust font size, switch between Dark, Sepia, and Light themes, and toggle "Witchlight Mode" — a softer blue-white palette variant. A progress bar at the top of the viewport tracks position within the current chapter. A slide-out Table of Contents lists every chapter grouped by part for quick navigation.

Reading progress is automatically saved: the app remembers your scroll position in every chapter, which chapters you've completed, and your last-read position — all across browser sessions via localStorage.

### Library & Home
The home screen shows all six books as cards with cover art and a progress bar for each. A "Continue Reading" banner links directly to the last chapter you were reading, with no hunting required.

### Companion Guide — The Shadowhunter's Codex
An in-universe reference guide with four sections:
- **Characters** — portraits and bios for 8 major characters (Clary, Jace, Simon, Alec, Isabelle, Magnus, Luke, Valentine)
- **Runes** — 12 canonical Marks with custom SVG symbols and descriptions
- **Bestiary** — 6 creature types: Demons, Vampires, Werewolves, Warlocks, Faeries, Silent Brothers
- **Glossary** — 19 key terms from the Shadowhunter universe

### Interactive Maps
Two thematic maps with clickable/hoverable location markers:
- **New York** — 8 Shadowhunter locations including the New York Institute, Pandemonium Club, and the Hotel Dumort
- **Idris** — 8 locations in the Shadowhunter homeland: Alicante, Lake Lyn, the Adamant Citadel, and more

Each location shows a description and the books it appears in.

### Visual Effects & Easter Eggs
- Floating rune particles drift across non-reader pages (canvas-based, capped at 25)
- Mouse-trail sparkles on the home page
- A glamour overlay dissolves on first visit
- The Konami code (↑↑↓↓←→←→BA) triggers a portal animation
- Triple-clicking the hero rune triggers a "By the Angel!" flash

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Build | Vite 6.0.0 |
| Language | Vanilla JavaScript (ES6+) |
| Styling | CSS3 — custom properties, Grid, Flexbox |
| Fonts | Cinzel, Cinzel Decorative, Crimson Text, Inter (Google Fonts) |
| Data | Static JSON (book metadata) + static HTML fragments (chapters) |
| State | localStorage only |
| Runtime deps | None (Vite is a dev/build tool only) |

No frameworks, no UI libraries, no backend. The entire frontend is hand-written HTML, CSS, and JavaScript.

---

## Architecture

```
src/
  main.js              — app bootstrap, hash-based router
  views/
    home.js            — library & landing page
    reader.js          — chapter reading view
    guide.js           — companion guide (characters, runes, etc.)
    map.js             — interactive maps
  effects/
    particles.js       — floating rune particle system
    easterEggs.js      — Konami code, triple-click, mouse trail
  utils/
    progress.js        — localStorage reading progress manager
  styles/
    main.css           — design system + all styles

public/
  data/
    books.json         — book metadata and chapter index
    chapters/          — HTML fragments, one file per chapter
  images/
    epub/              — cover art (JPEG)
    generated/         — character portraits, maps (WebP)
```

**Routing** is hash-based (e.g., `#/read/city-of-bones/chapter-1`). All navigation is client-side with no page reloads. Each view renders by returning an HTML string, and registers/cleans up its own event listeners.

**Data flow:** On startup, `books.json` is fetched once and held in memory. Chapter HTML is fetched lazily when the user navigates to a chapter. All other content (characters, runes, map locations) is hardcoded in the view files.

---

## Design System

The visual identity is built on 70+ CSS custom properties:

- **Colors:** Deep navy/black backgrounds, gold (`#c9a84c`) as the primary accent, silver for secondary elements, blood red and portal purple for highlights
- **Typography:** Cinzel Decorative for branding/display, Cinzel for headings, Crimson Text for body reading text, Inter for UI controls
- **Aesthetic:** Gothic dark fantasy — angular shapes, rune motifs, soft glows, aged-parchment textures in Sepia mode

---

## Running Locally

```bash
npm install      # install Vite
npm run dev      # dev server at http://localhost:3000
npm run build    # production build → /dist
npm run preview  # preview the production build
```

The dev server auto-opens the browser. The production build is a static directory that can be dropped on any CDN.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Previous / Next chapter |
| `T` | Toggle Table of Contents |
| `Escape` | Close Table of Contents |
| `↑↑↓↓←→←→BA` | Portal easter egg |

---

## Browser Support

Modern evergreen browsers: Chrome, Firefox, Safari, Edge. Requires ES6 modules, CSS Grid, CSS custom properties, the Canvas API, and localStorage. No legacy browser support.

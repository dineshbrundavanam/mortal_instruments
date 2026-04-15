# Product Requirements Document
## The Mortal Instruments — Interactive Reading Experience

**Version:** 1.0  
**Date:** April 2026  
**Status:** Active

---

## 1. Overview

### 1.1 Product Summary

The Mortal Instruments Interactive Reader is a client-side web application that delivers the complete six-book series by Cassandra Clare alongside rich companion materials. It targets fans who want more than a plain e-reader — they want an immersive experience that feels native to the world of Shadowhunters: gothic atmosphere, interactive maps, character dossiers, and rune encyclopedias, all in one place.

### 1.2 Problem Statement

Existing e-reader apps (Kindle, Apple Books, generic EPUB readers) are generic. They do not offer:
- In-universe companion materials alongside the text
- Thematic visual design that reflects the source material's aesthetic
- Interactive locations maps for a fictional universe
- Character, creature, and rune references accessible without leaving the reading flow
- A delightful, fan-first experience with easter eggs and atmospheric touches

This project fills that gap by building a purpose-made reading environment for this specific series.

### 1.3 Goals

| Goal | Metric |
|------|--------|
| Deliver the complete series in a readable, beautiful interface | All 6 books, all chapters accessible |
| Persist reading progress reliably across sessions | localStorage-backed; position survives page reloads |
| Offer companion lore without breaking reading flow | Guide and map accessible from global nav |
| Load fast on modern browsers with no backend dependency | Fully static; deployable to any CDN |
| Delight fans with atmospheric design and easter eggs | Dark gothic theme, particle effects, Konami code |

### 1.4 Non-Goals

- Multi-user accounts or cloud sync
- Purchase flow or DRM
- Native mobile app (iOS/Android)
- Social features (annotations, highlights sharing)
- Support for IE11 or legacy browsers
- Offline-first / PWA capabilities (not a current requirement)

---

## 2. Users

### 2.1 Primary User

**The Fan Reader**
- Has read the series at least once; wants to re-read or reference specific sections
- Wants to look up characters, runes, or creatures without switching tabs
- Values aesthetic: expects a dark, gothic atmosphere consistent with the books
- Uses a modern desktop or laptop browser; may occasionally use a tablet

### 2.2 Secondary User

**The New Reader**
- Discovering the series for the first time through this app
- Relies more heavily on the Glossary and Bestiary for world-building context
- Progress tracking is essential — they may pause between sessions for days

---

## 3. Features

### 3.1 Library & Home View

**Description:** The landing page displays all six books as cards with cover art, title, tagline, and reading progress.

**Requirements:**
- Display all 6 books with cover art, book number, title, tagline, and publication year
- Show per-book reading progress as a colored progress bar
- Surface a "Continue Reading" banner linking to the user's most recently read chapter
- Clicking a book card navigates to that book's first unread chapter (or last read chapter if in progress)
- Animated glamour overlay displayed on first visit only; dissolves automatically after 3 seconds

### 3.2 Reader View

**Description:** The core reading experience — displays chapter text with navigation controls and reading utilities.

**Requirements:**
- Render chapter HTML content in a centered, max-width-constrained column
- Display chapter title, book title, and chapter number in the reader header
- Provide Previous / Next chapter navigation (buttons and keyboard arrow keys)
- Show a reading progress bar fixed to the top of the viewport, updating on scroll
- Table of Contents sidebar: toggleable via button (T key shortcut), lists all chapters grouped by part, closes on Escape
- Font size control: adjustable from 14px to 28px in 2px steps, persisted in localStorage
- Reading mode switcher: Dark (default), Sepia, Light — persisted in localStorage
- Witchlight Mode toggle: alternate blue-white ambient palette, persisted in localStorage
- Auto-save scroll position per chapter on scroll (300ms debounce); restore on return
- Mark chapter as completed when user scrolls past 90% of content
- Lazy-load chapter HTML on demand (not preloaded at startup)

### 3.3 Companion Guide ("The Shadowhunter's Codex")

**Description:** An in-universe reference guide with four tabs of lore content.

**Requirements:**

**Characters Tab**
- Display 8 major characters: Clary, Jace, Simon, Alec, Isabelle, Magnus, Luke, Valentine
- Each card: portrait image (graceful fallback to initials + gradient), name, alias, species, short biography
- Portraits lazy-loaded

**Runes Tab**
- Display 12 canonical runes: Angelic Power, Voyance, Iratze, Deflect, Speed, Strength, Stealth, Clairvoyance, Alliance, Love, Fearless, Parabatai
- Each entry: custom SVG symbol, rune name, alternate (Shadowhunter) name, description

**Bestiary Tab**
- Display 6 creature categories: Demons, Vampires, Werewolves, Warlocks, Faeries, Silent Brothers
- Each entry: name, description of nature/abilities, notable traits

**Glossary Tab**
- Display 19 key terms from the Shadowhunter universe
- Each entry: term, definition

### 3.4 Interactive Maps

**Description:** Two thematic maps with interactive location markers.

**Requirements:**

**New York Map**
- Display styled map image of NYC
- 8 interactive location markers positioned via CSS percentages (fully responsive)
- Hover/tap reveals a location card: name, description, books where it appears
- Locations include: New York Institute, Pandemonium Club, Jade Wolf, Taki's Diner, Dumort Hotel, Clary's Brooklyn apartment, Hunter's Moon, and the Morningstar mansion

**Idris Map**
- Display styled map image of the Shadowhunter homeworld
- 8 interactive location markers
- Same hover/tap card behavior as NYC map
- Locations include: Alicante, Lake Lyn, Adamant Citadel, Brocelind Forest, Alicante Academy, Gard, Wayland Manor, and the Clave headquarters

### 3.5 Reading Progress Tracking

**Description:** Persistent, per-chapter progress management using localStorage.

**Requirements:**
- Track: last-read chapter ID, last-read timestamp, scroll position per chapter, completed chapters array — all per book
- Calculate and display book-level completion percentage on home screen
- "Continue Reading" banner reflects true last-read position, not just book-level
- Progress survives page reload and browser restarts
- No account required; all data stored locally under key `tmi-reading-progress`

### 3.6 Visual Effects & Easter Eggs

**Description:** Atmospheric effects that create immersion and reward engaged fans.

**Requirements:**
- Floating rune particle system on non-reader pages (max 25 simultaneous particles, canvas-based)
- Mouse-trail sparkle effect on the home page
- Glamour overlay on first visit (CSS animation, `tmi-visited` localStorage flag)
- Konami code (↑↑↓↓←→←→BA) triggers a full-screen portal animation
- Hero rune triple-click triggers a "By the Angel!" flash animation
- Toast notification system for user-facing confirmations (e.g., chapter marked complete)

### 3.7 Navigation

**Description:** Hash-based client-side router.

**Routes:**

| Route | View |
|-------|------|
| `#/` | Home / Library |
| `#/read/:bookId/:chapterId` | Reader |
| `#/book/:bookId` | Redirects to last/first chapter of a book |
| `#/guide/:tab` | Companion Guide (tab: characters, runes, bestiary, glossary) |
| `#/map/:tab` | Interactive Maps (tab: nyc, idris) |

**Requirements:**
- Navigation handled entirely client-side with no page reloads
- Back/forward browser buttons work as expected
- Active nav item highlighted in global navigation bar
- Each view cleans up its event listeners when navigating away

---

## 4. Design Requirements

### 4.1 Visual Identity

- **Primary palette:** Deep navy/black backgrounds, gold (#c9a84c) accents, silver secondary accents, blood-red and portal-purple highlights
- **Typography:** Cinzel Decorative (display/branding), Cinzel (headings), Crimson Text (body/reading), Inter (UI controls)
- **Aesthetic:** Gothic dark fantasy — angular decorative elements, rune motifs, aged parchment textures in sepia mode

### 4.2 Responsive Design

- Desktop-first layout; readable and usable on tablets (768px+)
- Mobile navigation collapses to hamburger/overlay pattern
- TOC sidebar collapses to overlay on small screens
- Typography uses `clamp()` for fluid scaling
- Map location cards reposition to stay within viewport on hover

### 4.3 Reader Typography

- Body text: Crimson Text, minimum 14px, maximum 28px (user-controlled)
- Line height: 1.8 for reading comfort
- Max content width: 720px (optimal reading line length)
- Paragraph spacing: consistent vertical rhythm

---

## 5. Technical Requirements

### 5.1 Architecture

- **Type:** Client-side Single Page Application (SPA)
- **Build tool:** Vite 6.0.0
- **Language:** Vanilla JavaScript (ES6+), no framework dependencies
- **Styling:** CSS3 with custom properties; no CSS framework
- **Data:** Static JSON for metadata; static HTML fragments for chapter content
- **State:** LocalStorage only; no server-side state

### 5.2 Performance

- Initial JS bundle must be small; chapter content loaded on demand (lazy fetch)
- Images use `loading="lazy"` attribute
- Particle system capped at 25 particles; uses `requestAnimationFrame`
- Scroll handlers debounced at 300ms
- Books metadata fetched once and cached in memory for session lifetime

### 5.3 Browser Support

- Chrome, Firefox, Safari, Edge — latest two major versions
- ES6 modules, CSS Grid, CSS custom properties, Canvas API, localStorage required
- No polyfills for legacy browsers

### 5.4 Deployment

- Fully static; no server-side runtime required
- Deployable to any static CDN (Netlify, Vercel, GitHub Pages, S3 + CloudFront)
- Dev server on port 3000 via `vite`
- Production build via `vite build` outputs to `/dist`

### 5.5 LocalStorage Keys

| Key | Purpose |
|-----|---------|
| `tmi-visited` | Whether glamour intro has been shown |
| `tmi-witchlight` | Witchlight mode on/off |
| `tmi-reading-mode` | Reader theme: dark / sepia / light |
| `tmi-font-size` | Reader font size in pixels |
| `tmi-reading-progress` | Full reading progress object |

---

## 6. Accessibility

- Semantic HTML5 structure throughout
- ARIA labels on interactive elements (buttons, toggles, nav)
- Keyboard navigation: arrow keys (chapter nav), T (toggle TOC), Escape (close TOC)
- Image `alt` attributes present on all meaningful images
- Color contrast ratios meet WCAG AA for body text
- Focus styles visible on keyboard navigation

---

## 7. Content Inventory

| Content Type | Count | Format | Location |
|---|---|---|---|
| Books | 6 | Metadata in JSON | `/public/data/books.json` |
| Chapters | ~150 total | HTML fragments | `/public/data/chapters/` |
| Book covers | 6 | JPEG | `/public/images/epub/` |
| Character portraits | 8 | WebP | `/public/images/generated/` |
| Maps | 2 | WebP | `/public/images/generated/` |
| Rune SVGs | 12 | Inline SVG strings | `src/views/guide.js` |
| Characters | 8 | Hardcoded JS objects | `src/views/guide.js` |
| Map locations | 16 (8 per map) | Hardcoded JS objects | `src/views/map.js` |
| Glossary terms | 19 | Hardcoded JS objects | `src/views/guide.js` |

---

## 8. Out of Scope (Future Considerations)

The following are explicitly out of scope for the current version but may be considered for future iterations:

- **User accounts & cloud sync** — progress synced across devices
- **Bookmarks & annotations** — user-created notes on specific passages
- **Search** — full-text search across all books
- **Audio mode** — text-to-speech reading
- **PWA / offline support** — service worker for offline reading
- **Social features** — shareable quotes, reading groups
- **Additional series** — The Infernal Devices, The Dark Artifices
- **Accessibility audit** — formal WCAG 2.1 AA compliance testing

---

## 9. Success Criteria

The product is considered successful when:

1. All six books are fully readable from start to finish without errors
2. Reading progress persists accurately across sessions
3. Guide and map content loads correctly on all supported browsers
4. Visual effects perform at 60fps on a modern mid-range device
5. The application deploys and serves correctly as a static site
6. No JavaScript errors appear in the browser console during normal use

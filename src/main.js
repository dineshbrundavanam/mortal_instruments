/* ═══════════════════════════════════════════════════════════════════════════
   main.js — SPA Router & App Bootstrap
   The Mortal Instruments Interactive Reading Experience
   ═══════════════════════════════════════════════════════════════════════════ */

import { renderHome } from './views/home.js';
import { renderReader } from './views/reader.js';
import { renderGuide } from './views/guide.js';
import { renderMap } from './views/map.js';
import { initParticles } from './effects/particles.js';
import { initEasterEggs } from './effects/eastereggs.js';
import { ProgressManager } from './utils/progress.js';

// ─── App State ──────────────────────────────────────────────────────────────
const app = document.getElementById('app');
let booksData = null;
let currentView = null;
let currentCleanup = null;

// ─── Data Loading ───────────────────────────────────────────────────────────
async function loadBooksData() {
  if (booksData) return booksData;
  const res = await fetch('/data/books.json');
  booksData = await res.json();
  return booksData;
}

// ─── Router ─────────────────────────────────────────────────────────────────
function parseRoute() {
  const hash = window.location.hash || '#/';
  const parts = hash.slice(2).split('/'); // remove '#/'
  
  if (parts[0] === '' || parts[0] === undefined) {
    return { view: 'home' };
  }
  if (parts[0] === 'read' && parts[1] && parts[2]) {
    return { view: 'reader', bookId: parts[1], chapterId: parts[2] };
  }
  if (parts[0] === 'book' && parts[1]) {
    return { view: 'reader', bookId: parts[1], chapterId: null };
  }
  if (parts[0] === 'guide') {
    return { view: 'guide', tab: parts[1] || 'characters' };
  }
  if (parts[0] === 'map') {
    return { view: 'map', tab: parts[1] || 'nyc' };
  }
  return { view: 'home' };
}

function updateNavActive(viewName) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  const navMap = {
    'home': 'nav-home',
    'reader': null,
    'guide': 'nav-guide',
    'map': 'nav-map',
  };
  
  const id = navMap[viewName];
  if (id) {
    document.getElementById(id)?.classList.add('active');
  }
}

async function navigate() {
  const route = parseRoute();
  const data = await loadBooksData();
  
  // Cleanup previous view
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }
  
  // Animate out
  if (currentView) {
    app.classList.add('view-exit');
    await new Promise(r => setTimeout(r, 200));
  }
  
  app.classList.remove('view-exit');
  app.innerHTML = '';
  
  updateNavActive(route.view);
  
  // Show/hide particles based on view
  const particleCanvas = document.getElementById('rune-particles');
  if (route.view === 'reader') {
    particleCanvas.style.display = 'none';
  } else {
    particleCanvas.style.display = 'block';
  }
  
  // Show/hide nav in reader
  const nav = document.getElementById('main-nav');
  if (route.view === 'reader') {
    nav.classList.add('reader-nav');
  } else {
    nav.classList.remove('reader-nav');
  }
  
  let cleanup = null;
  
  switch (route.view) {
    case 'home':
      cleanup = renderHome(app, data);
      break;
    case 'reader':
      cleanup = await renderReader(app, data, route.bookId, route.chapterId);
      break;
    case 'guide':
      cleanup = renderGuide(app, data, route.tab);
      break;
    case 'map':
      cleanup = renderMap(app, data, route.tab);
      break;
    default:
      cleanup = renderHome(app, data);
  }
  
  currentCleanup = cleanup;
  currentView = route.view;
  
  // Animate in
  app.classList.add('view-enter');
  setTimeout(() => app.classList.remove('view-enter'), 500);
  
  // Scroll to top unless reader (handled internally)
  if (route.view !== 'reader') {
    window.scrollTo(0, 0);
  }
}

// ─── Glamour Intro ──────────────────────────────────────────────────────────
function initGlamour() {
  const overlay = document.getElementById('glamour-overlay');
  const hasVisited = localStorage.getItem('tmi-visited');
  
  if (hasVisited) {
    overlay.classList.add('hidden');
    return;
  }
  
  localStorage.setItem('tmi-visited', 'true');
  
  setTimeout(() => {
    overlay.classList.add('dissolving');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 1500);
  }, 3000);
}

// ─── Witchlight Toggle ─────────────────────────────────────────────────────
function initWitchlight() {
  const btn = document.getElementById('witchlight-toggle');
  const isWitchlight = localStorage.getItem('tmi-witchlight') === 'true';
  
  if (isWitchlight) {
    document.body.classList.add('witchlight-mode');
    btn.classList.add('active');
  }
  
  btn.addEventListener('click', () => {
    const active = document.body.classList.toggle('witchlight-mode');
    btn.classList.toggle('active', active);
    localStorage.setItem('tmi-witchlight', active);
    
    showToast(active ? '✨ Witchlight activated' : '🌙 Witchlight off');
  });
}

// ─── Toast System ───────────────────────────────────────────────────────────
export function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── Bootstrap ──────────────────────────────────────────────────────────────
async function init() {
  initGlamour();
  initParticles();
  initWitchlight();
  initEasterEggs();
  
  window.addEventListener('hashchange', navigate);
  await navigate();
}

init();

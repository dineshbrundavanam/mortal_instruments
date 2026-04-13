/* ═══════════════════════════════════════════════════════════════════════════
   eastereggs.js — Easter Eggs: Konami Code, "By the Angel!" etc
   ═══════════════════════════════════════════════════════════════════════════ */

import { showToast } from '../main.js';

// ─── Konami Code (↑↑↓↓←→←→BA) ──────────────────────────────────────────
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;

function triggerPortal() {
  const portal = document.createElement('div');
  portal.className = 'portal-effect';
  portal.innerHTML = `
    <div class="portal-ring"></div>
  `;
  document.body.appendChild(portal);
  
  showToast('🌀 A Portal to Idris opens...');
  
  setTimeout(() => portal.remove(), 3500);
}

// ─── "By the Angel!" (click hero rune 3 times quickly) ───────────────────
let runeClicks = 0;
let runeClickTimer = null;

function handleRuneClick() {
  runeClicks++;
  
  if (runeClickTimer) clearTimeout(runeClickTimer);
  runeClickTimer = setTimeout(() => { runeClicks = 0; }, 800);
  
  if (runeClicks >= 3) {
    runeClicks = 0;
    triggerAngelFlash();
  }
}

function triggerAngelFlash() {
  const flash = document.createElement('div');
  flash.className = 'angel-flash';
  flash.innerHTML = `<span class="angel-flash-text">By the Angel!</span>`;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 1500);
}

// ─── Mouse trail (subtle golden particles on home screen) ────────────────
let mouseTrailActive = false;

function initMouseTrail() {
  document.addEventListener('mousemove', (e) => {
    // Only on home view
    if (!document.querySelector('.home-view')) return;
    
    // Throttle — only every 5th event
    if (Math.random() > 0.15) return;
    
    const spark = document.createElement('div');
    spark.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 4px;
      height: 4px;
      background: rgba(201, 168, 76, 0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9000;
      animation: sparkFade 0.8s ease-out forwards;
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 800);
  });
  
  // Add sparkFade animation if not exists
  if (!document.getElementById('spark-styles')) {
    const style = document.createElement('style');
    style.id = 'spark-styles';
    style.textContent = `
      @keyframes sparkFade {
        0% { opacity: 1; transform: scale(1) translateY(0); }
        100% { opacity: 0; transform: scale(0) translateY(-20px); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ─── Init all easter eggs ────────────────────────────────────────────────
export function initEasterEggs() {
  // Konami code listener
  document.addEventListener('keydown', (e) => {
    if (e.key === KONAMI[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === KONAMI.length) {
        triggerPortal();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
  
  // Hero rune click listener (delegated)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.hero-rune')) {
      handleRuneClick();
    }
  });
  
  // Mouse trail
  initMouseTrail();
}

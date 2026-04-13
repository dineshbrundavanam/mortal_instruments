/* ═══════════════════════════════════════════════════════════════════════════
   reader.js — Immersive Chapter Reader View
   ═══════════════════════════════════════════════════════════════════════════ */

import { ProgressManager } from '../utils/progress.js';
import { showToast } from '../main.js';

export async function renderReader(container, data, bookId, chapterId) {
  const book = data.books.find(b => b.id === bookId);
  if (!book) {
    container.innerHTML = '<p style="padding: 2rem; text-align: center;">Book not found.</p>';
    return null;
  }
  
  // If no chapter specified, use last read or first chapter
  if (!chapterId) {
    const progress = ProgressManager.getBookProgress(bookId);
    chapterId = progress.lastChapterId || book.chapters[0].id;
    window.location.hash = `#/read/${bookId}/${chapterId}`;
    return null;
  }
  
  const chapterIndex = book.chapters.findIndex(c => c.id === chapterId);
  const chapter = book.chapters[chapterIndex];
  
  if (!chapter) {
    container.innerHTML = '<p style="padding: 2rem; text-align: center;">Chapter not found.</p>';
    return null;
  }
  
  const prevChapter = chapterIndex > 0 ? book.chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < book.chapters.length - 1 ? book.chapters[chapterIndex + 1] : null;
  
  // Check if we need to go to next/prev book
  const bookIndex = data.books.findIndex(b => b.id === bookId);
  const nextBook = !nextChapter && bookIndex < data.books.length - 1 ? data.books[bookIndex + 1] : null;
  const prevBook = !prevChapter && bookIndex > 0 ? data.books[bookIndex - 1] : null;
  
  // Load chapter content
  let chapterHtml = '';
  try {
    const res = await fetch(`/${chapter.file}`);
    chapterHtml = await res.text();
  } catch (e) {
    chapterHtml = '<p>Error loading chapter content.</p>';
  }
  
  // Get reading mode
  const readingMode = localStorage.getItem('tmi-reading-mode') || 'dark';
  const fontSize = parseInt(localStorage.getItem('tmi-font-size') || '18');
  
  const html = `
    <div class="reader-view ${readingMode !== 'dark' ? `reader-${readingMode}` : ''}" id="reader-view">
      <!-- Reading progress bar -->
      <div class="reading-progress">
        <div class="reading-progress-fill" id="reading-progress-fill" style="width: 0%"></div>
      </div>
      
      <!-- TOC Overlay -->
      <div class="toc-overlay" id="toc-overlay"></div>
      
      <!-- TOC Sidebar -->
      <aside class="toc-sidebar" id="toc-sidebar">
        <div class="toc-header">
          <span class="toc-title">${book.title}</span>
          <button class="toc-close" id="toc-close" aria-label="Close table of contents">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        ${renderTOC(book.chapters, chapterId, bookId)}
      </aside>
      
      <!-- Chapter Header -->
      <header class="chapter-header">
        <div class="chapter-book-title">${book.title}</div>
        <div class="chapter-part">${chapter.part}</div>
        ${chapter.number > 0 ? `<div class="chapter-number">Chapter ${chapter.number}</div>` : ''}
        <h1 class="chapter-title">${chapter.title}</h1>
        <div class="chapter-meta">
          <span>📖 ~${chapter.readingTime} min read</span>
          <span>•</span>
          <span>${chapterIndex + 1} of ${book.chapters.length}</span>
        </div>
        <div class="chapter-divider"></div>
      </header>
      
      <!-- Chapter Content -->
      <article class="chapter-content" id="chapter-content" style="--reader-font-size: ${fontSize}px">
        ${chapterHtml}
      </article>
      
      <!-- Chapter Navigation -->
      <nav class="chapter-nav">
        <button class="chapter-nav-btn prev" id="nav-prev" ${!prevChapter && !prevBook ? 'disabled' : ''}>
          <span class="chapter-nav-label">← Previous</span>
          <span class="chapter-nav-title">${prevChapter ? prevChapter.title : (prevBook ? `${prevBook.title} (Final)` : 'Start of Book')}</span>
        </button>
        <button class="chapter-nav-btn next" id="nav-next" ${!nextChapter && !nextBook ? 'disabled' : ''}>
          <span class="chapter-nav-label">Next →</span>
          <span class="chapter-nav-title">${nextChapter ? nextChapter.title : (nextBook ? `${nextBook.title} (Begin)` : 'End of Series')}</span>
        </button>
      </nav>
      
      <!-- Reader Controls -->
      <div class="reader-controls">
        <button class="reader-control-btn" id="btn-toc" title="Table of Contents (T)">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
        <button class="reader-control-btn" id="btn-font-up" title="Increase Font Size">A+</button>
        <button class="reader-control-btn" id="btn-font-down" title="Decrease Font Size">A−</button>
        <button class="reader-control-btn" id="btn-theme" title="Reading Theme">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a10 10 0 0 0 0 20z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // ─── Setup event listeners ──────────────────────────────────────────────
  
  // TOC toggle
  const tocSidebar = document.getElementById('toc-sidebar');
  const tocOverlay = document.getElementById('toc-overlay');
  
  function toggleTOC(open) {
    tocSidebar.classList.toggle('open', open);
    tocOverlay.classList.toggle('visible', open);
  }
  
  document.getElementById('btn-toc').addEventListener('click', () => toggleTOC(true));
  document.getElementById('toc-close').addEventListener('click', () => toggleTOC(false));
  tocOverlay.addEventListener('click', () => toggleTOC(false));
  
  // Navigation
  document.getElementById('nav-prev').addEventListener('click', () => {
    if (prevChapter) {
      window.location.hash = `#/read/${bookId}/${prevChapter.id}`;
    } else if (prevBook) {
      const lastCh = prevBook.chapters[prevBook.chapters.length - 1];
      window.location.hash = `#/read/${prevBook.id}/${lastCh.id}`;
    }
  });
  
  document.getElementById('nav-next').addEventListener('click', () => {
    ProgressManager.markChapterComplete(bookId, chapterId);
    if (nextChapter) {
      window.location.hash = `#/read/${bookId}/${nextChapter.id}`;
    } else if (nextBook) {
      window.location.hash = `#/read/${nextBook.id}/${nextBook.chapters[0].id}`;
    }
  });
  
  // Font size controls
  const contentEl = document.getElementById('chapter-content');
  let currentFontSize = fontSize;
  
  document.getElementById('btn-font-up').addEventListener('click', () => {
    currentFontSize = Math.min(28, currentFontSize + 2);
    contentEl.style.setProperty('--reader-font-size', `${currentFontSize}px`);
    localStorage.setItem('tmi-font-size', currentFontSize);
    showToast(`Font size: ${currentFontSize}px`);
  });
  
  document.getElementById('btn-font-down').addEventListener('click', () => {
    currentFontSize = Math.max(14, currentFontSize - 2);
    contentEl.style.setProperty('--reader-font-size', `${currentFontSize}px`);
    localStorage.setItem('tmi-font-size', currentFontSize);
    showToast(`Font size: ${currentFontSize}px`);
  });
  
  // Theme toggle (dark → sepia → light → dark)
  const themes = ['dark', 'sepia', 'light'];
  let themeIndex = themes.indexOf(readingMode);
  
  document.getElementById('btn-theme').addEventListener('click', () => {
    themeIndex = (themeIndex + 1) % themes.length;
    const newTheme = themes[themeIndex];
    const readerView = document.getElementById('reader-view');
    
    readerView.classList.remove('reader-sepia', 'reader-light');
    if (newTheme !== 'dark') {
      readerView.classList.add(`reader-${newTheme}`);
    }
    
    localStorage.setItem('tmi-reading-mode', newTheme);
    showToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode`);
  });
  
  // Keyboard shortcuts
  function handleKeydown(e) {
    if (e.key === 'ArrowLeft' && prevChapter) {
      window.location.hash = `#/read/${bookId}/${prevChapter.id}`;
    } else if (e.key === 'ArrowRight' && nextChapter) {
      ProgressManager.markChapterComplete(bookId, chapterId);
      window.location.hash = `#/read/${bookId}/${nextChapter.id}`;
    } else if (e.key === 't' || e.key === 'T') {
      toggleTOC(!tocSidebar.classList.contains('open'));
    } else if (e.key === 'Escape') {
      toggleTOC(false);
    }
  }
  document.addEventListener('keydown', handleKeydown);
  
  // Scroll tracking with debounce
  const progressFill = document.getElementById('reading-progress-fill');
  let scrollTimeout = null;
  
  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    
    progressFill.style.width = `${percent}%`;
    
    // Debounce save
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      ProgressManager.saveChapterPosition(bookId, chapterId, percent);
      
      // Mark complete if scrolled to bottom
      if (percent > 95) {
        ProgressManager.markChapterComplete(bookId, chapterId);
      }
    }, 300);
  }
  window.addEventListener('scroll', handleScroll);
  
  // Restore scroll position
  const savedScroll = ProgressManager.getScrollPosition(bookId, chapterId);
  if (savedScroll > 5) {
    setTimeout(() => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTarget = (savedScroll / 100) * docHeight;
      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }, 300);
  } else {
    window.scrollTo(0, 0);
  }
  
  // Save initial position
  ProgressManager.saveChapterPosition(bookId, chapterId, savedScroll || 0);
  
  // Nav auto-hide on scroll (show on upscroll)
  let lastScrollY = window.scrollY;
  const nav = document.getElementById('main-nav');
  
  function handleNavScroll() {
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 100) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastScrollY = currentY;
  }
  window.addEventListener('scroll', handleNavScroll);
  
  // Cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('scroll', handleNavScroll);
    nav.classList.remove('nav-hidden');
    if (scrollTimeout) clearTimeout(scrollTimeout);
  };
}

function renderTOC(chapters, activeChapterId, bookId) {
  let currentPart = '';
  let html = '';
  
  for (const ch of chapters) {
    if (ch.part !== currentPart) {
      currentPart = ch.part;
      html += `<div class="toc-part">${currentPart}</div>`;
    }
    
    const isActive = ch.id === activeChapterId;
    const label = ch.number > 0 ? `${ch.number}. ` : '';
    
    html += `
      <a href="#/read/${bookId}/${ch.id}" class="toc-item ${isActive ? 'active' : ''}">
        ${ch.number > 0 ? `<span class="toc-item-number">${ch.number}</span>` : ''}
        ${ch.title}
      </a>
    `;
  }
  
  return html;
}

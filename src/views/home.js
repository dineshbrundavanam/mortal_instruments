/* ═══════════════════════════════════════════════════════════════════════════
   home.js — Book Selection / Library Home View
   ═══════════════════════════════════════════════════════════════════════════ */

import { ProgressManager } from '../utils/progress.js';

export function renderHome(container, data) {
  const lastRead = ProgressManager.getLastRead();
  let lastReadBook = null;
  let lastReadChapter = null;
  
  if (lastRead) {
    lastReadBook = data.books.find(b => b.id === lastRead.bookId);
    if (lastReadBook) {
      lastReadChapter = lastReadBook.chapters.find(c => c.id === lastRead.chapterId);
    }
  }
  
  const html = `
    <div class="home-view">
      <!-- Hero Section -->
      <section class="hero">
        <svg class="hero-rune" viewBox="0 0 100 140" aria-label="Angelic Power Rune">
          <path d="M50 5 L50 135 M25 35 L75 35 M20 70 L80 70 M30 105 L70 105 M50 5 L25 35 M50 5 L75 35 M25 35 L20 70 M75 35 L80 70 M20 70 L30 105 M80 70 L70 105 M30 105 L50 135 M70 105 L50 135" 
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                style="color: var(--gold)"/>
        </svg>
        <h1 class="hero-title">The Mortal Instruments</h1>
        <p class="hero-subtitle">The Complete Collection</p>
        <p class="hero-author">by Cassandra Clare</p>
      </section>
      
      ${lastReadBook && lastReadChapter ? `
        <!-- Continue Reading Banner -->
        <a href="#/read/${lastReadBook.id}/${lastReadChapter.id}" class="continue-banner" id="continue-banner">
          <div class="continue-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <div class="continue-info">
            <div class="continue-label">Continue Reading</div>
            <div class="continue-title">${lastReadBook.title}</div>
            <div class="continue-chapter">${lastReadChapter.number > 0 ? `Chapter ${lastReadChapter.number}: ` : ''}${lastReadChapter.title}</div>
          </div>
        </a>
      ` : ''}
      
      <!-- Book Grid -->
      <div class="section-title">The Six Books</div>
      <div class="book-grid" id="book-grid">
        ${data.books.map(book => {
          const progress = ProgressManager.getBookCompletionPercent(book.id, book.totalChapters);
          const bookProgress = ProgressManager.getBookProgress(book.id);
          const lastChapter = bookProgress.lastChapterId 
            ? book.chapters.find(c => c.id === bookProgress.lastChapterId)
            : null;
          
          return `
            <article class="book-card" data-book-id="${book.id}" id="book-card-${book.bookNumber}">
              <div class="book-card-cover">
                <img src="${book.coverImage}" alt="${book.title} cover" loading="lazy" />
                <span class="book-number">Book ${book.bookNumber}</span>
              </div>
              <div class="book-card-body">
                <h2 class="book-card-title">${book.title}</h2>
                <div class="book-card-year">${book.year}</div>
                <p class="book-card-tagline">${book.tagline}</p>
                <div class="book-card-meta">
                  <span class="book-card-chapters">${book.totalChapters} chapters</span>
                  ${lastChapter ? `<span style="color: var(--gold); font-size: 0.75rem;">📖 ${lastChapter.title}</span>` : ''}
                </div>
              </div>
              <div class="book-progress">
                <div class="book-progress-fill" style="width: ${progress}%; background: ${book.color};"></div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Attach click handlers to book cards
  container.querySelectorAll('.book-card').forEach(card => {
    card.addEventListener('click', () => {
      const bookId = card.dataset.bookId;
      const book = data.books.find(b => b.id === bookId);
      const progress = ProgressManager.getBookProgress(bookId);
      
      if (progress.lastChapterId) {
        window.location.hash = `#/read/${bookId}/${progress.lastChapterId}`;
      } else {
        // Start from first chapter
        window.location.hash = `#/read/${bookId}/${book.chapters[0].id}`;
      }
    });
  });
  
  // Stagger card animation
  const cards = container.querySelectorAll('.book-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  });
  
  return null; // no cleanup needed
}

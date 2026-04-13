/* ═══════════════════════════════════════════════════════════════════════════
   progress.js — Reading Progress Manager (localStorage)
   ═══════════════════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'tmi-reading-progress';

export class ProgressManager {
  static getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  }
  
  static getBookProgress(bookId) {
    const all = this.getAll();
    return all[bookId] || { lastChapterId: null, scrollPositions: {}, completedChapters: [] };
  }
  
  static saveChapterPosition(bookId, chapterId, scrollPercent) {
    const all = this.getAll();
    if (!all[bookId]) {
      all[bookId] = { lastChapterId: null, scrollPositions: {}, completedChapters: [] };
    }
    all[bookId].lastChapterId = chapterId;
    all[bookId].scrollPositions[chapterId] = scrollPercent;
    all[bookId].lastRead = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
  
  static markChapterComplete(bookId, chapterId) {
    const all = this.getAll();
    if (!all[bookId]) {
      all[bookId] = { lastChapterId: null, scrollPositions: {}, completedChapters: [] };
    }
    if (!all[bookId].completedChapters.includes(chapterId)) {
      all[bookId].completedChapters.push(chapterId);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
  
  static getScrollPosition(bookId, chapterId) {
    const progress = this.getBookProgress(bookId);
    return progress.scrollPositions[chapterId] || 0;
  }
  
  static getLastRead() {
    const all = this.getAll();
    let latest = null;
    let latestTime = 0;
    
    for (const [bookId, data] of Object.entries(all)) {
      if (data.lastRead && data.lastRead > latestTime) {
        latestTime = data.lastRead;
        latest = { bookId, chapterId: data.lastChapterId };
      }
    }
    return latest;
  }
  
  static getBookCompletionPercent(bookId, totalChapters) {
    const progress = this.getBookProgress(bookId);
    if (!progress.completedChapters || !totalChapters) return 0;
    return Math.round((progress.completedChapters.length / totalChapters) * 100);
  }
}

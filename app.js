const seed = [
  { id: 'solo-leveling', title: 'Solo Leveling', author: 'Chugong', status: 'Reading', chapters: 179, source: 'MangaDex', sourceId: 'mangadex', cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80' },
  { id: 'one-piece', title: 'One Piece', author: 'Eiichiro Oda', status: 'Plan to read', chapters: 1120, source: 'MangaDex', sourceId: 'mangadex', cover: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b0d?w=600&q=80' },
  { id: 'chainsaw-man', title: 'Chainsaw Man', author: 'Tatsuki Fujimoto', status: 'Reading', chapters: 172, source: 'AniList', sourceId: 'anilist', cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076a3f5?w=600&q=80' },
  { id: 'frieren', title: 'Frieren: Beyond Journey’s End', author: 'Kanehito Yamada', status: 'Completed', chapters: 140, source: 'AniList', sourceId: 'anilist', cover: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=80' }
];

const defaults = { direction: 'Vertical', fit: 'Width', theme: 'Dark', preload: true };
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
};

export const store = {
  get library() { return read('manga-library', seed); },
  set library(value) { localStorage.setItem('manga-library', JSON.stringify(value)); },
  get history() { return read('manga-history', []); },
  set history(value) { localStorage.setItem('manga-history', JSON.stringify(value)); },
  get settings() { return { ...defaults, ...read('reader-settings', {}) }; },
  set settings(value) { localStorage.setItem('reader-settings', JSON.stringify(value)); },
  get sources() { return read('manga-sources', []); },
  set sources(value) { localStorage.setItem('manga-sources', JSON.stringify(Array.isArray(value) ? value : [])); }
};

export function cover(manga) { return manga?.cover || seed[0].cover; }
export function findManga(id) { return [...store.library, ...seed].find((manga) => manga.id === id) || store.library[0]; }
export function toast(message) {
  const element = document.createElement('div');
  element.className = 'toast';
  element.textContent = message;
  document.body.append(element);
  setTimeout(() => element.remove(), 2400);
}
export function clearSources() { store.sources = []; }
export function openReader(manga, chapter = 1) {
  if (!manga) return;
  store.history = [{ ...manga, chapter, readAt: new Date().toISOString() }, ...store.history.filter((item) => item.id !== manga.id)].slice(0, 50);
  const modal = document.createElement('div');
  modal.className = 'reader-modal';
  modal.innerHTML = `<div class="reader-box"><button class="close" aria-label="Close">×</button><p class="muted">${manga.title}</p><h1>Chapter ${chapter}</h1><div class="reader-page">Reader preview<br><small>Chapter content is not available from this source yet.</small></div></div>`;
  document.body.append(modal);
  modal.querySelector('.close').onclick = () => modal.remove();
}

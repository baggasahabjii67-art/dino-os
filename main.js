const mangaLibrary = [
  { id: 'solo-leveling', title: 'Solo Leveling', author: 'Chugong', chapters: 179, source: 'MangaDex', cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80' },
  { id: 'one-piece', title: 'One Piece', author: 'Eiichiro Oda', chapters: 1120, source: 'MangaDex', cover: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b0d?w=600&q=80' },
  { id: 'chainsaw-man', title: 'Chainsaw Man', author: 'Tatsuki Fujimoto', chapters: 172, source: 'AniList', cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076a3f5?w=600&q=80' },
  { id: 'frieren', title: 'Frieren: Beyond Journey’s End', author: 'Kanehito Yamada', chapters: 140, source: 'AniList', cover: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=80' }
];

const sourceList = [
  { id: 'mangadex', name: 'MangaDex', language: 'All languages', installed: true },
  { id: 'anilist', name: 'AniList', language: 'All languages', installed: true },
  { id: 'mangafreak', name: 'MangaFreak', language: 'English', installed: false },
  { id: 'mangakakalot', name: 'MangaKakalot', language: 'English', installed: false },
  { id: 'mangasee', name: 'MangaSee', language: 'English', installed: false }
];

const defaultSettings = {
  theme: 'Dark', layout: 'Comfortable', accent: 'Purple', fontSize: 'Medium',
  readingDirection: 'Vertical', pageFit: 'Width', resolution: 'Auto',
  optimization: 'Balanced', preload: 'Enabled', animations: 'Enabled'
};

function loadSettings() {
  try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem('dino-reader-settings') || '{}') }; }
  catch { return { ...defaultSettings }; }
}

let settings = loadSettings();
const app = document.getElementById('app');
let currentTab = 'manga';
let searchText = '';

function saveSettings() { localStorage.setItem('dino-reader-settings', JSON.stringify(settings)); }
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function navButton(id, icon, label) { return `<button class="nav ${currentTab === id ? 'active' : ''}" data-nav="${id}"><span>${icon}</span><label>${label}</label></button>`; }
function renderCard(manga) { return `<article class="card"><div class="cover"><img src="${manga.cover}" alt="${escapeHtml(manga.title)}" /><span class="badge">${escapeHtml(manga.source)}</span></div><h3>${escapeHtml(manga.title)}</h3><p>${escapeHtml(manga.author)} · ${manga.chapters} chapters</p><button class="btn small" data-read="${manga.id}">Read</button></article>`; }
function renderSourceRow(source) { return `<div class="row"><div><b>${escapeHtml(source.name)}</b><p class="muted">${escapeHtml(source.language)} · Built-in source</p></div><button class="btn small" data-source-toggle="${source.id}">${source.installed ? 'Installed' : 'Install'}</button></div>`; }

function renderMangaView() {
  const filtered = mangaLibrary.filter((manga) => `${manga.title} ${manga.author}`.toLowerCase().includes(searchText.toLowerCase()));
  return `<section><div class="heading"><div><h1>Manga</h1><p class="muted">Your manga library</p></div></div><div class="grid">${filtered.map(renderCard).join('') || '<div class="empty">No manga matches your search.</div>'}</div></section>`;
}
function renderHistoryView() { return `<section><div class="heading"><div><h1>History</h1><p class="muted">Reading progress will show here.</p></div></div><div class="panel"><p class="muted">No recent chapters yet.</p></div></section>`; }
function renderSourcesView() { return `<section><div class="heading"><div><h1>Sources</h1><p class="muted">All sources available in the app</p></div></div><div class="panel">${sourceList.map(renderSourceRow).join('')}</div></section>`; }

const settingOptions = {
  theme: ['Dark', 'Light', 'Midnight'], layout: ['Compact', 'Comfortable', 'Spacious'], accent: ['Purple', 'Blue', 'Green', 'Orange'],
  fontSize: ['Small', 'Medium', 'Large'], readingDirection: ['Vertical', 'Horizontal'], pageFit: ['Width', 'Height', 'Original'],
  resolution: ['Auto', '720p', '1080p', '1440p'], optimization: ['Battery saver', 'Balanced', 'Quality'], preload: ['Enabled', 'Disabled'], animations: ['Enabled', 'Disabled']
};
const settingLabels = { theme: 'Theme', layout: 'Layout density', accent: 'Accent color', fontSize: 'Reader font size', readingDirection: 'Reading direction', pageFit: 'Page fit', resolution: 'Resolution', optimization: 'Optimization mode', preload: 'Preload pages', animations: 'Animations' };
function settingControl(key) { return `<label class="setting"><span>${settingLabels[key]}</span><select data-setting="${key}">${settingOptions[key].map((option) => `<option ${settings[key] === option ? 'selected' : ''}>${option}</option>`).join('')}</select></label>`; }
function renderSettingsView() {
  return `<section><div class="heading"><div><h1>Settings & Customization</h1><p class="muted">Personalize the interface and reading experience.</p></div></div><div class="settings-grid">${Object.keys(settingOptions).map(settingControl).join('')}</div><div class="settings-actions"><button class="btn" data-reset-settings>Reset to defaults</button><span class="muted">Settings are saved automatically.</span></div></section>`;
}

function openReader(manga) {
  const modal = document.createElement('div'); modal.className = 'reader-modal';
  modal.innerHTML = `<div class="reader-box" role="dialog" aria-modal="true"><button class="close" type="button" aria-label="Close reader">×</button><p class="muted">${escapeHtml(manga.title)}</p><h1>Chapter 1</h1><div class="reader-page"><img src="${manga.cover}" alt="${escapeHtml(manga.title)} cover" /><p>Chapter content is not available from this source yet.</p></div></div>`;
  document.body.append(modal); const close = () => modal.remove(); modal.querySelector('.close').onclick = close; modal.onclick = (event) => { if (event.target === modal) close(); };
}

function render() {
  if (!app) return;
  const page = currentTab === 'manga' ? renderMangaView() : currentTab === 'history' ? renderHistoryView() : currentTab === 'sources' ? renderSourcesView() : renderSettingsView();
  app.innerHTML = `<div class="shell"><aside><div class="brand">Dino<span>Readers</span></div>${navButton('manga', '▦', 'Manga')}${navButton('history', '◷', 'History')}${navButton('sources', '◉', 'Sources')}${navButton('settings', '⚙', 'Settings')}</aside><main><header><input id="searchInput" class="search" placeholder="Search manga..." value="${escapeHtml(searchText)}" /></header>${page}</main></div>`;
  document.querySelectorAll('[data-nav]').forEach((button) => button.onclick = () => { currentTab = button.dataset.nav; render(); });
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.oninput = (event) => { searchText = event.target.value; render(); };
  document.querySelectorAll('[data-read]').forEach((button) => button.onclick = () => { const manga = mangaLibrary.find((item) => item.id === button.dataset.read); if (manga) openReader(manga); });
  document.querySelectorAll('[data-source-toggle]').forEach((button) => button.onclick = () => { const source = sourceList.find((item) => item.id === button.dataset.sourceToggle); if (source) { source.installed = !source.installed; button.textContent = source.installed ? 'Installed' : 'Install'; } });
  document.querySelectorAll('[data-setting]').forEach((control) => control.onchange = () => { settings[control.dataset.setting] = control.value; saveSettings(); });
  const reset = document.querySelector('[data-reset-settings]');
  if (reset) reset.onclick = () => { settings = { ...defaultSettings }; saveSettings(); render(); };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();

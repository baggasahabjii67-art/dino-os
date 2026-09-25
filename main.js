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

const APP_VERSION = '002';
const defaultSettings = { theme: 'Dark', layout: 'Comfortable', accent: 'Purple', fontSize: 'Medium', readingDirection: 'Vertical', pageFit: 'Width', resolution: 'Auto', optimization: 'Balanced', preload: 'Enabled', animations: 'Enabled', incognito: 'Disabled' };
function loadSettings() { try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem('dino-reader-settings') || '{}') }; } catch { return { ...defaultSettings }; } }
let settings = loadSettings();
const app = document.getElementById('app');
let currentTab = 'manga';
let searchText = '';

function saveSettings() { localStorage.setItem('dino-reader-settings', JSON.stringify(settings)); }
function applySettings() {
  const root = document.documentElement;
  const themes = { Dark: ['#101216', '#181b21', '#222731', '#f1f3f5'], Light: ['#f3f5f8', '#ffffff', '#e5e9f0', '#18202b'], Midnight: ['#070b18', '#10172b', '#192442', '#eef3ff'] };
  const accents = { Purple: '#a78bfa', Blue: '#60a5fa', Green: '#69d391', Orange: '#fb923c' };
  const sizes = { Small: '14px', Medium: '16px', Large: '18px' };
  const spacing = { Compact: '10px', Comfortable: '14px', Spacious: '20px' };
  const [bg, panel, panel2, text] = themes[settings.theme] || themes.Dark;
  root.style.setProperty('--bg', bg); root.style.setProperty('--panel', panel); root.style.setProperty('--panel2', panel2); root.style.setProperty('--text', text);
  root.style.setProperty('--brand', accents[settings.accent] || accents.Purple);
  root.style.setProperty('--base-size', sizes[settings.fontSize] || sizes.Medium);
  root.style.setProperty('--card-padding', spacing[settings.layout] || spacing.Comfortable);
  document.body.dataset.animations = settings.animations.toLowerCase();
  document.body.dataset.optimization = settings.optimization.toLowerCase().replace(' ', '-');
  document.body.dataset.incognito = settings.incognito.toLowerCase();
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
function navButton(id, icon, label) { return `<button class="nav ${currentTab === id ? 'active' : ''}" data-nav="${id}"><span>${icon}</span><label>${label}</label></button>`; }
function renderCard(manga) { return `<article class="card"><div class="cover"><img src="${manga.cover}" alt="${escapeHtml(manga.title)}" /><span class="badge">${escapeHtml(manga.source)}</span></div><h3>${escapeHtml(manga.title)}</h3><p>${escapeHtml(manga.author)} · ${manga.chapters} chapters</p><button class="btn small" data-read="${manga.id}">Read</button></article>`; }
function renderSourceRow(source) { return `<div class="row"><div><b>${escapeHtml(source.name)}</b><p class="muted">${escapeHtml(source.language)} · Built-in source</p></div><button class="btn small" data-source-toggle="${source.id}">${source.installed ? 'Installed' : 'Install'}</button></div>`; }
function renderMangaView() { const filtered = mangaLibrary.filter((manga) => `${manga.title} ${manga.author}`.toLowerCase().includes(searchText.toLowerCase())); return `<section><div class="heading"><div><h1>Manga</h1><p class="muted">Your manga library</p></div></div><div class="grid">${filtered.map(renderCard).join('') || '<div class="empty">No manga matches your search.</div>'}</div></section>`; }
function renderHistoryView() { return `<section><div class="heading"><div><h1>History</h1><p class="muted">Reading progress will show here.</p></div></div><div class="panel"><p class="muted">${settings.incognito === 'Enabled' ? 'Incognito mode is enabled. Reading history is not saved.' : 'No recent chapters yet.'}</p></div></section>`; }
function renderSourcesView() { return `<section><div class="heading"><div><h1>Sources</h1><p class="muted">All sources available in the app</p></div></div><div class="panel">${sourceList.map(renderSourceRow).join('')}</div></section>`; }

const settingOptions = { theme: ['Dark', 'Light', 'Midnight'], layout: ['Compact', 'Comfortable', 'Spacious'], accent: ['Purple', 'Blue', 'Green', 'Orange'], fontSize: ['Small', 'Medium', 'Large'], readingDirection: ['Vertical', 'Horizontal'], pageFit: ['Width', 'Height', 'Original'], resolution: ['Auto', '720p', '1080p', '1440p'], optimization: ['Battery saver', 'Balanced', 'Quality'], preload: ['Enabled', 'Disabled'], animations: ['Enabled', 'Disabled'], incognito: ['Enabled', 'Disabled'] };
const settingLabels = { theme: 'Theme', layout: 'Layout density', accent: 'Accent color', fontSize: 'Reader font size', readingDirection: 'Reading direction', pageFit: 'Page fit', resolution: 'Resolution', optimization: 'Optimization mode', preload: 'Preload pages', animations: 'Animations', incognito: 'Incognito mode' };
function settingControl(key) { return `<label class="setting"><span>${settingLabels[key]}</span><select data-setting="${key}">${settingOptions[key].map((option) => `<option ${settings[key] === option ? 'selected' : ''}>${option}</option>`).join('')}</select></label>`; }
function renderSettingsView() { return `<section><div class="heading"><div><h1>Settings & Customization</h1><p class="muted">Changes apply immediately and are saved automatically.</p></div></div><div class="settings-grid">${Object.keys(settingOptions).map(settingControl).join('')}</div><div class="settings-actions"><button class="btn" data-reset-settings>Reset to defaults</button><span class="muted">Your settings are stored on this device.</span></div></section>`; }
function renderDetailsView() { return `<section><div class="heading"><div><h1>Version & Details</h1><p class="muted">About DinoReaders</p></div></div><div class="panel details"><div class="detail-row"><b>Version</b><strong>${APP_VERSION}</strong></div><div class="detail-row"><b>Application</b><span>DinoReaders Manga Reader</span></div><div class="detail-row"><b>Features</b><span>Library, reader preview, sources, customization and privacy controls</span></div><div class="detail-row"><b>Privacy</b><span>${settings.incognito === 'Enabled' ? 'Incognito mode is enabled' : 'Standard local settings mode'}</span></div><p class="muted">Version number changes whenever an application update is made.</p></div></section>`; }

function openReader(manga) { const modal = document.createElement('div'); modal.className = `reader-modal reader-${settings.readingDirection.toLowerCase()}`; modal.innerHTML = `<div class="reader-box" role="dialog" aria-modal="true"><button class="close" type="button" aria-label="Close reader">×</button><p class="muted">${escapeHtml(manga.title)}</p><h1>Chapter 1</h1><div class="reader-page reader-fit-${settings.pageFit.toLowerCase()} reader-resolution-${settings.resolution.toLowerCase()}"><img src="${manga.cover}" alt="${escapeHtml(manga.title)} cover" /><p>Chapter content is not available from this source yet.</p><small>Direction: ${settings.readingDirection} · Fit: ${settings.pageFit} · Resolution: ${settings.resolution}</small></div></div>`; document.body.append(modal); const close = () => modal.remove(); modal.querySelector('.close').onclick = close; modal.onclick = (event) => { if (event.target === modal) close(); }; }

function render() {
  if (!app) return; applySettings();
  const page = currentTab === 'manga' ? renderMangaView() : currentTab === 'history' ? renderHistoryView() : currentTab === 'sources' ? renderSourcesView() : currentTab === 'settings' ? renderSettingsView() : renderDetailsView();
  app.innerHTML = `<div class="shell"><aside><div class="brand">Dino<span>Readers</span></div>${navButton('manga', '▦', 'Manga')}${navButton('history', '◷', 'History')}${navButton('sources', '◉', 'Sources')}${navButton('settings', '⚙', 'Settings')}<div class="sidebar-version">Version ${APP_VERSION}</div>${navButton('details', 'ⓘ', 'Details')}</aside><main><header><input id="searchInput" class="search" placeholder="Search manga..." value="${escapeHtml(searchText)}" /></header>${page}</main></div>`;
  document.querySelectorAll('[data-nav]').forEach((button) => button.onclick = () => { currentTab = button.dataset.nav; render(); });
  const searchInput = document.getElementById('searchInput'); if (searchInput) searchInput.oninput = (event) => { searchText = event.target.value; render(); };
  document.querySelectorAll('[data-read]').forEach((button) => button.onclick = () => { const manga = mangaLibrary.find((item) => item.id === button.dataset.read); if (manga) openReader(manga); });
  document.querySelectorAll('[data-source-toggle]').forEach((button) => button.onclick = () => { const source = sourceList.find((item) => item.id === button.dataset.sourceToggle); if (source) { source.installed = !source.installed; button.textContent = source.installed ? 'Installed' : 'Install'; } });
  document.querySelectorAll('[data-setting]').forEach((control) => control.onchange = () => { settings[control.dataset.setting] = control.value; saveSettings(); applySettings(); render(); });
  const reset = document.querySelector('[data-reset-settings]'); if (reset) reset.onclick = () => { settings = { ...defaultSettings }; saveSettings(); render(); };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();

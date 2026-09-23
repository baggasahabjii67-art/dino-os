const PREBUILT_REPO = 'https://raw.githubusercontent.com/keiyoushi/extensions/repo/index.json';
const navItems = [['manga', '▦', 'Manga'], ['history', '◷', 'History'], ['reader-settings', '⚙', 'Reader settings'], ['setting', '☷', 'Setting'], ['sources', '◉', 'Sources']];

function startApp() {
  const app = document.querySelector('#app');
  if (!app) return;

  let current = 'manga';
  let query = '';

  const nav = () => navItems.map(([id, icon, label]) => `<button class="nav ${current === id ? 'active' : ''}" data-nav="${id}"><span>${icon}</span><label>${label}</label></button>`).join('');
  const card = (m) => `<article class="card"><div class="cover"><img src="${m.cover || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80'}" alt="${m.title}"><span class="badge">${m.status || 'New'}</span></div><h3>${m.title}</h3><p>${m.author || 'Unknown'} · ${m.chapters || '?'} chapters</p><button class="btn small" data-read="${m.id}">Read</button></article>`;

  function manga() {
    const allSources = Array.isArray(store.sources) ? store.sources : [];
    const installed = new Set(allSources.filter((s) => s && s.installed).map((s) => String(s.id).toLowerCase()));
    const list = (Array.isArray(store.library) ? store.library : []).filter((m) => {
      if (!installed.size) return true;
      const key = String(m.sourceId || m.source || '').toLowerCase();
      return installed.has(key);
    });
    const filtered = list.filter((m) => `${m.title || ''} ${m.author || ''}`.toLowerCase().includes(query.toLowerCase()));
    return `<div class="view-head"><div><h1>Manga</h1><p class="sub">${filtered.length} titles in your library</p></div></div><div class="grid">${filtered.map(card).join('') || '<div class="empty">No manga found. Install a source or refresh the repository.</div>'}</div>`;
  }

  function history() {
    return `<div class="view-head"><div><h1>History</h1><p class="sub">Your read chapters and saved progress</p></div>${store.history.length ? '<button class="btn" data-action="clear-history">Clear history</button>' : ''}</div><div class="panel">${store.history.map((x) => `<div class="row"><div><b>${x.title}</b><p class="muted">Chapter ${x.chapter} · ${new Date(x.readAt).toLocaleString()}</p></div><button class="btn small" data-read="${x.id}">Continue</button></div>`).join('') || '<p class="muted">Nothing here yet.</p>'}</div>`;
  }

  function readerSettings() {
    const s = store.settings;
    return `<div class="view-head"><div><h1>Reader settings</h1><p class="sub">Customize chapter reading</p></div></div><div class="panel">${[['direction', 'Direction', ['Vertical', 'Horizontal']], ['fit', 'Fit', ['Width', 'Height']], ['theme', 'Theme', ['Dark', 'Light']]].map(([key, label, values]) => `<div class="row"><b>${label}</b><select data-setting="${key}">${values.map((v) => `<option ${s[key] === v ? 'selected' : ''}>${v}</option>`).join('')}</select></div>`).join('')}<label class="row"><b>Preload pages</b><input type="checkbox" data-setting="preload" ${s.preload ? 'checked' : ''}></label></div>`;
  }

  function sourceRow(s) {
    return `<div class="row source-row"><div><b>${s.name || s.id}</b><p class="muted">${s.language || s.lang || 'all'} · ${s.version || 'Community'} · ${s.repo || 'Keiyoushi extensions'}</p></div><button class="btn small" data-source="${s.id}">${s.installed ? 'Remove' : 'Install'}</button></div>`;
  }

  function sources() {
    const list = Array.isArray(store.sources) ? store.sources : [];
    return `<div class="view-head"><div><h1>Sources</h1><p class="sub">${list.length} sources from the extension repository</p></div><button class="btn" data-action="refresh-sources">Refresh all</button></div><div class="panel">${list.map(sourceRow).join('') || '<p class="muted">No sources loaded. Refresh the repository.</p>'}</div>`;
  }

  function setting() {
    return `<div class="view-head"><div><h1>Setting</h1><p class="sub">Extension repository configuration</p></div></div><div class="panel"><h2>Automatic extension repository</h2><p class="muted">The app tries to rebuild the source list automatically from the official Keiyoushi index.</p><code>${PREBUILT_REPO}</code><div class="actions"><button class="btn" data-action="refresh-sources">Build source list now</button><button class="btn danger" data-action="reset-sources">Remove all sources</button></div><p id="repo-status" class="muted">Loading sources…</p></div>`;
  }

  function view() {
    app.innerHTML = `<div class="shell"><aside><div class="brand">Dino<span>Readers</span></div>${nav()}</aside><main><header><input class="search" placeholder="Search manga..." value="${query}"></header>${current === 'manga' ? manga() : current === 'history' ? history() : current === 'reader-settings' ? readerSettings() : current === 'sources' ? sources() : setting()}</main></div>`;
    bind();
  }

  function possibleManifests(url) {
    const u = url.replace(/\/$/, '');
    return /\.json$/i.test(u) ? [u] : [`${u}/index.json`, `${u}/index.min.json`];
  }

  function extensionList(data) {
    const raw = Array.isArray(data) ? data : (data.extensions || data.sources || data.items || data);
    return Array.isArray(raw) ? raw : Object.entries(raw || {}).map(([id, value]) => ({ ...value, id: value.id || id }));
  }

  function normaliseExtensions(data) {
    const result = [];
    extensionList(data).forEach((ext, i) => {
      const nested = Array.isArray(ext.sources) && ext.sources.length ? ext.sources : [ext];
      nested.forEach((source, j) => {
        const id = String(source.id || source.name || `source-${i}-${j}`).toLowerCase().replace(/[^a-z0-9-]/g, '-');
        result.push({
          id,
          name: source.name || source.title || id,
          language: source.lang || source.language || 'all',
          version: source.version || source.versionName || 'Community',
          repo: 'Keiyoushi extensions',
          installed: false,
          ...source,
        });
      });
    });
    return [...new Map(result.map((x) => [x.id, x])).values()];
  }

  async function discover(url) {
    const status = document.querySelector('#repo-status');
    if (status) status.textContent = 'Fetching the source list…';

    let loaded = false;
    for (const manifest of possibleManifests(url)) {
      try {
        const r = await fetch(manifest, { cache: 'no-store' });
        if (!r.ok) continue;
        const payload = await r.json();
        const list = normaliseExtensions(payload);
        if (list.length) {
          const old = new Map((Array.isArray(store.sources) ? store.sources : []).map((s) => [String(s.id).toLowerCase(), s]));
          store.sources = list.map((s) => ({ ...s, installed: !!old.get(String(s.id).toLowerCase())?.installed }));
          loaded = true;
          view();
          if (status) status.textContent = `${list.length} sources loaded`;
          toast(`${list.length} sources loaded`);
          return;
        }
      } catch (e) {
        console.warn('Source fetch failed:', manifest, e);
      }
    }

    if (status) status.textContent = 'Using built-in library. Refresh later if needed.';
    if (!Array.isArray(store.sources) || !store.sources.length) {
      const fallback = [{ id: 'mangadex', name: 'MangaDex', language: 'all', version: 'Built-in', repo: 'Keiyoushi extensions', installed: true }];
      store.sources = fallback;
    }
    view();
  }

  function bind() {
    document.querySelectorAll('[data-nav]').forEach((x) => x.onclick = () => {
      current = x.dataset.nav;
      view();
    });

    const search = document.querySelector('.search');
    if (search) {
      search.oninput = (e) => {
        query = e.target.value;
        view();
      };
    }

    document.querySelectorAll('[data-read]').forEach((x) => x.onclick = () => openReader(findManga(x.dataset.read)));
    document.querySelectorAll('[data-source]').forEach((x) => x.onclick = () => {
      store.sources = (Array.isArray(store.sources) ? store.sources : []).map((s) => s.id === x.dataset.source ? { ...s, installed: !s.installed } : s);
      view();
    });

    document.querySelectorAll('[data-setting]').forEach((x) => {
      x.onchange = () => {
        const value = x.type === 'checkbox' ? x.checked : x.value;
        store.settings = { ...store.settings, [x.dataset.setting]: value };
        toast('Saved');
      };
    });

    document.querySelectorAll('[data-action="refresh-sources"]').forEach((x) => x.onclick = () => discover(PREBUILT_REPO));
    document.querySelector('[data-action="reset-sources"]')?.addEventListener('click', () => {
      clearSources();
      store.sources = [];
      view();
      discover(PREBUILT_REPO);
    });
    document.querySelector('[data-action="clear-history"]')?.addEventListener('click', () => {
      store.history = [];
      view();
    });
  }

  view();
  discover(PREBUILT_REPO).catch((error) => {
    console.error('Source discovery failed:', error);
    view();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

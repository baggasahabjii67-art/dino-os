const mangaLibrary = [
  {
    id: 'solo-leveling',
    title: 'Solo Leveling',
    author: 'Chugong',
    chapters: 179,
    source: 'MangaDex',
    cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80'
  },
  {
    id: 'one-piece',
    title: 'One Piece',
    author: 'Eiichiro Oda',
    chapters: 1120,
    source: 'MangaDex',
    cover: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b0d?w=600&q=80'
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    author: 'Tatsuki Fujimoto',
    chapters: 172,
    source: 'AniList',
    cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076a3f5?w=600&q=80'
  },
  {
    id: 'frieren',
    title: 'Frieren: Beyond Journey’s End',
    author: 'Kanehito Yamada',
    chapters: 140,
    source: 'AniList',
    cover: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=80'
  }
];

const sourceList = [
  { id: 'mangadex', name: 'MangaDex', language: 'All languages', installed: true },
  { id: 'anilist', name: 'AniList', language: 'All languages', installed: true },
  { id: 'mangafreak', name: 'MangaFreak', language: 'English', installed: false },
  { id: 'mangakakalot', name: 'MangaKakalot', language: 'English', installed: false },
  { id: 'mangasee', name: 'MangaSee', language: 'English', installed: false }
];

const app = document.getElementById('app');
let currentTab = 'manga';
let searchText = '';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function navButton(id, icon, label) {
  return `
    <button class="nav ${currentTab === id ? 'active' : ''}" data-nav="${id}">
      <span>${icon}</span>
      <label>${label}</label>
    </button>
  `;
}

function renderCard(manga) {
  return `
    <article class="card">
      <div class="cover">
        <img src="${manga.cover}" alt="${escapeHtml(manga.title)}" />
        <span class="badge">${escapeHtml(manga.source)}</span>
      </div>
      <h3>${escapeHtml(manga.title)}</h3>
      <p>${escapeHtml(manga.author)} · ${manga.chapters} chapters</p>
      <button class="btn small" data-read="${escapeHtml(manga.id)}">Read</button>
    </article>
  `;
}

function renderSourceRow(source) {
  return `
    <div class="row">
      <div>
        <b>${escapeHtml(source.name)}</b>
        <p class="muted">${escapeHtml(source.language)} · Built-in source</p>
      </div>
      <button class="btn small" data-source-toggle="${source.id}">
        ${source.installed ? 'Installed' : 'Install'}
      </button>
    </div>
  `;
}

function renderMangaView() {
  const filtered = mangaLibrary.filter((manga) => {
    const haystack = `${manga.title} ${manga.author}`.toLowerCase();
    return haystack.includes(searchText.toLowerCase());
  });

  return `
    <section>
      <div class="heading">
        <div>
          <h1>Manga</h1>
          <p class="muted">Your manga library</p>
        </div>
      </div>
      <div class="grid">
        ${filtered.map(renderCard).join('') || '<div class="empty">No manga matches your search.</div>'}
      </div>
    </section>
  `;
}

function renderHistoryView() {
  return `
    <section>
      <div class="heading">
        <div>
          <h1>History</h1>
          <p class="muted">Reading progress will show here.</p>
        </div>
      </div>
      <div class="panel">
        <p class="muted">No recent chapters yet.</p>
      </div>
    </section>
  `;
}

function renderSourcesView() {
  return `
    <section>
      <div class="heading">
        <div>
          <h1>Sources</h1>
          <p class="muted">All sources available in the app</p>
        </div>
      </div>
      <div class="panel">
        ${sourceList.map(renderSourceRow).join('')}
      </div>
    </section>
  `;
}

function openReader(manga) {
  const modal = document.createElement('div');
  modal.className = 'reader-modal';
  modal.innerHTML = `
    <div class="reader-box" role="dialog" aria-modal="true" aria-labelledby="reader-title">
      <button class="close" type="button" aria-label="Close reader">×</button>
      <p class="muted">${escapeHtml(manga.title)}</p>
      <h1 id="reader-title">Chapter 1</h1>
      <div class="reader-page">
        <img src="${manga.cover}" alt="${escapeHtml(manga.title)} cover" />
        <p>Chapter content is not available from this source yet.</p>
      </div>
    </div>
  `;

  document.body.append(modal);
  const close = () => modal.remove();
  modal.querySelector('.close').addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
}

function render() {
  if (!app) return;

  const page = currentTab === 'manga'
    ? renderMangaView()
    : currentTab === 'history'
      ? renderHistoryView()
      : renderSourcesView();

  app.innerHTML = `
    <div class="shell">
      <aside>
        <div class="brand">Dino<span>Readers</span></div>
        ${navButton('manga', '▦', 'Manga')}
        ${navButton('history', '◷', 'History')}
        ${navButton('sources', '◉', 'Sources')}
      </aside>

      <main>
        <header>
          <input id="searchInput" class="search" placeholder="Search manga..." value="${escapeHtml(searchText)}" />
        </header>
        ${page}
      </main>
    </div>
  `;

  document.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      currentTab = button.dataset.nav;
      render();
    });
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      searchText = event.target.value;
      render();
    });
  }

  document.querySelectorAll('[data-read]').forEach((button) => {
    button.addEventListener('click', () => {
      const manga = mangaLibrary.find((item) => item.id === button.dataset.read);
      if (manga) openReader(manga);
    });
  });

  document.querySelectorAll('[data-source-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.sourceToggle;
      const source = sourceList.find((item) => item.id === id);
      if (!source) return;

      source.installed = !source.installed;
      button.textContent = source.installed ? 'Installed' : 'Install';
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}

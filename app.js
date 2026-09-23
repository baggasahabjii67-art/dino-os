const seed = [
  {id:'solo-leveling',title:'Solo Leveling',author:'Chugong',status:'Reading',chapters:179,cover:'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=85'},
  {id:'one-piece',title:'One Piece',author:'Eiichiro Oda',status:'Plan to read',chapters:1120,cover:'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600&q=85'},
  {id:'chainsaw-man',title:'Chainsaw Man',author:'Tatsuki Fujimoto',status:'Reading',chapters:172,cover:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=85'},
  {id:'frieren',title:'Frieren: Beyond Journey’s End',author:'Kanehito Yamada',status:'Completed',chapters:140,cover:'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=85'}
];

export const store = {
  get library(){ return JSON.parse(localStorage.getItem('manga-library') || 'null') || seed; },
  set library(value){ localStorage.setItem('manga-library', JSON.stringify(value)); },
  get history(){ return JSON.parse(localStorage.getItem('manga-history') || '[]'); },
  set history(value){ localStorage.setItem('manga-history', JSON.stringify(value)); },
  get settings(){ return JSON.parse(localStorage.getItem('reader-settings') || 'null') || {direction:'Vertical',fit:'Width',theme:'Dark',preload:true}; },
  set settings(value){ localStorage.setItem('reader-settings', JSON.stringify(value)); }
};

export function cover(manga){ return manga.cover || seed[0].cover; }
export function findManga(id){ return [...store.library, ...seed].find(m => m.id === id) || store.library[0]; }
export function toast(message){ const el=document.createElement('div'); el.className='toast'; el.textContent=message; document.body.append(el); setTimeout(()=>el.remove(),2400); }

export function openReader(manga, chapter=1){
  const history = store.history.filter(item => item.id !== manga.id);
  store.history = [{...manga, chapter, readAt: new Date().toISOString()}, ...history].slice(0,50);
  const reader=document.createElement('div'); reader.className='reader';
  const pages=Array.from({length:8},(_,i)=>`<img class="page" src="${cover(manga)}" alt="${manga.title} page ${i+1}" loading="lazy">`).join('');
  reader.innerHTML=`<div class="readerbar"><b>${manga.title} · Chapter ${chapter}</b><div class="reader-actions"><button class="btn" id="pdf">Download / Save PDF</button><button class="btn" id="close">Close ×</button></div></div><div class="pages">${pages}</div>`;
  document.body.append(reader);
  reader.querySelector('#close').onclick=()=>reader.remove();
  reader.querySelector('#pdf').onclick=()=>{ window.print(); };
}

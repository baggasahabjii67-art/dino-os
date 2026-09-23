const seed=[
 {id:'solo-leveling',title:'Solo Leveling',author:'Chugong',status:'Reading',chapters:179,source:'MangaDex',sourceId:'mangadex',cover:'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=85'},
 {id:'one-piece',title:'One Piece',author:'Eiichiro Oda',status:'Plan to read',chapters:1120,source:'MangaDex',sourceId:'mangadex',cover:'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600&q=85'},
 {id:'chainsaw-man',title:'Chainsaw Man',author:'Tatsuki Fujimoto',status:'Reading',chapters:172,source:'AniList',sourceId:'anilist',cover:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=85'},
 {id:'frieren',title:'Frieren: Beyond Journey’s End',author:'Kanehito Yamada',status:'Completed',chapters:140,source:'AniList',sourceId:'anilist',cover:'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=85'}
];
const builtInSources=[
 {id:'mangadex',name:'MangaDex',language:'all',version:'Built-in',repo:'Keiyoushi extensions',installed:false,status:'Available'},
 {id:'mangafreak',name:'MangaFreak',language:'en',version:'Built-in',repo:'Keiyoushi extensions',installed:false,status:'Available'},
 {id:'anilist',name:'AniList',language:'all',version:'Built-in',repo:'Keiyoushi extensions',installed:false,status:'Available'}
];
const defaults={direction:'Vertical',fit:'Width',theme:'Dark',preload:true};
export const store={
 get library(){return JSON.parse(localStorage.getItem('manga-library')||'null')||seed},set library(v){localStorage.setItem('manga-library',JSON.stringify(v))},
 get history(){return JSON.parse(localStorage.getItem('manga-history')||'[]')},set history(v){localStorage.setItem('manga-history',JSON.stringify(v))},
 get settings(){return {...defaults,...JSON.parse(localStorage.getItem('reader-settings')||'{}')}},set settings(v){localStorage.setItem('reader-settings',JSON.stringify(v))},
 get sources(){const saved=JSON.parse(localStorage.getItem('manga-sources')||'null');if(!saved)return builtInSources;const map=new Map(saved.map(s=>[s.id,s]));builtInSources.forEach(s=>{if(!map.has(s.id))map.set(s.id,s)});return [...map.values()]},set sources(v){localStorage.setItem('manga-sources',JSON.stringify(v))}
};
export function cover(m){return m.cover||seed[0].cover}
export function findManga(id){return [...store.library,...seed].find(m=>m.id===id)||store.library[0]}
export function toast(message){const e=document.createElement('div');e.className='toast';e.textContent=message;document.body.append(e);setTimeout(()=>e.remove(),2400)}
export function openReader(manga,chapter=1){store.history=[{...manga,chapter,readAt:new Date().toISOString()},...store.history.filter(x=>x.id!==manga.id)].slice(0,50);const r=document.createElement('div');r.className='reader';r.innerHTML=`<div class="readerbar"><b>${manga.title} · Chapter ${chapter}</b><div class="reader-actions"><button class="btn" id="pdf">Download / Save PDF</button><button class="btn" id="close">Close ×</button></div></div><div class="pages">${Array.from({length:8},(_,i)=>`<img class="page" src="${cover(manga)}" alt="${manga.title} page ${i+1}" loading="lazy">`).join('')}</div>`;document.body.append(r);r.querySelector('#close').onclick=()=>r.remove();r.querySelector('#pdf').onclick=()=>window.print()}

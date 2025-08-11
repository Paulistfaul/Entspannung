const CACHE_NAME = 'calmloop-v3';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS))); self.skipWaiting();});
self.addEventListener('activate', e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))); self.clients.claim();});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(resp=>{
    if(e.request.method==='GET' && resp.status===200 && resp.type==='basic'){const clone=resp.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request, clone));}
    return resp;
  }).catch(()=>{ if(e.request.mode==='navigate') return caches.match('./index.html'); })));
});
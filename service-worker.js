const V="scada-pioneer-v3";
const SHELL=["./","index.html","offline.html","style.css","script.js","manifest.json","favicon.ico","icon-192.png","icon-512.png","api/tips.json","assets/scada-icons.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 const r=e.request;if(r.method!=="GET")return;
 const u=new URL(r.url);
 if(u.origin===location.origin&&u.pathname.endsWith("/api/tips.json")){
  e.respondWith(caches.open(V).then(c=>c.match(r).then(hit=>{
   const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>hit);
   return hit||net;})));return}
 e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>r.mode==="navigate"?caches.match("offline.html"):undefined)))});
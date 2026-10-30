(()=>{"use strict";
const tips=JSON.parse(document.getElementById("tips-data").textContent);
const L={jafza:"JAFZA Gate",commute:"Commute",bedspace:"Bedspace",scada:"SCADA On-Call",legal:"Legal & Dewa",budget:"Groceries/Budget"};
const S={alarm:"High risk",warn:"Caution",tech:"Technical",ok:"Operational tip"};
const $=id=>document.getElementById(id);
const get=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const buzz=()=>{try{navigator.vibrate&&navigator.vibrate(10)}catch(e){}};
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let favs=get("favs",[]),cat="all",term="",timer;
function card(x){const f=favs.includes(x.id);
 return `<article class="tip ${x.sev}" data-id="${x.id}"><span class="sev ${x.sev}">${S[x.sev]}</span><span class="cat">${L[x.category]}</span><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p><div class="acts"><button class="fav${f?" on":""}" aria-pressed="${f}">${f?"Saved":"Save"}</button><button class="copy">Copy</button><button class="share">Share</button>${x.link?`<a href="${x.link}" target="_blank" rel="noopener noreferrer">${x.linkText}</a>`:""}</div></article>`}
function render(){
 const t=term.toLowerCase();
 const r=tips.filter(x=>(cat==="all"||x.category===cat)&&(!t||(x.title+" "+x.body).toLowerCase().includes(t)));
 $("count").textContent=r.length+" of "+tips.length+" tips";
 $("list").innerHTML=r.length?r.map(card).join(""):"<p>No tips match. Clear the search or pick another category.</p>";
 const s=tips.filter(x=>favs.includes(x.id));$("sc").textContent=s.length;
 $("savedList").innerHTML=s.length?s.map(card).join(""):"<p class='mu'>Nothing saved yet. Tap Save on any tip.</p>";
}
$("q").addEventListener("input",e=>{clearTimeout(timer);timer=setTimeout(()=>{term=e.target.value;render()},200)});
document.querySelectorAll(".pill").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".pill").forEach(p=>p.classList.remove("active"));b.classList.add("active");cat=b.dataset.cat;render()}));
async function onAct(e){
 const a=e.target.closest(".tip");if(!a)return;const id=+a.dataset.id,x=tips.find(t=>t.id===id),txt=x.title+": "+x.body;
 if(e.target.classList.contains("fav")){favs=favs.includes(id)?favs.filter(i=>i!==id):[...favs,id];set("favs",favs);buzz();render()}
 if(e.target.classList.contains("copy")){buzz();try{await navigator.clipboard.writeText(txt);e.target.textContent="Copied"}catch(err){e.target.textContent="Copy failed"}}
 if(e.target.classList.contains("share")){buzz();if(navigator.share){try{await navigator.share({title:x.title,text:txt,url:location.href})}catch(err){if(err&&err.name==="AbortError")return;try{await navigator.clipboard.writeText(txt);e.target.textContent="Copied"}catch(e2){}}}else{try{await navigator.clipboard.writeText(txt);e.target.textContent="Copied"}catch(err){}}}
}
$("list").addEventListener("click",onAct);$("savedList").addEventListener("click",onAct);
document.querySelectorAll(".bottom-nav button").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".bottom-nav button").forEach(x=>x.classList.toggle("on",x===b));
 ["tips","check","calc","saved"].forEach(v=>$("v-"+v).hidden=v!==b.dataset.v);scrollTo(0,0)}));
const boxes=[...document.querySelectorAll(".check input")];let ck=get("check",[]);
function prog(){$("prog").textContent=boxes.filter(b=>b.checked).length+" of "+boxes.length+" done"}
boxes.forEach((b,i)=>{b.checked=ck.includes(i);b.addEventListener("change",()=>{buzz();set("check",boxes.map((x,j)=>x.checked?j:-1).filter(j=>j>=0));prog()})});prog();
$("resetCheck").onclick=()=>{boxes.forEach(b=>b.checked=false);set("check",[]);prog()};
const ids=["rent","nol","food","net","util","misc"];const saved=get("calc",null);
if(saved)ids.forEach(k=>{if(saved[k]!=null)$("c-"+k).value=saved[k]});
function calc(){const v={};let sum=0;ids.forEach(k=>{v[k]=Math.max(0,Number($("c-"+k).value)||0);sum+=v[k]});
 set("calc",v);$("t-m").textContent="AED "+sum.toLocaleString();$("t-y").textContent="AED "+(sum*12).toLocaleString();$("t-r").textContent=sum?Math.round(v.rent/sum*100)+"%":"0%"}
ids.forEach(k=>$("c-"+k).addEventListener("input",calc));
document.querySelectorAll("[data-rent]").forEach(b=>b.addEventListener("click",()=>{$("c-rent").value=b.dataset.rent;buzz();calc()}));calc();
const net=$("net");function upd(){net.textContent=navigator.onLine?"Online":"Offline";net.className="badge "+(navigator.onLine?"on":"off")}
addEventListener("online",upd);addEventListener("offline",upd);upd();
const dlg=$("install"),di=$("doInstall");let dp=null;
$("openInstall").onclick=()=>dlg.showModal();$("closeInstall").onclick=()=>dlg.close();
addEventListener("beforeinstallprompt",e=>{e.preventDefault();dp=e;di.hidden=false});
di.onclick=async()=>{if(dp){dp.prompt();await dp.userChoice;dp=null;di.hidden=true;dlg.close()}};
const sa=matchMedia("(display-mode: standalone)").matches||navigator.standalone;
try{if(!sa&&!localStorage.getItem("seenInstall")){localStorage.setItem("seenInstall","1");setTimeout(()=>dlg.showModal(),2500)}}catch(e){}
if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js").catch(()=>{}));
render();
fetch("api/tips.json").then(r=>r.ok?r.json():null).then(j=>{if(j&&Array.isArray(j.tips)&&j.tips.length&&JSON.stringify(j.tips)!==JSON.stringify(tips)){tips.splice(0,tips.length,...j.tips);render()}}).catch(()=>{});})();
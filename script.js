(()=>{"use strict";
const tips=JSON.parse(document.getElementById("tips-data").textContent);
const L={jafza:"JAFZA Gate",commute:"Commute",bedspace:"Bedspace",scada:"SCADA On-Call",legal:"Legal & Dewa",budget:"Groceries/Budget"};
const S={alarm:"High risk",warn:"Caution",tech:"Technical",ok:"Operational tip"};
const $=id=>document.getElementById(id);
const get=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const buzz=()=>{try{navigator.vibrate&&navigator.vibrate(10)}catch(e){}};
function flash(b,t){const o=b.dataset.l||b.textContent;b.dataset.l=o;b.textContent=t;b.classList.add("done");clearTimeout(b._t);b._t=setTimeout(()=>{b.textContent=o;b.classList.remove("done")},1500)}
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let favs=get("favs",[]),cat="all",term="",timer;
function card(x){const f=favs.includes(x.id);
 return `<article class="tip ${x.sev}" data-id="${x.id}"><div class="meta"><span class="sev ${x.sev}">${S[x.sev]}</span><span class="cat">${L[x.category]}</span><span class="tid">#${x.id}</span></div><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p><div class="acts"><button class="fav${f?" on":""}" aria-pressed="${f}">${f?"★ Saved":"☆ Save"}</button><button class="copy">Copy</button><button class="share">Share</button>${x.link?`<a href="${x.link}" target="_blank" rel="noopener noreferrer">${x.linkText}</a>`:""}</div></article>`}
function render(){
 const t=term.toLowerCase();
 const r=tips.filter(x=>(cat==="all"||x.category===cat)&&(!t||(x.title+" "+x.body).toLowerCase().includes(t)));
 const filt=!!t||cat!=="all";$("count").innerHTML="Showing "+r.length+" of "+tips.length+" tips"+(filt?' <button class="link reset">Reset</button>':"");
 $("list").innerHTML=r.length?r.map(card).join(""):"<p>No tips match. Clear the search or pick another category.</p>";
 const s=tips.filter(x=>favs.includes(x.id));$("sc").textContent=s.length;
 $("savedList").innerHTML=s.length?s.map(card).join(""):`<div class="empty"><svg class="ic big" aria-hidden="true"><use href="assets/scada-icons.svg#bookmark"/></svg><h3>No bookmarks yet</h3><p>Tap ☆ Save on any tip to keep it here, even offline.</p><button class="btn primary browse">Browse ${tips.length} Tips</button></div>`;
}
$("q").addEventListener("input",e=>{clearTimeout(timer);timer=setTimeout(()=>{term=e.target.value;render()},200)});
document.querySelectorAll(".pill").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".pill").forEach(p=>p.classList.remove("active"));b.classList.add("active");cat=b.dataset.cat;render()}));
async function onAct(e){
 if(e.target.closest(".browse")){buzz();showView("tips");return}
 const a=e.target.closest(".tip");if(!a)return;const id=+a.dataset.id,x=tips.find(t=>t.id===id),txt=x.title+": "+x.body;
 if(e.target.classList.contains("fav")){favs=favs.includes(id)?favs.filter(i=>i!==id):[...favs,id];set("favs",favs);buzz();render()}
 if(e.target.classList.contains("copy")){buzz();try{await navigator.clipboard.writeText(txt);flash(e.target,"✓ Copied")}catch(err){flash(e.target,"Copy failed")}}
 if(e.target.classList.contains("share")){buzz();if(navigator.share){try{await navigator.share({title:x.title,text:txt,url:location.href})}catch(err){if(err&&err.name==="AbortError")return;try{await navigator.clipboard.writeText(txt);flash(e.target,"✓ Copied")}catch(e2){}}}else{try{await navigator.clipboard.writeText(txt);flash(e.target,"✓ Copied")}catch(err){}}}
}
$("count").addEventListener("click",e=>{if(e.target.classList.contains("reset")){term="";$("q").value="";cat="all";document.querySelectorAll(".pill").forEach(p=>p.classList.toggle("active",p.dataset.cat==="all"));render()}});
$("list").addEventListener("click",onAct);$("savedList").addEventListener("click",onAct);
function showView(v){document.querySelectorAll(".bottom-nav button").forEach(x=>x.classList.toggle("on",x.dataset.v===v));["tips","check","calc","saved"].forEach(k=>$("v-"+k).hidden=k!==v);scrollTo(0,0)}
document.querySelectorAll(".bottom-nav button").forEach(b=>b.addEventListener("click",()=>{buzz();showView(b.dataset.v)}));
const boxes=[...document.querySelectorAll(".check input")];let ck=get("check",[]);
let cf="all";
function prog(){const n=boxes.filter(b=>b.checked).length;$("prog").textContent=n+" of "+boxes.length+" inspected";$("meterFill").style.width=(n/boxes.length*100)+"%";$("n-all").textContent=boxes.length;$("n-p").textContent=boxes.length-n;$("n-d").textContent=n;boxes.forEach(b=>{const li=b.closest("li");li.classList.toggle("done",b.checked);li.hidden=cf==="pending"?b.checked:cf==="done"?!b.checked:false})}
boxes.forEach((b,i)=>{b.checked=ck.includes(i);b.addEventListener("change",()=>{buzz();set("check",boxes.map((x,j)=>x.checked?j:-1).filter(j=>j>=0));prog()})});prog();
$("resetCheck").onclick=()=>{boxes.forEach(b=>b.checked=false);set("check",[]);prog()};
$("chkSeg").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;cf=b.dataset.f;$("chkSeg").querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));prog()});
$("shareCheck").onclick=async e=>{const b=e.currentTarget,items=[...document.querySelectorAll(".check li span")].map(x=>x.textContent),n=boxes.filter(x=>x.checked).length;
 const txt="Bedspace inspection: "+n+"/"+boxes.length+" checked\n\n"+boxes.map((x,i)=>(x.checked?"✅ ":"❌ ")+items[i]).join("\n");buzz();
 if(navigator.share){try{await navigator.share({title:"Bedspace inspection",text:txt});return}catch(err){if(err&&err.name==="AbortError")return}}
 try{await navigator.clipboard.writeText(txt);flash(b,"✓ Copied")}catch(err){flash(b,"Copy failed")}};
const SEG=[["Rent","segRent","pctRent",v=>v.rent],["Nol / commute","segTransport","pctTransport",v=>v.nol],["Food","segFood","pctFood",v=>v.food],["SIM / hotspot","segHotspot","pctHotspot",v=>v.net],["Utilities & misc","segMisc","pctMisc",v=>v.util+v.misc]];
let lastV=null,lastSum=0;
function chart(v,sum){lastV=v;lastSum=sum;SEG.forEach(([n,sid,pid,f])=>{const p=sum?f(v)/sum*100:0;$(sid).style.width=p.toFixed(1)+"%";$(pid).textContent=Math.round(p)+"%"});if(!sum)$("chart-focus-label").textContent="Enter values"}
document.querySelectorAll(".bar-seg,.legend-item").forEach(el=>el.addEventListener("click",()=>{if(!lastV||!lastSum)return;buzz();const sg=SEG.find(x=>x[1]===(el.id||el.dataset.target)),a=sg[3](lastV);$("chart-focus-label").textContent=sg[0]+": AED "+a.toLocaleString()+" ("+Math.round(a/lastSum*100)+"%)"}));
const ids=["rent","nol","food","net","util","misc"];const saved=get("calc",null);
if(saved)ids.forEach(k=>{if(saved[k]!=null)$("c-"+k).value=saved[k]});
function calc(){const v={};let sum=0;ids.forEach(k=>{v[k]=Math.max(0,Number($("c-"+k).value)||0);sum+=v[k]});
 set("calc",v);$("t-m").textContent="AED "+sum.toLocaleString();$("t-y").textContent="AED "+(sum*12).toLocaleString();$("t-r").textContent=sum?Math.round(v.rent/sum*100)+"%":"0%";document.querySelectorAll("[data-rent]").forEach(b=>b.classList.toggle("on",b.dataset.rent===String(v.rent)));chart(v,sum)}
ids.forEach(k=>$("c-"+k).addEventListener("input",calc));
document.querySelectorAll("[data-rent]").forEach(b=>b.addEventListener("click",()=>{$("c-rent").value=b.dataset.rent;buzz();calc()}));calc();
const ST=[["Discovery Gardens","r"],["The Gardens","r"],["Al Furjan","r"],["Ibn Battuta","b"],["Energy","b"],["Danube","b"],["Life Pharmacy (ex-UAE Exchange)","b"]];
const rf=$("r-from"),rt=$("r-to");ST.forEach((x,i)=>{rf.add(new Option(x[0],i));rt.add(new Option(x[0],i))});rf.value=0;rt.value=5;
function route(){const a=ST[rf.value],b=ST[rt.value];let t;
 if(a===b)t="Pick two different stations.";
 else if(a[1]!==b[1])t="Change trains at Jabal Ali (now branded National Paints). Route 2020 trains and the JAFZA-side branch run separately. Check the destination on the platform display.";
 else t="No change at Jabal Ali needed: both stations are on the same branch. Check the platform display for your destination.";
 $("r-out").textContent=t}
rf.onchange=rt.onchange=route;route();
function hh(){document.documentElement.style.setProperty("--hh",document.querySelector(".top").offsetHeight+"px")}hh();addEventListener("resize",hh);
const chip=$("topChip");addEventListener("scroll",()=>chip.classList.toggle("show",scrollY>400&&!$("v-tips").hidden),{passive:true});chip.onclick=()=>{buzz();scrollTo({top:0,behavior:"smooth"})};
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
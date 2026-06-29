
const accentColors={cyan:"#00e5e5",red:"#ff3728",purple:"#bd35ff",orange:"#ff8a1f",green:"#44ff88",blue:"#3f8cff",gold:"#d9a64a",grey:"#746b5c"};
const beerProfiles={hazy:["#ffe989","#f3aa22","#fff0d6","hazy"],westcoast:["#ffe27a","#f39a12","#fff0d6","westcoast"],pilsner:["#fff09a","#f5c93b","#fff4d8","pilsner"],kolsch:["#fff3a6","#f7d154","#fff7dc","kolsch"],stout:["#1d0f0a","#020101","#b67644","stout"],pastry:["#2a130d","#020101","#b67644","stout"],sour:["#ff9ab6","#d84571","#fff1e5","sour"],wheat:["#ffd36a","#e58c18","#fff0d6","wheat"],brown:["#8b3b1d","#301007","#d8a06c","brown"],oldale:["#d74b20","#6b160d","#e7b17f","brown"],barleywine:["#a1371a","#3a0d05","#d99b65","barleywine"],empty:["#222","#111","#ddd","empty"]};
let state,editingTap,timers={};

async function loadInitial(){
 const saved=localStorage.getItem("booguels-taps-v11");
 if(saved){state=JSON.parse(saved);render();return}
 const r=await fetch("beers.json?v=11",{cache:"no-store"});state=await r.json();render()
}
function persist(){localStorage.setItem("booguels-taps-v11",JSON.stringify(state))}
function cssFor(t){const a=accentColors[t.accent]||t.accent||accentColors.grey;const p=beerProfiles[t.glass||"hazy"]||beerProfiles.hazy;return `--accent:${a};--beer1:${p[0]};--beer2:${p[1]};--foam:${p[2]}`}
function tapHtml(t){const empty=t.status!=="online";const p=beerProfiles[t.glass||"empty"]||beerProfiles.empty;return `<section class="tap ${empty?"empty":"online"}" data-tap="${t.tap}" style="${cssFor(t)}"><div class="num">${t.tap}</div><div class="info"><div class="name">${empty?"Empty Tap":t.name}</div><div class="style">${empty?"Coming Soon":t.style}</div><div class="rule"></div><div class="stats"><div><div class="value">${empty?"--":t.abv} ${empty?"%":"%"}</div><div class="label">ABV</div></div><div><div class="value">${empty?"--":t.ibu}</div><div class="label">IBU</div></div></div></div><div class="extras">${empty?"":String(t.extras||"").split("\n").filter(Boolean).map(x=>`<div>${x}</div>`).join("")}</div><div class="glasswrap"><div class="glass ${p[3]}"><div class="beer"></div><div class="foam"></div></div></div></section>`}
function render(){tapgrid.innerHTML=state.taps.sort((a,b)=>a.tap-b.tap).map(tapHtml).join("");document.querySelectorAll(".tap").forEach(el=>{const n=Number(el.dataset.tap);el.addEventListener("touchstart",()=>timers[n]=setTimeout(()=>openEditor(n),700));el.addEventListener("touchend",()=>clearTimeout(timers[n]));el.addEventListener("mousedown",()=>timers[n]=setTimeout(()=>openEditor(n),700));el.addEventListener("mouseup",()=>clearTimeout(timers[n]));el.addEventListener("dblclick",()=>openEditor(n));})}
function openEditor(n){editingTap=state.taps.find(t=>t.tap===n);modalTitle.textContent=`Modifier Tap ${n}`;status.value=editingTap.status||"online";name.value=editingTap.name||"";style.value=editingTap.style||"";abv.value=editingTap.abv||"";ibu.value=editingTap.ibu||"";extras.value=editingTap.extras||"";accent.value=Object.keys(accentColors).includes(editingTap.accent)?editingTap.accent:"cyan";glass.value=editingTap.glass||"hazy";modal.classList.remove("hidden")}
function closeEditor(){modal.classList.add("hidden")}
closeBtn.addEventListener("click",closeEditor);modal.addEventListener("click",e=>{if(e.target.id==="modal")closeEditor()});
emptyBtn.addEventListener("click",()=>{if(!editingTap)return;Object.assign(editingTap,{status:"empty",name:"Empty Tap",style:"Coming Soon",abv:"",ibu:"",extras:"",accent:"grey",glass:"empty"});persist();render();closeEditor()});
resetBtn.addEventListener("click",()=>{localStorage.removeItem("booguels-taps-v11");location.reload()});
tapForm.addEventListener("submit",e=>{e.preventDefault();if(!editingTap)return;Object.assign(editingTap,{status:status.value,name:name.value,style:style.value,abv:abv.value,ibu:ibu.value,extras:extras.value,accent:accent.value,glass:glass.value});if(editingTap.status==="empty")Object.assign(editingTap,{name:"Empty Tap",style:"Coming Soon",abv:"",ibu:"",extras:"",accent:"grey",glass:"empty"});persist();render();closeEditor()});
presentationBtn.addEventListener("click",()=>document.body.classList.toggle("presentation"));
loadInitial();
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js?v=11").catch(()=>{});

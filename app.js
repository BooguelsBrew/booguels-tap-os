
const accentColors={cyan:"#00e5e5",red:"#ff3a20",purple:"#b72cff",orange:"#ff8a1f",green:"#44ff88",blue:"#3f8cff",gold:"#ffc857",grey:"#707070"};
const beerProfiles={
  hazy:["#ffe989","#f3aa22","#fff0d6","hazy"],
  westcoast:["#ffe27a","#f39a12","#fff0d6","westcoast"],
  pilsner:["#fff09a","#f5c93b","#fff4d8","pilsner"],
  kolsch:["#fff3a6","#f7d154","#fff7dc","kolsch"],
  stout:["#1d0f0a","#020101","#b67644","stout"],
  pastry:["#2a130d","#020101","#b67644","stout"],
  sour:["#ff9ab6","#d84571","#fff1e5","sour"],
  wheat:["#ffd36a","#e58c18","#fff0d6","wheat"],
  brown:["#8b3b1d","#301007","#d8a06c","brown"],
  oldale:["#d74b20","#6b160d","#e7b17f","brown"],
  barleywine:["#a1371a","#3a0d05","#d99b65","barleywine"],
  empty:["#222","#111","#ddd","empty"]
};
let state, editingTap;

async function loadInitial(){
  const saved=localStorage.getItem("booguels-taps-v10");
  if(saved){state=JSON.parse(saved);render();return}
  const r=await fetch("beers.json?v=10",{cache:"no-store"});
  state=await r.json();render();
}
function persist(){localStorage.setItem("booguels-taps-v10",JSON.stringify(state))}
function cssFor(t){
  const accent=accentColors[t.accent]||t.accent||accentColors.grey;
  const p=beerProfiles[t.glass||"westcoast"]||beerProfiles.westcoast;
  return `--accent:${accent};--beer1:${p[0]};--beer2:${p[1]};--foam:${p[2]}`;
}
function tapHtml(t){
  const empty=t.status!=="online";
  const p=beerProfiles[t.glass||"westcoast"]||beerProfiles.westcoast;
  return `<section class="tap ${empty?"empty":"online"}" data-tap="${t.tap}" style="${cssFor(t)}">
    <div class="num">${t.tap}</div>
    <div class="info"><div class="name">${empty?"Empty Tap":(t.name||"")}</div><div class="style">${empty?"Coming Soon":(t.style||"")}</div><div class="rule"></div>
      <div class="stats"><div><div class="value">${empty?"-- %":(t.abv||"--")+" %"}</div><div class="label">ABV</div></div><div><div class="value">${empty?"--":(t.ibu||"--")}</div><div class="label">IBU</div></div></div>
    </div>
    <div class="extras">${empty?"":String(t.extras||"").split("\n").filter(Boolean).map(x=>`<div>${x}</div>`).join("")}</div>
    <div class="glasswrap"><div class="glass ${p[3]}"><div class="beer"></div><div class="foam"></div></div></div>
  </section>`
}
function render(){
  document.getElementById("tapgrid").innerHTML=state.taps.sort((a,b)=>a.tap-b.tap).map(tapHtml).join("");
  document.querySelectorAll(".tap").forEach(el=>el.addEventListener("click",()=>openEditor(Number(el.dataset.tap))));
}
function updatePreview(){
  const glass=document.getElementById("glass").value;
  const accent=document.getElementById("accent").value;
  document.getElementById("preview").innerHTML=`Aperçu : verre <b>${glass}</b>, accent <b>${accent}</b>. Sauvegarde pour appliquer.`;
}
function openEditor(n){
  editingTap=state.taps.find(t=>t.tap===n);
  modalTitle.textContent=`Tap ${n}`;
  status.value=editingTap.status||"online"; name.value=editingTap.name||""; style.value=editingTap.style||"";
  abv.value=editingTap.abv||""; ibu.value=editingTap.ibu||""; extras.value=editingTap.extras||"";
  accent.value=Object.keys(accentColors).includes(editingTap.accent)?editingTap.accent:"cyan";
  glass.value=editingTap.glass||"westcoast";
  modal.classList.remove("hidden"); updatePreview();
}
function closeEditor(){modal.classList.add("hidden")}
closeBtn.addEventListener("click",closeEditor);
modal.addEventListener("click",e=>{if(e.target.id==="modal")closeEditor()});
glass.addEventListener("change",updatePreview); accent.addEventListener("change",updatePreview);
emptyBtn.addEventListener("click",()=>{if(!editingTap)return;Object.assign(editingTap,{status:"empty",name:"Empty Tap",style:"Coming Soon",abv:"",ibu:"",extras:"",accent:"grey",glass:"empty"});persist();render();closeEditor()});
resetBtn.addEventListener("click",()=>{localStorage.removeItem("booguels-taps-v10");location.reload()});
tapForm.addEventListener("submit",e=>{
  e.preventDefault(); if(!editingTap)return;
  Object.assign(editingTap,{status:status.value,name:name.value,style:style.value,abv:abv.value,ibu:ibu.value,extras:extras.value,accent:accent.value,glass:glass.value});
  if(editingTap.status==="empty")Object.assign(editingTap,{name:"Empty Tap",style:"Coming Soon",abv:"",ibu:"",extras:"",accent:"grey",glass:"empty"});
  persist();render();closeEditor();
});
loadInitial();
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js?v=10").catch(()=>{});

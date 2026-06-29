
const beerColors = {
  gold: ["#ffe27a","#f39a12"],
  amber: ["#d74b20","#6b160d"],
  stout: ["#22100b","#020101"],
  empty: ["#222","#111"]
};

let state = null;
let editingTap = null;

async function loadInitial(){
  const saved = localStorage.getItem("booguels-taps-v9");
  if(saved){
    state = JSON.parse(saved);
    render();
    return;
  }
  const r = await fetch("beers.json?v=9", {cache:"no-store"});
  state = await r.json();
  render();
}

function persist(){
  localStorage.setItem("booguels-taps-v9", JSON.stringify(state));
}

function tapHtml(t){
  const empty = t.status !== "online";
  const colors = beerColors[t.beer || (empty ? "empty" : "gold")] || beerColors.gold;
  return `<section class="tap ${empty ? "empty" : "online"}" data-tap="${t.tap}" style="--accent:${t.accent || "#777"};--beer1:${colors[0]};--beer2:${colors[1]}">
    <div class="num">${t.tap}</div>
    <div class="info">
      <div class="name">${empty ? "Empty Tap" : (t.name || "")}</div>
      <div class="style">${empty ? "Coming Soon" : (t.style || "")}</div>
      <div class="rule"></div>
      <div class="stats">
        <div><div class="value">${empty ? "-- %" : (t.abv || "--") + " %"}</div><div class="label">ABV</div></div>
        <div><div class="value">${empty ? "--" : (t.ibu || "--")}</div><div class="label">IBU</div></div>
      </div>
    </div>
    <div class="extras">${empty ? "" : String(t.extras || "").split("\\n").filter(Boolean).map(x=>`<div>${x}</div>`).join("")}</div>
    <div class="glasswrap"><div class="glass"><div class="beer"></div><div class="foam"></div></div></div>
  </section>`;
}

function render(){
  document.getElementById("tapgrid").innerHTML = state.taps.sort((a,b)=>a.tap-b.tap).map(tapHtml).join("");
  document.querySelectorAll(".tap").forEach(el => {
    el.addEventListener("click", () => openEditor(Number(el.dataset.tap)));
  });
}

function openEditor(tapNo){
  editingTap = state.taps.find(t => t.tap === tapNo);
  document.getElementById("modalTitle").textContent = `Tap ${tapNo}`;
  document.getElementById("status").value = editingTap.status || "online";
  document.getElementById("name").value = editingTap.name || "";
  document.getElementById("style").value = editingTap.style || "";
  document.getElementById("abv").value = editingTap.abv || "";
  document.getElementById("ibu").value = editingTap.ibu || "";
  document.getElementById("extras").value = editingTap.extras || "";
  document.getElementById("accent").value = editingTap.accent || "#00e5e5";
  document.getElementById("modal").classList.remove("hidden");
}

function closeEditor(){
  document.getElementById("modal").classList.add("hidden");
}

document.getElementById("closeBtn").addEventListener("click", closeEditor);
document.getElementById("modal").addEventListener("click", e => { if(e.target.id === "modal") closeEditor(); });

document.getElementById("emptyBtn").addEventListener("click", () => {
  if(!editingTap) return;
  editingTap.status = "empty";
  editingTap.name = "Empty Tap";
  editingTap.style = "Coming Soon";
  editingTap.abv = "";
  editingTap.ibu = "";
  editingTap.extras = "";
  editingTap.accent = "#666666";
  editingTap.beer = "empty";
  persist();
  render();
  closeEditor();
});

document.getElementById("tapForm").addEventListener("submit", e => {
  e.preventDefault();
  if(!editingTap) return;
  editingTap.status = document.getElementById("status").value;
  editingTap.name = document.getElementById("name").value;
  editingTap.style = document.getElementById("style").value;
  editingTap.abv = document.getElementById("abv").value;
  editingTap.ibu = document.getElementById("ibu").value;
  editingTap.extras = document.getElementById("extras").value;
  editingTap.accent = document.getElementById("accent").value;
  if(editingTap.status === "empty"){
    editingTap.name = "Empty Tap";
    editingTap.style = "Coming Soon";
    editingTap.abv = "";
    editingTap.ibu = "";
    editingTap.extras = "";
    editingTap.accent = "#666666";
    editingTap.beer = "empty";
  }
  persist();
  render();
  closeEditor();
});

loadInitial();

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js?v=9").catch(()=>{});


const fallback = {
  taps: [
    {tap:1,status:"online",name:"Back To Brew",style:"Modern Pale Ale",abv:"5,5",ibu:"29",extras:["Nectaron","Krush"],accent:"#00d7d7",beerColor:"#f5a623"},
    {tap:2,status:"online",name:"Nutcracker",style:"Modern Old Ale",abv:"6,8",ibu:"30",extras:[],accent:"#ff1f17",beerColor:"#8f2616"},
    {tap:3,status:"online",name:"Darkness",style:"Pastry Stout",abv:"8",ibu:"36",extras:["Fèves cacao","Vanille","Tonka"],accent:"#b42cff",beerColor:"#070505"},
    {tap:4,status:"empty"},{tap:5,status:"empty"},{tap:6,status:"empty"}
  ]
};

async function getData(){
  try {
    const r = await fetch("beers.json?cache="+Date.now());
    if(!r.ok) throw new Error("json");
    return await r.json();
  } catch(e) { return fallback; }
}
function card(t){
 const empty=t.status!=="online";
 const accent=t.accent||"#777";
 const beer=t.beerColor||"#222";
 return `<section class="tap ${empty?'empty':''}" style="--accent:${accent};--beer:${beer}">
  <div class="num">${t.tap}</div>
  <div class="info">
    <div class="name">${empty?'Empty Tap':t.name}</div>
    <div class="style">${empty?'Coming Soon':t.style}</div>
    <div class="rule"></div>
    <div class="stats">
      <div><div class="value">${empty?'-- %':t.abv+' %'}</div><div class="label">ABV</div></div>
      <div><div class="value">${empty?'--':t.ibu}</div><div class="label">IBU</div></div>
    </div>
  </div>
  <div class="extras">${empty?'':(t.extras||[]).map(x=>`<div>${x}</div>`).join('')}</div>
  <div class="glass-wrap"><div class="glass"><div class="beer"></div><div class="foam"></div></div></div>
 </section>`;
}
getData().then(d=>{ document.getElementById("taplist").innerHTML = d.taps.sort((a,b)=>a.tap-b.tap).map(card).join(""); });
if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");

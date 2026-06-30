
const colors={cyan:'#00dbe5',orange:'#e88b21',red:'#ff3528',purple:'#a93cff',green:'#65d875',blue:'#418cff',gold:'#c39a4e',grey:'#5f5a51'};
const looks={gold:['#ffe985','#f3a217','#fff0d6'],amber:['#d64b1f','#5b160d','#e2af78'],stout:['#2b130e','#020101','#b87644'],redbeer:['#c4311f','#5b1008','#e2a270'],sour:['#ff98b5','#d84570','#fff0e2'],empty:['#222','#111','#ddd']};
let state=null,current=null,timer=null;
async function init(){const saved=localStorage.getItem('bb-premium-30');state=saved?JSON.parse(saved):await (await fetch('beers.json?v=30p',{cache:'no-store'})).json();render();}
function persist(){localStorage.setItem('bb-premium-30',JSON.stringify(state));}
function css(t){const c=colors[t.accent]||colors.grey;const l=looks[t.beer]||looks.gold;return `--accent:${c};--beerTop:${l[0]};--beerBottom:${l[1]};--foam:${l[2]}`}
function card(t){const e=t.status!=='online';const extras=(t.extras||[]).join(' • ');return `<section class="card ${e?'empty':'online'}" data-tap="${t.tap}" style="${css(t)}"><div class="num">${t.tap}</div><div class="info"><div class="name">${e?'EMPTY TAP':t.name}</div><div class="style">${e?'COMING SOON':t.style}</div><div class="ingredients">${e?'':extras}</div><div class="stats"><div><div class="value">${e?'--':t.abv+'%'}</div><div class="label">ABV</div></div><div><div class="value">${e?'--':t.ibu}</div><div class="label">IBU</div></div></div></div><div class="glassbox"><div class="pint"><div class="beer"></div><div class="foam"></div></div></div></section>`}
function render(){grid.innerHTML=state.taps.sort((a,b)=>a.tap-b.tap).map(card).join('');document.querySelectorAll('.card').forEach(el=>{const n=+el.dataset.tap;el.addEventListener('click',()=>openEditor(n));el.addEventListener('touchstart',()=>timer=setTimeout(()=>openEditor(n),450),{passive:true});el.addEventListener('touchend',()=>clearTimeout(timer),{passive:true});});}
function openEditor(n){current=state.taps.find(t=>t.tap===n);editorTitle.textContent='BEC '+n;status.value=current.status;name.value=current.name;style.value=current.style;abv.value=current.abv;ibu.value=current.ibu;extras.value=(current.extras||[]).join('\n');accent.value=current.accent;beer.value=current.beer;editor.classList.remove('hidden');}
function close(){editor.classList.add('hidden')}
closeBtn.onclick=close;
emptyBtn.onclick=()=>{Object.assign(current,{status:'empty',name:'Empty Tap',style:'Coming Soon',abv:'',ibu:'',extras:[],accent:'grey',beer:'empty'});persist();render();close();}
resetBtn.onclick=()=>{localStorage.removeItem('bb-premium-30');location.reload();}
saveBtn.onclick=()=>{Object.assign(current,{status:status.value,name:name.value,style:style.value,abv:abv.value,ibu:ibu.value,extras:extras.value.split('\n').map(x=>x.trim()).filter(Boolean),accent:accent.value,beer:beer.value});if(current.status==='empty')Object.assign(current,{name:'Empty Tap',style:'Coming Soon',abv:'',ibu:'',extras:[],accent:'grey',beer:'empty'});persist();render();close();}
presentBtn.onclick=()=>document.body.classList.toggle('presentation');
init();if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js?v=30p').catch(()=>{});}


let state = null;
let current = null;

async function load(){
  const saved = localStorage.getItem('bb-master-app');
  if(saved){ state = JSON.parse(saved); }
  else {
    const r = await fetch('beers.json?v=master1', {cache:'no-store'});
    state = await r.json();
  }
}
function persist(){ localStorage.setItem('bb-master-app', JSON.stringify(state)); }

function openTap(n){
  current = state.taps.find(t => t.tap === n);
  title.textContent = 'Bec ' + n;
  status.value = current.status || 'online';
  name.value = current.name || '';
  style.value = current.style || '';
  abv.value = current.abv || '';
  ibu.value = current.ibu || '';
  extras.value = current.extras || '';
  editor.classList.remove('hidden');
}
document.querySelectorAll('.zone').forEach(z=>{
  z.addEventListener('click',()=>openTap(Number(z.dataset.tap)));
});
close.onclick = () => editor.classList.add('hidden');
save.onclick = () => {
  if(!current) return;
  Object.assign(current, {
    status: status.value,
    name: name.value,
    style: style.value,
    abv: abv.value,
    ibu: ibu.value,
    extras: extras.value
  });
  persist();
  editor.classList.add('hidden');
};

load();

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js?v=master1').catch(()=>{});
}

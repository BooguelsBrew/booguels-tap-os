
let state = null;
let current = null;
let holdTimer = null;

async function load(){
  const saved = localStorage.getItem('bb-master-app-fixed');
  if(saved){ state = JSON.parse(saved); }
  else {
    const r = await fetch('beers.json?v=master2', {cache:'no-store'});
    state = await r.json();
  }
}
function persist(){ localStorage.setItem('bb-master-app-fixed', JSON.stringify(state)); }

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
  const n = Number(z.dataset.tap);

  z.addEventListener('click', e => {
    e.preventDefault();
    openTap(n);
  });

  z.addEventListener('touchstart', e => {
    holdTimer = setTimeout(() => openTap(n), 350);
  }, {passive:true});

  z.addEventListener('touchend', () => clearTimeout(holdTimer), {passive:true});
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
  navigator.serviceWorker.register('./sw.js?v=master2').catch(()=>{});
}

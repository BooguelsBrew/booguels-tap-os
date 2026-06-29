// BOOGUELS BREW TAPLIST V5 HYBRIDE
// Cette V5 utilise l'image master premium comme interface plein écran.
// La prochaine étape consistera à rendre les zones de texte dynamiques au-dessus du master.

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js?v=5").catch(() => {});
}

// BOOGUELS BREW TAPLIST V6 MASTER OVERLAY
// V6 = version master premium plein écran, avec cache forcé.
// La prochaine étape pourra ajouter des calques texte dynamiques par-dessus.

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js?v=6").catch(() => {});
}

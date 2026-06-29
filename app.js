// BOOGUELS TAP OS V7
// Version master premium affichée en plein écran.
// beers.json est inclus pour préparer les futures mises à jour dynamiques.

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js?v=7").catch(() => {});
}

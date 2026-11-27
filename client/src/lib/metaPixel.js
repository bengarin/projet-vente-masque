/* Meta Pixel — équivalent du code fourni par Meta, chargé depuis React (pas de script inline : CSP stricte).
   L'identifiant vient de l'admin (Paramètres) via l'API ; vide = rien n'est chargé.
   Uniquement sur la boutique : jamais sur /admin. */
let loadedId = null;

export function initMetaPixel(id) {
  if (!id || loadedId === id || typeof window === "undefined") return;
  if (!window.fbq) {
    // File d'attente officielle de Meta : les appels sont gardés jusqu'au chargement du script
    const n = (window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); });
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    const t = document.createElement("script");
    t.async = true;
    t.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(t);
  }
  window.fbq("init", id);
  loadedId = id;
}

/* Une « page vue » par écran (le site ne recharge pas la page entre les étapes) */
let lastPath = null;
export function trackPageView(path) {
  if (!loadedId || !window.fbq || path === lastPath) return;   // évite le doublon du mode développement de React
  lastPath = path;
  window.fbq("track", "PageView");
}

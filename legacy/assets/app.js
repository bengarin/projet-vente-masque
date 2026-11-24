/* =====================================================================
   SOCLE COMMUN DES 3 ÉTAPES — config, langues, navigation, pack, panier
   ===================================================================== */
window.MC = (() => {
const CONFIG = {
  brand: "mapetitecoree.ma",
  logo: {src:"../client/public/images/logo-mapetitecoree.png", src2x:"../client/public/images/logo-mapetitecoree@2x.png", webp:"../client/public/images/logo-mapetitecoree.webp", webp2x:"../client/public/images/logo-mapetitecoree@2x.webp", w:640, h:175,
         alt:"mapetitecoree.ma — Korean & Natural Skincare"},
  currency: "DH",
  packSizes: [3, 4, 6],
  packPrices: {3: null, 4: null, 6: null}, // [DONNÉES MANQUANTES] prix fixe du pack en DH ; null = somme des prix unitaires
  pages: {1: "index.html", 2: "etape-2.html", 3: "etape-3.html", 4: "checkout.html"},
  checkoutUrl: "/checkout",                // paiement Shopify (utilisé seulement si le site tourne sur Shopify)
  checkoutPage: "checkout.html",           // page de commande du site

  /* ===== LIVRAISON — [DONNÉES MANQUANTES] aucune option configurée pour mapetitecoree.ma =====
     Une ligne par option. fee = frais en DH ; freeFrom = gratuit à partir de ce total produits (null = jamais).
     Exemple de format (NE PAS laisser tel quel sans validation) :
       {id:"maroc", label:{fr:"Livraison Maroc", ar:"التوصيل فالمغرب", en:"Delivery in Morocco"}, fee:20, freeFrom:299, delay:{fr:"…", ar:"…", en:"…"}} */
  shipping: [],

  /* ===== PAIEMENT — [DONNÉES MANQUANTES] aucun mode configuré =====
     Exemple : {id:"cod", label:{fr:"Paiement à la livraison", ar:"الدفع عند الاستلام", en:"Cash on delivery"}} */
  payments: [],

  /* Où envoyer la commande (URL qui reçoit un POST JSON : Make, Zapier, Google Apps Script, ton serveur…).
     null = aucune commande réelle n'est envoyée. */
  orderEndpoint: null,
  /* true = permet de tester le parcours jusqu'à la confirmation (marquée « commande test »). Mettre false en production. */
  previewMode: true,
  homeUrl: "/",
  shopify: "auto"                          // "auto" = actif sur la boutique Shopify si tous les variantId sont remplis
};
const LANGS = [
  {code:"ar", label:"العربية", flag:"../client/public/images/deco/drapeau-ma.webp", dir:"rtl"},
  {code:"fr", label:"Français", flag:"../client/public/images/deco/drapeau-fr.webp", dir:"ltr"},
  {code:"en", label:"English",  flag:"../client/public/images/deco/drapeau-en.webp", dir:"ltr"}
];
const LRI = "⁦", PDI = "⁩";       // isole « 2/4 » pour l'arabe
const iso = s => LRI + s + PDI;

/* Textes communs — arabe (darija) à faire relire par une personne native [HYPOTHÈSE] */
const T = {
  fr:{steps:["Langue","Pack","Masques"],menu:"Menu",close:"Fermer",cart:"Panier",continue:"Continuer",lang:"Langue",
      stepTag:n=>`ÉTAPE ${n}/3`,step:n=>`Étape ${n}`,home:"Accueil",
      cartTitle:"Mon panier",packOf:t=>`Pack de ${t} masques`,noPack:"Aucun pack choisi",
      unit:"Prix unitaire",unitLine:v=>`Prix unitaire : ${v??"à renseigner"}`,tbd:"Prix à renseigner",add:"Ajouter",minus:"Retirer un",del:"Supprimer",
      sumMasks:"Total des masques",packPrice:t=>`Prix du pack de ${t}`,total:"Total",tbdTotal:"À renseigner",
      empty:"Ton panier est vide.",emptyHint:"Choisis tes masques pour remplir ton pack.",
      need:k=>k===1?"Ajoute encore 1 masque pour compléter ton pack.":`Ajoute encore ${k} masques pour compléter ton pack.`,
      choosePack:"Choisis d'abord la taille de ton pack.",ready:"Ton pack est complet ✓",
      keep:"Continuer mes achats",checkout:"Passer au checkout",full:t=>`Ton pack contient déjà ${t} masques.`,
      demo:"Aperçu : le paiement s'active sur la boutique Shopify une fois les variantId renseignés.",
      missing:"Il manque l'ID Shopify (variantId) d'un masque : paiement impossible pour l'instant.",
      err:"Le panier n'a pas pu être mis à jour. Réessaie.",goPick:"Choisir mes masques"},
  ar:{steps:["اللغة","الباك","الماسكات"],menu:"القائمة",close:"إغلاق",cart:"السلة",continue:"متابعة",lang:"اللغة",
      stepTag:n=>`الخطوة ${n}/3`,step:n=>`الخطوة ${n}`,home:"الرئيسية",
      cartTitle:"السلة ديالي",packOf:t=>`باك ديال ${t} ماسكات`,noPack:"ما زال ما اخترتي باك",
      unit:"ثمن الوحدة",unitLine:v=>`ثمن الوحدة: ${v??"يُحدَّد"}`,tbd:"الثمن: يُحدَّد",add:"إضافة",minus:"نقص واحد",del:"حذف",
      sumMasks:"مجموع الماسكات",packPrice:t=>`ثمن باك ${t}`,total:"المجموع",tbdTotal:"يُحدَّد",
      empty:"السلة خاوية.",emptyHint:"اختاري الماسكات باش تعمري الباك ديالك.",
      need:k=>k===1?"زيدي ماسك واحد باش يكمل الباك.":`زيدي ${k} ماسكات باش يكمل الباك.`,
      choosePack:"اختاري أولاً حجم الباك.",ready:"الباك ديالك كامل ✓",
      keep:"كملي التسوق",checkout:"إتمام الطلب",full:t=>`الباك فيه ${t} ماسكات.`,
      demo:"معاينة: الأداء كيخدم في متجر Shopify ملي تتزاد معرّفات variantId.",
      missing:"ناقص معرّف Shopify ديال شي ماسك: ما يمكنش الأداء دابا.",
      err:"ما تحدّثاتش السلة. عاودي مرة أخرى.",goPick:"اختاري الماسكات"},
  en:{steps:["Language","Pack","Masks"],menu:"Menu",close:"Close",cart:"Cart",continue:"Continue",lang:"Language",
      stepTag:n=>`STEP ${n}/3`,step:n=>`Step ${n}`,home:"Home",
      cartTitle:"My cart",packOf:t=>`Pack of ${t} masks`,noPack:"No pack selected",
      unit:"Unit price",unitLine:v=>`Unit price: ${v??"to be set"}`,tbd:"Price to be set",add:"Add",minus:"Remove one",del:"Remove",
      sumMasks:"Masks subtotal",packPrice:t=>`Pack of ${t} price`,total:"Total",tbdTotal:"To be set",
      empty:"Your cart is empty.",emptyHint:"Pick your masks to fill your pack.",
      need:k=>k===1?"Add 1 more mask to complete your pack.":`Add ${k} more masks to complete your pack.`,
      choosePack:"Choose your pack size first.",ready:"Your pack is complete ✓",
      keep:"Continue shopping",checkout:"Go to checkout",full:t=>`Your pack already has ${t} masks.`,
      demo:"Preview: checkout works on the Shopify store once the variantIds are filled in.",
      missing:"A mask is missing its Shopify ID (variantId): checkout isn't possible yet.",
      err:"The cart couldn't be updated. Please try again.",goPick:"Pick my masks"}
};

const store = {
  get(k){try{return sessionStorage.getItem(k) ?? localStorage.getItem(k)}catch(e){return null}},
  set(k,v){try{sessionStorage.setItem(k,v);localStorage.setItem(k,v)}catch(e){}}
};
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const qs = new URLSearchParams(location.search);

/* Choix conservés : URL (?lang=en&pack=4) puis mémoire du navigateur */
function getLang(){ const v = (qs.get("lang") || store.get("mc_lang") || "").slice(0,2); return LANGS.some(l => l.code === v) ? v : null; }
function getPack(){ const v = parseInt(qs.get("pack") || store.get("mc_pack"), 10); return CONFIG.packSizes.includes(v) ? v : null; }
/* Un nouveau choix met aussi à jour l'adresse, pour qu'elle ne garde pas l'ancien */
function syncUrl(k, v){ qs.set(k, v); try{ history.replaceState(null, "", location.pathname + "?" + qs.toString() + location.hash); }catch(e){} }
function setLang(l){ store.set("mc_lang", l); syncUrl("lang", l); }
function setPack(n){ store.set("mc_pack", String(n)); syncUrl("pack", n); Pack.trim(); }
function url(step){
  const p = new URLSearchParams(); const l = getLang(), k = getPack();
  if (l) p.set("lang", l); if (k && step >= 2) p.set("pack", k);
  const q = p.toString(); return CONFIG.pages[step] + (q ? "?" + q : "");
}
function go(step){ location.href = url(step); }
const onShopify = () => CONFIG.shopify === true || (CONFIG.shopify === "auto" && !!window.Shopify);
const fmt = v => v == null ? null : `${Number(v).toLocaleString("fr-MA",{minimumFractionDigits:Number(v)%1?2:0,maximumFractionDigits:2})} ${CONFIG.currency}`;
const products = () => window.PRODUCTS || [];
const byId = id => products().find(p => p.id === id);

/* ---------- Icônes et stickers dessinés ---------- */
const ICON = {
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M3.5 6h17M3.5 12h17M3.5 18h17"/></svg>',
  cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L21 8H6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>'
};
const DECO = {
  star:c=>`<svg viewBox="0 0 60 60"><path d="M30 4l7.6 15.4 17 2.5-12.3 12 2.9 16.9L30 42.8 14.8 50.8l2.9-16.9L5.4 21.9l17-2.5z" fill="${c||'#F7D33A'}" stroke="#fff" stroke-width="5" stroke-linejoin="round" paint-order="stroke"/><path d="M30 4l7.6 15.4 17 2.5-12.3 12 2.9 16.9L30 42.8 14.8 50.8l2.9-16.9L5.4 21.9l17-2.5z" fill="none" stroke="rgba(22,35,138,.25)" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  ostar:()=>`<svg viewBox="0 0 60 60"><path d="M30 6l7 14.6 16 2.3-11.6 11.3 2.8 15.9L30 42.6 15.8 50.1l2.8-15.9L7 22.9l16-2.3z" fill="none" stroke="#1530C8" stroke-width="3.2" stroke-linejoin="round"/></svg>`,
  spark:c=>`<svg viewBox="0 0 60 60"><path d="M30 4c2 14 8 20 22 22-14 2-20 8-22 22-2-14-8-20-22-22 14-2 20-8 22-22z" fill="${c||'#fff'}" stroke="#1530C8" stroke-width="3" stroke-linejoin="round"/></svg>`,
  sparks:()=>`<svg viewBox="0 0 60 60"><path d="M22 10c1.6 11 6 15.5 17 17-11 1.6-15.4 6-17 17-1.6-11-6-15.4-17-17 11-1.5 15.4-6 17-17z" fill="#F7D33A" stroke="#1530C8" stroke-width="2.6" stroke-linejoin="round"/><path d="M46 4c.9 6 3.4 8.5 9.4 9.4-6 .9-8.5 3.4-9.4 9.4-.9-6-3.4-8.5-9.4-9.4 6-.9 8.5-3.4 9.4-9.4z" fill="#fff" stroke="#1530C8" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
  rays:c=>`<svg viewBox="0 0 40 40"><g stroke="${c||'#1530C8'}" stroke-width="4.2" stroke-linecap="round"><path d="M8 28L3 34"/><path d="M18 22l2-12"/><path d="M27 26l9-6"/></g></svg>`,
  side:c=>`<svg viewBox="0 0 40 40"><g stroke="${c||'#F3CF45'}" stroke-width="4.2" stroke-linecap="round"><path d="M30 8l-12 6"/><path d="M32 20H16"/><path d="M30 32l-12-6"/></g></svg>`,
  heart:()=>`<svg viewBox="0 0 60 60"><path d="M30 52S6 37 6 21c0-8 6-13 12.5-13C24 8 28 11 30 15c2-4 6-7 11.5-7C48 8 54 13 54 21c0 16-24 31-24 31z" fill="#fff" stroke="#1530C8" stroke-width="3.4" stroke-linejoin="round"/></svg>`,
  smile:()=>`<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" fill="#FBE38A" stroke="#16238A" stroke-width="3"/><circle cx="22" cy="25" r="2.6" fill="#16238A"/><circle cx="38" cy="25" r="2.6" fill="#16238A"/><path d="M19 35c6 8 16 8 22 0" fill="none" stroke="#16238A" stroke-width="3" stroke-linecap="round"/></svg>`,
  squig:()=>`<svg viewBox="0 0 100 14"><path d="M2 8c8-6 14 6 22 0s14 6 22 0 14 6 22 0 14 6 22 0" fill="none" stroke="#F3CF45" stroke-width="4.5" stroke-linecap="round"/></svg>`,
  face:()=>`<svg viewBox="0 0 60 70"><path d="M30 3c15 0 26 12 26 30 0 20-12 34-26 34S4 53 4 33C4 15 15 3 30 3z" fill="#fff" stroke="#CDBBF3" stroke-width="2"/><ellipse cx="20" cy="30" rx="6.5" ry="4" fill="#CDBBF3"/><ellipse cx="40" cy="30" rx="6.5" ry="4" fill="#CDBBF3"/><ellipse cx="30" cy="50" rx="7.5" ry="4" fill="#CDBBF3"/></svg>`
};
function deco(root = document){
  root.querySelectorAll("[data-dc]").forEach(el => { const [k,c] = el.dataset.dc.split(":"); if (DECO[k]) el.innerHTML = DECO[k](c); });
}

/* ---------- Papier déchiré : bords irréguliers calculés une fois ---------- */
function rnd(seed){ let s = seed % 2147483647 || 7; return () => (s = s * 16807 % 2147483647) / 2147483647; }
function tear(root = document){
  root.querySelectorAll("[data-torn]").forEach((el, i) => {
    const a = +el.dataset.torn || 6, sides = el.dataset.sides || "tblr", r = rnd(1000 + i * 97 + a * 13);
    const pts = [], amp = k => sides.includes(k) ? a : 0;
    const edge = (n, f) => { for (let j = 0; j <= n; j++) pts.push(f(j / n, r())); };
    edge(28, (t, q) => `${(t*100).toFixed(2)}% ${(q*amp("t")).toFixed(1)}px`);
    edge(8,  (t, q) => `calc(100% - ${(q*amp("r")).toFixed(1)}px) ${(t*100).toFixed(2)}%`);
    edge(28, (t, q) => `${(100-t*100).toFixed(2)}% calc(100% - ${(q*amp("b")).toFixed(1)}px)`);
    edge(8,  (t, q) => `${(q*amp("l")).toFixed(1)}px ${(100-t*100).toFixed(2)}%`);
    el.style.clipPath = `polygon(${pts.join(",")})`;
  });
}

/* ---------- Pile de masques en papier (étape 2) : n masques exactement ---------- */
function maskStack(n){
  const cols = ["#CDBBF3","#F7DA6A","#2338C9"], dx = n <= 3 ? 20 : n <= 5 ? 15 : 12;
  const face = "M32 2C49 2 62 15 62 36 62 60 48 80 32 80 16 80 2 60 2 36 2 15 15 2 32 2z";
  const w = 66 + (n-1) * dx, uid = "m" + n;
  let g = "";
  for (let i = n-1; i >= 1; i--){
    const c = n === 3 ? ["#F7DA6A","#2338C9"][i-1] : cols[(i-1) % 3];
    g += `<g transform="translate(${2+i*dx} 4)" filter="url(#${uid}s)"><path d="${face}" fill="${c}"/><path d="${face}" fill="url(#${uid}t)"/>
      <ellipse cx="44" cy="34" rx="7" ry="4.5" fill="rgba(255,255,255,.35)"/></g>`;
  }
  g += `<g transform="translate(2 4)" filter="url(#${uid}s)"><path d="${face}" fill="#fff" stroke="#B9A4EE" stroke-width="2"/><path d="${face}" fill="url(#${uid}t)"/>
    <ellipse cx="20" cy="33" rx="8" ry="5" fill="#D4C5F6"/><ellipse cx="44" cy="33" rx="8" ry="5" fill="#D4C5F6"/>
    <path d="M27 48q5 3 10 0" fill="none" stroke="#B9A4EE" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="32" cy="62" rx="9" ry="4.6" fill="#D4C5F6"/></g>`;
  return `<svg viewBox="0 0 ${w+6} 90" aria-hidden="true"><defs>
    <filter id="${uid}s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="2" dy="2" stdDeviation="1.6" flood-color="#3A1A70" flood-opacity=".22"/></filter>
    <pattern id="${uid}t" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="transparent"/><path d="M0 7h40M0 19h40M0 31h40" stroke="rgba(0,0,0,.035)"/><path d="M5 0v40M17 0v40M29 0v40" stroke="rgba(255,255,255,.06)"/></pattern>
  </defs>${g}</svg>`;
}

/* ---------- État du pack : liste ordonnée des masques choisis (un id peut se répéter) ---------- */
const listeners = [];
const Pack = {
  order: (() => { try { return JSON.parse(store.get("mc_order") || "[]").filter(id => byId(id)); } catch(e){ return []; } })(),
  get N(){ return getPack(); },
  count(){ return this.order.length; },
  qty(id){ return this.order.filter(x => x === id).length; },
  save(){ store.set("mc_order", JSON.stringify(this.order)); listeners.forEach(f => f()); },
  trim(){ const n = getPack(); if (n && this.order.length > n){ this.order = this.order.slice(0, n); this.save(); } },
  setQty(id, q){
    const N = this.N, cur = this.qty(id); q = Math.max(0, q);
    if (q > cur){
      if (!N){ toast(T[curLang].choosePack); return false; }
      if (this.count() + (q - cur) > N){ toast(T[curLang].full(N)); return false; }
      for (let i = cur; i < q; i++) this.order.push(id);
    } else for (let i = q; i < cur; i++) this.order.splice(this.order.lastIndexOf(id), 1);
    this.save(); return true;
  },
  replace(oldId, newId){ const i = this.order.lastIndexOf(oldId); if (i < 0) return false; this.order[i] = newId; this.save(); return true; },
  items(){ return products().filter(p => this.qty(p.id)).map(x => ({x, q: this.qty(x.id)})); },
  totals(){
    const items = this.items(), N = this.N;
    const sum = items.every(({x}) => x.price != null) ? items.reduce((s,{x,q}) => s + x.price * q, 0) : null;
    const pack = N ? CONFIG.packPrices[N] : null;
    return {items, sum, pack, total: pack != null ? pack : sum};
  }
};
Pack.trim();
function onChange(f){ listeners.push(f); }

let curLang = getLang() || "fr", curStep = 1, langCb = null;

/* Logo : vraie image (PNG transparent, version WebP + écran haute densité) */
function logoImg(cls){
  const L = CONFIG.logo;
  return `<picture><source type="image/webp" srcset="${L.webp} 1x, ${L.webp2x} 2x"><img class="logo ${cls}" src="${L.src}" srcset="${L.src} 1x, ${L.src2x} 2x" width="${L.w}" height="${L.h}" alt="${esc(L.alt)}" decoding="async"></picture>`;
}

/* ---------- En-tête, menu (3 langues) et suivi d'étapes ---------- */
function chrome(step, lang, opts = {}){
  curLang = lang; curStep = step; langCb = opts.onLang || null;
  const t = T[lang], L = LANGS.find(l => l.code === lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = L.dir;                         // RTL seulement pour l'arabe
  document.getElementById("top").innerHTML = `
    <button class="icon" type="button" id="menuBtn" aria-label="${esc(t.menu)}" aria-expanded="false">${ICON.menu}</button>
    <a class="brand" href="${esc(url(1))}" dir="ltr">${logoImg("hd")}</a>
    <button class="icon cart" type="button" id="cartBtn" aria-label="${esc(t.cart)}">${ICON.cart}<b id="cartCount" hidden>0</b></button>`;
  let m = document.getElementById("menu");
  if (!m){ m = document.createElement("div"); m.id = "menu"; m.className = "menu"; document.body.appendChild(m); }
  const can = i => i <= step || (i === 2 && getLang()) || (i === 3 && getLang() && getPack());
  m.innerHTML = `<nav aria-label="${esc(t.menu)}"><div class="mhead"><span class="mlogo">${logoImg("mn")}</span><button class="x" type="button" id="menuClose" aria-label="${esc(t.close)}">×</button></div>
    ${[1,2,3].map(i => `<a href="${esc(url(i))}" ${can(i)?"":'aria-disabled="true"'} ${i===step?'aria-current="page"':''}>${esc(t.step(i))} · ${esc(t.steps[i-1])}</a>`).join("")}
    ${opts.onLang ? `<p class="mlab">${esc(t.lang)}</p><div class="mlangs">${LANGS.map(l => `<button type="button" data-lang="${l.code}" ${l.code===lang?'aria-pressed="true"':'aria-pressed="false"'}><img src="${l.flag}" alt="">${esc(l.label)}</button>`).join("")}</div>` : ""}
    <a href="${esc(CONFIG.homeUrl)}">${esc(t.home)}</a></nav>`;
  const openM = v => { m.classList.toggle("open", v); document.getElementById("menuBtn").setAttribute("aria-expanded", v); lock(v); };
  document.getElementById("menuBtn").onclick = () => openM(true);
  m.onclick = e => {
    if (e.target === m || e.target.id === "menuClose") return openM(false);
    const b = e.target.closest("[data-lang]");
    if (b && langCb){ setLang(b.dataset.lang); openM(false); langCb(b.dataset.lang); }
  };
  document.getElementById("cartBtn").onclick = () => Cart.open();

  const sd = document.getElementById("sdots");
  if (sd){
    sd.setAttribute("aria-label", t.stepTag(step));
    sd.innerHTML = [1,2,3].map(i => {
      const cls = i < step ? "done" : i === step ? "now" : "";
      const inner = i < step ? ICON.check : i;
      return `<li class="${cls}">${i < step ? `<a class="c" href="${esc(url(i))}" aria-label="${esc(t.step(i)+' · '+t.steps[i-1])}">${inner}</a>`
        : `<span class="c" ${i===step?'aria-current="step"':''}>${inner}</span>`}</li>`;
    }).join("");
  }
  document.querySelectorAll("[data-tag]").forEach(el => el.textContent = t.stepTag(step));
  document.querySelectorAll(".cta .ic").forEach(el => el.innerHTML = ICON.arrow);
  Cart.badge();
  if (Cart.isOpen()) Cart.render();
}

/* Textes de page : clé simple → texte ; clé en _html → balisage interne (aucune donnée externe) */
function i18n(dict){
  document.querySelectorAll("[data-i18n]").forEach(el => { const k = el.dataset.i18n;
    if (typeof dict[k+"_html"] === "string") el.innerHTML = dict[k+"_html"];
    else if (typeof dict[k] === "string") el.textContent = dict[k]; });
}

let toastT;
function toast(msg){
  let el = document.getElementById("toast");
  if (!el){ el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role","status"); document.body.appendChild(el); }
  el.textContent = msg; el.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 2400);
}

/* Animations : coupées si la cliente a demandé moins de mouvement */
const RM = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
/* Lance une animation CSS sur UN élément précis. On attend la fin de SES propres animations
   (pas celles de ses enfants, dont l'événement « animationend » remonte et coupait l'animation trop tôt). */
function anim(el, cls){
  if (!el || RM()) return;
  const reg = el._anims || (el._anims = {});          // un suivi PAR animation (un bouton peut en avoir deux en même temps)
  const prev = reg[cls]; if (prev) clearTimeout(prev.t);
  const tok = reg[cls] = {};
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  const clean = () => { if (reg[cls] === tok){ clearTimeout(tok.t); delete reg[cls]; el.classList.remove(cls); } };
  const own = el.getAnimations ? el.getAnimations({subtree:true}).filter(a => a.effect && a.effect.target === el && a.animationName) : [];
  if (own.length) Promise.all(own.map(a => a.finished.catch(() => {}))).then(clean);
  tok.t = setTimeout(clean, 1000);                    // filet de sécurité
}

/* Petite fenêtre de choix (confirmation, remplacement) — renvoie la valeur du bouton touché */
function dialog({title, html = "", buttons = []}){
  return new Promise(res => {
    const back = document.activeElement;
    const d = document.createElement("div"); d.className = "dlg"; d.setAttribute("role","dialog"); d.setAttribute("aria-modal","true");
    d.innerHTML = `<div class="dbox"><div class="sh"><div class="paper dpaper" data-torn="6">
        <button class="x" type="button" data-value="" aria-label="${esc(T[curLang].close)}">×</button>
        <h2 id="dlgT">${esc(title)}</h2>${html}
        <div class="dbtns">${buttons.map(b => `<button type="button" class="${b.primary?"go":"ghost"}" data-value="${esc(b.value)}">${esc(b.label)}</button>`).join("")}</div>
      </div></div></div>`;
    d.setAttribute("aria-labelledby","dlgT");
    document.body.appendChild(d); tear(d); deco(d); lock(true);
    const done = v => { d.remove(); lock(false); document.removeEventListener("keydown", key); back && back.focus && back.focus(); res(v); };
    const key = e => { if (e.key === "Escape") done(""); };
    document.addEventListener("keydown", key);
    d.addEventListener("click", e => { if (e.target === d) return done(""); const b = e.target.closest("[data-value]"); if (b) done(b.dataset.value); });
    (d.querySelector(".go") || d.querySelector("[data-value]")).focus();
  });
}

/* Bloque le défilement de la page derrière une fenêtre ouverte */
let locks = 0;
function lock(on){ locks = Math.max(0, locks + (on ? 1 : -1)); document.documentElement.classList.toggle("locked", locks > 0); }

/* ---------- Panier latéral (même contenu sur les 3 pages) ---------- */
const TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>';
const Cart = {
  el: null,
  ensure(){
    if (this.el) return this.el;
    const d = document.createElement("div");
    d.className = "drawer"; d.id = "cartDrawer";
    d.innerHTML = `<aside class="dpanel" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
      <header class="dhead"><div><h2 id="cartTitle"></h2><p id="cartSub"></p></div><button class="x" type="button" data-close>×</button></header>
      <div class="dbody"><ul class="lines" id="cartLines"></ul></div>
      <footer class="dfoot"><div class="sum" id="cartSum"></div><p class="status" id="cartStatus"></p>
        <button class="go" type="button" id="cartGo"></button><button class="ghost" type="button" data-close id="cartKeep"></button></footer>
    </aside>`;
    document.body.appendChild(d);
    d.addEventListener("click", e => {
      if (e.target === d || e.target.closest("[data-close]")) return this.close();
      const b = e.target.closest("button[data-act]"); if (!b) return;
      const id = b.closest("[data-id]").dataset.id, q = Pack.qty(id);
      Pack.setQty(id, b.dataset.act === "plus" ? q + 1 : b.dataset.act === "minus" ? q - 1 : 0);
    });
    d.querySelector("#cartGo").addEventListener("click", () => this.checkout());
    document.addEventListener("keydown", e => { if (e.key === "Escape" && this.isOpen()) this.close(); });
    return this.el = d;
  },
  isOpen(){ return !!this.el && this.el.classList.contains("open"); },
  open(){ this.ensure(); this.render(); if (!this.isOpen()){ this.el.classList.add("open"); lock(true); } this.el.querySelector("[data-close]").focus(); },
  close(){ if (this.isOpen()){ this.el.classList.remove("open"); lock(false); document.getElementById("cartBtn")?.focus(); } },
  badge(){ const b = document.getElementById("cartCount"); if (!b) return; const n = Pack.count(); b.hidden = !n; b.textContent = n; },
  render(){
    const t = T[curLang], N = Pack.N, n = Pack.count(), {items, sum, pack, total} = Pack.totals(), d = this.ensure();
    d.querySelector("#cartTitle").textContent = t.cartTitle;
    d.querySelector("#cartSub").textContent = N ? `${t.packOf(N)} · ${iso(n+"/"+N)}` : t.noPack;
    d.querySelector("[data-close]").setAttribute("aria-label", t.close);
    d.querySelector("#cartLines").innerHTML = items.length ? items.map(({x,q}) => `
      <li class="line" data-id="${esc(x.id)}">
        <img src="${esc(x.images[0])}" alt="">
        <div class="info"><small>${esc(x.brand)}</small><b>${esc(x.name)}</b>
          <span>${esc(t.unitLine(x.price==null ? null : fmt(x.price)))}</span>
          <div class="ctl"><div class="qty">
              <button class="mi" type="button" data-act="minus" aria-label="${esc(t.minus+" – "+x.name)}">−</button>
              <output>${q}</output>
              <button class="pl" type="button" data-act="plus" aria-label="${esc(t.add+" – "+x.name)}" ${N && n>=N ? "disabled" : ""}>+</button></div>
            <button class="rm" type="button" data-act="del">${TRASH}${esc(t.del)}</button></div>
        </div>
        ${x.price==null ? "" : `<div class="lt">${esc(fmt(x.price*q))}</div>`}
      </li>`).join("")
      : `<li class="emptyc"><span class="dc" data-dc="face"></span><b>${esc(t.empty)}</b><span>${esc(t.emptyHint)}</span></li>`;
    deco(d);
    const row = (a,b,c="") => `<div class="${c}"><span>${esc(a)}</span><span dir="ltr">${esc(b)}</span></div>`;
    d.querySelector("#cartSum").innerHTML = (pack != null ? row(t.sumMasks, sum==null ? t.tbdTotal : fmt(sum)) + row(t.packPrice(N), fmt(pack)) : "")
      + row(t.total, total==null || !items.length ? (items.length ? t.tbdTotal : fmt(0)) : fmt(total), "tot");
    const ids = items.every(({x}) => x.variantId), st = d.querySelector("#cartStatus"), go = d.querySelector("#cartGo");
    let msg, bad = false;
    if (!N){ msg = t.choosePack; bad = true; }
    else if (n < N){ msg = t.need(N - n); bad = true; }
    else if (!onShopify()) msg = t.ready;
    else if (!ids){ msg = t.missing; bad = true; }
    else msg = t.ready;
    st.textContent = msg; st.className = "status" + (bad ? " bad" : "");
    const pickMode = curStep !== 3 && (!N || n < N) && getLang() && N;
    go.textContent = pickMode ? t.goPick : t.checkout;
    go.disabled = !pickMode && (!N || n < N || (onShopify() && !ids) || curStep === 4);
    go.hidden = curStep === 4;                       // déjà sur la page de commande
    go.dataset.mode = pickMode ? "pick" : "checkout";
    d.querySelector("#cartKeep").textContent = t.keep;
  },
  async checkout(){
    const t = T[curLang], go = this.el.querySelector("#cartGo");
    if (go.dataset.mode === "pick") return location.href = url(3);
    if (!Pack.N || Pack.count() !== Pack.N) return;
    if (!onShopify()){ location.href = CONFIG.checkoutPage + (getLang() ? "?lang=" + getLang() + (Pack.N ? "&pack=" + Pack.N : "") : ""); return; }
    go.disabled = true;
    try{
      const packId = "pack-" + Date.now();
      const r = await fetch("/cart/add.js", {method:"POST", headers:{"Content-Type":"application/json", Accept:"application/json"},
        body: JSON.stringify({items: Pack.items().map(({x,q}) => ({id:Number(x.variantId), quantity:q, properties:{_pack:packId, _pack_taille:String(Pack.N)}}))})});
      if (!r.ok) throw new Error(r.status);
      Pack.order = []; Pack.save();
      location.href = CONFIG.checkoutUrl;
    }catch(e){ toast(t.err); go.disabled = false; }
  }
};
onChange(() => { Cart.badge(); if (Cart.isOpen()) Cart.render(); });

return {CONFIG, LANGS, T, store, esc, qs, iso, getLang, getPack, setLang, setPack, url, go, fmt, onShopify, byId, products,
        ICON, DECO, deco, tear, maskStack, chrome, i18n, toast, lock, Pack, Cart, onChange, dialog, anim, RM};
})();

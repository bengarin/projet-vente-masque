/* Langues et textes communs de la boutique.
   Arabe : arabe standard simple (interface et fiches), à faire relire par une personne native [HYPOTHÈSE]. */

/* « قناع » accordé avec le nombre : 1 / 2 (duel) / 3 à 10 (pluriel) / 11 et plus.
   cas : "nom" (sujet), "acc" (complément direct), "gen" (après une préposition) */
export const arMasks = (n, cas = "nom") => n === 1 ? (cas === "acc" ? "قناعاً واحداً" : "قناع واحد")
  : n === 2 ? (cas === "nom" ? "قناعان" : "قناعين") : n <= 10 ? `${n} أقنعة` : `${n} قناعاً`;
export const LANGS = [
  { code: "ar", label: "العربية", flag: "/images/deco/drapeau-ma.webp", dir: "rtl" },
  { code: "fr", label: "Français", flag: "/images/deco/drapeau-fr.webp", dir: "ltr" },
  { code: "en", label: "English", flag: "/images/deco/drapeau-en.webp", dir: "ltr" },
];

export const T = {
  fr: {
    steps: ["Langue", "Pack", "Masques"], menu: "Menu", close: "Fermer", cart: "Panier", continue: "Continuer", lang: "Langue",
    stepTag: n => `ÉTAPE ${n}/3`, step: n => `Étape ${n}`, home: "Accueil",
    cartTitle: "Mon panier", packOf: t => `Pack de ${t} masques`, noPack: "Aucun pack choisi",
    unitLine: v => `Prix unitaire : ${v ?? "pas encore défini"}`, tbd: "Prix pas encore défini", add: "Ajouter", minus: "Retirer un", del: "Supprimer",
    sumMasks: "Total des masques", packPrice: t => `Prix du pack de ${t}`, total: "Total", tbdTotal: "Non défini",
    empty: "Ton panier est vide.", emptyHint: "Choisis tes masques pour remplir ton pack.",
    need: k => k === 1 ? "Ajoute encore 1 masque pour compléter ton pack." : `Ajoute encore ${k} masques pour compléter ton pack.`,
    choosePack: "Choisis d'abord la taille de ton pack.", ready: "Ton pack est complet ✓",
    keep: "Continuer mes achats", checkout: "Passer la commande", full: t => `Ton pack contient déjà ${t} masques.`, goPick: "Choisir mes masques",
    outStock: "Épuisé", noMoreStock: "Plus de stock disponible pour ce produit.",
    soins: "Soins à l'unité", soinsShort: "Soins", mySoins: "Mes soins", nSoins: n => `${n} soin${n > 1 ? "s" : ""}`, readyAll: "Ton panier est prêt ✓", seeSoins: "Voir les soins",
    promoTag: "En plus de ton pack", promoTitle: "Envie d'un soin en plus ?", promoSub: "Nos soins à l'unité, à ajouter avec ou sans pack de masques.", promoCta: "Découvrir les soins",
    loading: "Chargement…", loadErr: "La boutique n'a pas pu être chargée.", retry: "Réessayer",
  },
  ar: {
    steps: ["اللغة", "الباقة", "الأقنعة"], menu: "القائمة", close: "إغلاق", cart: "السلة", continue: "متابعة", lang: "اللغة",
    stepTag: n => `الخطوة ${n}/3`, step: n => `الخطوة ${n}`, home: "الرئيسية",
    cartTitle: "سلتي", packOf: t => `باقة من ${arMasks(t, "gen")}`, noPack: "لم تختاري أي باقة بعد",
    unitLine: v => `سعر الوحدة: ${v ?? "لم يُحدَّد بعد"}`, tbd: "السعر لم يُحدَّد بعد", add: "إضافة", minus: "إزالة واحد", del: "حذف",
    sumMasks: "مجموع الأقنعة", packPrice: t => `سعر الباقة من ${arMasks(t, "gen")}`, total: "المجموع", tbdTotal: "غير محدَّد",
    empty: "سلتك فارغة.", emptyHint: "اختاري أقنعتك لتكملي باقتك.",
    need: k => k === 1 ? "أضيفي قناعاً واحداً آخر لإكمال باقتك." : k === 2 ? "أضيفي قناعين آخرين لإكمال باقتك." : `أضيفي ${arMasks(k, "acc")} أخرى لإكمال باقتك.`,
    choosePack: "اختاري حجم الباقة أولاً.", ready: "باقتك مكتملة ✓",
    keep: "متابعة التسوق", checkout: "إتمام الطلب", full: t => `باقتك تضم ${arMasks(t, "acc")} بالفعل.`, goPick: "اختيار الأقنعة",
    outStock: "نفد من المخزون", noMoreStock: "لا يتوفر مخزون إضافي من هذا المنتج.",
    soins: "منتجات العناية بالقطعة", soinsShort: "العناية", mySoins: "منتجات العناية", nSoins: n => (n === 1 ? "منتج عناية واحد" : n === 2 ? "منتجا عناية" : n <= 10 ? `${n} منتجات عناية` : `${n} منتجاً للعناية`), readyAll: "سلتك جاهزة ✓", seeSoins: "عرض منتجات العناية",
    promoTag: "إضافة إلى باقتك", promoTitle: "هل ترغبين في منتج عناية إضافي؟", promoSub: "منتجات العناية تُباع بالقطعة، أضيفيها مع باقة الأقنعة أو من دونها.", promoCta: "اكتشفي منتجات العناية",
    loading: "جارٍ التحميل…", loadErr: "تعذّر تحميل المتجر.", retry: "إعادة المحاولة",
  },
  en: {
    steps: ["Language", "Pack", "Masks"], menu: "Menu", close: "Close", cart: "Cart", continue: "Continue", lang: "Language",
    stepTag: n => `STEP ${n}/3`, step: n => `Step ${n}`, home: "Home",
    cartTitle: "My cart", packOf: t => `Pack of ${t} masks`, noPack: "No pack selected",
    unitLine: v => `Unit price: ${v ?? "not set yet"}`, tbd: "Price not set yet", add: "Add", minus: "Remove one", del: "Remove",
    sumMasks: "Masks subtotal", packPrice: t => `Pack of ${t} price`, total: "Total", tbdTotal: "Not set",
    empty: "Your cart is empty.", emptyHint: "Pick your masks to fill your pack.",
    need: k => k === 1 ? "Add 1 more mask to complete your pack." : `Add ${k} more masks to complete your pack.`,
    choosePack: "Choose your pack size first.", ready: "Your pack is complete ✓",
    keep: "Continue shopping", checkout: "Go to checkout", full: t => `Your pack already has ${t} masks.`, goPick: "Pick my masks",
    outStock: "Sold out", noMoreStock: "No more stock for this product.",
    soins: "Skincare (sold individually)", soinsShort: "Skincare", mySoins: "My skincare", nSoins: n => `${n} skincare item${n > 1 ? "s" : ""}`, readyAll: "Your cart is ready ✓", seeSoins: "View skincare",
    promoTag: "On top of your pack", promoTitle: "Would you like some extra skincare?", promoSub: "Our skincare is sold individually, with or without a mask pack.", promoCta: "Discover skincare",
    loading: "Loading…", loadErr: "The shop couldn't be loaded.", retry: "Try again",
  },
};

/* Texte traduit d'un objet {fr, ar, en} (repli sur le français) */
export const tr = (o, lang) => (o ? o[lang] || o.fr || o.en || o.ar || "" : "");

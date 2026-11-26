/* Langues et textes communs de la boutique.
   Arabe (darija) à faire relire par une personne native [HYPOTHÈSE] — textes repris de l'ancienne version. */
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
    keep: "Continuer mes achats", checkout: "Passer au checkout", full: t => `Ton pack contient déjà ${t} masques.`, goPick: "Choisir mes masques",
    outStock: "Épuisé", noMoreStock: "Plus de stock disponible pour ce produit.",
    soins: "Soins à l'unité", soinsShort: "Soins", mySoins: "Mes soins", nSoins: n => `${n} soin${n > 1 ? "s" : ""}`, readyAll: "Ton panier est prêt ✓", seeSoins: "Voir les soins",
    promoTag: "En plus de ton pack", promoTitle: "Envie d'un soin en plus ?", promoSub: "Nos soins à l'unité, à ajouter avec ou sans pack de masques.", promoCta: "Découvrir les soins",
    loading: "Chargement…", loadErr: "La boutique n'a pas pu être chargée.", retry: "Réessayer",
  },
  ar: {
    steps: ["اللغة", "الباك", "الماسكات"], menu: "القائمة", close: "إغلاق", cart: "السلة", continue: "متابعة", lang: "اللغة",
    stepTag: n => `الخطوة ${n}/3`, step: n => `الخطوة ${n}`, home: "الرئيسية",
    cartTitle: "السلة ديالي", packOf: t => `باك ديال ${t} ماسكات`, noPack: "ما زال ما اخترتي باك",
    unitLine: v => `ثمن الوحدة: ${v ?? "ما زال ما تحدّدش"}`, tbd: "الثمن ما زال ما تحدّدش", add: "إضافة", minus: "نقص واحد", del: "حذف",
    sumMasks: "مجموع الماسكات", packPrice: t => `ثمن باك ${t}`, total: "المجموع", tbdTotal: "ما محدّدش",
    empty: "السلة خاوية.", emptyHint: "اختاري الماسكات باش تعمري الباك ديالك.",
    need: k => k === 1 ? "زيدي ماسك واحد باش يكمل الباك." : `زيدي ${k} ماسكات باش يكمل الباك.`,
    choosePack: "اختاري أولاً حجم الباك.", ready: "الباك ديالك كامل ✓",
    keep: "كملي التسوق", checkout: "إتمام الطلب", full: t => `الباك فيه ${t} ماسكات.`, goPick: "اختاري الماسكات",
    outStock: "نفد المخزون", noMoreStock: "ما بقاش المخزون ديال هاد المنتج.",
    soins: "منتجات العناية بالوحدة", soinsShort: "العناية", mySoins: "منتجات العناية ديالي", nSoins: n => `${n} ${n > 1 ? "منتجات" : "منتج"} ديال العناية`, readyAll: "السلة ديالك واجدة ✓", seeSoins: "شوفي منتجات العناية",
    promoTag: "زيادة على الباك ديالك", promoTitle: "بغيتي شي عناية زايدة؟", promoSub: "منتجات العناية بالوحدة، زيديهم مع الباك ديال الماسكات ولا بلا بيه.", promoCta: "اكتشفي منتجات العناية",
    loading: "كيتحمّل…", loadErr: "ما تحمّلش المتجر.", retry: "عاودي",
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
    soins: "Skincare (sold individually)", soinsShort: "Skincare", mySoins: "My skincare", nSoins: n => `${n} skincare item${n > 1 ? "s" : ""}`, readyAll: "Your cart is ready ✓", seeSoins: "See skincare",
    promoTag: "On top of your pack", promoTitle: "Fancy some extra skincare?", promoSub: "Our skincare sold individually, with or without a mask pack.", promoCta: "Discover skincare",
    loading: "Loading…", loadErr: "The shop couldn't be loaded.", retry: "Try again",
  },
};

/* Texte traduit d'un objet {fr, ar, en} (repli sur le français) */
export const tr = (o, lang) => (o ? o[lang] || o.fr || o.en || o.ar || "" : "");

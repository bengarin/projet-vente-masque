/* =====================================================================
   PRODUITS — LE SEUL FICHIER À COMPLÉTER AVEC TES DONNÉES
   ---------------------------------------------------------------------
   images    : photos dans images/produits/ (la 1re est la photo principale).
               Ajoute d'autres vues ainsi : ["images/produits/x-face.webp","images/produits/x-dos.webp"]
   brand/name: tels qu'imprimés sur l'emballage (ne pas traduire)
   price     : [DONNÉES MANQUANTES] prix unitaire en DH, ex. 25  (null = « Prix à renseigner »)
   variantId : [DONNÉES MANQUANTES] ID de variante Shopify (nombre) — requis pour le vrai paiement
   video     : [DONNÉES MANQUANTES] chemin d'un .mp4 (ex. "videos/x.mp4") ou lien https ; null = pas de vidéo
   pack      : mentions LISIBLES sur l'emballage, recopiées telles quelles (langue d'origine)
   info      : description traduite par toi {fr, ar, en} — null = non fournie
   usage     : mode d'emploi {fr, ar, en} — null = non fourni (aucun n'est visible sur les photos)
   ===================================================================== */
window.PRODUCTS = [
  { id:"collagen", tape:"ging",
    images:["images/produits/mediheal-collagen.webp"],
    brand:"MEDIHEAL", name:"Collagen",
    price:null, variantId:null, video:null,
    pack:["Core Firming","Mediheal Dermatology"],
    info:null, usage:null },
  { id:"vitc", tape:"dots",
    images:["images/produits/7th-heaven-vitamin-c.webp"],
    brand:"7th Heaven", name:"Nutriactive Vitamin C Advanced Serum Sheet Mask",
    price:null, variantId:null, video:null,
    pack:["Vitamin C — 5% Active Complex*","Anti-Fatigue — Brightening + Re-Energising","For all skin types","Vegan — Vegetarian Society Approved","1 biodegradable sheet mask"],
    info:null, usage:null },
  { id:"green", tape:"grid",
    images:["images/produits/lookatme-green-blend.webp"],
    brand:"look AT ME", name:"Green Blend Tea Tree + Cucumber Face Mask",
    price:null, variantId:null, video:null,
    pack:["Revitalizing & Soothing","Tencel sheet","Made in Korea"],
    info:null, usage:null },
  { id:"hazel", tape:"ydots",
    images:["images/produits/idc-hazel-lavender.webp"],
    brand:"IDC Institute", name:"One Week Treatment — Hazel + Lavender",
    price:null, variantId:null, video:null,
    pack:["Wednesday (3)","Hamamélis et Lavande","Nettoie les pores et élimine la fatigue de la peau","Facial mask — 22 g / 0.73 fl.oz","Cruelty free"],
    info:null, usage:null },
  { id:"gluta", tape:"checkl",
    images:["images/produits/some-by-mi-glutathione.jpg"],
    brand:"SOME BY MI", name:"Real Glutathione Brightening Care Mask",
    price:null, variantId:null, video:null,
    pack:["Moisturizing | Radiance","Clinical Solution — Dermatologist Tested","A 100% plant-based biodegradable sheet mask formulated with Real Glutathione that revitalizes dull skin and promotes a brighter, more even skin tone.","Net 20 g – 0.70 oz"],
    info:null, usage:null },
  { id:"rosegold", tape:"ging",
    images:["images/produits/masquebar-rose-gold-foil.webp"],
    brand:"masque BAR", name:"Rose Gold Foil Sheet Mask",
    price:null, variantId:null, video:null,
    pack:["Unmasque Beauty","MasqueBAR Rose Gold Foil Sheet Mask is enriched with extracts that help nourish and hydrate your skin.","Contains: Soybean Extract, Mushroom Extract, Witch Hazel Water","1 complete mask — 30 ml / 1.01 US fl oz"],
    info:null, usage:null }
];

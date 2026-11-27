/* Étape 3 — composer son pack (ancienne page etape-3.html) : cartes produit, progression, remplacement, fiche produit.
   Les produits, prix et stocks viennent de la base MySQL via l'API. */
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link, Navigate } from "react-router-dom";
import { iso, isoName } from "../../lib/format.js";
import { tr } from "../../lib/i18n.js";
import { Deco, Paper, Torn } from "../../ui/decor.jsx";
import { anim, RM, useBodyClass, useOverlay, useScrollLock } from "../../ui/overlay.jsx";
import { CatalogGate, Header } from "../Chrome.jsx";
import { PATHS, useShop } from "../ShopContext.jsx";
import "../../styles/pg-pick.css";

export const P = {
  fr: { title: <>Compose ton <span className="hl">pack</span> !</>, sub: "Choisis tes masques préférés", hint: "Tu peux choisir plusieurs fois le même masque.",
    add: "Ajouter", remove: "Retirer un", tbd: "Prix pas encore défini", details: "Voir la fiche", more: "Voir plus",
    prog: (n, t) => `${iso(n + "/" + t)} masques choisis`, left: k => (k === 0 ? "Pack complet ✓" : `Encore ${k} à choisir`),
    mine: (n, t) => `Mon pack : ${iso(n + "/" + t)}`, cta: "Ajouter au panier", toastFull: "Ton pack est complet !",
    empty: "Vide", removeOne: "Retirer ce masque", sheetTag: "Fiche produit", photo: n => `Photo ${n}`,
    packText: "Mentions imprimées sur l'emballage", packNote: "Recopiées telles quelles, dans la langue de l'emballage.",
    info: "Description", usage: "Mode d'emploi", video: "Vidéo", notGiven: "Information à confirmer",
    intro: "Présentation", hl: "Pourquoi le choisir ?", specs: "Fiche technique",
    sBrand: "Marque", sName: "Nom du produit", sType: "Type", sContent: "Contenance", precautions: "Précautions",
    packMore: "Voir le texte original de l'emballage",
    backTo: "Retour à mon pack", edit: "Modifier le pack", added: "Pack ajouté au panier ✓", addedBtn: "Ajouté",
    swapT: "Ton pack est complet !", swap: "Tu veux ajouter :", swapWhich: "Choisis le masque à remplacer :", swapCancel: "Annuler",
    swapGo: "Remplacer ce masque", swapPick: "Touche un masque ci-dessus", swapped: (a, b) => `${a} remplacé par ${b}`, swapAria: n => `Remplacer un masque par ${n}`,
    noProducts: "Aucun masque n'est disponible pour le moment." },
  ar: { title: <>كوّني <span className="hl">باقتك</span>!</>, sub: "اختاري أقنعتك المفضلة", hint: "يمكنك اختيار القناع نفسه أكثر من مرة.",
    add: "إضافة", remove: "إزالة واحد", tbd: "السعر لم يُحدَّد بعد", details: "عرض التفاصيل", more: "عرض المزيد",
    prog: (n, t) => `الأقنعة المختارة: ${iso(n + "/" + t)}`, left: k => (k === 0 ? "الباقة مكتملة ✓" : `بقي ${k} للاختيار`),
    mine: (n, t) => `باقتي: ${iso(n + "/" + t)}`, cta: "أضيفي إلى السلة", toastFull: "باقتك مكتملة!",
    empty: "فارغ", removeOne: "إزالة هذا القناع", sheetTag: "بطاقة المنتج", photo: n => `الصورة ${n}`,
    packText: "النص المطبوع على الغلاف", packNote: "منقول كما هو، بلغة الغلاف.",
    info: "الوصف", usage: "طريقة الاستعمال", video: "فيديو", notGiven: "معلومة في انتظار التأكيد",
    intro: "نبذة عن المنتج", hl: "لماذا تختارينه؟", specs: "البطاقة التقنية",
    sBrand: "العلامة التجارية", sName: "اسم المنتج", sType: "النوع", sContent: "المحتوى", precautions: "احتياطات الاستعمال",
    packMore: "عرض النص الأصلي للغلاف",
    backTo: "العودة إلى باقتي", edit: "تعديل الباقة", added: "أُضيفت الباقة إلى السلة ✓", addedBtn: "تمت الإضافة",
    swapT: "باقتك مكتملة!", swap: "تريدين إضافة:", swapWhich: "اختاري القناع الذي تريدين استبداله:", swapCancel: "إلغاء",
    swapGo: "استبدال هذا القناع", swapPick: "اختاري قناعاً من الأعلى", swapped: (a, b) => `تم استبدال ${a} بـ${b}`, swapAria: n => `استبدال قناع بـ${n}`,
    noProducts: "لا يتوفر أي قناع حالياً." },
  en: { title: <>Build your <span className="hl">pack</span>!</>, sub: "Pick your favourite masks", hint: "You can pick the same mask more than once.",
    add: "Add", remove: "Remove one", tbd: "Price not set yet", details: "View details", more: "See more",
    prog: (n, t) => `${iso(n + "/" + t)} masks selected`, left: k => (k === 0 ? "Pack complete ✓" : `${k} more to pick`),
    mine: (n, t) => `My pack: ${iso(n + "/" + t)}`, cta: "Add to cart", toastFull: "Your pack is complete!",
    empty: "Empty", removeOne: "Remove this mask", sheetTag: "Product sheet", photo: n => `Photo ${n}`,
    packText: "Printed on the packaging", packNote: "Copied as printed, in the packaging's language.",
    info: "Description", usage: "How to use", video: "Video", notGiven: "Information to be confirmed",
    intro: "Overview", hl: "Why choose it?", specs: "Product details",
    sBrand: "Brand", sName: "Product name", sType: "Type", sContent: "Contents", precautions: "Precautions",
    packMore: "See the original packaging text",
    backTo: "Back to my pack", edit: "Change pack", added: "Pack added to cart ✓", addedBtn: "Added",
    swapT: "Your pack is complete!", swap: "You'd like to add:", swapWhich: "Choose the mask to replace:", swapCancel: "Cancel",
    swapGo: "Replace this mask", swapPick: "Tap a mask above", swapped: (a, b) => `${a} replaced with ${b}`, swapAria: n => `Replace a mask with ${n}`,
    noProducts: "No masks are available right now." },
};

const PEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>';
const CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6"/></svg>';
const IC = {
  pack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/></svg>',
  use: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
  spec: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8.5h8M8 12.5h8M8 16.5h5"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.3v.2"/></svg>',
};
const svg = html => <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;

export default function PickPage() {
  useBodyClass("pickpage");
  const { uiLang, t, packSize, catalog } = useShop();
  const p = P[uiLang];
  if (catalog && !packSize) return <Navigate to={PATHS[2]} replace />;   // pas de pack choisi → étape 2
  return (
    <div className="pg-pick">
      <Header step={3} langMenu />
      <section className="band">
        <Paper torn={9} sides="tb" className="bg lav" />
        <Paper torn={6} sides="tbr" className="corner l yel" />
        <Paper torn={6} sides="tbl" className="corner r yel" />
        <Deco k="heart" className="dc d1" /><Deco k="face" className="dc d2" />
        <div className="wrap">
          <div className="tagw"><Deco k="rays" /><Torn torn={3} className="yel"><span className="tag">{t.stepTag(3)}</span></Torn><Deco k="rays" /></div><br />
          <div className="h1w"><Torn torn={6}><h1>{p.title}</h1></Torn></div><br />
          <div className="subw"><Torn torn={4}><span>{p.sub}</span></Torn><Deco k="rays" /></div>
        </div>
      </section>
      <CatalogGate>{packSize ? <Picker p={p} /> : null}</CatalogGate>
    </div>
  );
}

/* Photo qui glisse de la carte vers le cercle (ajout) ou du cercle vers la carte (retrait) */
function glide(src, from, to, { size, toSize, fadeIn = false }) {
  const f = document.createElement("img"); f.src = src; f.className = "fly"; f.alt = "";
  Object.assign(f.style, { left: (from.left + from.width / 2 - size / 2) + "px", top: (from.top + from.height / 2 - size / 2) + "px", width: size + "px", height: size + "px" });
  document.body.appendChild(f);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2), dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const lift = Math.min(60, Math.abs(dy) * 0.25);
  return new Promise(res => {
    f.animate([
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: fadeIn ? 0.7 : 1 },
      { transform: `translate(${dx * 0.5}px,${dy * 0.5 - lift}px) scale(${(1 + toSize / size) / 2}) rotate(-6deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px,${dy}px) scale(${toSize / size}) rotate(0deg)`, opacity: fadeIn ? 0 : 0.9 },
    ], { duration: 460, easing: "cubic-bezier(.35,.1,.25,1)" }).onfinish = () => { f.remove(); res(); };
  });
}

/* Célébration : étoiles et bouts de papier */
function burst(r, count, up) {
  const layer = document.createElement("div"); layer.className = "confetti"; layer.setAttribute("aria-hidden", "true");
  Object.assign(layer.style, { left: r.left + r.width / 2 + "px", top: r.top + r.height * 0.4 + "px" });
  const kinds = ["star:#F7D33A", "star:#1530C8", "paper:#CDBBF3", "paper:#FBE38A", "paper:#1530C8", "star:#fff"];
  for (let i = 0; i < count; i++) {
    const k = kinds[i % kinds.length].split(":"), el = document.createElement("span");
    el.className = "cf " + k[0];
    if (k[0] === "star") el.innerHTML = `<svg viewBox="0 0 20 20"><path d="M10 1l2.6 5.6 6 .7-4.5 4.1 1.2 6L10 14.4 4.7 17.4l1.2-6L1.4 7.3l6-.7z" fill="${k[1]}" stroke="#1530C8" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
    else el.style.background = k[1];
    layer.appendChild(el);
    const ang = up ? (-Math.PI * (0.12 + 0.76 * (i / (count - 1)))) + (Math.random() - 0.5) * 0.25 : (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const dist = (up ? 70 : 55) + Math.random() * 60;
    const x = Math.cos(ang) * dist * (up ? 1.5 : 1.4), y = Math.sin(ang) * dist * (up ? 1 : 0.8) - (up ? 0 : 20);
    el.animate([
      { transform: "translate(-50%,-50%) scale(.3) rotate(0deg)", opacity: 0 },
      { transform: `translate(calc(-50% + ${x * 0.7}px),calc(-50% + ${y * 0.7}px)) scale(1) rotate(${ang * 60}deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(calc(-50% + ${x}px),calc(-50% + ${y + 26}px)) scale(.8) rotate(${ang * 90}deg)`, opacity: 0 },
    ], { duration: 780 + Math.random() * 180, easing: "cubic-bezier(.2,.7,.3,1)" });
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1100);
}

function Dots({ p, size, onRemove, idPrefix, d, l }) {
  const { packSize: N, order, count: n, byId } = useShop();
  const out = [];
  for (let i = 0; i < N; i++) {
    if (i) out.push(<span key={"l" + i} className={`link${i < n ? " on" : ""}`} aria-hidden="true" />);
    const x = byId(order[i]);
    out.push(x
      ? <button key={"d" + i} type="button" className="dot on" data-i={i} data-rm={x.id} aria-label={`${p.removeOne} : ${x.name}`} onClick={() => onRemove(x.id)}><img src={x.images[0]} alt="" /></button>
      : <span key={"d" + i} className="dot" aria-label={p.empty} />);
  }
  return <div className="dots" id={idPrefix} style={{ "--d": d + "px", "--l": l + "px" }} data-size={size}>{out}</div>;
}

function Picker({ p }) {
  const { uiLang, t, packProducts: products, unitProducts, packSize: N, count: n, order, qty, setQty, replace, byId, money, setCartOpen } = useShop();
  const { toast } = useOverlay();
  const [pmId, setPmId] = useState(null);
  const [swNew, setSwNew] = useState(null);
  const [ctaState, setCtaState] = useState("idle");      // idle | waiting (célébration) | added
  const miniRef = useRef(null), miniOn = useRef(false), ctaRef = useRef(null), progTxt = useRef(null), mineTxt = useRef(null), lastN = useRef(n);
  const full = n >= N;

  /* ---------- Mini-barre : visible quand les grands cercles ne sont pas entièrement à l'écran ---------- */
  const updMini = useCallback(() => {
    const dots = document.getElementById("dots"), bar = document.querySelector(".pg-pick .bar");
    if (!dots || !bar || !miniRef.current) return;
    const r = dots.getBoundingClientRect(), v = !(r.top >= 0 && r.bottom <= bar.getBoundingClientRect().top);
    if (v !== miniOn.current) { miniOn.current = v; miniRef.current.classList.toggle("on", v); }
  }, []);
  useEffect(() => {
    let raf = 0; const on = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; updMini(); }); };
    addEventListener("scroll", on, { passive: true }); addEventListener("resize", on); updMini();
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [updMini]);
  useEffect(() => {
    if (lastN.current !== n) { anim(progTxt.current, "tickn"); anim(mineTxt.current, "tickn"); }
    lastN.current = n;
  }, [n]);

  /* Effet au toucher : petit anneau jaune */
  useEffect(() => {
    const h = e => { const b = e.target.closest?.(".pg-pick .pl:not(:disabled), .pg-pick .mi:not(:disabled), .pg-pick .vplus, .pg-pick .editp, .pg-pick .cta:not(:disabled)"); if (b) anim(b, "tap"); };
    document.addEventListener("pointerdown", h, { passive: true });
    return () => document.removeEventListener("pointerdown", h);
  }, []);

  const viewBox = () => {
    const bar = document.querySelector(".pg-pick .bar").getBoundingClientRect().top;
    const mini = miniOn.current ? miniRef.current.getBoundingClientRect().bottom : 0;
    return { top: mini, bottom: bar };
  };
  const dotAt = i => { updMini(); const main = document.querySelectorAll("#dots .dot")[i]; return miniOn.current ? (document.querySelectorAll("#miniDots .dot")[i] || main) : main; };
  const clampToView = r => {
    const v = viewBox(), h = Math.max(40, r.height * 0.3);
    if (r.bottom < v.top + 10) return { left: r.left, width: r.width, height: h, top: v.top - h * 0.5 };
    if (r.top > v.bottom - 10) return { left: r.left, width: r.width, height: h, top: v.bottom - h * 0.5 };
    return r;
  };
  const cardOf = id => document.querySelector(`.pg-pick .item[data-id="${id}"]`);
  const twinDot = dot => {
    const main = [...document.querySelectorAll("#dots .dot")], mini = [...document.querySelectorAll("#miniDots .dot")];
    let i = main.indexOf(dot); if (i >= 0) return mini[i]; i = mini.indexOf(dot); return i >= 0 ? main[i] : null;
  };

  function flyIn(id, fromModal) {
    const dot = dotAt(n);   // n = nombre avant l'ajout → index du nouveau cercle
    if (RM() || !dot) return;
    const srcImg = (fromModal && document.querySelector("#gal img")) || cardOf(id)?.querySelector(".ph img");
    if (!srcImg) return;
    const a = clampToView(srcImg.getBoundingClientRect()), b = dot.getBoundingClientRect();
    const twin = twinDot(dot);
    dot.classList.add("pending"); twin?.classList.add("pending");
    glide(srcImg.src, a, b, { size: Math.min(a.width, 72), toSize: b.width }).then(() => {
      dot.classList.remove("pending"); twin?.classList.remove("pending"); anim(dot, "fillin");
    });
  }
  function flyOut(id, from) {
    if (RM() || !from) return;
    const img = cardOf(id)?.querySelector(".ph img"); if (!img) return;
    const to = clampToView(img.getBoundingClientRect());
    glide(from.src, from.rect, to, { size: from.rect.width, toSize: Math.min(to.width, 72), fadeIn: true });
  }
  function cardFeedback(id, delta) {
    const c = cardOf(id); if (!c) return;
    const up = delta > 0;
    anim(c.querySelector(".sh"), up ? "bump" : "dip");
    anim(c.querySelector(".ph"), up ? "flashup" : "flashdown");
    anim(c.querySelector(".qbadge"), "popn");
    anim(c.querySelector(".qty output"), up ? "rollup" : "rolldown");
    anim(c.querySelector(up ? ".pl" : ".mi"), "press");
    if (pmId === id) anim(document.querySelector("#pmQty output"), up ? "rollup" : "rolldown");
  }
  function celebrate() {
    if (RM()) return;
    burst(ctaRef.current.getBoundingClientRect(), 14, true);
    const strip = document.querySelector(".pg-pick .prog .paper")?.getBoundingClientRect();
    if (strip && strip.top > 60 && strip.bottom < innerHeight - 100) burst(strip, 10, false);
  }

  function change(id, delta) {
    const before = n;
    if (delta > 0 && before >= N) return setSwNew(id);    // pack complet → proposer un remplacement
    let fromRect = null;
    if (delta < 0) {
      const i = order.lastIndexOf(id), dot = i >= 0 ? dotAt(i) : null, img = dot?.querySelector("img");
      if (dot && img) fromRect = { rect: dot.getBoundingClientRect(), src: img.src };
    }
    let ok = false;
    flushSync(() => { ok = setQty(id, qty(id) + delta); });
    if (!ok) return;
    cardFeedback(id, delta);
    if (delta > 0) { flyIn(id, pmId === id); const d = dotAt(before); if (d) anim(d, "popn"); } else flyOut(id, fromRect);
    if (before + delta === N && before < N) {
      toast(p.toastFull);
      if (!RM()) {
        celebrate(); setCtaState("waiting");
        setTimeout(() => { setCtaState(s => (s === "waiting" ? "idle" : s)); requestAnimationFrame(() => anim(ctaRef.current, "ready")); }, 420);
      }
    }
  }

  function addToCart() {
    if (n !== N) return;
    setCtaState("added"); toast(p.added);
    anim(document.getElementById("cartBtn"), "cartwig"); anim(document.getElementById("cartCount"), "popn");
    setTimeout(() => { setCtaState("idle"); setCartOpen(true); }, RM() ? 0 : 750);
  }

  const qtyCtl = x => {
    const q = qty(x.id), soldOut = x.stock != null && q >= x.stock && !full;
    return <>
      <button className="mi" type="button" aria-label={`${p.remove} – ${x.name}`} disabled={!q} onClick={() => change(x.id, -1)}>−</button>
      <output aria-live="polite">{q}</output>
      <button className="pl" type="button" disabled={soldOut} aria-label={full ? p.swapAria(x.name) : `${p.add} – ${x.name}`} onClick={() => change(x.id, 1)}>+</button>
    </>;
  };

  const d = N <= 3 ? 44 : N <= 4 ? 42 : 36, l = N <= 3 ? 26 : N <= 4 ? 16 : 10;
  const removeFromDot = id => change(id, -1);

  return (
    <>
      <div className="mini" ref={miniRef} aria-hidden="true"><div className="minin">
        <Dots p={p} idPrefix="miniDots" d={N <= 4 ? 30 : 26} l={N <= 4 ? 10 : 6} onRemove={removeFromDot} />
        <b>{iso(n + "/" + N)}</b></div></div>

      <main className="wrap wide">
        <section className="prog" aria-live="polite">
          <Torn torn={6} className="yel">
            <Dots p={p} idPrefix="dots" d={d} l={l} onRemove={removeFromDot} />
            <div className="pbar" aria-hidden="true"><i style={{ width: (n / N * 100) + "%" }} /></div>
            <div className="ptxt" ref={progTxt}>{p.prog(n, N)}<br /><span>{p.left(N - n)}</span></div>
            <Link className="editp" to={PATHS[2]}>{svg(PEN)}<span>{p.edit}</span></Link>
          </Torn>
        </section>
        {!products.length && <p className="cursel">{p.noProducts}</p>}
        <ul className="grid">
          {products.map(x => {
            const q = qty(x.id), out = x.stock === 0;
            return (
              <li key={x.id} className={`item${q > 0 ? " sel" : ""}`} data-id={x.id}><div className="sh">
                <Paper torn={5} className="card">
                  <button className="open-p" type="button" aria-label={`${p.details} – ${x.name}`} onClick={() => setPmId(x.id)}>
                    <span className="ph"><img src={x.images[0] || "/images/deco/visage-masque.webp"} alt="" loading="lazy" width="600" height="600" /><span className="qbadge">×{q}</span>
                      {out && <span className="outst">{t.outStock}</span>}</span>
                    <span className="brandp">{x.brand}</span>
                    <span className="name" title={x.name}>{x.name}</span>
                  </button>
                  <div className="pricerow">{x.price == null ? <span className="price tbd">{p.tbd}</span> : <span className="price">{money(x.price)}</span>}</div>
                  <button className="vplus" type="button" aria-label={`${p.more} – ${x.brand} ${x.name}`} aria-haspopup="dialog" onClick={() => setPmId(x.id)}>
                    <span className="vtxt">{p.more}</span><span className="varr" aria-hidden="true">→</span><Deco k="sparks" className="dc vs" />
                  </button>
                  <div className="qty">{qtyCtl(x)}</div>
                </Paper>
                <span className={`tape ${x.tape || "ging"}`} />
              </div></li>
            );
          })}
        </ul>
        <div className="note"><Torn torn={4}><span>{p.hint}</span></Torn></div>
        {unitProducts.length > 0 && <SoinsTeaser t={t} items={unitProducts} />}
      </main>

      <div className="bar"><div className="barin">
        <div className="mine"><Deco k="side" /><span ref={mineTxt}>{p.mine(n, N)}</span></div>
        <button className="cta" type="button" ref={ctaRef} disabled={!full || ctaState === "waiting"} onClick={addToCart}>
          {ctaState === "added" ? <><span className="ck" aria-hidden="true">✓</span>{p.addedBtn}</> : <span>{p.cta}</span>}
        </button>
      </div></div>

      {swNew != null && <SwapModal p={p} newId={swNew} onClose={() => setSwNew(null)}
        onSwap={oldId => {
          setSwNew(null);
          let ok = false; flushSync(() => { ok = replace(oldId, swNew); });
          if (!ok) return;
          cardFeedback(swNew, 1); cardFeedback(oldId, -1);
          toast(p.swapped(isoName(byId(oldId).name), isoName(byId(swNew).name)));
        }} />}
      {pmId != null && byId(pmId) && <ProductModal p={p} x={byId(pmId)} lang={uiLang} closeLabel={t.close} qtyCtl={qtyCtl} money={money} onClose={() => setPmId(null)} />}
    </>
  );
}

/* Carte promotionnelle « Soins à l'unité » sous la grille des masques.
   Toute la carte est un seul lien vers /soins (aucun bouton imbriqué) ; apparition douce quand elle entre à l'écran. */
export function SoinsTeaser({ t, items }) {
  const { money } = useShop();
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || RM() || !("IntersectionObserver" in window)) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const pics = items.slice(0, 2);
  const label = `${t.promoTitle} ${t.promoCta} : ${items.map(x => `${x.brand} ${x.name}`).join(", ")}`;
  return (
    <Link ref={ref} className={`soins-promo${shown ? " is-in" : ""}`} to={PATHS.soins} aria-label={label}>
      <span className="sh sp-sh">
        <Paper as="span" torn={7} className="sp-paper">
          <span className="sp-pics" aria-hidden="true">
            {pics.map((x, i) => (
              <span key={x.id} className={`sp-pol sp-pol-${i + 1}`}>
                <img src={x.images[0]} alt="" loading="lazy" width="200" height="200" />
                <span className="sp-cap"><span className="sp-brand">{x.brand}</span>{x.price != null && <span className="sp-price">{money(x.price)}</span>}</span>
              </span>))}
            <Deco k="sparks" className="dc sp-spark" />
          </span>
          <span className="sp-head">
            <span className="sp-tag">{t.promoTag}</span>
            <span className="sp-title">{t.promoTitle}</span>
          </span>
          <span className="sp-sub">{t.promoSub}</span>
          <span className="sp-cta" aria-hidden="true">{t.promoCta}<span className="sp-arr">→</span></span>
        </Paper>
        <span className="tape check sp-tape" aria-hidden="true" />
        <Deco k="star" className="dc sp-star" />
      </span>
    </Link>
  );
}

/* ---------- Fenêtre de remplacement (pack complet) ---------- */
function SwapModal({ p, newId, onClose, onSwap }) {
  const { order, byId, qty, t } = useShop();
  const [pick, setPick] = useState(null);
  const listRef = useRef(null);
  const opener = useRef(document.activeElement);
  useScrollLock(true);
  const nx = byId(newId);
  const inPack = [...new Set(order)].map(byId).filter(x => x && x.id !== newId);
  useEffect(() => {
    listRef.current?.querySelector("[role=radio]")?.focus();
    const key = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", key);
    const o = opener.current;
    return () => { document.removeEventListener("keydown", key); if (o && document.contains(o)) o.focus(); };
  }, [onClose]);
  if (!inPack.length) return null;
  const row = (x, extra) => <><img src={x.images[0]} alt="" /><span className="swn"><small>{x.brand}</small><b>{x.name}</b></span>{extra}</>;
  const onKey = e => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const list = [...listRef.current.querySelectorAll("[role=radio]")], i = list.indexOf(document.activeElement); if (i < 0) return;
    e.preventDefault(); const nb = list[(i + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : list.length - 1)) % list.length];
    nb.focus(); setPick(Number(nb.dataset.id));
  };
  return (
    <div className="swm open" role="dialog" aria-modal="true" aria-labelledby="swT" aria-describedby="swDesc">
      <div className="swbox">
        <header className="swhead">
          <Paper torn={7} sides="b" className="bg lav" />
          <span className="swtitle"><Deco k="sparks" /><h2 id="swT">{p.swapT}</h2></span>
          <button className="pclose" type="button" aria-label={t.close} onClick={onClose}>{svg(CLOSE)}</button>
        </header>
        <div className="swbody" ref={listRef} onKeyDown={onKey}>
          <p className="swlab" id="swDesc">{p.swap}</p>
          <div className="swnew">{row(nx, <span className="swplus" aria-hidden="true">+1</span>)}</div>
          <p className="swlab">{p.swapWhich}</p>
          <ul className="swlist" role="radiogroup" aria-label={p.swapWhich}>
            {inPack.map(x => (
              <li key={x.id}><button type="button" role="radio" aria-checked={pick === x.id} data-id={x.id} onClick={e => { setPick(x.id); anim(e.currentTarget, "press"); }}>
                <span className="swradio" aria-hidden="true" />{row(x, <span className="swq" dir="ltr">×{qty(x.id)}</span>)}
              </button></li>
            ))}
          </ul>
        </div>
        <footer className="swfoot">
          <Paper torn={6} sides="t" className="bg lav" />
          <p className="swhint" aria-live="polite" hidden={!!pick}>{pick ? "" : p.swapPick}</p>
          <button className="go swgo" type="button" disabled={!pick} onClick={() => onSwap(pick)}>{p.swapGo}</button>
          <button className="ghost" type="button" onClick={onClose}>{p.swapCancel}</button>
        </footer>
      </div>
    </div>
  );
}

/* ---------- Fiche produit ---------- */
export function ProductModal({ p, x, lang, closeLabel, qtyCtl, onClose, money }) {
  const [cur, setCur] = useState(0);
  const closeRef = useRef(null);
  const opener = useRef(document.activeElement);
  useScrollLock(true);
  useEffect(() => {
    closeRef.current?.focus();
    const key = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", key);
    const o = opener.current;
    return () => { document.removeEventListener("keydown", key); if (o && document.contains(o)) o.focus(); };
  }, [onClose]);
  const intro = tr(x.intro, lang) || null;
  const info = tr(x.info, lang) || null, usage = tr(x.usage, lang) || null, precautions = tr(x.precautions, lang) || null;
  const type = tr(x.type, lang) || null, content = tr(x.content, lang) || null;
  const highlights = (x.highlights && (x.highlights[lang] || x.highlights.fr)) || [];
  const missing = <p className="missingf">{p.notGiven}</p>;
  const card = (cls, ico, title, body) => <section className={`pcard ${cls}`}><h3><span className="ico">{svg(IC[ico])}</span>{title}</h3>{body}</section>;
  const isFile = x.video && /\.(mp4|webm|mov)(\?|$)/i.test(x.video);
  const imgs = x.images.length ? x.images : ["/images/deco/visage-masque.webp"];
  return (
    <div className="pmodal open" role="dialog" aria-modal="true" aria-labelledby="pmName" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pbox">
        <div className="phead">
          <Paper torn={7} sides="b" className="bg lav" />
          <span className="ptag"><Deco k="rays" /><span className="sh"><Paper as="span" torn={3} className="yel"><span className="tag">{p.sheetTag}</span></Paper></span></span>
          <button className="pclose" type="button" ref={closeRef} aria-label={closeLabel} onClick={onClose}>{svg(CLOSE)}</button>
        </div>
        <div className="pscroll">
          <div className="gwrap">
            <span className={`tape ${x.tape || "ging"}`} /><Deco k="sparks" className="dc gs1" /><Deco k="rays" className="dc gs2" />
            <div className="sh frame-sh"><Paper torn={5} className="frame"><div className="gal" id="gal" onScroll={e => { const g = e.currentTarget; const i = Math.round(Math.abs(g.scrollLeft) / g.clientWidth); if (i !== cur) setCur(i); }}>
              {imgs.map((src, i) => <figure key={i} id={"g" + i}><img src={src} alt={`${x.brand} – ${x.name} · ${p.photo(i + 1)}`} /></figure>)}
            </div></Paper></div>
          </div>
          {imgs.length > 1 && <div className="thumbs">{imgs.map((src, i) => (
            <button key={i} type="button" aria-label={p.photo(i + 1)} aria-current={i === cur}
              onClick={() => { setCur(i); document.getElementById("g" + i)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); }}>
              <img src={src} alt="" /></button>))}</div>}
          <section className="pid">
            <span className="pbrand">{x.brand}</span>
            <h2 className="pname" id="pmName">{x.name}</h2>
            {type && <p className="ptype">{type}{content && <span className="pcontent"> · {content}</span>}</p>}
            <div className={`pprice${x.price == null ? " tbd" : ""}`}>{x.price == null ? p.tbd : money(x.price)}</div>
          </section>
          {/* Introduction : ce que le produit apporte et comment il s'intègre au moment de soin (masquée si vide) */}
          {intro && (() => {
            // 1re phrase-question (« Peau terne ? ») mise en avant, puis le bénéfice annoncé par la marque
            const m = /^(.{3,90}?[?؟])\s+([\s\S]+)$/.exec(intro);
            return <section className="pintro"><h3>{p.intro}</h3>{m ? <><p className="hook">{m[1]}</p><p>{m[2]}</p></> : <p>{intro}</p>}</section>;
          })()}
          {highlights.length > 0 && card("phl", "star", p.hl, <ul className="hlist">{highlights.map((l, i) => {
            // « Titre : phrase courte » → titre en gras + phrase ; sinon la ligne telle quelle
            const m = /^(.{2,48}?)\s*[:：]\s+(.+)$/.exec(l);
            return <li key={i}>{m ? <><b className="hl-t">{m[1]}</b><span className="hl-d">{m[2]}</span></> : <span className="hl-d">{l}</span>}</li>;
          })}</ul>)}
          {card("pi", "info", p.info, info ? <p className="ptext">{info}</p> : missing)}
          {card("pspec", "spec", p.specs, <dl className="specs">
            <dt>{p.sBrand}</dt><dd className="latin">{x.brand}</dd>
            <dt>{p.sName}</dt><dd className="latin">{x.name}</dd>
            {/* Lignes affichées seulement si l'information est confirmée */}
            {type && <><dt>{p.sType}</dt><dd>{type}</dd></>}
            {content && <><dt>{p.sContent}</dt><dd>{content}</dd></>}
          </dl>)}
          {/* Mode d'emploi : affiché seulement s'il est confirmé (jamais de bloc « à confirmer ») */}
          {usage && card("pu", "use", p.usage, <p className="ptext">{usage}</p>)}
          {/* Précautions : affichées seulement si elles sont renseignées dans l'admin (jamais de bloc « à confirmer ») */}
          {precautions && card("pw", "warn", p.precautions, <p className="ptext">{precautions}</p>)}
          {x.video && card("pv", "video", p.video, isFile
            ? <video className="pvideo" src={x.video} controls playsInline preload="metadata" />
            : <a className="more" href={x.video} target="_blank" rel="noopener noreferrer">{p.video} ↗</a>)}
        </div>
        <div className="pfoot">
          <Paper torn={6} sides="t" className="bg lav" />
          <div className="qty" id="pmQty">{qtyCtl(x)}</div>
          <button className="back" type="button" onClick={onClose}>{svg(BACK)}<span>{p.backTo}</span></button>
        </div>
      </div>
    </div>
  );
}

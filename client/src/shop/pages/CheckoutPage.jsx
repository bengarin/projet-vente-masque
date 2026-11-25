/* Commande (ancienne page checkout.html) : récap, livraison, mode de livraison/paiement, total.
   La commande est envoyée à l'API qui revérifie et recalcule tout avant de l'enregistrer dans MySQL. */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api.js";
import { MA_CITIES } from "../../lib/cities.js";
import { iso } from "../../lib/format.js";
import { tr } from "../../lib/i18n.js";
import { Deco, Paper, Torn } from "../../ui/decor.jsx";
import { RM, useOverlay } from "../../ui/overlay.jsx";
import { CatalogGate, Header } from "../Chrome.jsx";
import { PATHS, useShop } from "../ShopContext.jsx";
import "../../styles/pg-co.css";

const P = {
  fr: { tag: "COMMANDE", title: "Finalise ta commande", s1: "Ton pack", s2: "Livraison", s3: "Livraison et paiement", s4: "Total",
    edit: "Modifier mon panier", packLine: (n, t) => `Pack de ${t} masques · ${iso(n + "/" + t)}`, unit: "Prix unitaire", tbd: "pas encore défini",
    name: "Nom complet", phone: "Téléphone", phoneHint: "Ex. 06 12 34 56 78 ou +212 6 12 34 56 78", address: "Adresse", city: "Ville", cityOther: "Ta ville", cityPh: "Cherche ta ville…", cityTop: "Casablanca et environs", cityAll: "Autres villes", cityOtherOpt: "Autre ville (à saisir)", cityNone: "Aucune ville trouvée.", cityPick: "Choisis ta ville dans la liste, ou « Autre ville ».", area: "Quartier ou code postal", optional: "(facultatif)",
    ship: "Mode de livraison", pay: "Mode de paiement", free: "Gratuit", freeFrom: v => `Gratuit dès ${v} d'achat`,
    noShip: "Aucun mode de livraison n'est encore configuré sur le site.", noPay: "Aucun mode de paiement n'est encore configuré sur le site.",
    products: "Produits", delivery: "Livraison", total: "Total à payer", toSet: "Non défini", chooseShip: "À choisir",
    confirm: "Confirmer la commande", sending: "Envoi…",
    req: "Ce champ est obligatoire.", badPhone: "Numéro invalide : 10 chiffres (06…, 07…, 05…) ou +212…", short: "Merci de préciser davantage.",
    pickShip: "Choisis un mode de livraison.", pickPay: "Choisis un mode de paiement.", fix: "Vérifie les champs en rouge.",
    blocked: "Commande impossible pour le moment : il manque des informations sur le site (prix, livraison ou paiement).",
    closed: "Les commandes sont fermées pour le moment.",
    sendErr: "La commande n'a pas pu être envoyée. Réessaie dans un instant.",
    stockErr: "Un masque n'est plus disponible en quantité suffisante. Modifie ton pack.", changed: "Le catalogue a changé : vérifie ton pack et réessaie.",
    tooMany: "Trop de commandes envoyées. Réessaie dans quelques minutes.",
    emptyTxt: "Ton pack n'est pas encore complet.", emptyGo: "Compléter mon pack",
    okT: "Merci, ta commande est enregistrée !", okNum: "Numéro de commande", okNext: "Nous te contacterons pour la confirmer.",
    okWho: "Nom", okTel: "Téléphone", okAddr: "Adresse", okShip: "Livraison", okPay: "Paiement", okTot: "Total", okBack: "Retour à l'accueil" },
  ar: { tag: "الطلب", title: "كمّلي الطلب ديالك", s1: "الباك ديالك", s2: "التوصيل", s3: "التوصيل والأداء", s4: "المجموع",
    edit: "بدّلي السلة", packLine: (n, t) => `باك ديال ${t} ماسكات · ${iso(n + "/" + t)}`, unit: "ثمن الوحدة", tbd: "ما زال ما تحدّدش",
    name: "الاسم الكامل", phone: "الهاتف", phoneHint: "مثال: 06 12 34 56 78 أو +212 6 12 34 56 78", address: "العنوان", city: "المدينة", cityOther: "المدينة ديالك", cityPh: "قلّبي على المدينة…", cityTop: "الدار البيضاء والنواحي", cityAll: "مدن أخرى", cityOtherOpt: "مدينة أخرى (كتبيها)", cityNone: "ما لقيناش هاد المدينة.", cityPick: "اختاري المدينة من اللائحة، ولا «مدينة أخرى».", area: "الحي أو الرمز البريدي", optional: "(اختياري)",
    ship: "طريقة التوصيل", pay: "طريقة الأداء", free: "مجاني", freeFrom: v => `مجاني ابتداءً من ${v}`,
    noShip: "ما زال ما تزادت حتى طريقة توصيل فالموقع.", noPay: "ما زال ما تزادت حتى طريقة أداء فالموقع.",
    products: "المنتجات", delivery: "التوصيل", total: "المجموع للأداء", toSet: "ما محدّدش", chooseShip: "اختاري",
    confirm: "أكّدي الطلب", sending: "كيتصيفط…",
    req: "هاد الخانة ضرورية.", badPhone: "رقم غير صحيح: 10 أرقام (06…، 07…، 05…) أو +212…", short: "عافاك وضّحي أكثر.",
    pickShip: "اختاري طريقة التوصيل.", pickPay: "اختاري طريقة الأداء.", fix: "راجعي الخانات اللي بالأحمر.",
    blocked: "ما يمكنش تدوزي الطلب دابا: ناقصين معلومات فالموقع (الثمن، التوصيل أو الأداء).",
    closed: "الطلبات مسدودة دابا.",
    sendErr: "ما تصيفطش الطلب. عاودي من بعد شوية.",
    stockErr: "شي ماسك ما بقاش متوفر بهاد الكمية. بدّلي الباك ديالك.", changed: "الكاتالوج تبدّل: راجعي الباك وعاودي.",
    tooMany: "صيفطتي بزاف ديال الطلبات. عاودي من بعد شي دقايق.",
    emptyTxt: "الباك ديالك ما زال ما كملش.", emptyGo: "كمّلي الباك ديالي",
    okT: "شكراً، الطلب ديالك تسجّل!", okNum: "رقم الطلب", okNext: "غادي نتاصلو بيك باش نأكدوه.",
    okWho: "الاسم", okTel: "الهاتف", okAddr: "العنوان", okShip: "التوصيل", okPay: "الأداء", okTot: "المجموع", okBack: "رجوع للرئيسية" },
  en: { tag: "CHECKOUT", title: "Complete your order", s1: "Your pack", s2: "Delivery details", s3: "Delivery & payment", s4: "Total",
    edit: "Edit my cart", packLine: (n, t) => `Pack of ${t} masks · ${iso(n + "/" + t)}`, unit: "Unit price", tbd: "not set yet",
    name: "Full name", phone: "Phone", phoneHint: "e.g. 06 12 34 56 78 or +212 6 12 34 56 78", address: "Address", city: "City", cityOther: "Your city", cityPh: "Search your city…", cityTop: "Casablanca & surroundings", cityAll: "Other cities", cityOtherOpt: "Other city (type it)", cityNone: "No city found.", cityPick: "Pick your city from the list, or “Other city”.", area: "Neighbourhood or postcode", optional: "(optional)",
    ship: "Delivery method", pay: "Payment method", free: "Free", freeFrom: v => `Free from ${v}`,
    noShip: "No delivery method has been set up on the site yet.", noPay: "No payment method has been set up on the site yet.",
    products: "Products", delivery: "Delivery", total: "Total to pay", toSet: "Not set", chooseShip: "To choose",
    confirm: "Confirm order", sending: "Sending…",
    req: "This field is required.", badPhone: "Invalid number: 10 digits (06…, 07…, 05…) or +212…", short: "Please add more detail.",
    pickShip: "Choose a delivery method.", pickPay: "Choose a payment method.", fix: "Please check the fields in red.",
    blocked: "Ordering isn't possible yet: some site information is missing (prices, delivery or payment).",
    closed: "Orders are closed for now.",
    sendErr: "The order couldn't be sent. Please try again shortly.",
    stockErr: "A mask is no longer available in that quantity. Please change your pack.", changed: "The catalogue changed: please check your pack and try again.",
    tooMany: "Too many orders sent. Please try again in a few minutes.",
    emptyTxt: "Your pack isn't complete yet.", emptyGo: "Complete my pack",
    okT: "Thank you, your order is registered!", okNum: "Order number", okNext: "We will contact you to confirm it.",
    okWho: "Name", okTel: "Phone", okAddr: "Address", okShip: "Delivery", okPay: "Payment", okTot: "Total", okBack: "Back to home" },
};
const WARN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.5"/></svg>';
const PEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>';
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const svg = h => <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: h }} />;

const norm = v => String(v).toLowerCase().normalize("NFD").replace(/[̀-ًͯ-ْ]/g, "").replace(/[’'`-]/g, " ").replace(/\s+/g, " ").trim();
const normPhone = v => v.replace(/[\s.\-()]/g, "");
const FORM_KEY = "mc_ship";
const loadForm = () => { try { return JSON.parse(localStorage.getItem(FORM_KEY) || "{}"); } catch { return {}; } };

export default function CheckoutPage() {
  const { uiLang } = useShop();
  const p = P[uiLang];
  useEffect(() => { document.title = p.title; return () => { document.title = "mapetitecoree.ma"; }; }, [p.title]);
  return (
    <div className="pg-co">
      <Header step={4} langMenu />
      <section className="band">
        <Paper torn={9} sides="tb" className="bg lav" />
        <Deco k="heart" className="dc d1" /><Deco k="sparks" className="dc d2" />
        <div className="wrap">
          <div className="tagw"><Deco k="rays" /><Torn torn={3} className="yel"><span className="tag">{p.tag}</span></Torn><Deco k="rays" /></div><br />
          <div className="h1w"><Torn torn={6}><h1>{p.title}</h1></Torn></div>
        </div>
      </section>
      <CatalogGate><Checkout p={p} /></CatalogGate>
    </div>
  );
}

function Checkout({ p }) {
  const { uiLang: lang, catalog, packSize: N, count: n, totals, money, setCartOpen, clearOrder, loadCatalog } = useShop();
  const { toast, hideToast } = useOverlay();
  const saved = useMemo(loadForm, []);
  const [f, setF] = useState({ name: saved.name || "", phone: saved.phone || "", address: saved.address || "", area: saved.area || "", cityOther: saved.cityOther || "" });
  const [cityKey, setCityKey] = useState(saved.cityKey || "");      // nom français de la ville, ou "other"
  const [cityText, setCityText] = useState("");
  const [errs, setErrs] = useState({});
  const [ship, setShip] = useState(catalog.shipping.length === 1 ? catalog.shipping[0].id : null);
  const [pay, setPay] = useState(catalog.payments.length === 1 ? catalog.payments[0].id : null);
  const [block, setBlock] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const okRef = useRef(null);

  const full = N && n === N;
  const cityName = c => (lang === "ar" ? c.ar : c.fr);
  const cityLabel = cityKey === "other" ? p.cityOtherOpt : (MA_CITIES.find(c => c.fr === cityKey) ? cityName(MA_CITIES.find(c => c.fr === cityKey)) : "");
  useEffect(() => { if (cityKey) setCityText(cityLabel); }, [cityKey, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try { localStorage.setItem(FORM_KEY, JSON.stringify({ ...f, cityKey })); } catch { /* ignore */ }
  }, [f, cityKey]);

  // Montants affichés (indicatifs) — le montant final est recalculé par le serveur
  const shipSel = catalog.shipping.find(s => s.id === ship);
  const products = totals.total;
  const shipFee = shipSel ? (shipSel.freeFrom != null && products != null && products >= shipSel.freeFrom ? 0 : shipSel.fee) : null;
  const grand = products != null && shipFee != null ? Math.round((products + shipFee) * 100) / 100 : null;
  const ready = catalog.store.ordersEnabled && catalog.shipping.length && catalog.payments.length && products != null;

  /* ---------- Vérification des champs ---------- */
  const check = (k, vals = f, ck = cityKey, ct = cityText) => {
    const v = (k === "city" ? ct : vals[k] || "").trim();
    if (k === "area") return "";
    if (k === "city") return ck ? "" : (v ? p.cityPick : p.req);
    if (k === "cityOther") { if (ck !== "other") return ""; if (!v) return p.req; return v.length < 2 ? p.short : ""; }
    if (!v) return p.req;
    if (k === "phone" && !/^(0[5-7]\d{8}|(\+|00)212[5-7]\d{8})$/.test(normPhone(v))) return p.badPhone;
    if (k === "name" && v.length < 2) return p.short;
    if (k === "address" && v.length < 6) return p.short;
    return "";
  };
  const validate = (k, ...a) => { const m = check(k, ...a); setErrs(e => ({ ...e, [k]: m })); return !m; };
  const set = k => e => { const vals = { ...f, [k]: e.target.value }; setF(vals); if (errs[k]) validate(k, vals); };
  const blur = k => () => { if (f[k].trim() || errs[k]) validate(k); };
  const fieldProps = k => ({ id: "f_" + k, name: k, value: f[k], onChange: set(k), onBlur: blur(k), "aria-invalid": errs[k] ? "true" : "false", "aria-describedby": "e_" + k });

  async function submit(e) {
    e.preventDefault();
    setBlock("");
    const keys = ["name", "phone", "address", "city", "cityOther"];
    const next = Object.fromEntries(keys.map(k => [k, check(k)]));
    if (catalog.shipping.length && !ship) next.ship = p.pickShip;
    if (catalog.payments.length && !pay) next.pay = p.pickPay;
    setErrs(next);
    const first = Object.keys(next).find(k => next[k]);
    if (first) {
      const el = first === "ship" || first === "pay" ? document.querySelector(`input[name=${first}]`) : document.getElementById("f_" + first);
      el?.focus({ preventScroll: true }); el?.scrollIntoView({ block: "center", behavior: RM() ? "auto" : "smooth" });
      toast(p.fix); return;
    }
    if (!ready) { setBlock(catalog.store.ordersEnabled ? p.blocked : p.closed); return; }
    setBusy(true);
    try {
      const { order } = await api("/api/shop/orders", { method: "POST", body: {
        lang, packSize: N,
        items: totals.items.map(({ x, q }) => ({ productId: x.id, qty: q })),
        customer: { name: f.name.trim(), phone: f.phone.trim(), address: f.address.trim(),
          city: cityKey === "other" ? f.cityOther.trim() : cityKey, cityIsOther: cityKey === "other", area: f.area.trim() || null },
        shippingMethodId: ship, paymentMethodId: pay,
      } });
      hideToast(); setDone(order); clearOrder();
      scrollTo({ top: 0, behavior: RM() ? "auto" : "smooth" });
      setTimeout(() => okRef.current?.focus({ preventScroll: true }), 50);
    } catch (err) {
      const map = { orders_closed: p.closed, price_missing: p.blocked, out_of_stock: p.stockErr, product_unavailable: p.changed,
        pack_incomplete: p.changed, shipping_unavailable: p.changed, payment_unavailable: p.changed, rate_limited: p.tooMany };
      if (err.code === "validation") {
        const fe = {};
        for (const [k, m] of Object.entries(err.fields)) { const key = k.replace(/^customer\./, ""); fe[key] = key === "phone" ? p.badPhone : (m || p.req); }
        setErrs(fe); toast(p.fix);
      } else setBlock(map[err.code] || p.sendErr);
      if (["out_of_stock", "product_unavailable", "price_missing", "shipping_unavailable", "payment_unavailable", "orders_closed"].includes(err.code)) loadCatalog();
    } finally { setBusy(false); }
  }

  if (done) return <Success p={p} o={done} money={money} okRef={okRef} />;
  if (!full) return (
    <main className="wrap"><section className="sec empty">
      <Deco k="face" /><p>{p.emptyTxt}</p>
      <Link className="btnp" to={PATHS[N ? 3 : 2]}>{p.emptyGo}</Link>
    </section></main>
  );

  return (
    <>
      <main className="wrap">
        <form id="co" className="co" noValidate onSubmit={submit}>
          <section className="sec" aria-labelledby="h1s">
            <span className="tape ging" />
            <h2 className="sh2" id="h1s"><span className="n">1</span><span>{p.s1}</span></h2>
            <p className="note" style={{ margin: "-4px 2px 8px" }}>{p.packLine(n, N)}</p>
            <ul className="rl">{totals.items.map(({ x, q }) => (
              <li key={x.id}><img src={x.images[0]} alt="" />
                <div className="i"><small>{x.brand}</small><b>{x.name}</b><span className="u">{p.unit} : {x.price == null ? p.tbd : money(x.price)}</span></div>
                <div className="r"><span className="q">×{q}</span>{x.price != null && <span className="lt">{money(x.price * q)}</span>}</div></li>))}
            </ul>
            <button type="button" className="editc" onClick={() => setCartOpen(true)}>{svg(PEN)}<span>{p.edit}</span></button>
          </section>

          <section className="sec" aria-labelledby="h2s">
            <span className="tape dots" />
            <h2 className="sh2" id="h2s"><span className="n">2</span><span>{p.s2}</span></h2>
            <Field k="name" label={p.name} err={errs.name}><input dir="auto" autoComplete="name" required {...fieldProps("name")} /></Field>
            <Field k="phone" label={p.phone} err={errs.phone} hint={p.phoneHint}>
              <input type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required {...fieldProps("phone")} aria-describedby="h_phone e_phone" /></Field>
            <Field k="address" label={p.address} err={errs.address}><textarea dir="auto" autoComplete="street-address" required {...fieldProps("address")} /></Field>
            <div className="row2">
              <CityField p={p} lang={lang} cityKey={cityKey} cityText={cityText} setCityText={setCityText} err={errs.city}
                onPick={k => { setCityKey(k); setErrs(e => ({ ...e, city: "" })); if (k === "other") setTimeout(() => document.getElementById("f_cityOther")?.focus(), 0); }}
                onType={() => setCityKey("")}
                onBlurCheck={(k, txt) => validate("city", f, k, txt)} />
              {cityKey === "other" && <Field k="cityOther" label={p.cityOther} err={errs.cityOther}>
                <input dir="auto" autoComplete="address-level2" {...fieldProps("cityOther")} /></Field>}
              <div className="fld"><label htmlFor="f_area"><span>{p.area}</span> <span>{p.optional}</span></label>
                <input id="f_area" dir="auto" name="area" autoComplete="postal-code" value={f.area} onChange={set("area")} /></div>
            </div>
          </section>

          <section className="sec" aria-labelledby="h3s">
            <span className="tape grid" />
            <h2 className="sh2" id="h3s"><span className="n">3</span><span>{p.s3}</span></h2>
            <p className="sub3">{p.ship}</p>
            <div className="opts" role="radiogroup">
              {catalog.shipping.length ? catalog.shipping.map(s => (
                <label className="ch" key={s.id}><input type="radio" name="ship" value={s.id} checked={ship === s.id} onChange={() => { setShip(s.id); setErrs(e => ({ ...e, ship: "" })); }} /><span className="rd" />
                  <span className="tx">{tr(s.label, lang)}{tr(s.delay, lang) && <small>{tr(s.delay, lang)}</small>}{s.freeFrom != null && <small>{p.freeFrom(money(s.freeFrom))}</small>}</span>
                  <span className="fee">{s.fee === 0 ? p.free : money(s.fee)}</span></label>
              )) : <p className="missing">{svg(WARN)}<span>{p.noShip}</span></p>}
            </div>
            <p className="fielderr">{errs.ship}</p>
            <p className="sub3">{p.pay}</p>
            <div className="opts" role="radiogroup">
              {catalog.payments.length ? catalog.payments.map(m => (
                <label className="ch" key={m.id}><input type="radio" name="pay" value={m.id} checked={pay === m.id} onChange={() => { setPay(m.id); setErrs(e => ({ ...e, pay: "" })); }} /><span className="rd" />
                  <span className="tx">{tr(m.label, lang)}</span></label>
              )) : <p className="missing">{svg(WARN)}<span>{p.noPay}</span></p>}
            </div>
            <p className="fielderr">{errs.pay}</p>
          </section>

          <section className="sec" aria-labelledby="h4s">
            <span className="tape ydots" />
            <h2 className="sh2" id="h4s"><span className="n">4</span><span>{p.s4}</span></h2>
            <div className="tot">
              <div><span>{p.products}</span>{products == null ? <span className="tbd">{p.toSet}</span> : <span dir="ltr">{money(products)}</span>}</div>
              <div><span>{p.delivery}</span>{catalog.shipping.length && !shipSel ? <span className="tbd">{p.chooseShip}</span>
                : shipFee === 0 ? <span>{p.free}</span> : shipFee == null ? <span className="tbd">{p.toSet}</span> : <span dir="ltr">{money(shipFee)}</span>}</div>
              <div className="big"><span>{p.total}</span>{grand == null ? <span className="tbd">{p.toSet}</span> : <span dir="ltr">{money(grand)}</span>}</div>
            </div>
            <p className="block" role="alert">{block || (!ready ? (catalog.store.ordersEnabled ? p.blocked : p.closed) : "")}</p>
          </section>
        </form>
      </main>
      <div className="bar">
        <div className="barin">
          <div className="tt"><small>{p.total}</small><b>{grand == null ? p.toSet : money(grand)}</b></div>
          <button className={`cta conf${busy ? " busy" : ""}`} type="submit" form="co" disabled={busy}>{busy ? p.sending : p.confirm}</button>
        </div>
      </div>
    </>
  );
}

function Field({ k, label, err, hint, children }) {
  return (
    <div className="fld"><label htmlFor={"f_" + k}><span>{label}</span> <i aria-hidden="true">*</i></label>
      {children}{hint && <span className="hint" id={"h_" + k}>{hint}</span>}<span className="err" id={"e_" + k}>{err}</span></div>
  );
}

/* ---------- Ville : liste déroulante avec recherche (mêmes règles qu'avant) ---------- */
function CityField({ p, lang, cityKey, cityText, setCityText, err, onPick, onType, onBlurCheck }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [act, setAct] = useState(-1);
  const box = useRef(null), input = useRef(null), list = useRef(null);
  const cityName = c => (lang === "ar" ? c.ar : c.fr);

  const opts = useMemo(() => {
    const nq = norm(q || "");
    const hit = c => !nq || norm(c.fr).includes(nq) || norm(c.ar).includes(nq);
    const top = MA_CITIES.filter(c => c.top && hit(c));
    const rest = MA_CITIES.filter(c => !c.top && hit(c)).sort((a, b) => cityName(a).localeCompare(cityName(b), lang));
    return { top, rest, flat: [...top, ...rest].map(c => c.fr).concat("other") };
  }, [q, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const openList = query => {
    setQ(query); setAct(-1); setOpen(true);
    requestAnimationFrame(() => {
      if (!list.current) return;
      if (!query) list.current.querySelector("[aria-selected=true]")?.scrollIntoView({ block: "nearest" });
      const r = list.current.getBoundingClientRect(), bar = document.querySelector(".pg-co .bar")?.getBoundingClientRect().top ?? innerHeight;
      if (r.bottom > bar - 8) scrollBy({ top: r.bottom - bar + 16, behavior: RM() ? "auto" : "smooth" });
    });
  };
  const close = () => { setOpen(false); setAct(-1); };
  const pick = k => { onPick(k); close(); };
  useEffect(() => {
    const h = e => { if (box.current && !box.current.contains(e.target)) close(); };
    document.addEventListener("pointerdown", h);
    return () => document.removeEventListener("pointerdown", h);
  }, []);
  useEffect(() => { if (act >= 0) list.current?.querySelectorAll("[role=option]")[act]?.scrollIntoView({ block: "nearest" }); }, [act]);

  const optId = k => "co_" + norm(k).replace(/ /g, "_");
  const opt = c => <li key={c.fr} role="option" id={optId(c.fr)} aria-selected={cityKey === c.fr} className={opts.flat[act] === c.fr ? "act" : ""} onClick={() => pick(c.fr)}>
    {cityName(c)}{lang === "ar" && <small dir="ltr">{c.fr}</small>}</li>;

  return (
    <div className="fld"><label htmlFor="f_city" id="l_city"><span>{p.city}</span> <i aria-hidden="true">*</i></label>
      <div className={`cbx${open ? " open" : ""}`} ref={box}>
        <input id="f_city" ref={input} name="city" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls="cityList" autoComplete="off" required
          aria-describedby="e_city" aria-invalid={err ? "true" : "false"} placeholder={p.cityPh} value={cityText}
          aria-activedescendant={act >= 0 ? optId(opts.flat[act]) : undefined}
          onFocus={e => { e.target.select(); openList(""); }}
          onClick={() => { if (!open) openList(""); }}
          onChange={e => { setCityText(e.target.value); onType(); openList(e.target.value); }}
          onKeyDown={e => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (!open) openList(""); const L = opts.flat.length; setAct(a => (a + (e.key === "ArrowDown" ? 1 : -1) + L) % L); }
            else if (e.key === "Enter" && open) { e.preventDefault(); pick(opts.flat[act < 0 ? 0 : act]); }
            else if (e.key === "Escape") close();
          }}
          onBlur={() => setTimeout(() => {
            if (document.activeElement === input.current) return;
            close();
            let k = cityKey;
            if (!k) {                         // saisie exacte d'une ville de la liste → acceptée
              const v = norm(cityText), c = v && MA_CITIES.find(x => norm(x.fr) === v || norm(x.ar) === v);
              if (c) { k = c.fr; onPick(c.fr); }
            }
            if (cityText.trim() || err) onBlurCheck(k, cityText);
          }, 120)} />
        <button type="button" className="cbtn" tabIndex={-1} aria-hidden="true" onClick={() => (open ? close() : input.current.focus())}>
          {svg('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>')}</button>
        {open && <ul className="clist" id="cityList" role="listbox" aria-labelledby="l_city" ref={list} onPointerDown={e => e.preventDefault()}>
          {opts.top.length > 0 && <><li className="grp" role="presentation">{p.cityTop}</li>{opts.top.map(opt)}</>}
          {opts.rest.length > 0 && <><li className="grp" role="presentation">{p.cityAll}</li>{opts.rest.map(opt)}</>}
          {!opts.top.length && !opts.rest.length && <li className="none" role="presentation">{p.cityNone}</li>}
          <li role="option" className={`other${opts.flat[act] === "other" ? " act" : ""}`} id="co_other" aria-selected={cityKey === "other"} onClick={() => pick("other")}>{p.cityOtherOpt}</li>
        </ul>}
      </div>
      <span className="err" id="e_city">{err}</span></div>
  );
}

function Success({ p, o, money, okRef }) {
  const rows = [[p.okWho, o.customer.name], [p.okTel, o.customer.phone],
    [p.okAddr, [o.customer.address, o.customer.area, o.customer.city].filter(Boolean).join(", ")],
    [p.okShip, `${o.shipping.label} — ${o.shipping.fee === 0 ? p.free : money(o.shipping.fee)}`],
    [p.okPay, o.payment.label], [p.okTot, money(o.total)]];
  return (
    <main className="wrap">
      <section className="sec okv" tabIndex={-1} ref={okRef} aria-live="polite">
        <div className="stamp">{svg(CHECK)}</div>
        <h2>{p.okT}</h2>
        <p className="num">{p.okNum} : <b>{o.number}</b></p>
        <p className="num">{p.okNext}</p>
        <div className="okd">
          <ul className="rl">{o.items.map(it => (
            <li key={it.productId}>{it.image && <img src={it.image} alt="" />}<div className="i"><small>{it.brand}</small><b>{it.name}</b></div>
              <div className="r"><span className="q">×{it.qty}</span>{it.lineTotal != null && <span className="lt">{money(it.lineTotal)}</span>}</div></li>))}</ul>
          <dl style={{ marginTop: 14 }}>{rows.map(([a, b], i) => <FragmentRow key={i} a={a} b={b} ltr={i === 1} />)}</dl>
        </div>
        <p style={{ marginTop: 18 }}><Link className="btnp" to="/">{p.okBack}</Link></p>
      </section>
    </main>
  );
}
const FragmentRow = ({ a, b, ltr }) => <><dt>{a}</dt><dd {...(ltr ? { dir: "ltr", className: "ph" } : {})}>{b}</dd></>;

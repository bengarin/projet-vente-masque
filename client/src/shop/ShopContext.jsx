/* État partagé de la boutique : langue, catalogue (chargé depuis l'API / MySQL), taille du pack, masques choisis. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { LANGS, T } from "../lib/i18n.js";
import { fmt } from "../lib/format.js";
import { useOverlay } from "../ui/overlay.jsx";

export const PATHS = { 1: "/", 2: "/pack", 3: "/masques", 4: "/commande", soins: "/soins" };

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* navigation privée */ } },
};
const qs = new URLSearchParams(location.search);
const validLang = v => (LANGS.some(l => l.code === v) ? v : null);

const ShopCtx = createContext(null);
export const useShop = () => useContext(ShopCtx);

export function ShopProvider({ children }) {
  const { toast } = useOverlay();
  const navigate = useNavigate();

  const [lang, setLangState] = useState(() => validLang((qs.get("lang") || store.get("mc_lang") || "").slice(0, 2)));
  const uiLang = lang || "fr";
  const t = T[uiLang];

  const [catalog, setCatalog] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [packSize, setPackSizeState] = useState(() => parseInt(qs.get("pack") || store.get("mc_pack"), 10) || null);
  const [order, setOrder] = useState(() => {
    try { const v = JSON.parse(store.get("mc_order_v2") || "[]"); return Array.isArray(v) ? v.filter(Number.isInteger) : []; }
    catch { return []; }
  });
  // Soins vendus à l'unité : { idProduit: quantité }
  const [extras, setExtras] = useState(() => {
    try { const v = JSON.parse(store.get("mc_extras_v1") || "{}"); return v && typeof v === "object" ? v : {}; }
    catch { return {}; }
  });
  const [cartOpen, setCartOpen] = useState(false);

  const loadCatalog = useCallback(async () => {
    setLoadError(null);
    try { setCatalog(await api("/api/shop/catalog")); }
    catch (e) { setLoadError(e); }
  }, []);
  useEffect(() => { loadCatalog(); }, [loadCatalog]);

  // Une fois le catalogue chargé : on retire les masques qui n'existent plus et les tailles de pack désactivées
  useEffect(() => {
    if (!catalog) return;
    const ids = new Set(catalog.products.filter(p => p.saleMode !== "unit").map(p => p.id));
    const unitIds = new Set(catalog.products.filter(p => p.saleMode === "unit").map(p => p.id));
    setOrder(o => (o.every(id => ids.has(id)) ? o : o.filter(id => ids.has(id))));
    setExtras(e => Object.fromEntries(Object.entries(e).filter(([id, q]) => unitIds.has(Number(id)) && q > 0)));
    setPackSizeState(n => (n && catalog.packSizes.some(p => p.size === n) ? n : null));
  }, [catalog]);

  useEffect(() => { if (packSize && order.length > packSize) setOrder(o => o.slice(0, packSize)); }, [packSize, order.length]);
  useEffect(() => { store.set("mc_order_v2", JSON.stringify(order)); }, [order]);
  useEffect(() => { store.set("mc_extras_v1", JSON.stringify(extras)); }, [extras]);
  useEffect(() => {
    const L = LANGS.find(l => l.code === uiLang);
    document.documentElement.lang = uiLang;
    document.documentElement.dir = L.dir;                       // RTL seulement pour l'arabe
  }, [uiLang]);

  const setLang = useCallback(l => { store.set("mc_lang", l); setLangState(l); }, []);
  const setPackSize = useCallback(n => {
    store.set("mc_pack", String(n)); setPackSizeState(n);
    setOrder(o => (o.length > n ? o.slice(0, n) : o));           // garde les premiers masques choisis
  }, []);

  const products = useMemo(() => catalog?.products || [], [catalog]);
  const packProducts = useMemo(() => products.filter(p => p.saleMode !== "unit"), [products]);
  const unitProducts = useMemo(() => products.filter(p => p.saleMode === "unit"), [products]);
  const byId = useCallback(id => products.find(p => p.id === id), [products]);
  const currency = catalog?.store.currency || "";
  // En arabe : « درهم » au lieu de « DH » / « MAD » (montant isolé pour un affichage RTL correct)
  const money = useCallback(v => {
    if (lang === "ar" && /^(dh|mad|dhs)$/i.test(currency.trim())) { const m = fmt(v, ""); return m == null ? null : "\u2067" + m + " درهم\u2069"; }
    return fmt(v, currency);
  }, [currency, lang]);

  const qty = useCallback(id => order.filter(x => x === id).length, [order]);

  /* Change la quantité d'un masque. Renvoie false (avec un message) si impossible. */
  const setQty = useCallback((id, q) => {
    const cur = order.filter(x => x === id).length; q = Math.max(0, q);
    if (q > cur) {
      if (!packSize) { toast(t.choosePack); return false; }
      if (order.length + (q - cur) > packSize) { toast(t.full(packSize)); return false; }
      const p = byId(id);
      if (p && p.stock != null && q > p.stock) { toast(t.noMoreStock); return false; }
      setOrder(o => [...o, ...Array(q - cur).fill(id)]);
    } else if (q < cur) {
      setOrder(o => { const n = [...o]; for (let i = q; i < cur; i++) n.splice(n.lastIndexOf(id), 1); return n; });
    }
    return true;
  }, [order, packSize, byId, toast, t]);

  const replace = useCallback((oldId, newId) => {
    const p = byId(newId);
    if (p && p.stock != null && qty(newId) + 1 > p.stock) { toast(t.noMoreStock); return false; }
    setOrder(o => { const i = o.lastIndexOf(oldId); if (i < 0) return o; const n = [...o]; n[i] = newId; return n; });
    return true;
  }, [byId, qty, toast, t]);

  /* Soins à l'unité : quantité libre (20 max), limitée par le stock s'il est suivi */
  const extraQty = useCallback(id => extras[id] || 0, [extras]);
  const setExtraQty = useCallback((id, q) => {
    q = Math.max(0, Math.min(20, q));
    const p = byId(id);
    if (q > (extras[id] || 0) && p && p.stock != null && q > p.stock) { toast(t.noMoreStock); return false; }
    setExtras(e => { const n = { ...e }; if (q) n[id] = q; else delete n[id]; return n; });
    return true;
  }, [extras, byId, toast, t]);
  const extrasCount = Object.values(extras).reduce((a, b) => a + b, 0);

  const clearOrder = useCallback(() => { setOrder([]); setExtras({}); }, []);

  const totals = useMemo(() => {
    const cents = list => (list.every(({ x }) => x.price != null) ? list.reduce((s, { x, q }) => s + Math.round(x.price * 100) * q, 0) : null);
    const items = packProducts.filter(p => order.includes(p.id)).map(x => ({ x, q: order.filter(i => i === x.id).length }));
    const extraItems = unitProducts.filter(p => extras[p.id]).map(x => ({ x, q: extras[x.id] }));
    const sumC = items.length ? cents(items) : 0;
    const pack = packSize && items.length ? catalog?.packSizes.find(p => p.size === packSize)?.price ?? null : null;
    const packC = !items.length ? 0 : pack != null ? Math.round(pack * 100) : sumC;
    const extrasC = cents(extraItems);
    const total = packC == null || extrasC == null ? null : (packC + extrasC) / 100;
    return { items, extraItems, sum: sumC == null ? null : sumC / 100, pack, packTotal: packC == null ? null : packC / 100,
      extrasTotal: extrasC == null ? null : extrasC / 100, total };
  }, [packProducts, unitProducts, order, extras, packSize, catalog]);
  // Commande possible : pack vide ou complet, et au moins un article
  const packOk = order.length === 0 || (packSize && order.length === packSize);
  const canCheckout = packOk && order.length + extrasCount > 0;

  const go = useCallback(step => navigate(PATHS[step]), [navigate]);

  const value = {
    lang, uiLang, t, setLang, catalog, loadError, loadCatalog, products, packProducts, unitProducts, byId, currency, money,
    packSize, setPackSize, order, count: order.length, qty, setQty, replace, clearOrder, totals,
    extras, extraQty, setExtraQty, extrasCount, cartCount: order.length + extrasCount, packOk, canCheckout,
    cartOpen, setCartOpen, go,
  };
  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

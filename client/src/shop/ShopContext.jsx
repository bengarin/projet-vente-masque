/* État partagé de la boutique : langue, catalogue (chargé depuis l'API / MySQL), taille du pack, masques choisis. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { LANGS, T } from "../lib/i18n.js";
import { fmt } from "../lib/format.js";
import { useOverlay } from "../ui/overlay.jsx";

export const PATHS = { 1: "/", 2: "/pack", 3: "/masques", 4: "/commande" };

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
    const ids = new Set(catalog.products.map(p => p.id));
    setOrder(o => (o.every(id => ids.has(id)) ? o : o.filter(id => ids.has(id))));
    setPackSizeState(n => (n && catalog.packSizes.some(p => p.size === n) ? n : null));
  }, [catalog]);

  useEffect(() => { if (packSize && order.length > packSize) setOrder(o => o.slice(0, packSize)); }, [packSize, order.length]);
  useEffect(() => { store.set("mc_order_v2", JSON.stringify(order)); }, [order]);
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
  const byId = useCallback(id => products.find(p => p.id === id), [products]);
  const currency = catalog?.store.currency || "";
  const money = useCallback(v => fmt(v, currency), [currency]);

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

  const clearOrder = useCallback(() => setOrder([]), []);

  const totals = useMemo(() => {
    const items = products.filter(p => order.includes(p.id)).map(x => ({ x, q: order.filter(i => i === x.id).length }));
    const sum = items.length && items.every(({ x }) => x.price != null) ? items.reduce((s, { x, q }) => s + Math.round(x.price * 100) * q, 0) / 100 : (items.length ? null : 0);
    const pack = packSize ? catalog?.packSizes.find(p => p.size === packSize)?.price ?? null : null;
    return { items, sum, pack, total: pack != null ? pack : sum };
  }, [products, order, packSize, catalog]);

  const go = useCallback(step => navigate(PATHS[step]), [navigate]);

  const value = {
    lang, uiLang, t, setLang, catalog, loadError, loadCatalog, products, byId, currency, money,
    packSize, setPackSize, order, count: order.length, qty, setQty, replace, clearOrder, totals,
    cartOpen, setCartOpen, go,
  };
  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

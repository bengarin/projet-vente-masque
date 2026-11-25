/* En-tête, menu (3 langues), suivi d'étapes, panier latéral, chargement du catalogue — communs à toutes les étapes */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LANGS } from "../lib/i18n.js";
import { iso } from "../lib/format.js";
import { Deco, ICON, Logo } from "../ui/decor.jsx";
import { useScrollLock } from "../ui/overlay.jsx";
import { PATHS, useShop } from "./ShopContext.jsx";

export function Header({ step, langMenu = false }) {
  const { t, uiLang, lang, packSize, setLang, cartCount: count, setCartOpen, unitProducts } = useShop();
  const [open, setOpen] = useState(false);
  useScrollLock(open);
  const can = i => i <= step || (i === 2 && lang) || (i === 3 && lang && packSize);
  return (
    <>
      <header className="top">
        <button className="icon" type="button" aria-label={t.menu} aria-expanded={open} onClick={() => setOpen(true)} dangerouslySetInnerHTML={{ __html: ICON.menu }} />
        <Link className="brand" to="/" dir="ltr"><Logo cls="hd" /></Link>
        <button className="icon cart" type="button" id="cartBtn" aria-label={t.cart} onClick={() => setCartOpen(true)}>
          <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: ICON.cart }} />
          <b id="cartCount" hidden={!count}>{count}</b>
        </button>
      </header>
      <div className={`menu${open ? " open" : ""}`} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
        <nav aria-label={t.menu}>
          <div className="mhead"><span className="mlogo"><Logo cls="mn" /></span>
            <button className="x" type="button" aria-label={t.close} onClick={() => setOpen(false)}>×</button></div>
          {[1, 2, 3].map(i => (
            <Link key={i} to={PATHS[i]} aria-disabled={can(i) ? undefined : "true"} aria-current={i === step ? "page" : undefined} onClick={() => setOpen(false)}>
              {t.step(i)} · {t.steps[i - 1]}
            </Link>
          ))}
          {unitProducts.length > 0 && <Link to={PATHS.soins} className="msoins" aria-current={step === "soins" ? "page" : undefined} onClick={() => setOpen(false)}>✦ {t.soins}</Link>}
          {langMenu && <>
            <p className="mlab">{t.lang}</p>
            <div className="mlangs">{LANGS.map(l => (
              <button key={l.code} type="button" aria-pressed={l.code === uiLang} onClick={() => { setLang(l.code); setOpen(false); }}>
                <img src={l.flag} alt="" />{l.label}
              </button>))}</div>
          </>}
          <Link to="/" onClick={() => setOpen(false)}>{t.home}</Link>
        </nav>
      </div>
      <CartDrawer step={step} />
    </>
  );
}

export function StepDots({ step }) {
  const { t } = useShop();
  return (
    <ol className="sdots" aria-label={t.stepTag(step)}>
      {[1, 2, 3].map(i => (
        <li key={i} className={i < step ? "done" : i === step ? "now" : ""}>
          {i < step
            ? <Link className="c" to={PATHS[i]} aria-label={`${t.step(i)} · ${t.steps[i - 1]}`} dangerouslySetInnerHTML={{ __html: ICON.check }} />
            : <span className="c" aria-current={i === step ? "step" : undefined}>{i}</span>}
        </li>
      ))}
    </ol>
  );
}

/* Affiche un message pendant le chargement du catalogue ou en cas d'erreur */
export function CatalogGate({ children }) {
  const { catalog, loadError, loadCatalog, t } = useShop();
  if (catalog) return children;
  return (
    <main className="wrap"><div className="gate">
      {loadError
        ? <><p role="alert">{t.loadErr}<br /><small>{loadError.message}</small></p><button className="go" type="button" onClick={loadCatalog}>{t.retry}</button></>
        : <p aria-live="polite">{t.loading}</p>}
    </div></main>
  );
}

const TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>';

/* ---------- Panier latéral (même contenu sur toutes les pages) ---------- */
function CartDrawer({ step }) {
  const { t, cartOpen, setCartOpen, packSize: N, count: n, totals, qty, setQty, money, lang, extrasCount, setExtraQty, canCheckout } = useShop();
  const navigate = useNavigate();
  const closeRef = useRef(null);
  useScrollLock(cartOpen);
  useEffect(() => {
    if (!cartOpen) return;
    closeRef.current?.focus();
    const key = e => { if (e.key === "Escape") setCartOpen(false); };
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("keydown", key); document.getElementById("cartBtn")?.focus(); };
  }, [cartOpen, setCartOpen]);

  const { items, extraItems, sum, pack, total } = totals;
  const any = items.length + extraItems.length > 0;
  let msg, bad = false;
  if (n > 0 && N && n < N) { msg = t.need(N - n); bad = true; }          // pack commencé mais incomplet
  else if (n > 0) msg = extrasCount ? t.readyAll : t.ready;
  else if (extrasCount) msg = t.readyAll;
  else { msg = N ? t.emptyHint : t.choosePack; bad = !N; }
  const pickMode = step !== 3 && N && n > 0 && n < N && lang;
  const goDisabled = !pickMode && (!canCheckout || step === 4);
  const go = () => { setCartOpen(false); navigate(pickMode ? PATHS[3] : PATHS[4]); };
  const row = (a, b, c = "") => <div className={c}><span>{a}</span><span dir="ltr">{b}</span></div>;

  return (
    <div className={`drawer${cartOpen ? " open" : ""}`} onClick={e => { if (e.target === e.currentTarget) setCartOpen(false); }}>
      {cartOpen && <aside className="dpanel" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
        <header className="dhead">
          <div><h2 id="cartTitle">{t.cartTitle}</h2><p>{[N && n ? `${t.packOf(N)} · ${iso(n + "/" + N)}` : null, extrasCount ? t.nSoins(extrasCount) : null].filter(Boolean).join(" · ") || (N ? t.packOf(N) : t.noPack)}</p></div>
          <button className="x" type="button" ref={closeRef} aria-label={t.close} onClick={() => setCartOpen(false)}>×</button>
        </header>
        <div className="dbody"><ul className="lines">
          {items.length ? items.map(({ x, q }) => (
            <li className="line" key={x.id}>
              <img src={x.images[0]} alt="" />
              <div className="info"><small>{x.brand}</small><b>{x.name}</b>
                <span>{t.unitLine(x.price == null ? null : money(x.price))}</span>
                <div className="ctl"><div className="qty">
                  <button className="mi" type="button" aria-label={`${t.minus} – ${x.name}`} onClick={() => setQty(x.id, q - 1)}>−</button>
                  <output>{q}</output>
                  <button className="pl" type="button" aria-label={`${t.add} – ${x.name}`} disabled={!!N && n >= N} onClick={() => setQty(x.id, q + 1)}>+</button></div>
                  <button className="rm" type="button" onClick={() => setQty(x.id, 0)}><span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: TRASH }} />{t.del}</button></div>
              </div>
              {x.price != null && <div className="lt">{money(x.price * qty(x.id))}</div>}
            </li>
          )) : !extraItems.length && <li className="emptyc"><Deco k="face" /><b>{t.empty}</b><span>{t.emptyHint}</span></li>}
          {extraItems.length > 0 && <li className="lsec">{t.mySoins}</li>}
          {extraItems.map(({ x, q }) => (
            <li className="line" key={"s" + x.id}>
              <img src={x.images[0]} alt="" />
              <div className="info"><small>{x.brand}</small><b>{x.name}</b>
                <span>{t.unitLine(x.price == null ? null : money(x.price))}</span>
                <div className="ctl"><div className="qty">
                  <button className="mi" type="button" aria-label={`${t.minus} – ${x.name}`} onClick={() => setExtraQty(x.id, q - 1)}>−</button>
                  <output>{q}</output>
                  <button className="pl" type="button" aria-label={`${t.add} – ${x.name}`} onClick={() => setExtraQty(x.id, q + 1)}>+</button></div>
                  <button className="rm" type="button" onClick={() => setExtraQty(x.id, 0)}><span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: TRASH }} />{t.del}</button></div>
              </div>
              {x.price != null && <div className="lt">{money(x.price * q)}</div>}
            </li>))}
        </ul></div>
        <footer className="dfoot">
          <div className="sum">
            {pack != null && <>{row(t.sumMasks, sum == null ? t.tbdTotal : money(sum))}{row(t.packPrice(N), money(pack))}</>}
            {row(t.total, !any ? money(0) : total == null ? t.tbdTotal : money(total), "tot")}
          </div>
          <p className={`status${bad ? " bad" : ""}`}>{msg}</p>
          {step !== 4 && <button className="go" type="button" disabled={goDisabled} onClick={go}>{pickMode ? t.goPick : t.checkout}</button>}
          <button className="ghost" type="button" onClick={() => setCartOpen(false)}>{t.keep}</button>
        </footer>
      </aside>}
    </div>
  );
}

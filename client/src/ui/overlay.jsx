/* Toast, fenêtre de confirmation et blocage du défilement — équivalents React de l'ancien app.js */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Paper } from "./decor.jsx";

/* ---------- Blocage du défilement derrière une fenêtre ouverte ---------- */
let locks = 0;
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    locks++; document.documentElement.classList.add("locked");
    return () => { locks = Math.max(0, locks - 1); if (!locks) document.documentElement.classList.remove("locked"); };
  }, [active]);
}

/* Classe ajoutée au <body> tant que la page est affichée (ex. fond lavande de l'étape 2) */
export function useBodyClass(cls) {
  useEffect(() => {
    if (!cls) return;
    document.body.classList.add(cls);
    return () => document.body.classList.remove(cls);
  }, [cls]);
}

export const RM = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

/* Lance une animation CSS (classe) sur un élément, puis la retire */
export function anim(el, cls) {
  if (!el || RM()) return;
  const reg = el._anims || (el._anims = {});
  const prev = reg[cls]; if (prev) clearTimeout(prev.t);
  const tok = reg[cls] = {};
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  const clean = () => { if (reg[cls] === tok) { clearTimeout(tok.t); delete reg[cls]; el.classList.remove(cls); } };
  const own = el.getAnimations ? el.getAnimations({ subtree: true }).filter(a => a.effect && a.effect.target === el && a.animationName) : [];
  if (own.length) Promise.all(own.map(a => a.finished.catch(() => {}))).then(clean);
  tok.t = setTimeout(clean, 1000);
}

/* ---------- Toast + Dialog ---------- */
const OverlayCtx = createContext(null);
export const useOverlay = () => useContext(OverlayCtx);

export function OverlayProvider({ children, closeLabel = "Fermer" }) {
  const [toastMsg, setToastMsg] = useState({ text: "", show: false });
  const tRef = useRef(0);
  const toast = useCallback(text => {
    setToastMsg({ text, show: true });
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setToastMsg(m => ({ ...m, show: false })), 2400);
  }, []);
  const hideToast = useCallback(() => setToastMsg(m => ({ ...m, show: false })), []);

  const [dlg, setDlg] = useState(null);
  const dialog = useCallback(opts => new Promise(resolve => {
    setDlg({ ...opts, back: document.activeElement, resolve });
  }), []);
  const done = v => { const d = dlg; setDlg(null); d?.back?.focus?.(); d?.resolve(v); };

  return (
    <OverlayCtx.Provider value={{ toast, hideToast, dialog }}>
      {children}
      <div className={`toast${toastMsg.show ? " show" : ""}`} role="status">{toastMsg.text}</div>
      {dlg && <Dialog {...dlg} closeLabel={closeLabel} onDone={done} />}
    </OverlayCtx.Provider>
  );
}

function Dialog({ title, body, buttons = [], onDone, closeLabel }) {
  const ref = useRef(null);
  useScrollLock(true);
  useEffect(() => {
    (ref.current?.querySelector(".go") || ref.current?.querySelector("[data-value]"))?.focus();
    const key = e => { if (e.key === "Escape") onDone(""); };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="dlg" role="dialog" aria-modal="true" aria-labelledby="dlgT" ref={ref} onClick={e => { if (e.target === e.currentTarget) onDone(""); }}>
      <div className="dbox"><div className="sh"><Paper torn={6} className="dpaper">
        <button className="x" type="button" data-value="" aria-label={closeLabel} onClick={() => onDone("")}>×</button>
        <h2 id="dlgT">{title}</h2>
        {body}
        <div className="dbtns">
          {buttons.map(b => (
            <button key={b.value} type="button" className={b.primary ? "go" : "ghost"} data-value={b.value} onClick={() => onDone(b.value)}>{b.label}</button>
          ))}
        </div>
      </Paper></div></div>
    </div>
  );
}

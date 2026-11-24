/* Outils et composants partagés de l'administration */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { api, ApiError } from "../lib/api.js";
import { fmt } from "../lib/format.js";
import { Ic } from "./icons.jsx";

export const STATUSES = [
  { code: "nouvelle", label: "Nouvelle" },
  { code: "confirmee", label: "Confirmée" },
  { code: "en_preparation", label: "En préparation" },
  { code: "expediee", label: "Expédiée" },
  { code: "livree", label: "Livrée" },
  { code: "annulee", label: "Annulée" },
];
export const statusLabel = c => STATUSES.find(s => s.code === c)?.label || c;
export const StatusBadge = ({ s }) => <span className={`a-badge a-st-${s}`}>{statusLabel(s)}</span>;
export const Badge = ({ tone = "neutral", children, title }) => <span className={`a-badge a-tone-${tone}`} title={title}>{children}</span>;

export const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

/* Appel API admin : une session expirée renvoie à la page de connexion */
export function useAdminApi() {
  const { setAdmin } = useAuth();
  return useCallback(async (path, opts) => {
    try { return await api("/api/admin" + path, opts); }
    catch (e) { if (e instanceof ApiError && e.status === 401) setAdmin(null); throw e; }
  }, [setAdmin]);
}

/* Charge des données au montage ; reload() pour rafraîchir */
export function useLoad(path) {
  const call = useAdminApi();
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const reload = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try { setState({ data: await call(path), error: null, loading: false }); }
    catch (e) { setState(s => ({ data: s.data, error: e, loading: false })); }
  }, [call, path]);
  useEffect(() => { reload(); }, [reload]);
  return { ...state, reload, setData: d => setState(s => ({ ...s, data: typeof d === "function" ? d(s.data) : d })) };
}

export const money = (v, cur) => (v == null ? "—" : fmt(v, cur));
export const numStr = v => (v == null ? "" : String(v));

/* ---------- Mise en page ---------- */
export function PageHeader({ title, subtitle, back, actions, children }) {
  return (
    <header className="a-phead">
      <div className="a-phead-main">
        {back && <Link className="a-back" to={back.to}><Ic n="left" size={16} />{back.label}</Link>}
        <h1 className="a-title">{title}</h1>
        {subtitle && <p className="a-subtitle">{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="a-phead-actions">{actions}</div>}
    </header>
  );
}

export function Card({ title, icon, actions, children, className = "", pad = true, id }) {
  return (
    <section className={`a-card ${className}`} id={id}>
      {(title || actions) && (
        <div className="a-card-head">
          {title && <h2 className="a-card-title">{icon && <span className="a-card-ic"><Ic n={icon} size={16} /></span>}{title}</h2>}
          {actions && <div className="a-card-actions">{actions}</div>}
        </div>
      )}
      <div className={pad ? "a-card-body" : ""}>{children}</div>
    </section>
  );
}

export function Empty({ icon = "star", title, children }) {
  return (
    <div className="a-empty">
      <span className="a-empty-ic"><Ic n={icon} size={22} /></span>
      <b>{title}</b>
      {children && <p>{children}</p>}
    </div>
  );
}

/* Chargement (squelette) / erreur / contenu */
export function Loader({ state, children, rows = 4 }) {
  if (state.error && !state.data) return (
    <div className="a-alert a-alert-err" role="alert"><Ic n="alert" />
      <span>{state.error.message}</span>{state.reload && <button className="a-btn a-btn-sm a-btn-secondary" type="button" onClick={state.reload}>Réessayer</button>}</div>
  );
  if (!state.data) return <div className="a-skel" aria-label="Chargement…">{Array.from({ length: rows }, (_, i) => <span key={i} />)}</div>;
  return children(state.data);
}

export function Field({ label, error, hint, children, required, className = "" }) {
  return (
    <label className={`a-field${error ? " has-err" : ""} ${className}`}>
      <span className="a-label">{label}{required && <i aria-hidden="true"> *</i>}</span>
      {children}
      {hint && !error && <small className="a-hint">{hint}</small>}
      {error && <small className="a-err"><Ic n="alert" size={13} />{error}</small>}
    </label>
  );
}

export function Switch({ checked, onChange, label, hint }) {
  return (
    <label className="a-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="a-switch-track" aria-hidden="true"><span /></span>
      <span className="a-switch-txt"><b>{label}</b>{hint && <small>{hint}</small>}</span>
    </label>
  );
}

/* ---------- Notifications (en haut à droite) ---------- */
export function useFlash() {
  const [msg, setMsg] = useState(null);
  useEffect(() => { if (!msg || msg.type === "err") return; const t = setTimeout(() => setMsg(null), 3200); return () => clearTimeout(t); }, [msg]);
  const el = msg ? createPortal(
    <div className={`a-toast a-toast-${msg.type}`} role={msg.type === "err" ? "alert" : "status"}>
      <Ic n={msg.type === "err" ? "alert" : "check"} />
      <span>{msg.text}</span>
      <button type="button" className="a-icon-btn a-icon-btn-sm" aria-label="Fermer" onClick={() => setMsg(null)}><Ic n="x" size={16} /></button>
    </div>, document.body) : null;
  return [el, setMsg];
}

/* ---------- Fenêtre de confirmation (remplace window.confirm) ---------- */
const ConfirmCtx = createContext(null);
export const useConfirm = () => useContext(ConfirmCtx);

export function ConfirmProvider({ children }) {
  const [req, setReq] = useState(null);
  const okRef = useRef(null);
  const confirm = useCallback(opts => new Promise(resolve => setReq({ ...opts, resolve, back: document.activeElement })), []);
  const close = v => { req?.resolve(v); req?.back?.focus?.(); setReq(null); };
  useEffect(() => {
    if (!req) return;
    okRef.current?.focus();
    const k = e => { if (e.key === "Escape") close(false); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {req && createPortal(
        <div className="a-modal-back" onClick={e => { if (e.target === e.currentTarget) close(false); }}>
          <div className="a-modal" role="alertdialog" aria-modal="true" aria-labelledby="a-cf-t" aria-describedby="a-cf-m">
            <span className={`a-modal-ic ${req.danger ? "danger" : ""}`}><Ic n={req.danger ? "alert" : "info"} size={22} /></span>
            <h2 id="a-cf-t">{req.title}</h2>
            <p id="a-cf-m">{req.message}</p>
            <div className="a-modal-actions">
              <button type="button" className="a-btn a-btn-secondary" onClick={() => close(false)}>{req.cancelLabel || "Annuler"}</button>
              <button type="button" ref={okRef} className={`a-btn ${req.danger ? "a-btn-danger" : "a-btn-primary"}`} onClick={() => close(true)}>{req.confirmLabel || "Confirmer"}</button>
            </div>
          </div>
        </div>, document.body)}
    </ConfirmCtx.Provider>
  );
}

/* Onglets simples (accessibles au clavier) */
export function Tabs({ tabs, value, onChange, label, small }) {
  const move = (e, i) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    onChange(n.id);
    e.currentTarget.parentElement.querySelector(`[data-tab="${n.id}"]`)?.focus();
  };
  return (
    <div className={`a-tabs${small ? " a-tabs-sm" : ""}`} role="tablist" aria-label={label}>
      {tabs.map((t, i) => (
        <button key={t.id} type="button" role="tab" data-tab={t.id} aria-selected={value === t.id} tabIndex={value === t.id ? 0 : -1}
          className={t.error ? "has-err" : ""} onClick={() => onChange(t.id)} onKeyDown={e => move(e, i)}>
          {t.icon && <Ic n={t.icon} size={16} />}{t.label}{t.dot && <span className="a-dot" aria-label="rempli" />}
        </button>
      ))}
    </div>
  );
}

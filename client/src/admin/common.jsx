/* Outils partagés de l'administration */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, ApiError } from "../lib/api.js";
import { fmt } from "../lib/format.js";

export const STATUSES = [
  { code: "nouvelle", label: "Nouvelle" },
  { code: "confirmee", label: "Confirmée" },
  { code: "en_preparation", label: "En préparation" },
  { code: "expediee", label: "Expédiée" },
  { code: "livree", label: "Livrée" },
  { code: "annulee", label: "Annulée" },
];
export const statusLabel = c => STATUSES.find(s => s.code === c)?.label || c;
export const StatusBadge = ({ s }) => <span className={`badge st-${s}`}>{statusLabel(s)}</span>;

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
    catch (e) { setState({ data: null, error: e, loading: false }); }
  }, [call, path]);
  useEffect(() => { reload(); }, [reload]);
  return { ...state, reload, setData: d => setState(s => ({ ...s, data: typeof d === "function" ? d(s.data) : d })) };
}

export const money = (v, cur) => (v == null ? "—" : fmt(v, cur));

export function Loader({ state, children }) {
  if (state.error) return <p className="alert err">{state.error.message}</p>;
  if (!state.data) return <p className="muted">Chargement…</p>;
  return children(state.data);
}

export function Field({ label, error, hint, children, required }) {
  return (
    <label className={`af${error ? " has-err" : ""}`}>
      <span className="al">{label}{required && <i> *</i>}</span>
      {children}
      {hint && <small className="ah">{hint}</small>}
      {error && <small className="ae">{error}</small>}
    </label>
  );
}

/* Message de succès / erreur temporaire */
export function useFlash() {
  const [msg, setMsg] = useState(null);
  useEffect(() => { if (!msg || msg.type === "err") return; const t = setTimeout(() => setMsg(null), 3000); return () => clearTimeout(t); }, [msg]);
  return [msg ? <p className={`alert ${msg.type}`} role={msg.type === "err" ? "alert" : "status"}>{msg.text}</p> : null, setMsg];
}

/* Nombre → texte pour un champ (null → vide) */
export const numStr = v => (v == null ? "" : String(v));

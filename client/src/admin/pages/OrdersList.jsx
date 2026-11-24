/* Liste des commandes : recherche et filtres (date, numéro, client, statut), pagination. Filtres gardés dans l'adresse. */
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fmtDate } from "../../lib/format.js";
import { Loader, money, STATUSES, StatusBadge, useLoad } from "../common.jsx";

const KEYS = ["status", "number", "q", "from", "to", "page"];

export default function OrdersList() {
  const [sp, setSp] = useSearchParams();
  const cur = Object.fromEntries(KEYS.map(k => [k, sp.get(k) || ""]));
  const [form, setForm] = useState(cur);
  useEffect(() => { setForm(Object.fromEntries(KEYS.map(k => [k, sp.get(k) || ""]))); }, [sp]);

  const qs = new URLSearchParams(Object.entries(cur).filter(([, v]) => v)).toString();
  const st = useLoad(`/orders?${qs}`);
  const apply = (e, extra = {}) => {
    e?.preventDefault();
    const next = { ...form, page: "", ...extra };
    setSp(Object.fromEntries(Object.entries(next).filter(([, v]) => v)));
  };
  const reset = () => setSp({});
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <div className="ahead"><h1>Commandes</h1><button className="btn ghost" onClick={st.reload}>Actualiser</button></div>
      <form className="filters card" onSubmit={apply}>
        <input placeholder="N° de commande" value={form.number} onChange={set("number")} />
        <input placeholder="Cliente (nom, téléphone, ville)" value={form.q} onChange={set("q")} />
        <select value={form.status} onChange={e => { set("status")(e); apply(null, { status: e.target.value }); }}>
          <option value="">Tous les statuts</option>{STATUSES.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}
        </select>
        <label className="inl">Du <input type="date" value={form.from} onChange={set("from")} /></label>
        <label className="inl">au <input type="date" value={form.to} onChange={set("to")} /></label>
        <button className="btn primary">Rechercher</button>
        {qs && <button className="btn ghost" type="button" onClick={reset}>Effacer</button>}
      </form>
      <Loader state={st}>{d => {
        const pages = Math.max(1, Math.ceil(d.total / d.limit));
        return d.orders.length ? (
          <>
            <p className="muted">{d.total} commande(s)</p>
            <div className="card tblwrap"><table className="tbl">
              <thead><tr><th>N°</th><th>Date</th><th>Cliente</th><th>Ville</th><th>Pack</th><th>Statut</th><th className="num">Total</th></tr></thead>
              <tbody>{d.orders.map(o => (
                <tr key={o.id}>
                  <td><Link to={`/admin/commandes/${o.id}`}>{o.number}</Link></td>
                  <td>{fmtDate(o.createdAt)}</td>
                  <td dir="auto">{o.customer.name}<br /><small className="muted" dir="ltr">{o.customer.phone}</small></td>
                  <td dir="auto">{o.customer.city}</td>
                  <td>{o.packSize} masques</td>
                  <td><StatusBadge s={o.status} /></td>
                  <td className="num">{money(o.total, o.currency)}</td>
                </tr>))}</tbody>
            </table></div>
            {pages > 1 && <div className="pager">
              <button className="btn ghost" disabled={d.page <= 1} onClick={() => apply(null, { ...cur, page: String(d.page - 1) })}>← Précédent</button>
              <span>Page {d.page} / {pages}</span>
              <button className="btn ghost" disabled={d.page >= pages} onClick={() => apply(null, { ...cur, page: String(d.page + 1) })}>Suivant →</button>
            </div>}
          </>
        ) : <p className="muted card">Aucune commande ne correspond.</p>;
      }}</Loader>
    </>
  );
}

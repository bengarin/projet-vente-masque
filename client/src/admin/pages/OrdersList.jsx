/* Liste des commandes : recherche et filtres (date, numéro, client, statut), pagination. Filtres gardés dans l'adresse. */
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fmtDate } from "../../lib/format.js";
import { Empty, Loader, money, PageHeader, STATUSES, StatusBadge, useLoad } from "../common.jsx";
import { Ic } from "../icons.jsx";

const KEYS = ["status", "number", "q", "from", "to", "page"];

export default function OrdersList() {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();
  const cur = Object.fromEntries(KEYS.map(k => [k, sp.get(k) || ""]));
  const [form, setForm] = useState(cur);
  const [more, setMore] = useState(!!(cur.from || cur.to || cur.number));
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
  const nbFilters = ["number", "q", "from", "to"].filter(k => cur[k]).length;

  return (
    <>
      <PageHeader title="Commandes" subtitle={st.data ? `${st.data.total} commande${st.data.total > 1 ? "s" : ""}${qs ? " correspondant aux filtres" : ""}` : " "}
        actions={<button className="a-btn a-btn-secondary" type="button" onClick={st.reload}><Ic n="refresh" size={16} />Actualiser</button>} />

      <div className="a-chips" role="group" aria-label="Filtrer par statut">
        <button type="button" aria-pressed={!cur.status} onClick={() => apply(null, { status: "" })}>Toutes</button>
        {STATUSES.map(s => (
          <button key={s.code} type="button" aria-pressed={cur.status === s.code} className={`a-chip-${s.code}`} onClick={() => apply(null, { status: s.code })}>
            <span className="a-chip-dot" />{s.label}</button>))}
      </div>

      <form className="a-filters" onSubmit={apply}>
        <label className="a-search a-grow"><Ic n="search" size={16} />
          <input placeholder="Cliente : nom, téléphone ou ville" aria-label="Rechercher une cliente" value={form.q} onChange={set("q")} /></label>
        <button type="button" className={`a-btn a-btn-secondary a-only-mobile${nbFilters ? " has-count" : ""}`} aria-expanded={more} onClick={() => setMore(m => !m)}>
          Plus de filtres{nbFilters > 0 && <span className="a-count">{nbFilters}</span>}</button>
        <div className={`a-filters-more${more ? " open" : ""}`}>
          <label className="a-search a-search-sm"><span className="a-hash">N°</span>
            <input placeholder="MPC-…" aria-label="Numéro de commande" value={form.number} onChange={set("number")} /></label>
          <label className="a-date"><span>Du</span><input type="date" value={form.from} onChange={set("from")} /></label>
          <label className="a-date"><span>Au</span><input type="date" value={form.to} onChange={set("to")} /></label>
        </div>
        <div className="a-filters-btns">
          <button className="a-btn a-btn-primary"><Ic n="search" size={16} />Rechercher</button>
          {qs && <button className="a-btn a-btn-ghost" type="button" onClick={reset}><Ic n="x" size={16} />Effacer</button>}
        </div>
      </form>

      <Loader state={st} rows={6}>{d => {
        const pages = Math.max(1, Math.ceil(d.total / d.limit));
        return d.orders.length ? (
          <>
            <div className="a-card a-table-card">
              <table className="a-table a-table-orders a-table-click">
                <thead><tr><th>Commande</th><th>Cliente</th><th>Ville</th><th>Contenu</th><th>Statut</th><th className="a-r">Total</th></tr></thead>
                <tbody>{d.orders.map(o => (
                  <tr key={o.id} onClick={e => { if (!e.target.closest("a")) navigate(`/admin/commandes/${o.id}`); }}>
                    <td className="a-cell-main"><Link className="a-strong-link" to={`/admin/commandes/${o.id}`}>{o.number}</Link><small className="a-muted a-block">{fmtDate(o.createdAt)}</small></td>
                    <td data-label="Cliente"><span dir="auto" className="a-block">{o.customer.name}</span><small className="a-muted a-block" dir="ltr">{o.customer.phone}</small></td>
                    <td data-label="Ville" dir="auto">{o.customer.city}</td>
                    <td data-label="Contenu">{o.packSize ? `Pack de ${o.packSize}` : "—"}{o.extrasCount > 0 && <small className="a-muted a-block">+ {o.extrasCount} soin{o.extrasCount > 1 ? "s" : ""}</small>}</td>
                    <td data-label="Statut"><StatusBadge s={o.status} /></td>
                    <td data-label="Total" className="a-r a-num"><b>{money(o.total, o.currency)}</b></td>
                  </tr>))}</tbody>
              </table>
            </div>
            {pages > 1 && <nav className="a-pager" aria-label="Pagination">
              <button className="a-btn a-btn-secondary" disabled={d.page <= 1} onClick={() => apply(null, { ...cur, page: String(d.page - 1) })}><Ic n="left" size={16} />Précédent</button>
              <span>Page <b>{d.page}</b> / {pages}</span>
              <button className="a-btn a-btn-secondary" disabled={d.page >= pages} onClick={() => apply(null, { ...cur, page: String(d.page + 1) })}>Suivant<Ic n="right" size={16} /></button>
            </nav>}
          </>
        ) : <div className="a-card"><Empty icon="orders" title="Aucune commande ne correspond">{qs ? <button className="a-btn a-btn-sm a-btn-secondary" type="button" onClick={reset}>Effacer les filtres</button> : "Les commandes de la boutique apparaîtront ici."}</Empty></div>;
      }}</Loader>
    </>
  );
}

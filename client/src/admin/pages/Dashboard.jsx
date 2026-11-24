/* Tableau de bord : chiffres réels calculés par le serveur */
import { Link } from "react-router-dom";
import { fmtDate } from "../../lib/format.js";
import { Loader, money, STATUSES, StatusBadge, useLoad } from "../common.jsx";

export default function Dashboard() {
  const st = useLoad("/dashboard");
  return (
    <>
      <div className="ahead"><h1>Tableau de bord</h1><button className="btn ghost" onClick={st.reload}>Actualiser</button></div>
      <Loader state={st}>{d => (
        <>
          <div className="kpis">
            <Kpi label="Commandes (total)" value={d.orders.total} sub={`${d.orders.thisMonth} ce mois-ci`} to="/admin/commandes" />
            <Kpi label="Ventes (hors annulées)" value={money(d.sales.total, d.currency)} sub={`${money(d.sales.thisMonth, d.currency)} ce mois-ci`} />
            <Kpi label="Ventes livrées" value={money(d.sales.delivered, d.currency)} sub="statut « Livrée »" />
            <Kpi label="Produits" value={d.products.total} sub={`${d.products.active} actifs · ${d.products.inactive} inactifs`} to="/admin/produits" />
          </div>
          {d.products.withoutPrice > 0 && <p className="alert warn">⚠️ {d.products.withoutPrice} produit(s) sans prix : ils ne peuvent pas être commandés (sauf si un prix fixe de pack est défini). <Link to="/admin/produits">Compléter</Link></p>}
          <div className="grid2">
            <section className="card">
              <h2>Commandes par statut</h2>
              <ul className="stlist">{STATUSES.map(s => (
                <li key={s.code}><Link to={`/admin/commandes?status=${s.code}`}><StatusBadge s={s.code} /></Link><b>{d.orders.byStatus[s.code] || 0}</b></li>))}</ul>
            </section>
            <section className="card">
              <h2>Stock bas (≤ {d.lowStockThreshold})</h2>
              {d.lowStock.length ? <ul className="stlist">{d.lowStock.map(p => (
                <li key={p.id}><Link to={`/admin/produits/${p.id}`}>{p.brand} – {p.name}</Link><b className={p.stock === 0 ? "red" : ""}>{p.stock}</b></li>))}</ul>
                : <p className="muted">Aucun produit en stock bas (les produits au stock « non suivi » ne sont pas comptés).</p>}
            </section>
          </div>
          <section className="card">
            <h2>Dernières commandes</h2>
            {d.recentOrders.length ? <table className="tbl"><thead><tr><th>N°</th><th>Date</th><th>Cliente</th><th>Statut</th><th className="num">Total</th></tr></thead>
              <tbody>{d.recentOrders.map(o => (
                <tr key={o.id}><td><Link to={`/admin/commandes/${o.id}`}>{o.number}</Link></td><td>{fmtDate(o.createdAt)}</td><td dir="auto">{o.customerName}</td>
                  <td><StatusBadge s={o.status} /></td><td className="num">{money(o.total, o.currency)}</td></tr>))}</tbody></table>
              : <p className="muted">Aucune commande pour l'instant.</p>}
          </section>
        </>
      )}</Loader>
    </>
  );
}

function Kpi({ label, value, sub, to }) {
  const inner = <><span className="kl">{label}</span><b className="kv">{value}</b><small>{sub}</small></>;
  return to ? <Link className="kpi card" to={to}>{inner}</Link> : <div className="kpi card">{inner}</div>;
}

/* Tableau de bord : chiffres réels calculés par le serveur */
import { Link } from "react-router-dom";
import { fmtDate } from "../../lib/format.js";
import { Card, Empty, Loader, money, PageHeader, STATUSES, StatusBadge, useLoad } from "../common.jsx";
import { Ic } from "../icons.jsx";

const STATUS_COLORS = { nouvelle: "#E8B923", confirmee: "#1530C8", en_preparation: "#8F72D9", expediee: "#0B7FB8", livree: "#1F8A4C", annulee: "#C2413A" };

export default function Dashboard() {
  const st = useLoad("/dashboard");
  // Vérifications de mise en vente : uniquement des lectures sur les routes existantes
  const ship = useLoad("/settings/shipping");
  const pay = useLoad("/settings/payments");
  const general = useLoad("/settings/general");
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <>
      <PageHeader title="Tableau de bord" subtitle={<span className="a-cap">{today}</span>}
        actions={<button className="a-btn a-btn-secondary" type="button" onClick={st.reload}><Ic n="refresh" size={16} />Actualiser</button>} />
      <Loader state={st} rows={6}>{d => {
        const totalSt = Math.max(1, d.orders.total);
        const checks = [
          { ok: d.products.withoutPrice === 0, label: "Prix des produits", detail: d.products.withoutPrice ? `${d.products.withoutPrice} produit(s) sans prix` : "Tous renseignés", to: "/admin/produits" },
          { ok: !!ship.data?.items.some(x => x.isActive), label: "Mode de livraison", detail: ship.data ? (ship.data.items.some(x => x.isActive) ? "Au moins un actif" : "Aucun actif") : "…", to: "/admin/parametres?onglet=livraison" },
          { ok: !!pay.data?.items.some(x => x.isActive), label: "Mode de paiement", detail: pay.data ? (pay.data.items.some(x => x.isActive) ? "Au moins un actif" : "Aucun actif") : "…", to: "/admin/parametres?onglet=paiement" },
          { ok: !!general.data?.settings.ordersEnabled, label: "Commandes ouvertes", detail: general.data ? (general.data.settings.ordersEnabled ? "Oui" : "En pause") : "…", to: "/admin/parametres" },
        ];
        const allOk = checks.every(c => c.ok);
        return (
          <>
            <div className="a-kpis">
              <Kpi icon="orders" tone="cob" label="Commandes" value={d.orders.total} sub={<><b>{d.orders.thisMonth}</b> ce mois-ci</>} to="/admin/commandes" />
              <Kpi icon="money" tone="butter" label="Ventes (hors annulées)" value={money(d.sales.total, d.currency)} sub={<><b>{money(d.sales.thisMonth, d.currency)}</b> ce mois-ci</>} />
              <Kpi icon="truck" tone="green" label="Ventes livrées" value={money(d.sales.delivered, d.currency)} sub="Commandes au statut « Livrée »" />
              <Kpi icon="products" tone="lav" label="Produits" value={d.products.total} sub={<><b>{d.products.active}</b> actifs · {d.products.inactive} inactifs</>} to="/admin/produits" />
            </div>

            {!allOk && (
              <Card title="Avant d'ouvrir les ventes" icon="alert" className="a-card-warn">
                <ul className="a-checklist">{checks.map(c => (
                  <li key={c.label} className={c.ok ? "ok" : "todo"}>
                    <span className="a-check-ic"><Ic n={c.ok ? "check" : "alert"} size={14} stroke={2.6} /></span>
                    <span className="a-grow"><b>{c.label}</b><small>{c.detail}</small></span>
                    {!c.ok && <Link className="a-btn a-btn-sm a-btn-secondary" to={c.to}>Compléter</Link>}
                  </li>))}</ul>
              </Card>
            )}

            <div className="a-grid-2">
              <Card title="Commandes par statut" icon="layers" actions={<Link className="a-link" to="/admin/commandes">Tout voir</Link>}>
                <ul className="a-bars">{STATUSES.map(s => {
                  const n = d.orders.byStatus[s.code] || 0;
                  return (
                    <li key={s.code}>
                      <Link to={`/admin/commandes?status=${s.code}`} className="a-bar-row">
                        <StatusBadge s={s.code} />
                        <span className="a-bar"><i style={{ width: `${(n / totalSt) * 100}%`, background: STATUS_COLORS[s.code] }} /></span>
                        <b className="a-num">{n}</b>
                      </Link>
                    </li>);
                })}</ul>
              </Card>
              <Card title={`Stock bas (≤ ${d.lowStockThreshold})`} icon="box" actions={<Link className="a-link" to="/admin/produits">Produits</Link>}>
                {d.lowStock.length ? <ul className="a-rows">{d.lowStock.map(p => (
                  <li key={p.id}><Link to={`/admin/produits/${p.id}`} className="a-grow a-ellipsis"><small className="a-muted">{p.brand}</small> {p.name}</Link>
                    <span className={`a-stock ${p.stock === 0 ? "zero" : "low"}`}>{p.stock === 0 ? "Épuisé" : `${p.stock} restant${p.stock > 1 ? "s" : ""}`}</span></li>))}</ul>
                  : <Empty icon="check" title="Aucun stock bas">Les produits au stock « non suivi » ne sont pas comptés.</Empty>}
              </Card>
            </div>

            <Card title="Dernières commandes" icon="history" pad={false} actions={<Link className="a-link" to="/admin/commandes">Toutes les commandes</Link>}>
              {d.recentOrders.length ? (
                <table className="a-table a-table-rows">
                  <thead><tr><th>N°</th><th>Date</th><th>Cliente</th><th>Statut</th><th className="a-r">Total</th></tr></thead>
                  <tbody>{d.recentOrders.map(o => (
                    <tr key={o.id}>
                      <td data-label="N°"><Link className="a-strong-link" to={`/admin/commandes/${o.id}`}>{o.number}</Link></td>
                      <td data-label="Date" className="a-muted">{fmtDate(o.createdAt)}</td>
                      <td data-label="Cliente" dir="auto">{o.customerName}</td>
                      <td data-label="Statut"><StatusBadge s={o.status} /></td>
                      <td data-label="Total" className="a-r a-num"><b>{money(o.total, o.currency)}</b></td>
                    </tr>))}</tbody>
                </table>
              ) : <Empty icon="orders" title="Aucune commande pour l'instant">Elles apparaîtront ici dès la première commande.</Empty>}
            </Card>
          </>
        );
      }}</Loader>
    </>
  );
}

function Kpi({ icon, tone, label, value, sub, to }) {
  const inner = <>
    <span className={`a-kpi-ic a-t-${tone}`}><Ic n={icon} size={20} /></span>
    <span className="a-kpi-label">{label}</span>
    <b className="a-kpi-value">{value}</b>
    <small className="a-kpi-sub">{sub}</small>
    {to && <Ic n="right" size={16} className="a-kpi-go" />}
  </>;
  return to ? <Link className={`a-kpi a-kpi-${tone}`} to={to}>{inner}</Link> : <div className={`a-kpi a-kpi-${tone}`}>{inner}</div>;
}

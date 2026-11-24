/* Détail d'une commande : produits, quantités, prix, livraison, total, statut, historique, note interne */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fmtDate } from "../../lib/format.js";
import { Loader, money, STATUSES, StatusBadge, statusLabel, useAdminApi, useFlash, useLoad } from "../common.jsx";

/* 06… → 2126… pour le lien WhatsApp */
const intl = p => (p.startsWith("+") ? p.slice(1) : p.startsWith("00") ? p.slice(2) : p.startsWith("0") ? "212" + p.slice(1) : p);

export default function OrderDetail() {
  const { id } = useParams();
  const st = useLoad(`/orders/${id}`);
  return (
    <>
      <div className="ahead"><h1>Commande {st.data?.order.number || ""}</h1><Link className="btn ghost" to="/admin/commandes">← Commandes</Link></div>
      <Loader state={st}>{d => <Detail o={d.order} reload={st.reload} />}</Loader>
    </>
  );
}

function Detail({ o, reload }) {
  const call = useAdminApi();
  const [flash, setFlash] = useFlash();
  const [status, setStatus] = useState(o.status);
  const [note, setNote] = useState(o.adminNote || "");
  const [busy, setBusy] = useState(false);
  useEffect(() => { setStatus(o.status); setNote(o.adminNote || ""); }, [o]);
  const c = o.customer, cur = o.currency;

  const saveStatus = async () => {
    if (status === o.status) return;
    if (status === "annulee" && !window.confirm("Annuler cette commande ? Le stock des produits suivis sera remis. Une commande annulée ne peut plus changer de statut.")) return;
    setBusy(true);
    try { await call(`/orders/${o.id}/status`, { method: "PATCH", body: { status } }); setFlash({ type: "ok", text: `Statut : ${statusLabel(status)} ✓` }); reload(); }
    catch (e) { setFlash({ type: "err", text: e.message }); setStatus(o.status); }
    finally { setBusy(false); }
  };
  const saveNote = async () => {
    try { await call(`/orders/${o.id}/note`, { method: "PATCH", body: { adminNote: note } }); setFlash({ type: "ok", text: "Note enregistrée ✓" }); }
    catch (e) { setFlash({ type: "err", text: e.message }); }
  };

  return (
    <>
      {flash}
      <div className="grid2">
        <section className="card">
          <h2>Statut</h2>
          <p><StatusBadge s={o.status} /> <span className="muted">· passée le {fmtDate(o.createdAt)} · langue {o.lang.toUpperCase()}</span></p>
          {o.status === "annulee" ? <p className="muted">Commande annulée : statut définitif.</p> : (
            <div className="inlrow">
              <select value={status} onChange={e => setStatus(e.target.value)}>{STATUSES.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}</select>
              <button className="btn primary" type="button" disabled={busy || status === o.status} onClick={saveStatus}>Mettre à jour</button>
            </div>)}
          <h3>Historique</h3>
          <ul className="hist">{o.history.map((h, i) => (
            <li key={i}><span className="muted">{fmtDate(h.at)}</span> — {h.from ? `${statusLabel(h.from)} → ` : "Création : "}<b>{statusLabel(h.to)}</b>{h.admin && <small className="muted"> ({h.admin})</small>}</li>))}</ul>
        </section>
        <section className="card">
          <h2>Livraison</h2>
          <dl className="dl">
            <dt>Nom</dt><dd dir="auto">{c.name}</dd>
            <dt>Téléphone</dt><dd dir="ltr"><a href={`tel:${c.phone}`}>{c.phone}</a> · <a href={`https://wa.me/${intl(c.phone)}`} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></dd>
            <dt>Adresse</dt><dd dir="auto" className="pre">{c.address}</dd>
            <dt>Ville</dt><dd dir="auto">{c.city}{c.cityIsOther && <small className="muted"> (saisie libre)</small>}</dd>
            {c.area && <><dt>Quartier / CP</dt><dd dir="auto">{c.area}</dd></>}
            <dt>Mode de livraison</dt><dd>{o.shipping.label}</dd>
            <dt>Paiement</dt><dd>{o.payment.label}</dd>
          </dl>
        </section>
      </div>

      <section className="card">
        <h2>Produits — pack de {o.packSize}</h2>
        <div className="tblwrap"><table className="tbl">
          <thead><tr><th></th><th>Produit</th><th className="num">Prix unitaire</th><th className="num">Qté</th><th className="num">Total ligne</th></tr></thead>
          <tbody>{o.items.map(it => (
            <tr key={it.id}>
              <td>{it.image ? <img className="thumb" src={it.image} alt="" /> : <span className="thumb empty" />}</td>
              <td><small className="muted">{it.brand}</small><br />{it.productId ? <Link to={`/admin/produits/${it.productId}`}>{it.name}</Link> : <>{it.name} <small className="muted">(produit supprimé)</small></>}</td>
              <td className="num">{money(it.unitPrice, cur)}</td><td className="num">{it.qty}</td><td className="num">{money(it.lineTotal, cur)}</td>
            </tr>))}</tbody>
        </table></div>
        <dl className="totals">
          {o.itemsTotal != null && <><dt>Total des masques</dt><dd>{money(o.itemsTotal, cur)}</dd></>}
          {o.packPrice != null && <><dt>Prix fixe du pack</dt><dd>{money(o.packPrice, cur)}</dd></>}
          <dt>Produits facturés</dt><dd>{money(o.productsTotal, cur)}</dd>
          <dt>Livraison</dt><dd>{o.shipping.fee === 0 ? "Gratuite" : money(o.shipping.fee, cur)}</dd>
          <dt className="big">Total</dt><dd className="big">{money(o.total, cur)}</dd>
        </dl>
      </section>

      <section className="card">
        <h2>Note interne</h2>
        <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Visible uniquement dans l'admin" maxLength={5000} />
        <button className="btn" type="button" onClick={saveNote}>Enregistrer la note</button>
      </section>
    </>
  );
}

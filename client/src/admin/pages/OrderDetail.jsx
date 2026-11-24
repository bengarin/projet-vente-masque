/* Détail d'une commande : produits, quantités, prix, livraison, total, statut, historique, note interne */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fmtDate } from "../../lib/format.js";
import { Card, Loader, money, PageHeader, STATUSES, StatusBadge, statusLabel, useAdminApi, useConfirm, useFlash, useLoad } from "../common.jsx";
import { Ic } from "../icons.jsx";

/* 06… → 2126… pour le lien WhatsApp */
const intl = p => (p.startsWith("+") ? p.slice(1) : p.startsWith("00") ? p.slice(2) : p.startsWith("0") ? "212" + p.slice(1) : p);
/* Ordre normal du suivi (annulée à part) */
const FLOW = ["nouvelle", "confirmee", "en_preparation", "expediee", "livree"];

export default function OrderDetail() {
  const { id } = useParams();
  const st = useLoad(`/orders/${id}`);
  const o = st.data?.order;
  return (
    <>
      <PageHeader back={{ to: "/admin/commandes", label: "Commandes" }}
        title={o ? <>Commande <span className="a-mono">{o.number}</span></> : "Commande"}
        subtitle={o ? `Passée le ${fmtDate(o.createdAt)} · pack de ${o.packSize} · langue ${o.lang.toUpperCase()}` : " "}
        actions={o && <StatusBadge s={o.status} />} />
      <Loader state={st} rows={6}>{d => <Detail o={d.order} reload={st.reload} />}</Loader>
    </>
  );
}

function Detail({ o, reload }) {
  const call = useAdminApi();
  const confirm = useConfirm();
  const [flash, setFlash] = useFlash();
  const [status, setStatus] = useState(o.status);
  const [note, setNote] = useState(o.adminNote || "");
  const [busy, setBusy] = useState(false);
  useEffect(() => { setStatus(o.status); setNote(o.adminNote || ""); }, [o]);
  const c = o.customer, cur = o.currency;
  const step = FLOW.indexOf(o.status);

  const saveStatus = async () => {
    if (status === o.status) return;
    if (status === "annulee" && !(await confirm({ title: "Annuler cette commande ?", danger: true, confirmLabel: "Annuler la commande", cancelLabel: "Retour",
      message: "Le stock des produits suivis sera remis. Une commande annulée ne peut plus changer de statut." }))) return;
    setBusy(true);
    try { await call(`/orders/${o.id}/status`, { method: "PATCH", body: { status } }); setFlash({ type: "ok", text: `Statut mis à jour : ${statusLabel(status)}.` }); reload(); }
    catch (e) { setFlash({ type: "err", text: e.message }); setStatus(o.status); }
    finally { setBusy(false); }
  };
  const saveNote = async () => {
    try { await call(`/orders/${o.id}/note`, { method: "PATCH", body: { adminNote: note } }); setFlash({ type: "ok", text: "Note enregistrée." }); }
    catch (e) { setFlash({ type: "err", text: e.message }); }
  };

  return (
    <>
      {flash}
      {/* Suivi visuel de la commande */}
      <div className={`a-card a-progress${o.status === "annulee" ? " is-cancel" : ""}`}>
        {o.status === "annulee"
          ? <p className="a-progress-cancel"><Ic n="x" size={16} />Commande annulée — statut définitif, le stock a été remis.</p>
          : <ol>{FLOW.map((s, i) => <li key={s} className={i < step ? "done" : i === step ? "now" : ""}><span className="a-step-dot">{i < step ? <Ic n="check" size={12} stroke={3} /> : i + 1}</span><span>{statusLabel(s)}</span></li>)}</ol>}
      </div>

      <div className="a-detail">
        <div className="a-detail-main">
          <Card title={`Produits — pack de ${o.packSize}`} icon="products" pad={false}>
            <table className="a-table a-table-items">
              <thead><tr><th>Produit</th><th className="a-r">Prix unitaire</th><th className="a-r">Qté</th><th className="a-r">Total</th></tr></thead>
              <tbody>{o.items.map(it => (
                <tr key={it.id}>
                  <td className="a-cell-main"><div className="a-prod">
                    {it.image ? <img className="a-thumb" src={it.image} alt="" /> : <span className="a-thumb a-thumb-empty"><Ic n="image" size={18} /></span>}
                    <span className="a-prod-txt"><small>{it.brand}</small>
                      {it.productId ? <Link to={`/admin/produits/${it.productId}`}><b>{it.name}</b></Link> : <b>{it.name} <span className="a-muted a-xs">(produit supprimé)</span></b>}</span>
                  </div></td>
                  <td data-label="Prix unitaire" className="a-r a-num">{money(it.unitPrice, cur)}</td>
                  <td data-label="Quantité" className="a-r a-num">× {it.qty}</td>
                  <td data-label="Total ligne" className="a-r a-num"><b>{money(it.lineTotal, cur)}</b></td>
                </tr>))}</tbody>
            </table>
            <dl className="a-totals">
              {o.itemsTotal != null && <><dt>Total des masques</dt><dd>{money(o.itemsTotal, cur)}</dd></>}
              {o.packPrice != null && <><dt>Prix fixe du pack</dt><dd>{money(o.packPrice, cur)}</dd></>}
              <dt>Produits facturés</dt><dd>{money(o.productsTotal, cur)}</dd>
              <dt>Livraison</dt><dd>{o.shipping.fee === 0 ? "Gratuite" : money(o.shipping.fee, cur)}</dd>
              <dt className="a-total-big">Total</dt><dd className="a-total-big">{money(o.total, cur)}</dd>
            </dl>
          </Card>

          <Card title="Note interne" icon="note">
            <textarea className="a-textarea" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Visible uniquement dans l'admin (ex. appelée le…, colis n°…)" maxLength={5000} aria-label="Note interne" />
            <div className="a-right"><button className="a-btn a-btn-secondary" type="button" onClick={saveNote} disabled={note === (o.adminNote || "")}><Ic n="check" size={16} />Enregistrer la note</button></div>
          </Card>
        </div>

        <aside className="a-detail-side">
          <Card title="Statut" icon="layers">
            {o.status === "annulee" ? <p className="a-muted">Commande annulée : statut définitif.</p> : (
              <div className="a-status-form">
                <select value={status} onChange={e => setStatus(e.target.value)} aria-label="Nouveau statut">{STATUSES.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}</select>
                <button className="a-btn a-btn-primary" type="button" disabled={busy || status === o.status} onClick={saveStatus}>{busy ? "…" : "Mettre à jour"}</button>
              </div>)}
          </Card>

          <Card title="Cliente et livraison" icon="truck">
            <div className="a-contact">
              <span className="a-avatar a-avatar-lav" aria-hidden="true">{(c.name || "?").trim().charAt(0).toUpperCase()}</span>
              <span><b dir="auto">{c.name}</b><small className="a-muted a-block" dir="ltr">{c.phone}</small></span>
            </div>
            <div className="a-contact-btns">
              <a className="a-btn a-btn-sm a-btn-secondary" href={`tel:${c.phone}`}><Ic n="phone" size={15} />Appeler</a>
              <a className="a-btn a-btn-sm a-btn-secondary" href={`https://wa.me/${intl(c.phone)}`} target="_blank" rel="noopener noreferrer"><Ic n="chat" size={15} />WhatsApp</a>
            </div>
            <dl className="a-dl">
              <dt>Adresse</dt><dd dir="auto" className="a-pre">{c.address}</dd>
              <dt>Ville</dt><dd dir="auto">{c.city}{c.cityIsOther && <span className="a-muted a-xs"> (saisie libre)</span>}</dd>
              {c.area && <><dt>Quartier / CP</dt><dd dir="auto">{c.area}</dd></>}
              <dt>Livraison</dt><dd>{o.shipping.label}</dd>
              <dt>Paiement</dt><dd>{o.payment.label}</dd>
            </dl>
          </Card>

          <Card title="Historique" icon="history">
            <ol className="a-timeline">{[...o.history].reverse().map((h, i) => (
              <li key={i}><span className={`a-tl-dot a-st-dot-${h.to}`} />
                <div><b>{h.from ? `${statusLabel(h.from)} → ${statusLabel(h.to)}` : `Création : ${statusLabel(h.to)}`}</b>
                  <small className="a-muted a-block">{fmtDate(h.at)}{h.admin ? ` · ${h.admin}` : ""}</small></div></li>))}</ol>
          </Card>
        </aside>
      </div>
    </>
  );
}

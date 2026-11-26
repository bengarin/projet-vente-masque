/* Liste des produits : recherche, filtre actif/inactif, activer/désactiver, supprimer */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Empty, Loader, money, PageHeader, useAdminApi, useConfirm, useFlash, useLoad } from "../common.jsx";
import { Ic } from "../icons.jsx";

const FILTERS = [["", "Tous"], ["active", "Actifs"], ["inactive", "Inactifs"]];

export default function ProductsList() {
  const [q, setQ] = useState(""), [qd, setQd] = useState(""), [status, setStatus] = useState("");
  useEffect(() => { const t = setTimeout(() => setQd(q), 300); return () => clearTimeout(t); }, [q]);   // attend la fin de la frappe
  const st = useLoad(`/products?q=${encodeURIComponent(qd)}&status=${status}`);
  const general = useLoad("/settings/general");
  const cur = general.data?.settings.currency;
  const call = useAdminApi();
  const confirm = useConfirm();
  const [flash, setFlash] = useFlash();

  const toggle = async p => {
    try {
      await call(`/products/${p.id}/status`, { method: "PATCH", body: { isActive: !p.isActive } });
      st.setData(d => ({ products: d.products.map(x => (x.id === p.id ? { ...x, isActive: !p.isActive } : x)) }));
      setFlash({ type: "ok", text: `${p.name} : ${p.isActive ? "désactivé (caché de la boutique)" : "activé"}.` });
    } catch (e) { setFlash({ type: "err", text: e.message }); }
  };
  const remove = async p => {
    const warn = p.orderLines ? ` Ce produit apparaît dans ${p.orderLines} ligne(s) de commande : elles garderont leur copie (nom, prix), mais le lien vers le produit sera perdu. Conseil : désactive-le plutôt.` : "";
    const ok = await confirm({ title: "Supprimer ce produit ?", message: `« ${p.brand} – ${p.name} » sera supprimé définitivement.${warn}`, confirmLabel: "Supprimer", danger: true });
    if (!ok) return;
    try { await call(`/products/${p.id}`, { method: "DELETE" }); st.reload(); setFlash({ type: "ok", text: "Produit supprimé." }); }
    catch (e) { setFlash({ type: "err", text: e.message }); }
  };

  const count = st.data?.products.length;
  return (
    <>
      {flash}
      <PageHeader title="Produits" subtitle={count != null ? `${count} produit${count > 1 ? "s" : ""}${q || status ? " trouvé" + (count > 1 ? "s" : "") : " au catalogue"}` : " "}
        actions={<Link className="a-btn a-btn-primary" to="/admin/produits/nouveau"><Ic n="plus" size={16} />Nouveau produit</Link>} />

      <div className="a-toolbar">
        <label className="a-search"><Ic n="search" size={16} /><input type="search" placeholder="Rechercher un nom, une marque…" aria-label="Rechercher" value={q} onChange={e => setQ(e.target.value)} /></label>
        <div className="a-seg" role="group" aria-label="Filtrer par statut">
          {FILTERS.map(([v, l]) => <button key={v} type="button" aria-pressed={status === v} onClick={() => setStatus(v)}>{l}</button>)}
        </div>
      </div>

      <Loader state={st}>{d => d.products.length ? (
        <div className="a-card a-table-card">
          <table className="a-table a-table-products">
            <thead><tr><th>Produit</th><th className="a-r">Prix</th><th className="a-r">Stock</th><th>Statut</th><th className="a-r">Actions</th></tr></thead>
            <tbody>{d.products.map(p => (
              <tr key={p.id} className={p.isActive ? "" : "is-off"}>
                <td className="a-cell-main">
                  <Link to={`/admin/produits/${p.id}`} className="a-prod">
                    {p.image ? <img className="a-thumb" src={p.image} alt="" /> : <span className="a-thumb a-thumb-empty"><Ic n="image" size={18} /></span>}
                    <span className="a-prod-txt"><small>{p.brand}</small><b>{p.name}</b><span className="a-muted a-xs">{p.saleMode === "unit" ? <Badge tone="warn">Soin à l'unité</Badge> : "Masque · packs"}{p.category ? ` · ${p.category}` : ""}</span></span>
                  </Link>
                </td>
                <td data-label="Prix" className="a-r a-num">{p.price == null ? <Badge tone="warn">À renseigner</Badge> : <b>{money(p.price, cur)}</b>}</td>
                <td data-label="Stock" className="a-r a-num">{p.stock == null ? <span className="a-muted" title="Stock non suivi : pas de limite">Non suivi</span>
                  : <span className={`a-stock ${p.stock === 0 ? "zero" : p.stock <= (general.data?.settings.lowStockThreshold ?? 3) ? "low" : "ok"}`}>{p.stock === 0 ? "Épuisé" : p.stock}</span>}</td>
                <td data-label="Statut"><Badge tone={p.isActive ? "ok" : "off"}>{p.isActive ? "Actif" : "Inactif"}</Badge></td>
                <td className="a-r a-cell-actions">
                  <div className="a-actions">
                    <Link className="a-btn a-btn-sm a-btn-secondary" to={`/admin/produits/${p.id}`}><Ic n="edit" size={15} />Modifier</Link>
                    <button className="a-icon-btn" type="button" title={p.isActive ? "Désactiver (cacher de la boutique)" : "Activer"} aria-label={`${p.isActive ? "Désactiver" : "Activer"} ${p.name}`} onClick={() => toggle(p)}><Ic n={p.isActive ? "eyeOff" : "eye"} size={17} /></button>
                    <button className="a-icon-btn a-icon-btn-danger" type="button" title="Supprimer" aria-label={`Supprimer ${p.name}`} onClick={() => remove(p)}><Ic n="trash" size={17} /></button>
                  </div>
                </td>
              </tr>))}</tbody>
          </table>
        </div>
      ) : <div className="a-card"><Empty icon="products" title="Aucun produit trouvé">{q || status ? "Essaie une autre recherche ou un autre filtre." : "Ajoute ton premier produit."}</Empty></div>}</Loader>
    </>
  );
}

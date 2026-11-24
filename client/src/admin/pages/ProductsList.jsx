/* Liste des produits : recherche, filtre actif/inactif, activer/désactiver, supprimer */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader, money, useAdminApi, useFlash, useLoad } from "../common.jsx";

export default function ProductsList() {
  const [q, setQ] = useState(""), [qd, setQd] = useState(""), [status, setStatus] = useState("");
  useEffect(() => { const t = setTimeout(() => setQd(q), 300); return () => clearTimeout(t); }, [q]);   // attend la fin de la frappe
  const st = useLoad(`/products?q=${encodeURIComponent(qd)}&status=${status}`);
  const general = useLoad("/settings/general");
  const cur = general.data?.settings.currency;
  const call = useAdminApi();
  const [flash, setFlash] = useFlash();

  const toggle = async p => {
    try {
      await call(`/products/${p.id}/status`, { method: "PATCH", body: { isActive: !p.isActive } });
      st.setData(d => ({ products: d.products.map(x => (x.id === p.id ? { ...x, isActive: !p.isActive } : x)) }));
      setFlash({ type: "ok", text: `${p.name} : ${p.isActive ? "désactivé (caché de la boutique)" : "activé"}.` });
    } catch (e) { setFlash({ type: "err", text: e.message }); }
  };
  const remove = async p => {
    const warn = p.orderLines ? `\n\nCe produit apparaît dans ${p.orderLines} ligne(s) de commande : elles garderont leur copie (nom, prix), mais le lien vers le produit sera perdu. Conseil : désactive-le plutôt.` : "";
    if (!window.confirm(`Supprimer définitivement « ${p.brand} – ${p.name} » ?${warn}`)) return;
    try { await call(`/products/${p.id}`, { method: "DELETE" }); st.reload(); setFlash({ type: "ok", text: "Produit supprimé." }); }
    catch (e) { setFlash({ type: "err", text: e.message }); }
  };

  return (
    <>
      <div className="ahead"><h1>Produits</h1><Link className="btn primary" to="/admin/produits/nouveau">+ Nouveau produit</Link></div>
      {flash}
      <div className="filters card">
        <input type="search" placeholder="Rechercher (nom, marque)…" value={q} onChange={e => setQ(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Tous</option><option value="active">Actifs</option><option value="inactive">Inactifs</option>
        </select>
      </div>
      <Loader state={st}>{d => d.products.length ? (
        <div className="card tblwrap"><table className="tbl">
          <thead><tr><th></th><th>Produit</th><th className="num">Prix</th><th className="num">Stock</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>{d.products.map(p => (
            <tr key={p.id} className={p.isActive ? "" : "off"}>
              <td>{p.image ? <img className="thumb" src={p.image} alt="" /> : <span className="thumb empty" />}</td>
              <td><Link to={`/admin/produits/${p.id}`}><small className="muted">{p.brand}</small><br />{p.name}</Link>{p.category && <><br /><small className="muted">{p.category}</small></>}</td>
              <td className="num">{p.price == null ? <span className="badge warn">À renseigner</span> : money(p.price, cur)}</td>
              <td className="num">{p.stock == null ? <span className="muted" title="Stock non suivi : pas de limite">non suivi</span> : <b className={p.stock === 0 ? "red" : ""}>{p.stock}</b>}</td>
              <td><span className={`badge ${p.isActive ? "ok" : "off"}`}>{p.isActive ? "Actif" : "Inactif"}</span></td>
              <td className="acts">
                <Link className="btn small" to={`/admin/produits/${p.id}`}>Modifier</Link>
                <button className="btn small ghost" type="button" onClick={() => toggle(p)}>{p.isActive ? "Désactiver" : "Activer"}</button>
                <button className="btn small danger" type="button" onClick={() => remove(p)}>Supprimer</button>
              </td>
            </tr>))}</tbody>
        </table></div>
      ) : <p className="muted card">Aucun produit trouvé.</p>}</Loader>
    </>
  );
}

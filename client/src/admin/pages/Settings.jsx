/* Paramètres : boutique, tailles et prix des packs, modes de livraison, modes de paiement, catégories */
import { useEffect, useState } from "react";
import { Field, Loader, money, numStr, useAdminApi, useFlash, useLoad } from "../common.jsx";

export default function Settings() {
  const general = useLoad("/settings/general");
  const cur = general.data?.settings.currency || "";
  return (
    <>
      <div className="ahead"><h1>Paramètres</h1></div>
      <General st={general} />
      <PackSizes cur={cur} />
      <MethodList title="Modes de livraison" path="/settings/shipping" cur={cur} kind="shipping"
        help="Frais en dirhams. « Gratuit dès » = livraison offerte à partir de ce montant de produits (vide = jamais). Sans mode actif, la boutique refuse les commandes." />
      <MethodList title="Modes de paiement" path="/settings/payments" kind="payment"
        help="Libellés affichés au checkout (ex. paiement à la livraison). Aucun paiement en ligne n'est branché : c'est une information pour toi et la cliente." />
      <MethodList title="Catégories" path="/settings/categories" kind="category" help="Utilisées pour classer les produits dans l'admin." />
    </>
  );
}

function General({ st }) {
  const call = useAdminApi();
  const [f, setF] = useState(null);
  const [errs, setErrs] = useState({});
  const [flash, setFlash] = useFlash();
  useEffect(() => { if (st.data) setF(st.data.settings); }, [st.data]);
  const save = async e => {
    e.preventDefault();
    try { const r = await call("/settings/general", { method: "PUT", body: f }); st.setData(r); setErrs({}); setFlash({ type: "ok", text: "Paramètres enregistrés ✓" }); }
    catch (e2) { setErrs(e2.fields || {}); setFlash({ type: "err", text: e2.message }); }
  };
  return (
    <section className="card">
      <h2>Boutique</h2>{flash}
      <Loader state={st}>{() => f && (
        <form onSubmit={save} noValidate>
          <div className="row">
            <Field label="Nom de la boutique" error={errs.storeName} required><input value={f.storeName} onChange={e => setF({ ...f, storeName: e.target.value })} /></Field>
            <Field label="Devise affichée" error={errs.currency} required><input value={f.currency} onChange={e => setF({ ...f, currency: e.target.value })} maxLength={10} /></Field>
            <Field label="Seuil « stock bas »" error={errs.lowStockThreshold}><input type="number" min="0" value={f.lowStockThreshold} onChange={e => setF({ ...f, lowStockThreshold: e.target.value })} /></Field>
          </div>
          <label className="check"><input type="checkbox" checked={f.ordersEnabled} onChange={e => setF({ ...f, ordersEnabled: e.target.checked })} /> Commandes ouvertes (décocher pour mettre la boutique en pause)</label>
          <button className="btn primary">Enregistrer</button>
        </form>)}</Loader>
    </section>
  );
}

function PackSizes({ cur }) {
  const st = useLoad("/settings/pack-sizes");
  const call = useAdminApi();
  const [flash, setFlash] = useFlash();
  const [rows, setRows] = useState([]);
  const [add, setAdd] = useState({ size: "", price: "" });
  useEffect(() => { if (st.data) setRows(st.data.items.map(r => ({ ...r, price: numStr(r.price) }))); }, [st.data]);
  const upd = (i, k, v) => setRows(r => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const save = async r => {
    try { await call(`/settings/pack-sizes/${r.size}`, { method: "PUT", body: { price: r.price === "" ? null : r.price, isActive: r.isActive } }); setFlash({ type: "ok", text: `Pack de ${r.size} enregistré ✓` }); st.reload(); }
    catch (e) { setFlash({ type: "err", text: e.fields?.price || e.message }); }
  };
  const create = async e => {
    e.preventDefault();
    try { await call("/settings/pack-sizes", { method: "POST", body: { size: add.size, price: add.price === "" ? null : add.price, isActive: true } }); setAdd({ size: "", price: "" }); st.reload(); setFlash({ type: "ok", text: "Taille ajoutée ✓" }); }
    catch (e2) { setFlash({ type: "err", text: Object.values(e2.fields || {})[0] || e2.message }); }
  };
  const del = async r => {
    if (!window.confirm(`Supprimer le pack de ${r.size} ? (les commandes passées ne changent pas)`)) return;
    try { await call(`/settings/pack-sizes/${r.size}`, { method: "DELETE" }); st.reload(); } catch (e) { setFlash({ type: "err", text: e.message }); }
  };
  return (
    <section className="card">
      <h2>Tailles et prix des packs</h2>
      <p className="muted">Prix vide = le prix du pack est la somme des prix unitaires des masques choisis. Un prix rempli = prix fixe du pack.</p>
      {flash}
      <Loader state={st}>{() => (
        <>
          <div className="tblwrap"><table className="tbl">
            <thead><tr><th>Pack</th><th>Prix fixe ({cur})</th><th>Actif</th><th></th></tr></thead>
            <tbody>{rows.map((r, i) => (
              <tr key={r.size}><td><b>{r.size} masques</b></td>
                <td><input inputMode="decimal" value={r.price} placeholder="somme des prix" onChange={e => upd(i, "price", e.target.value)} /></td>
                <td><input type="checkbox" checked={r.isActive} onChange={e => upd(i, "isActive", e.target.checked)} /></td>
                <td className="acts"><button className="btn small primary" type="button" onClick={() => save(r)}>Enregistrer</button>
                  <button className="btn small danger" type="button" onClick={() => del(r)}>Supprimer</button></td></tr>))}</tbody>
          </table></div>
          <form className="inlrow" onSubmit={create}>
            <input type="number" min="1" max="12" placeholder="Taille (1–12)" value={add.size} onChange={e => setAdd({ ...add, size: e.target.value })} />
            <input inputMode="decimal" placeholder="Prix fixe (facultatif)" value={add.price} onChange={e => setAdd({ ...add, price: e.target.value })} />
            <button className="btn">+ Ajouter une taille</button>
          </form>
        </>)}</Loader>
    </section>
  );
}

/* Champs selon le type de liste */
const SPECS = {
  shipping: { empty: { labelFr: "", labelAr: "", labelEn: "", delayFr: "", delayAr: "", delayEn: "", fee: "", freeFrom: "", isActive: true, sortOrder: 0 },
    from: x => ({ labelFr: x.label.fr || "", labelAr: x.label.ar || "", labelEn: x.label.en || "", delayFr: x.delay?.fr || "", delayAr: x.delay?.ar || "", delayEn: x.delay?.en || "",
      fee: numStr(x.fee), freeFrom: numStr(x.freeFrom), isActive: x.isActive, sortOrder: x.sortOrder }),
    fields: [["labelFr", "Nom (FR)", true], ["labelAr", "Nom (AR)"], ["labelEn", "Nom (EN)"], ["delayFr", "Délai (FR)"], ["delayAr", "Délai (AR)"], ["delayEn", "Délai (EN)"], ["fee", "Frais (DH)", true], ["freeFrom", "Gratuit dès (DH)"]],
    summary: (x, cur) => `${x.label.fr} — ${x.fee === 0 ? "gratuit" : money(x.fee, cur)}${x.freeFrom != null ? ` · gratuit dès ${money(x.freeFrom, cur)}` : ""}` },
  payment: { empty: { labelFr: "", labelAr: "", labelEn: "", isActive: true, sortOrder: 0 },
    from: x => ({ labelFr: x.label.fr || "", labelAr: x.label.ar || "", labelEn: x.label.en || "", isActive: x.isActive, sortOrder: x.sortOrder }),
    fields: [["labelFr", "Nom (FR)", true], ["labelAr", "Nom (AR)"], ["labelEn", "Nom (EN)"]],
    summary: x => x.label.fr },
  category: { empty: { slug: "", nameFr: "", nameAr: "", nameEn: "", sortOrder: 0 }, noActive: true,
    from: x => ({ slug: x.slug, nameFr: x.name.fr || "", nameAr: x.name.ar || "", nameEn: x.name.en || "", sortOrder: x.sortOrder }),
    fields: [["nameFr", "Nom (FR)", true], ["nameAr", "Nom (AR)"], ["nameEn", "Nom (EN)"], ["slug", "Identifiant (ex. soins-visage)", true]],
    summary: x => `${x.name.fr} (${x.slug})` },
};

function MethodList({ title, path, kind, help, cur }) {
  const spec = SPECS[kind];
  const st = useLoad(path);
  const call = useAdminApi();
  const [flash, setFlash] = useFlash();
  const [edit, setEdit] = useState(null);     // { id|null, f, errs }
  const save = async e => {
    e.preventDefault();
    const body = { ...edit.f };
    for (const k of ["fee", "freeFrom"]) if (k in body && body[k] === "") body[k] = k === "fee" ? "" : null;
    try {
      await call(edit.id ? `${path}/${edit.id}` : path, { method: edit.id ? "PUT" : "POST", body });
      setEdit(null); st.reload(); setFlash({ type: "ok", text: "Enregistré ✓" });
    } catch (e2) { setEdit(x => ({ ...x, errs: e2.fields || {} })); setFlash({ type: "err", text: e2.message }); }
  };
  const del = async x => {
    if (!window.confirm("Supprimer cet élément ? (Les commandes passées gardent leur copie.) Conseil : décoche « Actif » pour seulement le cacher.")) return;
    try { await call(`${path}/${x.id}`, { method: "DELETE" }); st.reload(); } catch (e) { setFlash({ type: "err", text: e.message }); }
  };
  return (
    <section className="card">
      <div className="ahead sm"><h2>{title}</h2>{!edit && <button className="btn" type="button" onClick={() => setEdit({ id: null, f: spec.empty, errs: {} })}>+ Ajouter</button>}</div>
      <p className="muted">{help}</p>
      {flash}
      {edit && (
        <form className="subform" onSubmit={save} noValidate>
          <div className="row3">{spec.fields.map(([k, label, req]) => (
            <Field key={k} label={label} required={req} error={edit.errs[k]}>
              <input value={edit.f[k]} dir={k.endsWith("Ar") ? "rtl" : undefined} inputMode={["fee", "freeFrom"].includes(k) ? "decimal" : undefined}
                onChange={e => setEdit(x => ({ ...x, f: { ...x.f, [k]: e.target.value } }))} /></Field>))}
            <Field label="Ordre" error={edit.errs.sortOrder}><input type="number" value={edit.f.sortOrder} onChange={e => setEdit(x => ({ ...x, f: { ...x.f, sortOrder: e.target.value } }))} /></Field>
          </div>
          {!spec.noActive && <label className="check"><input type="checkbox" checked={edit.f.isActive} onChange={e => setEdit(x => ({ ...x, f: { ...x.f, isActive: e.target.checked } }))} /> Actif (proposé aux clientes)</label>}
          <div className="inlrow"><button className="btn primary">Enregistrer</button><button className="btn ghost" type="button" onClick={() => setEdit(null)}>Annuler</button></div>
        </form>)}
      <Loader state={st}>{d => d.items.length ? (
        <ul className="mlist">{d.items.map(x => (
          <li key={x.id} className={x.isActive === false ? "off" : ""}>
            <span>{spec.summary(x, cur)}{x.isActive === false && <span className="badge off">Inactif</span>}</span>
            <span className="acts"><button className="btn small" type="button" onClick={() => setEdit({ id: x.id, f: spec.from(x), errs: {} })}>Modifier</button>
              <button className="btn small danger" type="button" onClick={() => del(x)}>Supprimer</button></span>
          </li>))}</ul>
      ) : <p className="alert warn">Rien de configuré pour l'instant.</p>}</Loader>
    </section>
  );
}

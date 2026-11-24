/* Paramètres : boutique, tailles et prix des packs, modes de livraison, modes de paiement, catégories */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge, Card, Empty, Field, Loader, money, numStr, PageHeader, Switch, Tabs, useAdminApi, useConfirm, useFlash, useLoad } from "../common.jsx";
import { Ic } from "../icons.jsx";

const TABS = [
  { id: "boutique", label: "Boutique", icon: "store" },
  { id: "packs", label: "Packs", icon: "layers" },
  { id: "livraison", label: "Livraison", icon: "truck" },
  { id: "paiement", label: "Paiement", icon: "card" },
  { id: "categories", label: "Catégories", icon: "tag" },
];

export default function Settings() {
  const [sp, setSp] = useSearchParams();
  const tab = TABS.some(t => t.id === sp.get("onglet")) ? sp.get("onglet") : "boutique";
  const general = useLoad("/settings/general");
  const cur = general.data?.settings.currency || "";
  return (
    <>
      <PageHeader title="Paramètres" subtitle="Tout ce qui est affiché aux clientes et utilisé pour calculer les commandes." />
      <div className="a-tabs-scroll"><Tabs label="Sections des paramètres" tabs={TABS} value={tab} onChange={id => setSp(id === "boutique" ? {} : { onglet: id })} /></div>
      <div role="tabpanel">
        {tab === "boutique" && <General st={general} />}
        {tab === "packs" && <PackSizes cur={cur} />}
        {tab === "livraison" && <MethodList title="Modes de livraison" icon="truck" path="/settings/shipping" cur={cur} kind="shipping"
          help="Frais en dirhams. « Gratuit dès » = livraison offerte à partir de ce montant de produits (vide = jamais). Sans mode actif, la boutique refuse les commandes." />}
        {tab === "paiement" && <MethodList title="Modes de paiement" icon="card" path="/settings/payments" kind="payment"
          help="Libellés affichés au checkout (ex. paiement à la livraison). Aucun paiement en ligne n'est branché : c'est une information pour toi et la cliente." />}
        {tab === "categories" && <MethodList title="Catégories" icon="tag" path="/settings/categories" kind="category" help="Utilisées pour classer les produits dans l'admin." />}
      </div>
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
    try { const r = await call("/settings/general", { method: "PUT", body: f }); st.setData(r); setErrs({}); setFlash({ type: "ok", text: "Paramètres enregistrés." }); }
    catch (e2) { setErrs(e2.fields || {}); setFlash({ type: "err", text: e2.message }); }
  };
  return (
    <>
      {flash}
      <Loader state={st}>{() => f && (
        <form onSubmit={save} noValidate className="a-stack">
          <Card title="Ventes" icon="orders" className={f.ordersEnabled ? "" : "a-card-warn"}>
            <Switch checked={f.ordersEnabled} onChange={e => setF({ ...f, ordersEnabled: e.target.checked })}
              label="Commandes ouvertes" hint={f.ordersEnabled ? "Les clientes peuvent commander." : "Boutique en pause : les commandes sont refusées."} />
          </Card>
          <Card title="Informations de la boutique" icon="store">
            <div className="a-fgrid a-fgrid-3">
              <Field label="Nom de la boutique" error={errs.storeName} required><input value={f.storeName} onChange={e => setF({ ...f, storeName: e.target.value })} /></Field>
              <Field label="Devise affichée" error={errs.currency} required hint="Ex. DH"><input value={f.currency} onChange={e => setF({ ...f, currency: e.target.value })} maxLength={10} /></Field>
              <Field label="Seuil « stock bas »" error={errs.lowStockThreshold} hint="Alerte au tableau de bord"><input type="number" min="0" value={f.lowStockThreshold} onChange={e => setF({ ...f, lowStockThreshold: e.target.value })} /></Field>
            </div>
          </Card>
          <div className="a-right"><button className="a-btn a-btn-primary"><Ic n="check" size={16} />Enregistrer</button></div>
        </form>)}</Loader>
    </>
  );
}

function PackSizes({ cur }) {
  const st = useLoad("/settings/pack-sizes");
  const call = useAdminApi();
  const confirm = useConfirm();
  const [flash, setFlash] = useFlash();
  const [rows, setRows] = useState([]);
  const [add, setAdd] = useState({ size: "", price: "" });
  useEffect(() => { if (st.data) setRows(st.data.items.map(r => ({ ...r, price: numStr(r.price) }))); }, [st.data]);
  const upd = (i, k, v) => setRows(r => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const changed = r => { const o = st.data?.items.find(x => x.size === r.size); return o && (numStr(o.price) !== r.price || o.isActive !== r.isActive); };
  const save = async r => {
    try { await call(`/settings/pack-sizes/${r.size}`, { method: "PUT", body: { price: r.price === "" ? null : r.price, isActive: r.isActive } }); setFlash({ type: "ok", text: `Pack de ${r.size} enregistré.` }); st.reload(); }
    catch (e) { setFlash({ type: "err", text: e.fields?.price || e.message }); }
  };
  const create = async e => {
    e.preventDefault();
    try { await call("/settings/pack-sizes", { method: "POST", body: { size: add.size, price: add.price === "" ? null : add.price, isActive: true } }); setAdd({ size: "", price: "" }); st.reload(); setFlash({ type: "ok", text: "Taille ajoutée." }); }
    catch (e2) { setFlash({ type: "err", text: Object.values(e2.fields || {})[0] || e2.message }); }
  };
  const del = async r => {
    if (!(await confirm({ title: `Supprimer le pack de ${r.size} ?`, message: "Il ne sera plus proposé. Les commandes passées ne changent pas.", confirmLabel: "Supprimer", danger: true }))) return;
    try { await call(`/settings/pack-sizes/${r.size}`, { method: "DELETE" }); st.reload(); } catch (e) { setFlash({ type: "err", text: e.message }); }
  };
  return (
    <>
      {flash}
      <Card title="Tailles et prix des packs" icon="layers">
        <p className="a-help"><Ic n="info" size={15} />Prix vide = le prix du pack est la somme des prix unitaires des masques choisis. Prix rempli = prix fixe du pack.</p>
        <Loader state={st}>{() => (
          <>
            <div className="a-packs">{rows.map((r, i) => (
              <div key={r.size} className={`a-pack${r.isActive ? "" : " is-off"}`}>
                <div className="a-pack-n"><b>{r.size}</b><span>masques</span></div>
                <Field label="Prix fixe" className="a-pack-price">
                  <span className="a-input-wrap a-has-suffix"><input inputMode="decimal" value={r.price} placeholder="Somme des prix" onChange={e => upd(i, "price", e.target.value)} /><span className="a-suffix">{cur}</span></span></Field>
                <Switch checked={r.isActive} onChange={e => upd(i, "isActive", e.target.checked)} label={r.isActive ? "Proposé" : "Masqué"} />
                <div className="a-actions">
                  <button className="a-btn a-btn-sm a-btn-primary" type="button" disabled={!changed(r)} onClick={() => save(r)}>Enregistrer</button>
                  <button className="a-icon-btn a-icon-btn-danger" type="button" aria-label={`Supprimer le pack de ${r.size}`} title="Supprimer" onClick={() => del(r)}><Ic n="trash" size={17} /></button>
                </div>
              </div>))}</div>
            <form className="a-inline-form" onSubmit={create}>
              <span className="a-inline-title"><Ic n="plus" size={16} />Nouvelle taille</span>
              <input type="number" min="1" max="12" placeholder="Taille (1–12)" aria-label="Taille du pack" value={add.size} onChange={e => setAdd({ ...add, size: e.target.value })} />
              <input inputMode="decimal" placeholder={`Prix fixe en ${cur || "DH"} (facultatif)`} aria-label="Prix fixe" value={add.price} onChange={e => setAdd({ ...add, price: e.target.value })} />
              <button className="a-btn a-btn-secondary">Ajouter</button>
            </form>
          </>)}</Loader>
      </Card>
    </>
  );
}

/* Champs selon le type de liste */
const SPECS = {
  shipping: { empty: { labelFr: "", labelAr: "", labelEn: "", delayFr: "", delayAr: "", delayEn: "", fee: "", freeFrom: "", isActive: true, sortOrder: 0 },
    from: x => ({ labelFr: x.label.fr || "", labelAr: x.label.ar || "", labelEn: x.label.en || "", delayFr: x.delay?.fr || "", delayAr: x.delay?.ar || "", delayEn: x.delay?.en || "",
      fee: numStr(x.fee), freeFrom: numStr(x.freeFrom), isActive: x.isActive, sortOrder: x.sortOrder }),
    groups: [["Nom affiché", [["labelFr", "Français", true], ["labelAr", "العربية"], ["labelEn", "English"]]],
      ["Délai (facultatif)", [["delayFr", "Français"], ["delayAr", "العربية"], ["delayEn", "English"]]],
      ["Tarif", [["fee", "Frais", true, true], ["freeFrom", "Gratuit dès", false, true]]]],
    title: x => x.label.fr,
    meta: (x, cur) => <>{x.fee === 0 ? <Badge tone="ok">Gratuit</Badge> : <b>{money(x.fee, cur)}</b>}{x.freeFrom != null && <span className="a-muted"> · gratuit dès {money(x.freeFrom, cur)}</span>}{x.delay?.fr && <span className="a-muted"> · {x.delay.fr}</span>}</> },
  payment: { empty: { labelFr: "", labelAr: "", labelEn: "", isActive: true, sortOrder: 0 },
    from: x => ({ labelFr: x.label.fr || "", labelAr: x.label.ar || "", labelEn: x.label.en || "", isActive: x.isActive, sortOrder: x.sortOrder }),
    groups: [["Nom affiché", [["labelFr", "Français", true], ["labelAr", "العربية"], ["labelEn", "English"]]]],
    title: x => x.label.fr, meta: x => <span className="a-muted">{[x.label.ar, x.label.en].filter(Boolean).join(" · ") || "Traductions non renseignées"}</span> },
  category: { empty: { slug: "", nameFr: "", nameAr: "", nameEn: "", sortOrder: 0 }, noActive: true,
    from: x => ({ slug: x.slug, nameFr: x.name.fr || "", nameAr: x.name.ar || "", nameEn: x.name.en || "", sortOrder: x.sortOrder }),
    groups: [["Nom", [["nameFr", "Français", true], ["nameAr", "العربية"], ["nameEn", "English"]]], ["Identifiant", [["slug", "Ex. soins-visage", true]]]],
    title: x => x.name.fr, meta: x => <span className="a-muted a-mono">{x.slug}</span> },
};

function MethodList({ title, icon, path, kind, help, cur }) {
  const spec = SPECS[kind];
  const st = useLoad(path);
  const call = useAdminApi();
  const confirm = useConfirm();
  const [flash, setFlash] = useFlash();
  const [edit, setEdit] = useState(null);     // { id|null, f, errs }
  const save = async e => {
    e.preventDefault();
    const body = { ...edit.f };
    for (const k of ["fee", "freeFrom"]) if (k in body && body[k] === "") body[k] = k === "fee" ? "" : null;
    try {
      await call(edit.id ? `${path}/${edit.id}` : path, { method: edit.id ? "PUT" : "POST", body });
      setEdit(null); st.reload(); setFlash({ type: "ok", text: "Enregistré." });
    } catch (e2) { setEdit(x => ({ ...x, errs: e2.fields || {} })); setFlash({ type: "err", text: e2.message }); }
  };
  const del = async x => {
    if (!(await confirm({ title: "Supprimer cet élément ?", message: "Les commandes passées gardent leur copie. Conseil : désactive-le plutôt pour seulement le cacher.", confirmLabel: "Supprimer", danger: true }))) return;
    try { await call(`${path}/${x.id}`, { method: "DELETE" }); st.reload(); } catch (e) { setFlash({ type: "err", text: e.message }); }
  };
  const setField = k => e => setEdit(x => ({ ...x, f: { ...x.f, [k]: e.target.value } }));

  return (
    <>
      {flash}
      <Card title={title} icon={icon} actions={!edit && <button className="a-btn a-btn-sm a-btn-primary" type="button" onClick={() => setEdit({ id: null, f: spec.empty, errs: {} })}><Ic n="plus" size={15} />Ajouter</button>}>
        <p className="a-help"><Ic n="info" size={15} />{help}</p>
        {edit && (
          <form className="a-subform" onSubmit={save} noValidate>
            <h3 className="a-subform-title">{edit.id ? "Modifier" : "Nouvel élément"}</h3>
            {spec.groups.map(([g, fields]) => (
              <fieldset key={g} className="a-fieldset"><legend>{g}</legend>
                <div className="a-fgrid a-fgrid-3">{fields.map(([k, label, req, isMoney]) => (
                  <Field key={k} label={label} required={req} error={edit.errs[k]}>
                    {isMoney ? <span className="a-input-wrap a-has-suffix"><input value={edit.f[k]} inputMode="decimal" onChange={setField(k)} /><span className="a-suffix">{cur || "DH"}</span></span>
                      : <input value={edit.f[k]} dir={k.endsWith("Ar") ? "rtl" : undefined} className={k === "slug" ? "a-mono" : undefined} onChange={setField(k)} />}
                  </Field>))}</div>
              </fieldset>))}
            <div className="a-fgrid a-fgrid-3">
              <Field label="Ordre d'affichage" error={edit.errs.sortOrder}><input type="number" value={edit.f.sortOrder} onChange={setField("sortOrder")} /></Field>
              {!spec.noActive && <div className="a-field a-field-switch"><Switch checked={edit.f.isActive} onChange={e => setEdit(x => ({ ...x, f: { ...x.f, isActive: e.target.checked } }))} label="Actif" hint="Proposé aux clientes" /></div>}
            </div>
            <div className="a-right"><button className="a-btn a-btn-ghost" type="button" onClick={() => setEdit(null)}>Annuler</button><button className="a-btn a-btn-primary"><Ic n="check" size={16} />Enregistrer</button></div>
          </form>)}
        <Loader state={st}>{d => d.items.length ? (
          <ul className="a-list">{d.items.map(x => (
            <li key={x.id} className={x.isActive === false ? "is-off" : ""}>
              <span className="a-grow"><b className="a-block">{spec.title(x)}{x.isActive === false && <Badge tone="off">Inactif</Badge>}</b><span className="a-list-meta">{spec.meta(x, cur)}</span></span>
              <span className="a-actions">
                <button className="a-btn a-btn-sm a-btn-secondary" type="button" onClick={() => setEdit({ id: x.id, f: spec.from(x), errs: {} })}><Ic n="edit" size={15} />Modifier</button>
                <button className="a-icon-btn a-icon-btn-danger" type="button" aria-label={`Supprimer ${spec.title(x)}`} title="Supprimer" onClick={() => del(x)}><Ic n="trash" size={17} /></button>
              </span>
            </li>))}</ul>
        ) : !edit && <Empty icon="alert" title="Rien de configuré pour l'instant">Clique sur « Ajouter » pour créer le premier.</Empty>}</Loader>
      </Card>
    </>
  );
}

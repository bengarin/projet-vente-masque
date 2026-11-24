/* Création / modification d'un produit + gestion des photos */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Field, numStr, PageHeader, Switch, Tabs, useAdminApi, useConfirm, useFlash, useLoad } from "../common.jsx";
import { Ic } from "../icons.jsx";

const TAPES = [["ging", "Vichy jaune"], ["dots", "Pois lavande"], ["grid", "Quadrillé bleu"], ["ydots", "Pois jaunes"], ["checkl", "Damier lavande"], ["check", "Damier bleu"]];
const LANGS = [["Fr", "Français"], ["Ar", "العربية"], ["En", "English"]];
const EMPTY = { brand: "", name: "", slug: "", categoryId: "", price: "", stock: "", isActive: true, tape: "ging", videoUrl: "", sortOrder: 0,
  descriptionFr: "", descriptionAr: "", descriptionEn: "", usageFr: "", usageAr: "", usageEn: "", packMentions: "" };

const fromProduct = p => ({
  brand: p.brand, name: p.name, slug: p.slug, categoryId: p.categoryId ?? "", price: numStr(p.price), stock: numStr(p.stock),
  isActive: p.isActive, tape: p.tape, videoUrl: p.raw.videoUrl || "", sortOrder: p.raw.sortOrder,
  descriptionFr: p.raw.descriptionFr || "", descriptionAr: p.raw.descriptionAr || "", descriptionEn: p.raw.descriptionEn || "",
  usageFr: p.raw.usageFr || "", usageAr: p.raw.usageAr || "", usageEn: p.raw.usageEn || "", packMentions: p.raw.packMentions || "",
});

/* Vérification rapide côté navigateur (le serveur revérifie tout) */
function localCheck(f) {
  const e = {};
  if (!f.brand.trim()) e.brand = "Marque obligatoire.";
  if (!f.name.trim()) e.name = "Nom obligatoire.";
  if (f.price !== "" && !/^\d+([.,]\d{1,2})?$/.test(String(f.price).trim())) e.price = "Montant invalide (ex. 25 ou 25.50).";
  if (f.stock !== "" && !/^\d+$/.test(String(f.stock).trim())) e.stock = "Nombre entier positif, ou vide = non suivi.";
  if (f.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.slug)) e.slug = "Lettres minuscules, chiffres et tirets uniquement.";
  if (f.videoUrl && !/^(https:\/\/|\/)/.test(f.videoUrl)) e.videoUrl = "Lien https://… ou chemin /…";
  return e;
}

export default function ProductForm() {
  const { id } = useParams();
  const isNew = !id;
  const call = useAdminApi();
  const navigate = useNavigate();
  const cats = useLoad("/settings/categories");
  const general = useLoad("/settings/general");
  const [f, setF] = useState(EMPTY);
  const [product, setProduct] = useState(null);
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [loadErr, setLoadErr] = useState(null);
  const [flash, setFlash] = useFlash();
  const [descLang, setDescLang] = useState("Fr");
  const [useLang, setUseLang] = useState("Fr");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (isNew) { setF(EMPTY); setProduct(null); return; }
    call(`/products/${id}`).then(r => { setProduct(r.product); setF(fromProduct(r.product)); }).catch(setLoadErr);
  }, [id, isNew, call]);

  const set = k => e => { setDirty(true); const v = e.target.type === "checkbox" ? e.target.checked : e.target.value; setF(x => ({ ...x, [k]: v })); if (errs[k]) setErrs(x => ({ ...x, [k]: "" })); };
  const fp = k => ({ value: f[k], onChange: set(k), "aria-invalid": errs[k] ? "true" : undefined });

  const save = async e => {
    e.preventDefault();
    const local = localCheck(f);
    setErrs(local);
    if (Object.keys(local).length) return setFlash({ type: "err", text: "Corrige les champs en rouge." });
    setBusy(true);
    const body = { ...f, slug: f.slug || undefined, categoryId: f.categoryId === "" ? null : Number(f.categoryId),
      price: f.price === "" ? null : f.price, stock: f.stock === "" ? null : Number(f.stock), sortOrder: Number(f.sortOrder) || 0 };
    try {
      const r = await call(isNew ? "/products" : `/products/${id}`, { method: isNew ? "POST" : "PUT", body });
      setDirty(false);
      if (isNew) { navigate(`/admin/produits/${r.product.id}`, { replace: true }); return; }
      setProduct(r.product); setF(fromProduct(r.product));
      setFlash({ type: "ok", text: "Produit enregistré." });
    } catch (e2) {
      setErrs(e2.fields || {}); setFlash({ type: "err", text: e2.message });
    } finally { setBusy(false); }
  };

  if (loadErr) return <div className="a-alert a-alert-err"><Ic n="alert" /><span>{loadErr.message}</span><Link className="a-btn a-btn-sm a-btn-secondary" to="/admin/produits">Retour</Link></div>;
  if (!isNew && !product) return <div className="a-skel"><span /><span /><span /><span /></div>;
  const cur = general.data?.settings.currency || "";
  const langTabs = (base, value) => LANGS.map(([k, l]) => ({ id: k, label: l, dot: !!f[base + k].trim(), error: !!errs[base + k] }));

  return (
    <>
      {flash}
      <PageHeader back={{ to: "/admin/produits", label: "Produits" }}
        title={isNew ? "Nouveau produit" : product.name}
        subtitle={isNew ? "Renseigne les informations imprimées sur l'emballage." : <>{product.brand} · <span className="a-mono">/{product.slug}</span></>}
        actions={!isNew && <span className={`a-badge a-tone-${f.isActive ? "ok" : "off"}`}>{f.isActive ? "Actif" : "Inactif"}</span>} />

      <form className="a-form-layout" onSubmit={save} noValidate>
        <div className="a-form-main">
          <Card title="Identité" icon="tag">
            <div className="a-fgrid">
              <Field label="Marque" hint="Telle qu'imprimée sur l'emballage" required error={errs.brand}><input {...fp("brand")} maxLength={120} /></Field>
              <Field label="Nom du produit" hint="Tel qu'imprimé sur l'emballage" required error={errs.name}><input {...fp("name")} maxLength={255} /></Field>
            </div>
          </Card>

          <Card title="Description" icon="note" actions={<Tabs small label="Langue de la description" tabs={langTabs("description")} value={descLang} onChange={setDescLang} />}>
            {LANGS.map(([k, l]) => k === descLang && (
              <Field key={k} label={`Description — ${l}`} error={errs["description" + k]} hint="Laisse vide si l'information n'est pas vérifiée : la boutique affichera « Information non fournie ».">
                <textarea rows={6} dir={k === "Ar" ? "rtl" : undefined} {...fp("description" + k)} /></Field>))}
          </Card>

          <Card title="Mode d'emploi" icon="layers" actions={<Tabs small label="Langue du mode d'emploi" tabs={langTabs("usage")} value={useLang} onChange={setUseLang} />}>
            {LANGS.map(([k, l]) => k === useLang && (
              <Field key={k} label={`Mode d'emploi — ${l}`} error={errs["usage" + k]}>
                <textarea rows={5} dir={k === "Ar" ? "rtl" : undefined} {...fp("usage" + k)} /></Field>))}
          </Card>

          <Card title="Mentions de l'emballage" icon="box">
            <Field label="Une mention par ligne, recopiée telle quelle" error={errs.packMentions}><textarea rows={5} {...fp("packMentions")} /></Field>
          </Card>
        </div>

        <aside className="a-form-side">
          <Card title="Visibilité" icon="eye">
            <Switch checked={f.isActive} onChange={set("isActive")} label="Produit actif" hint={f.isActive ? "Visible dans la boutique" : "Caché de la boutique"} />
          </Card>

          <Card title="Prix et stock" icon="money">
            <Field label="Prix unitaire" error={errs.price} hint="Vide = « Prix à renseigner » (non commandable sans prix de pack fixe).">
              <span className="a-input-wrap a-has-suffix"><input inputMode="decimal" {...fp("price")} placeholder="ex. 25,50" /><span className="a-suffix">{cur}</span></span></Field>
            <Field label="Stock" error={errs.stock} hint="Vide = non suivi (pas de limite). Un nombre = décompté à chaque commande.">
              <input inputMode="numeric" {...fp("stock")} placeholder="Non suivi" /></Field>
          </Card>

          {!isNew && <Photos product={product} onChange={setProduct} setFlash={setFlash} />}

          <Card title="Organisation" icon="settings">
            <Field label="Catégorie" error={errs.categoryId}>
              <select {...fp("categoryId")}><option value="">— Aucune —</option>
                {cats.data?.items.map(c => <option key={c.id} value={c.id}>{c.name.fr}</option>)}</select></Field>
            <div className="a-fgrid a-fgrid-tight">
              <Field label="Ordre d'affichage" error={errs.sortOrder} hint="Petit = en premier"><input type="number" {...fp("sortOrder")} /></Field>
              <Field label="Ruban de la carte" error={errs.tape}>
                <select {...fp("tape")}>{TAPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
            </div>
            <Field label="Identifiant d'URL (slug)" error={errs.slug} hint={isNew ? "Laisse vide : créé automatiquement." : undefined}><input className="a-mono" {...fp("slug")} maxLength={120} /></Field>
            <Field label="Vidéo (facultatif)" error={errs.videoUrl} hint="Lien https://… ou fichier .mp4"><input {...fp("videoUrl")} placeholder="https://…" /></Field>
          </Card>
        </aside>

        <div className="a-savebar">
          <span className="a-savebar-txt">{dirty ? <><span className="a-dot a-dot-warn" />Modifications non enregistrées</> : isNew ? "Les photos s'ajoutent juste après la création." : "Tout est enregistré."}</span>
          <Link className="a-btn a-btn-ghost" to="/admin/produits">Annuler</Link>
          <button className="a-btn a-btn-primary" disabled={busy}><Ic n="check" size={16} />{busy ? "Enregistrement…" : isNew ? "Créer le produit" : "Enregistrer"}</button>
        </div>
      </form>
    </>
  );
}

function Photos({ product, onChange, setFlash }) {
  const call = useAdminApi();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const input = useRef(null);
  const imgs = product.images;

  const upload = async files => {
    if (!files.length) return;
    const form = new FormData();
    for (const file of files) form.append("images", file);
    setBusy(true);
    try { const r = await call(`/products/${product.id}/images`, { method: "POST", form }); onChange(r.product); setFlash({ type: "ok", text: "Photo(s) ajoutée(s)." }); }
    catch (e) { setFlash({ type: "err", text: e.message }); }
    finally { setBusy(false); if (input.current) input.current.value = ""; }
  };
  const move = async (i, d) => {
    const ids = imgs.map(x => x.id); const j = i + d; if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    try { const r = await call(`/products/${product.id}/images/order`, { method: "PUT", body: { ids } }); onChange(r.product); }
    catch (e) { setFlash({ type: "err", text: e.message }); }
  };
  const del = async img => {
    if (!(await confirm({ title: "Retirer cette photo ?", message: "Elle ne sera plus affichée sur la fiche du produit.", confirmLabel: "Retirer", danger: true }))) return;
    try { const r = await call(`/products/${product.id}/images/${img.id}`, { method: "DELETE" }); onChange(r.product); }
    catch (e) { setFlash({ type: "err", text: e.message }); }
  };

  return (
    <Card title={`Photos (${imgs.length})`} icon="image">
      {imgs.length > 0 && <ul className="a-photos">{imgs.map((img, i) => (
        <li key={img.id} className={i === 0 ? "is-main" : ""}>
          <img src={img.url} alt="" />
          {i === 0 && <span className="a-photo-tag">Principale</span>}
          <div className="a-photo-acts">
            <button className="a-icon-btn a-icon-btn-sm" type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Déplacer avant" title="Avant"><Ic n="left" size={15} /></button>
            <button className="a-icon-btn a-icon-btn-sm" type="button" disabled={i === imgs.length - 1} onClick={() => move(i, 1)} aria-label="Déplacer après" title="Après"><Ic n="right" size={15} /></button>
            <button className="a-icon-btn a-icon-btn-sm a-icon-btn-danger" type="button" onClick={() => del(img)} aria-label="Retirer la photo" title="Retirer"><Ic n="trash" size={15} /></button>
          </div>
        </li>))}</ul>}
      <label className={`a-drop${drag ? " is-drag" : ""}${busy ? " is-busy" : ""}`}
        onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); upload([...e.dataTransfer.files]); }}>
        <Ic n="upload" size={20} />
        <b>{busy ? "Envoi en cours…" : "Ajouter des photos"}</b>
        <small>Glisse-les ici ou clique · JPEG, PNG, WebP · 5 Mo max</small>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple className="a-sr" disabled={busy} onChange={e => upload([...e.target.files])} />
      </label>
      <p className="a-hint">La première photo est la photo principale.</p>
    </Card>
  );
}

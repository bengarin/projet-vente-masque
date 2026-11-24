/* Création / modification d'un produit + gestion des photos */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Field, numStr, useAdminApi, useFlash, useLoad } from "../common.jsx";

const TAPES = [["ging", "Vichy jaune"], ["dots", "Pois lavande"], ["grid", "Quadrillé bleu"], ["ydots", "Pois jaunes"], ["checkl", "Damier lavande"], ["check", "Damier bleu"]];
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
  const dirty = useRef(false);

  useEffect(() => {
    if (isNew) { setF(EMPTY); setProduct(null); return; }
    call(`/products/${id}`).then(r => { setProduct(r.product); setF(fromProduct(r.product)); }).catch(setLoadErr);
  }, [id, isNew, call]);

  const set = k => e => { dirty.current = true; const v = e.target.type === "checkbox" ? e.target.checked : e.target.value; setF(x => ({ ...x, [k]: v })); if (errs[k]) setErrs(x => ({ ...x, [k]: "" })); };
  const fp = k => ({ value: f[k], onChange: set(k) });

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
      dirty.current = false;
      if (isNew) { navigate(`/admin/produits/${r.product.id}`, { replace: true }); return; }
      setProduct(r.product); setF(fromProduct(r.product));
      setFlash({ type: "ok", text: "Produit enregistré ✓" });
    } catch (e2) {
      setErrs(e2.fields || {}); setFlash({ type: "err", text: e2.message });
    } finally { setBusy(false); }
  };

  if (loadErr) return <p className="alert err">{loadErr.message} <Link to="/admin/produits">Retour</Link></p>;
  if (!isNew && !product) return <p className="muted">Chargement…</p>;
  const cur = general.data?.settings.currency || "";

  return (
    <>
      <div className="ahead"><h1>{isNew ? "Nouveau produit" : `${product.brand} – ${product.name}`}</h1><Link className="btn ghost" to="/admin/produits">← Produits</Link></div>
      {flash}
      <form className="pform" onSubmit={save} noValidate>
        <section className="card">
          <h2>Identité</h2>
          <div className="row">
            <Field label="Marque (telle qu'imprimée)" required error={errs.brand}><input {...fp("brand")} maxLength={120} /></Field>
            <Field label="Nom du produit (tel qu'imprimé)" required error={errs.name}><input {...fp("name")} maxLength={255} /></Field>
          </div>
          <div className="row">
            <Field label="Catégorie" error={errs.categoryId}>
              <select {...fp("categoryId")}><option value="">— Aucune —</option>
                {cats.data?.items.map(c => <option key={c.id} value={c.id}>{c.name.fr}</option>)}</select></Field>
            <Field label="Identifiant d'URL (slug)" error={errs.slug} hint={isNew ? "Laisse vide : créé automatiquement." : undefined}><input {...fp("slug")} maxLength={120} /></Field>
          </div>
        </section>

        <section className="card">
          <h2>Prix, stock et visibilité</h2>
          <div className="row">
            <Field label={`Prix unitaire (${cur})`} error={errs.price} hint="Vide = « Prix à renseigner » (produit non commandable sans prix de pack fixe).">
              <input inputMode="decimal" {...fp("price")} placeholder="ex. 25 ou 25.50" /></Field>
            <Field label="Stock" error={errs.stock} hint="Vide = stock non suivi (pas de limite). Un nombre = décompté à chaque commande.">
              <input inputMode="numeric" {...fp("stock")} placeholder="non suivi" /></Field>
          </div>
          <div className="row">
            <label className="check"><input type="checkbox" checked={f.isActive} onChange={set("isActive")} /> Produit actif (visible dans la boutique)</label>
            <Field label="Ordre d'affichage" error={errs.sortOrder} hint="Plus petit = affiché en premier."><input type="number" {...fp("sortOrder")} /></Field>
          </div>
        </section>

        <section className="card">
          <h2>Description</h2>
          <p className="muted">Laisse vide si l'information n'est pas vérifiée : la boutique affichera « Information non fournie ».</p>
          <div className="row3">
            <Field label="Description — français" error={errs.descriptionFr}><textarea rows={5} {...fp("descriptionFr")} /></Field>
            <Field label="Description — arabe" error={errs.descriptionAr}><textarea rows={5} dir="rtl" {...fp("descriptionAr")} /></Field>
            <Field label="Description — anglais" error={errs.descriptionEn}><textarea rows={5} {...fp("descriptionEn")} /></Field>
          </div>
          <div className="row3">
            <Field label="Mode d'emploi — français" error={errs.usageFr}><textarea rows={4} {...fp("usageFr")} /></Field>
            <Field label="Mode d'emploi — arabe" error={errs.usageAr}><textarea rows={4} dir="rtl" {...fp("usageAr")} /></Field>
            <Field label="Mode d'emploi — anglais" error={errs.usageEn}><textarea rows={4} {...fp("usageEn")} /></Field>
          </div>
          <Field label="Mentions imprimées sur l'emballage (une par ligne, recopiées telles quelles)" error={errs.packMentions}><textarea rows={5} {...fp("packMentions")} /></Field>
        </section>

        <section className="card">
          <h2>Présentation</h2>
          <div className="row">
            <Field label="Ruban décoratif de la carte" error={errs.tape}>
              <select {...fp("tape")}>{TAPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
            <Field label="Vidéo (facultatif)" error={errs.videoUrl} hint="Lien https://… ou fichier .mp4"><input {...fp("videoUrl")} placeholder="https://…" /></Field>
          </div>
        </section>

        <div className="stickybar">
          <button className="btn primary" disabled={busy}>{busy ? "Enregistrement…" : isNew ? "Créer le produit" : "Enregistrer"}</button>
          {isNew && <span className="muted">Les photos s'ajoutent juste après la création.</span>}
        </div>
      </form>

      {!isNew && <Photos product={product} onChange={setProduct} setFlash={setFlash} />}
    </>
  );
}

function Photos({ product, onChange, setFlash }) {
  const call = useAdminApi();
  const [busy, setBusy] = useState(false);
  const input = useRef(null);
  const imgs = product.images;

  const upload = async files => {
    if (!files.length) return;
    const form = new FormData();
    for (const file of files) form.append("images", file);
    setBusy(true);
    try { const r = await call(`/products/${product.id}/images`, { method: "POST", form }); onChange(r.product); setFlash({ type: "ok", text: "Photo(s) ajoutée(s) ✓" }); }
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
    if (!window.confirm("Retirer cette photo du produit ?")) return;
    try { const r = await call(`/products/${product.id}/images/${img.id}`, { method: "DELETE" }); onChange(r.product); }
    catch (e) { setFlash({ type: "err", text: e.message }); }
  };

  return (
    <section className="card">
      <h2>Photos</h2>
      <p className="muted">La 1re photo est la photo principale. JPEG, PNG ou WebP, 5 Mo maximum chacune.</p>
      <ul className="photos">{imgs.map((img, i) => (
        <li key={img.id}><img src={img.url} alt="" />{i === 0 && <span className="badge ok">Principale</span>}
          <div className="acts">
            <button className="btn small ghost" type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Déplacer avant">←</button>
            <button className="btn small ghost" type="button" disabled={i === imgs.length - 1} onClick={() => move(i, 1)} aria-label="Déplacer après">→</button>
            <button className="btn small danger" type="button" onClick={() => del(img)}>Retirer</button>
          </div></li>))}
        {!imgs.length && <li className="muted">Aucune photo.</li>}
      </ul>
      <label className="btn">{busy ? "Envoi…" : "+ Ajouter des photos"}
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden disabled={busy} onChange={e => upload([...e.target.files])} /></label>
    </section>
  );
}

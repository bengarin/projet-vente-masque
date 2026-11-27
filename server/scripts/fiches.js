/* Fiches produit (database/fiches-produits.sql) : application + compte rendu.
   - Ne remplit que les champs vides, ne touche jamais aux prix, au stock ni aux photos.
   - Utilisé par db:migrate, db:seed et db:fiches.
   Lancement seul :  npm run db:fiches   (affiche ce qui a été trouvé et ce qui reste à confirmer) */
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import mysql from "mysql2/promise";
import { loadConfig, PROJECT_ROOT } from "../src/config.js";

const FILES = ["fiches-produits.sql", "photos-produits.sql", "produits-soins.sql", "descriptions-v2.sql", "points-forts-v2.sql", "contenu-v3.sql", "prix-masques.sql", "corrections-langue.sql", "meta-pixel.sql"].map(f => path.join(PROJECT_ROOT, "database", f));

/* Découpe le fichier en blocs « -- fiche: <clé> | <libellé> » + une requête UPDATE */
async function blocks() {
  const all = [];
  for (const file of FILES) {
    const sql = (await fs.readFile(file, "utf8")).replace(/\r\n/g, "\n");   // fichiers Windows (CRLF) acceptés
    all.push(...sql.split(/^-- fiche: /m).slice(1).map(b => {
      const [head, ...rest] = b.split("\n");
      const [key, label, url] = head.split(" | ");  // url vide = simple mise à jour
      return { key: key.trim(), label: (label || "").trim(), url: url?.trim() || undefined, sql: rest.join("\n").trim() };
    }));
  }
  return all;
}

export async function applyFiches(conn, { quiet = false } = {}) {
  const [[{ n }]] = await conn.query("SELECT COUNT(*) AS n FROM products");
  if (!n) { if (!quiet) console.log("  (aucun produit en base : lance « npm run db:seed » pour créer les produits et leurs fiches)"); return []; }
  const results = [];
  for (const b of await blocks()) {
    const [r] = await conn.query(b.sql);
    if (b.url) {                               // création (photo, produit, catégorie) : ajoutée maintenant, ou déjà présente ?
      const [sql, val] = b.url.startsWith("/") ? ["SELECT COUNT(*) AS n FROM product_images WHERE url = ?", b.url]
        : [`SELECT COUNT(*) AS n FROM ${b.key.startsWith("categorie") ? "categories" : "products"} WHERE slug = ?`, b.url.replace(/^slug=/, "")];
      const [[{ n: present }]] = await conn.query(sql, [val]);
      results.push({ ...b, created: true, matched: present, changed: r.affectedRows });
      continue;
    }
    if (b.key.startsWith("reglage-")) {        // réglage : ajouté s'il manquait, sinon valeur actuelle conservée
      const [[row]] = await conn.query("SELECT `value` FROM settings WHERE `key` = 'meta_pixel_id'");
      results.push({ ...b, matched: 1, changed: r.affectedRows, setting: row?.value || "vide (pixel désactivé)" });
      continue;
    }
    if (b.key.startsWith("prix-")) {           // prix : posé seulement si vide → on relit le prix réellement en base
      const sel = b.sql.replace(/^[\s\S]*?WHERE price IS NULL AND sale_mode = 'pack' AND /, "SELECT price, sale_mode FROM products WHERE ");
      const [rows] = await conn.query(sel);
      results.push({ ...b, matched: rows.length, changed: r.affectedRows, prices: rows.map(x => x.price == null ? "vide" : `${Number(x.price)} DH${x.sale_mode === "unit" ? " (vendu à l'unité)" : ""}`) });
      continue;
    }
    const matched = Number(/Rows matched:\s*(\d+)/i.exec(r.info || "")?.[1] ?? r.affectedRows);
    results.push({ ...b, matched, changed: r.changedRows ?? r.affectedRows });
  }
  if (!quiet) {
    console.log("\nFiches produit :");
    let section = "";
    for (const r of results.filter(r => !r.key.includes("-mentions"))) {
      const sec = r.key.startsWith("desc-") ? "Descriptions (nouvelle version) :"
        : r.key.startsWith("pf-") ? "Points forts (nouvelle version) :"
        : r.key.startsWith("v3-") ? "Fiches v3 — avantages d'abord, une langue par texte :"
        : r.key.startsWith("langue-") ? "Corrections de langue (FR / AR / EN) :"
        : r.key.startsWith("reglage-") ? "Réglages :"
        : r.key.startsWith("prix-") ? "Prix unitaires des masques (posés seulement si le prix est vide) :"
        : r.key.startsWith("produit-") || r.key.startsWith("categorie") || r.key.startsWith("photo-orjena") || r.key.startsWith("photo-somebymi") ? "Soins à l'unité :"
        : r.key.startsWith("photo-") ? "Photos d'ambiance :" : "";
      if (sec && sec !== section) { console.log("\n" + sec); section = sec; }
      const state = r.matched === 0 ? "INTROUVABLE dans la base"
        : r.key.startsWith("reglage-") ? (r.changed ? `ajouté → ${r.setting}` : `déjà réglé, conservé → ${r.setting}`)
        : r.key.startsWith("prix-") ? (r.changed ? `prix posé → ${r.prices.join(", ")}` : `prix déjà saisi, conservé → ${r.prices.join(", ")}`)
        : r.created ? (r.changed ? "ajoutée" : "déjà présente")
        : r.key.startsWith("desc-") || r.key.startsWith("pf-") || r.key.startsWith("v3-") || r.key.startsWith("langue-") ? (r.changed ? "réécrite" : "déjà à jour (ou modifiée dans l'admin : conservée)")
        : r.changed ? `complétée (${r.matched} produit(s))` : `déjà à jour (${r.matched} produit(s))`;
      console.log(`  ${r.matched ? "✔" : "✖"} ${r.label.padEnd(62)} ${state}`);
    }
    if (results.some(r => !r.matched && !r.key.includes("-mentions"))) {
      console.log("  → Produit introuvable : vérifie dans l'admin que la marque et le nom sont exactement ceux de l'emballage.");
    }
  }
  return results;
}

/* Tableau : ce qui est rempli pour chaque produit, par langue */
export async function report(conn) {
  const rows = await conn.query(`SELECT id, slug, brand, name, sale_mode, price,
      description_fr, description_ar, description_en, product_type_fr, product_type_ar, product_type_en,
      content_fr, content_ar, content_en, highlights_fr, highlights_ar, highlights_en,
      usage_fr, usage_ar, usage_en, precautions_fr, precautions_ar, precautions_en, pack_mentions,
      (SELECT COUNT(*) FROM product_images i WHERE i.product_id = products.id) AS photos
    FROM products ORDER BY sort_order, id`).then(r => r[0]);
  const f = v => (v && String(v).trim() ? "oui" : "—");
  const tri = (p, base) => ["fr", "ar", "en"].map(l => f(p[`${base}_${l}`])).join("/");
  console.log("\nContenu en base (FR/AR/EN) — « — » = vide (section ou ligne masquée sur la boutique) :");
  const W = 11;
  console.log("  " + ["Produit (identifiant)".padEnd(46), "Description", "Type".padEnd(W), "Contenance".padEnd(W), "Points clés", "Texte imprimé", "Mode d'emploi", "Précautions", "Photos", "Vente / prix"].join(" | "));
  for (const p of rows) {
    const id = ` (${p.slug})`, full = `${p.brand} — ${p.name}`;
    const nm = (full.length + id.length > 46 ? full.slice(0, 45 - id.length) + "…" : full) + id;
    console.log("  " + [nm.padEnd(46), tri(p, "description").padEnd(W), tri(p, "product_type").padEnd(W), tri(p, "content").padEnd(W),
      tri(p, "highlights").padEnd(W), f(p.pack_mentions).padEnd(13), tri(p, "usage").padEnd(13), tri(p, "precautions").padEnd(11), String(p.photos).padEnd(6), `${p.sale_mode === "unit" ? "unité" : "pack"} / ${p.price == null ? "—" : p.price + " DH"}`].join(" | "));
  }
  console.log("\n« — » : information non visible sur l'emballage ou non confirmée → volontairement vide (rien n'est inventé).");
}

/* Lancement direct : npm run db:fiches */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const cfg = loadConfig({ needJwt: false });
  const conn = await mysql.createConnection({ ...cfg.db, multipleStatements: true, charset: "utf8mb4" }).catch(e => {
    console.error(`✖ Connexion MySQL impossible : ${e.code || e.message}. Vérifie server/.env`); process.exit(1);
  });
  try {
    const [cols] = await conn.query("SHOW COLUMNS FROM products LIKE 'highlights_fr'");
    if (!cols.length) { console.error("✖ La base n'est pas à jour : lance d'abord « npm run db:migrate »."); process.exitCode = 1; }
    else { await applyFiches(conn); await report(conn); }
  } catch (e) {
    console.error("✖ Fiches non appliquées :", e.message); process.exitCode = 1;
  } finally { await conn.end(); }
}

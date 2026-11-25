/* Gestion des produits : liste, création, modification, activation, suppression, photos */
import { Router } from "express";
import { query, transaction } from "../../db.js";
import { notFound, badRequest } from "../../errors.js";
import { mapProductRow } from "../../services/catalog.js";
import { productInput, imageOrderInput, idParam } from "../../validation.js";
import { imageUpload, saveImages, removeUploaded } from "../../middleware/uploads.js";

const slugify = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100) || "produit";

function toColumns(d) {
  return {
    category_id: d.categoryId, brand: d.brand, name: d.name,
    description_fr: d.descriptionFr, description_ar: d.descriptionAr, description_en: d.descriptionEn,
    usage_fr: d.usageFr, usage_ar: d.usageAr, usage_en: d.usageEn,
    product_type_fr: d.typeFr, product_type_ar: d.typeAr, product_type_en: d.typeEn,
    content_fr: d.contentFr, content_ar: d.contentAr, content_en: d.contentEn,
    highlights_fr: d.highlightsFr, highlights_ar: d.highlightsAr, highlights_en: d.highlightsEn,
    precautions_fr: d.precautionsFr, precautions_ar: d.precautionsAr, precautions_en: d.precautionsEn,
    pack_mentions: d.packMentions, price: d.price, stock: d.stock, is_active: d.isActive ? 1 : 0, sale_mode: d.saleMode,
    tape: d.tape, video_url: d.videoUrl, sort_order: d.sortOrder,
  };
}

async function uniqueSlug(base, exceptId = 0) {
  let slug = base, i = 2;
  while ((await query("SELECT id FROM products WHERE slug = ? AND id <> ?", [slug, exceptId])).length) slug = `${base}-${i++}`;
  return slug;
}

async function getProduct(id) {
  const [row] = await query("SELECT * FROM products WHERE id = ?", [id]);
  if (!row) return null;
  const imgs = await query("SELECT id, url FROM product_images WHERE product_id = ? ORDER BY sort_order, id", [id]);
  const p = mapProductRow(row, imgs);
  return { ...p, raw: {
    descriptionFr: row.description_fr, descriptionAr: row.description_ar, descriptionEn: row.description_en,
    usageFr: row.usage_fr, usageAr: row.usage_ar, usageEn: row.usage_en, packMentions: row.pack_mentions,
    typeFr: row.product_type_fr, typeAr: row.product_type_ar, typeEn: row.product_type_en,
    contentFr: row.content_fr, contentAr: row.content_ar, contentEn: row.content_en,
    highlightsFr: row.highlights_fr, highlightsAr: row.highlights_ar, highlightsEn: row.highlights_en,
    precautionsFr: row.precautions_fr, precautionsAr: row.precautions_ar, precautionsEn: row.precautions_en,
    sortOrder: row.sort_order, videoUrl: row.video_url,
  }, createdAt: row.created_at, updatedAt: row.updated_at };
}

export function productsRouter(cfg) {
  const r = Router();

  r.get("/", async (req, res) => {
    const q = String(req.query.q || "").trim().slice(0, 120);
    const status = req.query.status === "active" ? 1 : req.query.status === "inactive" ? 0 : null;
    const where = [], params = [];
    if (q) { where.push("(p.name LIKE ? OR p.brand LIKE ? OR p.slug LIKE ?)"); params.push(`%${q}%`, `%${q}%`, `%${q}%`); }
    if (status !== null) { where.push("p.is_active = ?"); params.push(status); }
    const rows = await query(
      `SELECT p.id, p.slug, p.brand, p.name, p.price, p.stock, p.is_active, p.sale_mode, p.sort_order, p.category_id, c.name_fr AS category,
              (SELECT url FROM product_images i WHERE i.product_id = p.id ORDER BY sort_order, id LIMIT 1) AS image,
              (SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.id) AS orderLines
         FROM products p LEFT JOIN categories c ON c.id = p.category_id
        ${where.length ? "WHERE " + where.join(" AND ") : ""}
        ORDER BY p.sort_order, p.id`, params);
    res.json({ products: rows.map(p => ({ id: p.id, slug: p.slug, brand: p.brand, name: p.name, price: p.price, stock: p.stock,
      isActive: !!p.is_active, saleMode: p.sale_mode, sortOrder: p.sort_order, categoryId: p.category_id, category: p.category, image: p.image,
      orderLines: p.orderLines })) });
  });

  r.get("/:id", async (req, res) => {
    const p = await getProduct(idParam.parse(req.params.id));
    if (!p) throw notFound("Produit introuvable.");
    res.json({ product: p });
  });

  r.post("/", async (req, res) => {
    const d = productInput.parse(req.body);
    const slug = await uniqueSlug(d.slug || slugify(`${d.brand} ${d.name}`));
    const cols = { slug, ...toColumns(d) };
    const keys = Object.keys(cols);
    const result = await query(`INSERT INTO products (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`, Object.values(cols));
    res.status(201).json({ product: await getProduct(result.insertId) });
  });

  r.put("/:id", async (req, res) => {
    const id = idParam.parse(req.params.id);
    const d = productInput.parse(req.body);
    const [exists] = await query("SELECT id, slug FROM products WHERE id = ?", [id]);
    if (!exists) throw notFound("Produit introuvable.");
    const slug = d.slug && d.slug !== exists.slug ? await uniqueSlug(d.slug, id) : exists.slug;
    const cols = { slug, ...toColumns(d) };
    await query(`UPDATE products SET ${Object.keys(cols).map(k => `${k} = ?`).join(", ")} WHERE id = ?`, [...Object.values(cols), id]);
    res.json({ product: await getProduct(id) });
  });

  // Activer / désactiver sans toucher au reste
  r.patch("/:id/status", async (req, res) => {
    const id = idParam.parse(req.params.id);
    if (typeof req.body?.isActive !== "boolean") throw badRequest("isActive (true/false) attendu.");
    const result = await query("UPDATE products SET is_active = ? WHERE id = ?", [req.body.isActive ? 1 : 0, id]);
    if (!result.affectedRows) throw notFound("Produit introuvable.");
    res.json({ ok: true });
  });

  // Suppression définitive. Les commandes passées gardent leur copie (marque, nom, prix).
  r.delete("/:id", async (req, res) => {
    const id = idParam.parse(req.params.id);
    const imgs = await query("SELECT url FROM product_images WHERE product_id = ?", [id]);
    const result = await query("DELETE FROM products WHERE id = ?", [id]);
    if (!result.affectedRows) throw notFound("Produit introuvable.");
    await Promise.all(imgs.map(i => removeUploaded(cfg, i.url)));
    res.json({ ok: true });
  });

  /* ---- Photos ---- */
  r.post("/:id/images", imageUpload(cfg), async (req, res) => {
    const id = idParam.parse(req.params.id);
    const [p] = await query("SELECT id FROM products WHERE id = ?", [id]);
    if (!p) throw notFound("Produit introuvable.");
    const urls = await saveImages(cfg, req.files);
    const [{ maxOrder }] = await query("SELECT COALESCE(MAX(sort_order), -1) AS maxOrder FROM product_images WHERE product_id = ?", [id]);
    for (let i = 0; i < urls.length; i++) {
      await query("INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)", [id, urls[i], maxOrder + 1 + i]);
    }
    res.status(201).json({ product: await getProduct(id) });
  });

  r.put("/:id/images/order", async (req, res) => {
    const id = idParam.parse(req.params.id);
    const { ids } = imageOrderInput.parse(req.body);
    await transaction(async conn => {
      for (let i = 0; i < ids.length; i++) {
        await conn.query("UPDATE product_images SET sort_order = ? WHERE id = ? AND product_id = ?", [i, ids[i], id]);
      }
    });
    res.json({ product: await getProduct(id) });
  });

  r.delete("/:id/images/:imageId", async (req, res) => {
    const id = idParam.parse(req.params.id), imageId = idParam.parse(req.params.imageId);
    const [img] = await query("SELECT id, url FROM product_images WHERE id = ? AND product_id = ?", [imageId, id]);
    if (!img) throw notFound("Photo introuvable.");
    await query("DELETE FROM product_images WHERE id = ?", [imageId]);
    await removeUploaded(cfg, img.url);
    res.json({ product: await getProduct(id) });
  });

  return r;
}

/* Paramètres boutique : général, tailles/prix des packs, livraison, paiement, catégories */
import { Router } from "express";
import { query } from "../../db.js";
import { notFound, conflict } from "../../errors.js";
import { getSettings, mapShipping, mapPayment } from "../../services/catalog.js";
import { settingsInput, packSizeInput, shippingInput, paymentInput, categoryInput, idParam } from "../../validation.js";

/* Petit CRUD générique pour une table simple */
function crud(r, path, table, schema, toCols, map, listSql) {
  r.get(path, async (req, res) => res.json({ items: (await query(listSql)).map(map) }));
  r.post(path, async (req, res) => {
    const cols = toCols(schema.parse(req.body));
    const keys = Object.keys(cols);
    const result = await query(`INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`, Object.values(cols));
    const [row] = await query(`SELECT * FROM ${table} WHERE id = ?`, [result.insertId]);
    res.status(201).json({ item: map(row) });
  });
  r.put(`${path}/:id`, async (req, res) => {
    const id = idParam.parse(req.params.id);
    const cols = toCols(schema.parse(req.body));
    const result = await query(`UPDATE ${table} SET ${Object.keys(cols).map(k => `${k} = ?`).join(", ")} WHERE id = ?`, [...Object.values(cols), id]);
    if (!result.affectedRows) throw notFound();
    const [row] = await query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    res.json({ item: map(row) });
  });
  r.delete(`${path}/:id`, async (req, res) => {
    const result = await query(`DELETE FROM ${table} WHERE id = ?`, [idParam.parse(req.params.id)]);
    if (!result.affectedRows) throw notFound();
    res.json({ ok: true });
  });
}

export function settingsRouter() {
  const r = Router();

  /* Général */
  r.get("/general", async (req, res) => res.json({ settings: await getSettings() }));
  r.put("/general", async (req, res) => {
    const d = settingsInput.parse(req.body);
    const pairs = [["store_name", d.storeName], ["currency", d.currency], ["orders_enabled", d.ordersEnabled ? "1" : "0"],
      ["low_stock_threshold", String(d.lowStockThreshold)]];
    if (d.metaPixelId !== undefined) pairs.push(["meta_pixel_id", d.metaPixelId]);
    for (const [k, v] of pairs) {
      await query("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)", [k, v]);
    }
    res.json({ settings: await getSettings() });
  });

  /* Tailles de pack */
  const mapPack = p => ({ size: p.size, price: p.price, isActive: !!p.is_active });
  r.get("/pack-sizes", async (req, res) => res.json({ items: (await query("SELECT * FROM pack_sizes ORDER BY size")).map(mapPack) }));
  r.post("/pack-sizes", async (req, res) => {
    const d = packSizeInput.parse(req.body);
    const [exists] = await query("SELECT size FROM pack_sizes WHERE size = ?", [d.size]);
    if (exists) throw conflict("duplicate", `Le pack de ${d.size} existe déjà.`);
    await query("INSERT INTO pack_sizes (size, price, is_active) VALUES (?, ?, ?)", [d.size, d.price, d.isActive ? 1 : 0]);
    res.status(201).json({ ok: true });
  });
  r.put("/pack-sizes/:size", async (req, res) => {
    const size = idParam.parse(req.params.size);
    const d = packSizeInput.parse({ ...req.body, size });
    const result = await query("UPDATE pack_sizes SET price = ?, is_active = ? WHERE size = ?", [d.price, d.isActive ? 1 : 0, size]);
    if (!result.affectedRows) throw notFound("Taille de pack introuvable.");
    res.json({ ok: true });
  });
  r.delete("/pack-sizes/:size", async (req, res) => {
    const result = await query("DELETE FROM pack_sizes WHERE size = ?", [idParam.parse(req.params.size)]);
    if (!result.affectedRows) throw notFound("Taille de pack introuvable.");
    res.json({ ok: true });
  });

  /* Livraison */
  crud(r, "/shipping", "shipping_methods", shippingInput, d => ({
    label_fr: d.labelFr, label_ar: d.labelAr, label_en: d.labelEn, delay_fr: d.delayFr, delay_ar: d.delayAr, delay_en: d.delayEn,
    fee: d.fee, free_from: d.freeFrom, is_active: d.isActive ? 1 : 0, sort_order: d.sortOrder,
  }), mapShipping, "SELECT * FROM shipping_methods ORDER BY sort_order, id");

  /* Paiement */
  crud(r, "/payments", "payment_methods", paymentInput, d => ({
    label_fr: d.labelFr, label_ar: d.labelAr, label_en: d.labelEn, is_active: d.isActive ? 1 : 0, sort_order: d.sortOrder,
  }), mapPayment, "SELECT * FROM payment_methods ORDER BY sort_order, id");

  /* Catégories */
  crud(r, "/categories", "categories", categoryInput, d => ({
    slug: d.slug, name_fr: d.nameFr, name_ar: d.nameAr, name_en: d.nameEn, sort_order: d.sortOrder,
  }), c => ({ id: c.id, slug: c.slug, name: { fr: c.name_fr, ar: c.name_ar, en: c.name_en }, sortOrder: c.sort_order }),
  "SELECT * FROM categories ORDER BY sort_order, id");

  return r;
}

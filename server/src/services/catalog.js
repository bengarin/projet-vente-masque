/* Lecture du catalogue et des paramètres boutique depuis MySQL. */
import { query } from "../db.js";

export const LANGS = ["fr", "ar", "en"];
const tr = (row, base) => ({ fr: row[`${base}_fr`] || null, ar: row[`${base}_ar`] || null, en: row[`${base}_en`] || null });
const anyTr = o => {
  const has = v => (Array.isArray(v) ? v.length > 0 : !!v);
  return has(o.fr) || has(o.ar) || has(o.en) ? o : null;
};
/* « un élément par ligne » → liste (vide = null) */
const lines = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v ? v.split("\n").map(x => x.trim()).filter(Boolean) : null]));

export async function getSettings(q = query) {
  const rows = await q("SELECT `key`, `value` FROM settings");
  const s = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return {
    storeName: s.store_name || "",
    currency: s.currency || "",
    ordersEnabled: s.orders_enabled !== "0",
    lowStockThreshold: Number.isFinite(Number(s.low_stock_threshold)) ? Number(s.low_stock_threshold) : 3,
    // Identifiant Meta Pixel (public, visible dans le navigateur) — vide = pixel désactivé
    metaPixelId: /^\d{5,20}$/.test(s.meta_pixel_id || "") ? s.meta_pixel_id : "",
  };
}

export function mapProductRow(p, images = []) {
  return {
    id: p.id,
    slug: p.slug,
    categoryId: p.category_id,
    saleMode: p.sale_mode || "pack",
    brand: p.brand,
    name: p.name,
    price: p.price,
    stock: p.stock,
    isActive: !!p.is_active,
    tape: p.tape,
    video: p.video_url || null,
    intro: anyTr(tr(p, "intro")),
    info: anyTr(tr(p, "description")),
    usage: anyTr(tr(p, "usage")),
    type: anyTr(tr(p, "product_type")),
    content: anyTr(tr(p, "content")),
    highlights: anyTr(lines(tr(p, "highlights"))),
    precautions: anyTr(tr(p, "precautions")),
    pack: p.pack_mentions ? p.pack_mentions.split("\n").map(s => s.trim()).filter(Boolean) : [],
    images,
  };
}

async function imagesByProduct(ids) {
  if (!ids.length) return {};
  const rows = await query("SELECT id, product_id, url FROM product_images WHERE product_id IN (?) ORDER BY sort_order, id", [ids]);
  const map = {};
  for (const r of rows) (map[r.product_id] ||= []).push({ id: r.id, url: r.url });
  return map;
}

export async function loadProducts({ activeOnly }) {
  const rows = await query(
    `SELECT * FROM products ${activeOnly ? "WHERE is_active = 1" : ""} ORDER BY sort_order, id`
  );
  const imgs = await imagesByProduct(rows.map(r => r.id));
  return rows.map(r => mapProductRow(r, imgs[r.id] || []));
}

export const mapShipping = r => ({
  id: r.id, label: tr(r, "label"), delay: anyTr(tr(r, "delay")), fee: r.fee, freeFrom: r.free_from,
  isActive: !!r.is_active, sortOrder: r.sort_order,
});
export const mapPayment = r => ({ id: r.id, label: tr(r, "label"), isActive: !!r.is_active, sortOrder: r.sort_order });

/* Catalogue public : seulement ce qui est actif */
export async function publicCatalog() {
  const [settings, packs, cats, products, ship, pay] = await Promise.all([
    getSettings(),
    query("SELECT size, price FROM pack_sizes WHERE is_active = 1 ORDER BY size"),
    query("SELECT id, slug, name_fr, name_ar, name_en FROM categories ORDER BY sort_order, id"),
    loadProducts({ activeOnly: true }),
    query("SELECT * FROM shipping_methods WHERE is_active = 1 ORDER BY sort_order, id"),
    query("SELECT * FROM payment_methods WHERE is_active = 1 ORDER BY sort_order, id"),
  ]);
  return {
    store: { name: settings.storeName, currency: settings.currency, ordersEnabled: settings.ordersEnabled, metaPixelId: settings.metaPixelId },
    packSizes: packs.map(p => ({ size: p.size, price: p.price })),
    categories: cats.map(c => ({ id: c.id, slug: c.slug, name: tr(c, "name") })),
    products: products.map(({ isActive, ...p }) => ({ ...p, images: p.images.map(i => i.url) })),
    shipping: ship.map(r => { const { id, label, delay, fee, freeFrom } = mapShipping(r); return { id, label, delay, fee, freeFrom }; }),
    payments: pay.map(r => { const { id, label } = mapPayment(r); return { id, label }; }),
  };
}

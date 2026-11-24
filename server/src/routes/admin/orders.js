/* Commandes : liste filtrée, détail, statut, note interne */
import { Router } from "express";
import { query } from "../../db.js";
import { notFound } from "../../errors.js";
import { changeStatus } from "../../services/orders.js";
import { ordersQuery, statusInput, noteInput, idParam } from "../../validation.js";

const mapOrder = o => ({
  id: o.id, number: o.number, status: o.status, lang: o.lang, packSize: o.pack_size,
  customer: { name: o.customer_name, phone: o.customer_phone, address: o.address, city: o.city, cityIsOther: !!o.city_is_other, area: o.area },
  shipping: { id: o.shipping_method_id, label: o.shipping_label, fee: o.shipping_fee },
  payment: { id: o.payment_method_id, label: o.payment_label },
  itemsTotal: o.items_total, packPrice: o.pack_price, productsTotal: o.products_total, total: o.total, currency: o.currency,
  adminNote: o.admin_note, createdAt: o.created_at, updatedAt: o.updated_at,
});

export function ordersRouter() {
  const r = Router();

  r.get("/", async (req, res) => {
    const f = ordersQuery.parse(req.query);
    const where = [], params = [];
    if (f.status) { where.push("status = ?"); params.push(f.status); }
    if (f.number) { where.push("number LIKE ?"); params.push(`%${f.number.replace(/[%_]/g, "")}%`); }
    if (f.q) {
      const like = `%${f.q.replace(/[%_]/g, "")}%`;
      const phone = f.q.replace(/[\s.\-()]/g, "");
      where.push("(customer_name LIKE ? OR customer_phone LIKE ? OR city LIKE ?)");
      params.push(like, `%${phone.replace(/[%_]/g, "")}%`, like);
    }
    // Dates en jour calendaire (UTC) : du « from » 00:00 au « to » 23:59:59
    if (f.from) { where.push("created_at >= ?"); params.push(`${f.from} 00:00:00`); }
    if (f.to) { where.push("created_at < DATE_ADD(?, INTERVAL 1 DAY)"); params.push(`${f.to} 00:00:00`); }
    const w = where.length ? "WHERE " + where.join(" AND ") : "";
    const [{ n }] = await query(`SELECT COUNT(*) AS n FROM orders ${w}`, params);
    const rows = await query(
      `SELECT o.*, (SELECT COALESCE(SUM(quantity),0) FROM order_items oi WHERE oi.order_id = o.id) AS itemsCount
         FROM orders o ${w} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
      [...params, f.limit, (f.page - 1) * f.limit]);
    res.json({ total: n, page: f.page, limit: f.limit,
      orders: rows.map(o => ({ ...mapOrder(o), itemsCount: Number(o.itemsCount) })) });
  });

  r.get("/:id", async (req, res) => {
    const id = idParam.parse(req.params.id);
    const [o] = await query("SELECT * FROM orders WHERE id = ?", [id]);
    if (!o) throw notFound("Commande introuvable.");
    const [items, history] = await Promise.all([
      query("SELECT id, product_id, brand, name, image_url, unit_price, quantity, line_total FROM order_items WHERE order_id = ? ORDER BY id", [id]),
      query(`SELECT h.from_status, h.to_status, h.created_at, a.email AS admin
               FROM order_status_history h LEFT JOIN admins a ON a.id = h.admin_id WHERE h.order_id = ? ORDER BY h.created_at, h.id`, [id]),
    ]);
    res.json({ order: {
      ...mapOrder(o),
      items: items.map(i => ({ id: i.id, productId: i.product_id, brand: i.brand, name: i.name, image: i.image_url,
        unitPrice: i.unit_price, qty: i.quantity, lineTotal: i.line_total })),
      history: history.map(h => ({ from: h.from_status, to: h.to_status, at: h.created_at, admin: h.admin })),
    } });
  });

  r.patch("/:id/status", async (req, res) => {
    const id = idParam.parse(req.params.id);
    const { status } = statusInput.parse(req.body);
    const result = await changeStatus(id, status, req.admin.id);
    if (!result) throw notFound("Commande introuvable.");
    res.json({ ok: true, ...result });
  });

  r.patch("/:id/note", async (req, res) => {
    const id = idParam.parse(req.params.id);
    const { adminNote } = noteInput.parse(req.body);
    const result = await query("UPDATE orders SET admin_note = ? WHERE id = ?", [adminNote, id]);
    if (!result.affectedRows) throw notFound("Commande introuvable.");
    res.json({ ok: true });
  });

  return r;
}

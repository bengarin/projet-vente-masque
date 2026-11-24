/* Tableau de bord : chiffres clés (calculés en base, rien d'estimé) */
import { Router } from "express";
import { query } from "../../db.js";
import { getSettings } from "../../services/catalog.js";

export function dashboardRouter() {
  const r = Router();
  r.get("/", async (req, res) => {
    const settings = await getSettings();
    const [byStatus, [totals], [month], [prod], lowStock, recent] = await Promise.all([
      query("SELECT status, COUNT(*) AS n FROM orders GROUP BY status"),
      query(`SELECT COUNT(*) AS orders,
                    COALESCE(SUM(CASE WHEN status <> 'annulee' THEN total END), 0) AS sales,
                    COALESCE(SUM(CASE WHEN status = 'livree' THEN total END), 0) AS delivered
               FROM orders`),
      query(`SELECT COUNT(*) AS orders, COALESCE(SUM(CASE WHEN status <> 'annulee' THEN total END), 0) AS sales
               FROM orders WHERE created_at >= DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-01')`),
      query(`SELECT COUNT(*) AS total, COALESCE(SUM(is_active = 1), 0) AS active,
                    COALESCE(SUM(price IS NULL), 0) AS noPrice FROM products`),
      query("SELECT id, brand, name, stock FROM products WHERE stock IS NOT NULL AND stock <= ? ORDER BY stock, name LIMIT 20",
        [settings.lowStockThreshold]),
      query("SELECT id, number, status, customer_name, total, currency, created_at FROM orders ORDER BY created_at DESC, id DESC LIMIT 8"),
    ]);
    res.json({
      currency: settings.currency,
      orders: { total: totals.orders, byStatus: Object.fromEntries(byStatus.map(s => [s.status, s.n])), thisMonth: month.orders },
      sales: { total: Number(totals.sales), delivered: Number(totals.delivered), thisMonth: Number(month.sales) },
      products: { total: prod.total, active: Number(prod.active), inactive: prod.total - Number(prod.active), withoutPrice: Number(prod.noPrice) },
      lowStock, lowStockThreshold: settings.lowStockThreshold,
      recentOrders: recent.map(o => ({ id: o.id, number: o.number, status: o.status, customerName: o.customer_name,
        total: o.total, currency: o.currency, createdAt: o.created_at })),
    });
  });
  return r;
}

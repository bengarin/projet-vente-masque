/* Création d'une commande : tout est revérifié et recalculé par le serveur, dans une transaction
   (prix, pack complet, produits actifs, stock, livraison, paiement). */
import crypto from "node:crypto";
import { transaction } from "../db.js";
import { conflict, badRequest } from "../errors.js";
import { computeTotals } from "./pricing.js";
import { getSettings } from "./catalog.js";

const pick = (row, base, lang) => row[`${base}_${lang}`] || row[`${base}_fr`];

function newNumber() {
  const d = new Date();
  const ymd = d.toISOString().slice(2, 10).replace(/-/g, "");
  const rnd = crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 5);
  return `MPC-${ymd}-${rnd}`;
}

export async function createOrder(input) {
  return transaction(async conn => {
    const q = async (sql, params) => (await conn.query(sql, params))[0];

    const settings = await getSettings(q);
    if (!settings.ordersEnabled) throw conflict("orders_closed", "Les commandes sont fermées pour le moment.");

    const [pack] = await q("SELECT size, price FROM pack_sizes WHERE size = ? AND is_active = 1", [input.packSize]);
    if (!pack) throw badRequest("Cette taille de pack n'est pas disponible.");

    // Regroupe les lignes d'un même produit
    const qtyById = new Map();
    for (const it of input.items) qtyById.set(it.productId, (qtyById.get(it.productId) || 0) + it.qty);
    const count = [...qtyById.values()].reduce((a, b) => a + b, 0);
    if (count !== pack.size) throw conflict("pack_incomplete", `Le pack doit contenir exactement ${pack.size} masques.`);

    // Verrouille les produits pour décompter le stock sans conflit
    const ids = [...qtyById.keys()];
    const products = await q(
      `SELECT p.id, p.brand, p.name, p.price, p.stock,
              (SELECT url FROM product_images i WHERE i.product_id = p.id ORDER BY sort_order, id LIMIT 1) AS image
         FROM products p WHERE p.id IN (?) AND p.is_active = 1 FOR UPDATE`, [ids]);
    if (products.length !== ids.length) {
      const found = new Set(products.map(p => p.id));
      throw conflict("product_unavailable", "Un produit n'est plus disponible.", { productIds: ids.filter(i => !found.has(i)) });
    }
    const out = products.filter(p => p.stock != null && p.stock < qtyById.get(p.id));
    if (out.length) {
      throw conflict("out_of_stock", "Stock insuffisant pour un ou plusieurs produits.",
        { products: out.map(p => ({ productId: p.id, available: p.stock })) });
    }

    const [ship] = await q("SELECT * FROM shipping_methods WHERE id = ? AND is_active = 1", [input.shippingMethodId]);
    if (!ship) throw conflict("shipping_unavailable", "Ce mode de livraison n'est pas disponible.");
    const [pay] = await q("SELECT * FROM payment_methods WHERE id = ? AND is_active = 1", [input.paymentMethodId]);
    if (!pay) throw conflict("payment_unavailable", "Ce mode de paiement n'est pas disponible.");

    const lines = products.map(p => ({ product: p, unitPrice: p.price, qty: qtyById.get(p.id) }));
    const totals = computeTotals({ lines, packPrice: pack.price, shipping: { fee: ship.fee, freeFrom: ship.free_from } });
    if (!totals.ok) throw conflict("price_missing", "Un prix n'est pas encore renseigné : commande impossible pour le moment.");

    const c = input.customer;
    let orderId, number;
    for (let attempt = 0; attempt < 5; attempt++) {
      number = newNumber();
      try {
        const r = await q(
          `INSERT INTO orders (number, status, lang, pack_size, customer_name, customer_phone, address, city, city_is_other, area,
             shipping_method_id, shipping_label, shipping_fee, payment_method_id, payment_label,
             items_total, pack_price, products_total, total, currency)
           VALUES (?, 'nouvelle', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [number, input.lang, pack.size, c.name, c.phone, c.address, c.city, c.cityIsOther ? 1 : 0, c.area,
           ship.id, pick(ship, "label", "fr"), totals.shippingFee, pay.id, pick(pay, "label", "fr"),
           totals.itemsTotal, totals.packPrice, totals.productsTotal, totals.total, settings.currency]);
        orderId = r.insertId;
        break;
      } catch (e) {
        if (e.code !== "ER_DUP_ENTRY" || attempt === 4) throw e;
      }
    }

    for (const l of totals.lines) {
      await q(
        `INSERT INTO order_items (order_id, product_id, brand, name, image_url, unit_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, l.product.id, l.product.brand, l.product.name, l.product.image, l.unitPrice, l.qty, l.lineTotal]);
      if (l.product.stock != null) {
        await q("UPDATE products SET stock = stock - ? WHERE id = ?", [l.qty, l.product.id]);
      }
    }
    await q("INSERT INTO order_status_history (order_id, from_status, to_status) VALUES (?, NULL, 'nouvelle')", [orderId]);

    return {
      number,
      status: "nouvelle",
      packSize: pack.size,
      items: totals.lines.map(l => ({ productId: l.product.id, brand: l.product.brand, name: l.product.name, image: l.product.image,
        unitPrice: l.unitPrice, qty: l.qty, lineTotal: l.lineTotal })),
      customer: { name: c.name, phone: c.phone, address: c.address, city: c.city, area: c.area },
      shipping: { id: ship.id, label: pick(ship, "label", input.lang), fee: totals.shippingFee },
      payment: { id: pay.id, label: pick(pay, "label", input.lang) },
      itemsTotal: totals.itemsTotal, packPrice: totals.packPrice, productsTotal: totals.productsTotal,
      total: totals.total, currency: settings.currency,
    };
  });
}

/* Changement de statut. « annulee » remet le stock (si suivi) et ne peut plus être quittée. */
export async function changeStatus(orderId, toStatus, adminId) {
  return transaction(async conn => {
    const q = async (sql, params) => (await conn.query(sql, params))[0];
    const [o] = await q("SELECT id, status FROM orders WHERE id = ? FOR UPDATE", [orderId]);
    if (!o) return null;
    if (o.status === toStatus) return { changed: false };
    if (o.status === "annulee") throw conflict("order_cancelled", "Une commande annulée ne peut plus changer de statut (le stock a déjà été remis).");

    if (toStatus === "annulee") {
      const items = await q("SELECT product_id, quantity FROM order_items WHERE order_id = ? AND product_id IS NOT NULL", [orderId]);
      for (const it of items) {
        await q("UPDATE products SET stock = stock + ? WHERE id = ? AND stock IS NOT NULL", [it.quantity, it.product_id]);
      }
    }
    await q("UPDATE orders SET status = ? WHERE id = ?", [toStatus, orderId]);
    await q("INSERT INTO order_status_history (order_id, from_status, to_status, admin_id) VALUES (?, ?, ?, ?)",
      [orderId, o.status, toStatus, adminId]);
    return { changed: true, from: o.status };
  });
}

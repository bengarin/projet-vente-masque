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

    // Regroupe les lignes d'un même produit (pack et soins séparément)
    const group = list => { const m = new Map(); for (const it of list) m.set(it.productId, (m.get(it.productId) || 0) + it.qty); return m; };
    const packQty = group(input.items), extraQty = group(input.extras);
    if (!packQty.size && !extraQty.size) throw badRequest("Le panier est vide.");

    // Pack (facultatif) : taille active et nombre exact de masques
    let pack = null;
    if (packQty.size) {
      [pack] = await q("SELECT size, price FROM pack_sizes WHERE size = ? AND is_active = 1", [input.packSize]);
      if (!pack) throw badRequest("Cette taille de pack n'est pas disponible.");
      const count = [...packQty.values()].reduce((a, b) => a + b, 0);
      if (count !== pack.size) throw conflict("pack_incomplete", `Le pack doit contenir exactement ${pack.size} masques.`);
    }

    // Verrouille les produits pour décompter le stock sans conflit
    const ids = [...new Set([...packQty.keys(), ...extraQty.keys()])];
    const products = await q(
      `SELECT p.id, p.brand, p.name, p.price, p.stock, p.sale_mode,
              (SELECT url FROM product_images i WHERE i.product_id = p.id ORDER BY sort_order, id LIMIT 1) AS image
         FROM products p WHERE p.id IN (?) AND p.is_active = 1 FOR UPDATE`, [ids]);
    const byId = new Map(products.map(p => [p.id, p]));
    const wrong = [...[...packQty.keys()].filter(i => byId.get(i)?.sale_mode !== "pack"),
                   ...[...extraQty.keys()].filter(i => byId.get(i)?.sale_mode !== "unit")];
    if (products.length !== ids.length || wrong.length) {
      throw conflict("product_unavailable", "Un produit n'est plus disponible.", { productIds: [...new Set(ids.filter(i => !byId.has(i)).concat(wrong))] });
    }
    const totalQty = id => (packQty.get(id) || 0) + (extraQty.get(id) || 0);
    const out = products.filter(p => p.stock != null && p.stock < totalQty(p.id));
    if (out.length) {
      throw conflict("out_of_stock", "Stock insuffisant pour un ou plusieurs produits.",
        { products: out.map(p => ({ productId: p.id, available: p.stock })) });
    }

    const [ship] = await q("SELECT * FROM shipping_methods WHERE id = ? AND is_active = 1", [input.shippingMethodId]);
    if (!ship) throw conflict("shipping_unavailable", "Ce mode de livraison n'est pas disponible.");
    const [pay] = await q("SELECT * FROM payment_methods WHERE id = ? AND is_active = 1", [input.paymentMethodId]);
    if (!pay) throw conflict("payment_unavailable", "Ce mode de paiement n'est pas disponible.");

    const toLines = m => [...m].map(([id, qty]) => ({ product: byId.get(id), unitPrice: byId.get(id).price, qty }));
    const totals = computeTotals({ lines: toLines(packQty), packPrice: pack?.price ?? null, extras: toLines(extraQty),
      shipping: { fee: ship.fee, freeFrom: ship.free_from } });
    if (!totals.ok) throw conflict("price_missing", "Un prix n'est pas encore renseigné : commande impossible pour le moment.");

    const c = input.customer;
    let orderId, number;
    for (let attempt = 0; attempt < 5; attempt++) {
      number = newNumber();
      try {
        const r = await q(
          `INSERT INTO orders (number, status, lang, pack_size, customer_name, customer_phone, address, city, city_is_other, area,
             shipping_method_id, shipping_label, shipping_fee, payment_method_id, payment_label,
             items_total, pack_price, extras_total, products_total, total, currency)
           VALUES (?, 'nouvelle', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [number, input.lang, pack?.size ?? null, c.name, c.phone, c.address, c.city, c.cityIsOther ? 1 : 0, c.area,
           ship.id, pick(ship, "label", "fr"), totals.shippingFee, pay.id, pick(pay, "label", "fr"),
           totals.itemsTotal, totals.packPrice, totals.extrasTotal, totals.productsTotal, totals.total, settings.currency]);
        orderId = r.insertId;
        break;
      } catch (e) {
        if (e.code !== "ER_DUP_ENTRY" || attempt === 4) throw e;
      }
    }

    const all = [...totals.lines.map(l => ({ ...l, inPack: 1 })), ...totals.extras.map(l => ({ ...l, inPack: 0 }))];
    for (const l of all) {
      await q(
        `INSERT INTO order_items (order_id, product_id, in_pack, brand, name, image_url, unit_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, l.product.id, l.inPack, l.product.brand, l.product.name, l.product.image, l.unitPrice, l.qty, l.lineTotal]);
      if (l.product.stock != null) {
        await q("UPDATE products SET stock = stock - ? WHERE id = ?", [l.qty, l.product.id]);
      }
    }
    await q("INSERT INTO order_status_history (order_id, from_status, to_status) VALUES (?, NULL, 'nouvelle')", [orderId]);

    return {
      number,
      status: "nouvelle",
      packSize: pack?.size ?? null,
      items: all.map(l => ({ productId: l.product.id, inPack: !!l.inPack, brand: l.product.brand, name: l.product.name, image: l.product.image,
        unitPrice: l.unitPrice, qty: l.qty, lineTotal: l.lineTotal })),
      customer: { name: c.name, phone: c.phone, address: c.address, city: c.city, area: c.area },
      shipping: { id: ship.id, label: pick(ship, "label", input.lang), fee: totals.shippingFee },
      payment: { id: pay.id, label: pick(pay, "label", input.lang) },
      itemsTotal: totals.itemsTotal, packPrice: totals.packPrice, extrasTotal: totals.extrasTotal, productsTotal: totals.productsTotal,
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

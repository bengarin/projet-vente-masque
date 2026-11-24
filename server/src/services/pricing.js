/* Calcul des montants — fait UNIQUEMENT côté serveur (le navigateur n'envoie jamais de prix).
   Les calculs se font en centimes pour éviter les erreurs d'arrondi. */
const toCents = v => Math.round(Number(v) * 100);
const fromCents = c => c / 100;

/**
 * @param lines     [{ unitPrice: number|null, qty: number }]
 * @param packPrice prix fixe du pack ou null
 * @param shipping  { fee: number, freeFrom: number|null }
 */
export function computeTotals({ lines, packPrice = null, shipping }) {
  const allPriced = lines.every(l => l.unitPrice != null);
  const itemsCents = allPriced ? lines.reduce((s, l) => s + toCents(l.unitPrice) * l.qty, 0) : null;
  const productsCents = packPrice != null ? toCents(packPrice) : itemsCents;
  if (productsCents == null) return { ok: false, reason: "price_missing" };

  let shipCents = toCents(shipping.fee);
  if (shipping.freeFrom != null && productsCents >= toCents(shipping.freeFrom)) shipCents = 0;

  return {
    ok: true,
    itemsTotal: itemsCents == null ? null : fromCents(itemsCents),
    packPrice: packPrice == null ? null : fromCents(toCents(packPrice)),
    productsTotal: fromCents(productsCents),
    shippingFee: fromCents(shipCents),
    total: fromCents(productsCents + shipCents),
    lines: lines.map(l => ({ ...l, lineTotal: l.unitPrice == null ? null : fromCents(toCents(l.unitPrice) * l.qty) })),
  };
}

/* Téléphone marocain : 06/07/05 + 8 chiffres, ou +212 / 00212 */
export const normalizePhone = v => String(v || "").replace(/[\s.\-()]/g, "");
export const PHONE_RE = /^(0[5-7]\d{8}|(\+|00)212[5-7]\d{8})$/;

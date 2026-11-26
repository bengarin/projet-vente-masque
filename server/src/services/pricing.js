/* Calcul des montants — fait UNIQUEMENT côté serveur (le navigateur n'envoie jamais de prix).
   Les calculs se font en centimes pour éviter les erreurs d'arrondi. */
const toCents = v => Math.round(Number(v) * 100);
const fromCents = c => c / 100;

/**
 * @param lines     lignes du pack [{ unitPrice: number|null, qty }] (vide si pas de pack)
 * @param packPrice prix fixe du pack ou null
 * @param extras    soins à l'unité [{ unitPrice: number|null, qty }]
 * @param shipping  { fee: number, freeFrom: number|null }
 */
export function computeTotals({ lines = [], packPrice = null, extras = [], shipping }) {
  // Pack : prix fixe s'il existe, sinon somme des prix unitaires
  const allPriced = lines.every(l => l.unitPrice != null);
  const itemsCents = allPriced ? lines.reduce((s, l) => s + toCents(l.unitPrice) * l.qty, 0) : null;
  const packCents = !lines.length ? 0 : packPrice != null ? toCents(packPrice) : itemsCents;
  if (packCents == null) return { ok: false, reason: "price_missing" };
  // Soins à l'unité : chaque soin doit avoir un prix
  if (extras.some(l => l.unitPrice == null)) return { ok: false, reason: "price_missing" };
  const extrasCents = extras.reduce((s, l) => s + toCents(l.unitPrice) * l.qty, 0);
  const productsCents = packCents + extrasCents;

  let shipCents = toCents(shipping.fee);
  if (shipping.freeFrom != null && productsCents >= toCents(shipping.freeFrom)) shipCents = 0;
  const withLine = l => ({ ...l, lineTotal: l.unitPrice == null ? null : fromCents(toCents(l.unitPrice) * l.qty) });

  return {
    ok: true,
    itemsTotal: lines.length && itemsCents != null ? fromCents(itemsCents) : null,
    packPrice: lines.length && packPrice != null ? fromCents(toCents(packPrice)) : null,
    extrasTotal: extras.length ? fromCents(extrasCents) : null,
    productsTotal: fromCents(productsCents),
    shippingFee: fromCents(shipCents),
    total: fromCents(productsCents + shipCents),
    lines: lines.map(withLine),
    extras: extras.map(withLine),
  };
}

/* Téléphone marocain : 06/07/05 + 8 chiffres, ou +212 / 00212 */
export const normalizePhone = v => String(v || "").replace(/[\s.\-()]/g, "");
export const PHONE_RE = /^(0[5-7]\d{8}|(\+|00)212[5-7]\d{8})$/;

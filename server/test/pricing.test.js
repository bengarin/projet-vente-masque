import { test } from "node:test";
import assert from "node:assert/strict";
import { computeTotals, normalizePhone, PHONE_RE } from "../src/services/pricing.js";

const ship = { fee: 20, freeFrom: null };

test("somme des prix unitaires + frais de livraison", () => {
  const t = computeTotals({ lines: [{ unitPrice: 25.5, qty: 2 }, { unitPrice: 10.1, qty: 1 }], shipping: ship });
  assert.equal(t.itemsTotal, 61.1);
  assert.equal(t.total, 81.1);
});
test("prix fixe du pack prioritaire", () => {
  const t = computeTotals({ lines: [{ unitPrice: 30, qty: 3 }], packPrice: 75, shipping: ship });
  assert.equal(t.productsTotal, 75);
  assert.equal(t.itemsTotal, 90);
});
test("prix unitaire manquant sans prix de pack → refus", () => {
  assert.equal(computeTotals({ lines: [{ unitPrice: null, qty: 3 }], shipping: ship }).ok, false);
});
test("prix unitaire manquant mais prix de pack → accepté", () => {
  const t = computeTotals({ lines: [{ unitPrice: null, qty: 3 }], packPrice: 80, shipping: ship });
  assert.equal(t.ok, true); assert.equal(t.itemsTotal, null); assert.equal(t.total, 100);
});
test("livraison gratuite à partir du seuil", () => {
  assert.equal(computeTotals({ lines: [{ unitPrice: 100, qty: 3 }], shipping: { fee: 20, freeFrom: 300 } }).shippingFee, 0);
  assert.equal(computeTotals({ lines: [{ unitPrice: 99.99, qty: 3 }], shipping: { fee: 20, freeFrom: 300 } }).shippingFee, 20);
});
test("téléphone marocain", () => {
  for (const ok of ["06 12 34 56 78", "+212 6 12 34 56 78", "00212712345678", "0512345678"]) assert.ok(PHONE_RE.test(normalizePhone(ok)), ok);
  for (const ko of ["0812345678", "061234567", "+33612345678"]) assert.ok(!PHONE_RE.test(normalizePhone(ko)), ko);
});

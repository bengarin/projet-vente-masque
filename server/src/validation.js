/* Règles de validation des données reçues (côté serveur, même si le navigateur vérifie déjà). */
import { z } from "zod";
import { PHONE_RE, normalizePhone } from "./services/pricing.js";

export const ORDER_STATUSES = ["nouvelle", "confirmee", "en_preparation", "expediee", "livree", "annulee"];

const text = (max, min = 0) => z.string().trim().min(min, min ? "Champ obligatoire ou trop court." : undefined).max(max, `${max} caractères maximum.`);
const optText = max => z.union([z.string().trim().max(max, `${max} caractères maximum.`), z.null()]).optional()
  .transform(v => (v == null || v === "" ? null : v));
const money = z.union([z.number(), z.string().trim().regex(/^\d+([.,]\d{1,2})?$/, "Montant invalide (ex. 25 ou 25.50).")
  .transform(v => Number(v.replace(",", ".")))])
  .pipe(z.number({ error: "Montant invalide." }).min(0, "Doit être positif.").max(1_000_000, "Montant trop élevé."));
const optMoney = z.union([money, z.null(), z.literal("")]).optional().transform(v => (v === "" || v === undefined ? null : v));
const id = z.coerce.number().int().positive();
const bool = z.union([z.boolean(), z.literal(0), z.literal(1)]).transform(Boolean);

/* ---------- Commande publique ---------- */
export const orderInput = z.object({
  lang: z.enum(["fr", "ar", "en"]).default("fr"),
  // packSize = null / absent : commande sans pack (seulement des soins à l'unité)
  packSize: z.union([z.null(), z.coerce.number().int().min(1).max(12)]).optional().transform(v => v ?? null),
  items: z.array(z.object({ productId: id, qty: z.coerce.number().int().min(1).max(12) })).max(12).default([]),
  extras: z.array(z.object({ productId: id, qty: z.coerce.number().int().min(1, "Quantité invalide.").max(20, "20 maximum par soin.") })).max(20).default([]),
  customer: z.object({
    name: text(120, 2),
    phone: z.string().transform(normalizePhone).refine(v => PHONE_RE.test(v), "Numéro invalide : 10 chiffres (06…, 07…, 05…) ou +212…"),
    address: text(500, 6),
    city: text(120, 2),
    cityIsOther: z.boolean().default(false),
    area: optText(120),
  }),
  shippingMethodId: id,
  paymentMethodId: id,
}).refine(d => d.items.length || d.extras.length, { message: "Le panier est vide.", path: ["items"] })
  .refine(d => !d.items.length || d.packSize, { message: "Taille de pack manquante.", path: ["packSize"] });

/* ---------- Admin ---------- */
export const loginInput = z.object({
  email: z.string().trim().toLowerCase().email("E-mail invalide.").max(190),
  password: z.string().min(1, "Mot de passe requis.").max(200),
});

export const TAPES = ["ging", "dots", "grid", "ydots", "checkl", "check"];
export const productInput = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lettres minuscules, chiffres et tirets uniquement.").max(120).optional(),
  categoryId: z.union([id, z.null(), z.literal("")]).optional().transform(v => (v === "" || v === undefined ? null : v)),
  brand: text(120, 1),
  name: text(255, 1),
  introFr: optText(1500), introAr: optText(1500), introEn: optText(1500),
  descriptionFr: optText(5000), descriptionAr: optText(5000), descriptionEn: optText(5000),
  usageFr: optText(5000), usageAr: optText(5000), usageEn: optText(5000),
  typeFr: optText(200), typeAr: optText(200), typeEn: optText(200),
  contentFr: optText(200), contentAr: optText(200), contentEn: optText(200),
  highlightsFr: optText(5000), highlightsAr: optText(5000), highlightsEn: optText(5000),
  precautionsFr: optText(5000), precautionsAr: optText(5000), precautionsEn: optText(5000),
  packMentions: optText(5000),
  price: optMoney,
  // null/"" testés EN PREMIER : sinon z.coerce transforme null en 0 (stock « épuisé » au lieu de « non suivi »)
  stock: z.union([z.null(), z.literal(""), z.coerce.number().int("Nombre entier.").min(0, "Doit être positif.").max(1_000_000)])
    .optional().transform(v => (v === "" || v === undefined ? null : v)),
  isActive: bool.default(true),
  saleMode: z.enum(["pack", "unit"], { error: "Mode de vente invalide." }).default("pack"),
  tape: z.enum(TAPES).default("ging"),
  videoUrl: optText(500).refine(v => v == null || /^(https:\/\/|\/)/.test(v), "Lien https:// ou chemin /… uniquement."),
  sortOrder: z.coerce.number().int().min(-100000).max(100000).default(0),
});

export const statusInput = z.object({ status: z.enum(ORDER_STATUSES) });
export const noteInput = z.object({ adminNote: optText(5000) });

export const ordersQuery = z.object({
  status: z.union([z.enum(ORDER_STATUSES), z.literal("")]).optional(),
  number: z.string().trim().max(40).optional(),
  q: z.string().trim().max(120).optional(),
  from: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")]).optional(),
  to: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const settingsInput = z.object({
  storeName: text(120, 1),
  currency: text(10, 1),
  ordersEnabled: bool,
  lowStockThreshold: z.coerce.number().int().min(0).max(100000),
  // Meta Pixel : uniquement des chiffres (5 à 20), ou vide pour le désactiver
  metaPixelId: z.string().trim().regex(/^(\d{5,20})?$/, "L'identifiant Meta Pixel ne contient que des chiffres (ex. 1665012938525216).").optional(),
});

export const packSizeInput = z.object({
  size: z.coerce.number().int().min(1, "Entre 1 et 12.").max(12, "Entre 1 et 12."),
  price: optMoney,
  isActive: bool.default(true),
});

const labels = { labelFr: text(150, 1), labelAr: optText(150), labelEn: optText(150) };
export const shippingInput = z.object({
  ...labels,
  delayFr: optText(150), delayAr: optText(150), delayEn: optText(150),
  fee: money,
  freeFrom: optMoney,
  isActive: bool.default(true),
  sortOrder: z.coerce.number().int().default(0),
});
export const paymentInput = z.object({ ...labels, isActive: bool.default(true), sortOrder: z.coerce.number().int().default(0) });

export const categoryInput = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lettres minuscules, chiffres et tirets uniquement.").max(80),
  nameFr: text(120, 1), nameAr: optText(120), nameEn: optText(120),
  sortOrder: z.coerce.number().int().default(0),
});

export const imageOrderInput = z.object({ ids: z.array(id).max(50) });
export const idParam = z.coerce.number().int().positive();

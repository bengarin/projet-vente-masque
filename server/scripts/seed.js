/* Insère les données de départ (database/seed.sql) : produits existants SANS prix ni stock, tailles de pack 3/4/6,
   puis complète les fiches détaillées (database/fiches-produits.sql) sans écraser ce qui est déjà rempli. */
import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";
import { loadConfig, PROJECT_ROOT } from "../src/config.js";
import { applyFiches } from "./fiches.js";

const cfg = loadConfig({ needJwt: false });
const conn = await mysql.createConnection({ ...cfg.db, multipleStatements: true, charset: "utf8mb4" });
try {
  await conn.query(await fs.readFile(path.join(PROJECT_ROOT, "database", "seed.sql"), "utf8"));
  // Fiches détaillées (FR/AR/EN) : ne remplit que les champs encore vides, jamais les prix, le stock ou les photos
  await applyFiches(conn);
  const [[{ n }]] = await conn.query("SELECT COUNT(*) AS n FROM products");
  console.log(`✔ Données de départ insérées (${n} produits en base). Prix, stock, livraison et paiement restent à configurer dans l'admin.`);
} catch (e) {
  console.error("✖ Seed échoué :", e.message, "\n  As-tu lancé « npm run db:migrate » avant ?");
  process.exitCode = 1;
} finally {
  await conn.end();
}

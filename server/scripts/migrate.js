/* Applique les fichiers database/migrations/*.sql pas encore appliqués (suivi dans la table schema_migrations). */
import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";
import { loadConfig, PROJECT_ROOT } from "../src/config.js";
import { applyFiches } from "./fiches.js";

const cfg = loadConfig({ needJwt: false });
const dir = path.join(PROJECT_ROOT, "database", "migrations");

const conn = await mysql.createConnection({ ...cfg.db, multipleStatements: true, charset: "utf8mb4" }).catch(e => {
  console.error(`✖ Connexion MySQL impossible : ${e.code || e.message}\n  Vérifie server/.env et que la base « ${cfg.db.database} » existe (voir README).`);
  process.exit(1);
});
try {
  await conn.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name VARCHAR(190) PRIMARY KEY, applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  const [done] = await conn.query("SELECT name FROM schema_migrations");
  const applied = new Set(done.map(r => r.name));
  const files = (await fs.readdir(dir)).filter(f => f.endsWith(".sql")).sort();
  let n = 0;
  for (const f of files) {
    if (applied.has(f)) continue;
    console.log(`→ ${f}`);
    await conn.query(await fs.readFile(path.join(dir, f), "utf8"));
    await conn.query("INSERT INTO schema_migrations (name) VALUES (?)", [f]);
    n++;
  }
  console.log(n ? `✔ ${n} migration(s) appliquée(s).` : "✔ Base déjà à jour.");
  // Complète les fiches produit (champs vides uniquement) — rien si les produits ne sont pas encore créés
  await applyFiches(conn);
} catch (e) {
  console.error("✖ Migration échouée :", e.message);
  process.exitCode = 1;
} finally {
  await conn.end();
}

/* Démarrage du serveur API */
import { loadConfig } from "./config.js";
import { initDb, query } from "./db.js";
import { createApp } from "./app.js";

let cfg;
try {
  cfg = loadConfig();
} catch (e) {
  console.error(`\n✖ Configuration : ${e.message}\n`);
  process.exit(1);
}

initDb(cfg.db);
try {
  await query("SELECT 1");
} catch (e) {
  console.error(`\n✖ Connexion MySQL impossible (${e.code || e.message}). Vérifie DB_HOST / DB_USER / DB_PASSWORD / DB_NAME dans server/.env\n`);
  process.exit(1);
}

createApp(cfg).listen(cfg.port, () => {
  console.log(`✔ API prête sur http://localhost:${cfg.port}  (mode ${cfg.isProd ? "production" : "développement"})`);
});

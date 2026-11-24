/* Crée (ou réinitialise) un compte administrateur.
   Interactif :      npm run create-admin
   Non interactif :  ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run create-admin
   Le mot de passe n'est jamais stocké en clair : seulement son hash bcrypt. */
import readline from "node:readline";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import { loadConfig } from "../src/config.js";

function ask(question, hidden = false) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = s => { if (s.includes(question)) rl.output.write(s); else rl.output.write("*"); };
    }
    rl.question(question, a => { rl.close(); if (hidden) process.stdout.write("\n"); resolve(a.trim()); });
  });
}

const cfg = loadConfig({ needJwt: false });
const email = (process.env.ADMIN_EMAIL || await ask("E-mail de l'admin : ")).toLowerCase();
const name = process.env.ADMIN_NAME ?? (process.env.ADMIN_EMAIL ? "" : await ask("Nom (facultatif) : "));
let password = process.env.ADMIN_PASSWORD;
if (!password) {
  password = await ask("Mot de passe (12 caractères minimum) : ", true);
  const again = await ask("Confirme le mot de passe : ", true);
  if (again !== password) { console.error("✖ Les deux mots de passe sont différents."); process.exit(1); }
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { console.error("✖ E-mail invalide."); process.exit(1); }
if (password.length < 12) { console.error("✖ Mot de passe trop court (12 caractères minimum)."); process.exit(1); }

const conn = await mysql.createConnection({ ...cfg.db, charset: "utf8mb4" });
try {
  const hash = await bcrypt.hash(password, 12);
  const [r] = await conn.query(
    "INSERT INTO admins (email, name, password_hash) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = COALESCE(NULLIF(VALUES(name), ''), name)",
    [email, name || null, hash]);
  console.log(r.affectedRows === 1 ? `✔ Admin créé : ${email}` : `✔ Mot de passe mis à jour pour ${email}`);
} catch (e) {
  console.error("✖ Impossible de créer l'admin :", e.message, "\n  As-tu lancé « npm run db:migrate » avant ?");
  process.exitCode = 1;
} finally {
  await conn.end();
}

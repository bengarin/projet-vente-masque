/* Connexion MySQL (pool) + aide pour les transactions. Toutes les requêtes utilisent des paramètres « ? »
   (jamais de concaténation de texte venant du client) → protège contre l'injection SQL. */
import mysql from "mysql2/promise";

let pool = null;

export function initDb(dbConfig, extra = {}) {
  pool = mysql.createPool({
    ...dbConfig,
    charset: "utf8mb4",
    connectionLimit: 10,
    decimalNumbers: true,   // DECIMAL renvoyé en nombre JS
    dateStrings: false,
    timezone: "Z",
    ...extra,
  });
  return pool;
}

export function db() {
  if (!pool) throw new Error("Base de données non initialisée");
  return pool;
}

export async function query(sql, params = []) {
  const [rows] = await db().query(sql, params);
  return rows;
}

export async function transaction(fn) {
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (e) {
    await conn.rollback().catch(() => {});
    throw e;
  } finally {
    conn.release();
  }
}

export async function closeDb() {
  if (pool) await pool.end();
  pool = null;
}

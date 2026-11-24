/* Lecture et vérification du fichier .env — aucun secret n'est écrit dans le code. */
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const here = path.dirname(fileURLToPath(import.meta.url));
export const SERVER_ROOT = path.resolve(here, "..");
export const PROJECT_ROOT = path.resolve(SERVER_ROOT, "..");

dotenv.config({ path: path.join(SERVER_ROOT, ".env"), quiet: true });

function required(name) {
  const v = process.env[name];
  if (v === undefined || v === "") throw new Error(`Variable manquante dans server/.env : ${name} (voir server/.env.example)`);
  return v;
}

const isProd = process.env.NODE_ENV === "production";

export function loadConfig({ needJwt = true } = {}) {
  const cfg = {
    isProd,
    port: Number(process.env.PORT || 4000),
    db: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3306),
      user: required("DB_USER"),
      password: process.env.DB_PASSWORD ?? "",
      database: required("DB_NAME"),
    },
    jwtSecret: needJwt ? required("JWT_SECRET") : process.env.JWT_SECRET,
    sessionHours: Number(process.env.ADMIN_SESSION_HOURS || 8),
    cookieSecure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === "true" : isProd,
    trustProxy: process.env.TRUST_PROXY === "true",
    uploadsDir: path.join(SERVER_ROOT, "uploads"),
    clientDist: path.join(PROJECT_ROOT, "client", "dist"),
    maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 5),
  };
  if (needJwt && cfg.jwtSecret.length < 32) {
    throw new Error("JWT_SECRET doit contenir au moins 32 caractères aléatoires (voir README).");
  }
  if (isProd && !cfg.db.password) {
    throw new Error("DB_PASSWORD est vide : interdit en production.");
  }
  return cfg;
}

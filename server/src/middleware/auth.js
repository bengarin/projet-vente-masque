/* Protection des routes d'administration.
   - Session = jeton JWT signé, dans un cookie httpOnly (inaccessible au JavaScript du navigateur)
   - SameSite=Strict + contrôle de l'origine sur les requêtes qui modifient des données (anti-CSRF)
   - L'admin est relu en base à chaque requête : supprimer un compte coupe sa session. */
import jwt from "jsonwebtoken";
import { query } from "../db.js";

export const COOKIE = "mc_admin";

export function signSession(cfg, admin) {
  return jwt.sign({ sub: String(admin.id) }, cfg.jwtSecret, { expiresIn: `${cfg.sessionHours}h`, algorithm: "HS256" });
}

export function cookieOptions(cfg) {
  return { httpOnly: true, sameSite: "strict", secure: cfg.cookieSecure, path: "/api/admin", maxAge: cfg.sessionHours * 3600 * 1000 };
}

const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);

/* Refuse une requête qui modifie des données si elle vient d'un autre site */
export function sameOrigin(req, res, next) {
  if (SAFE.has(req.method)) return next();
  const origin = req.get("origin");
  if (origin) {
    let host;
    try { host = new URL(origin).host; } catch { host = null; }
    if (host !== req.get("host")) {
      return res.status(403).json({ error: { code: "bad_origin", message: "Origine de la requête refusée." } });
    }
  }
  next();
}

export function requireAdmin(cfg) {
  return async (req, res, next) => {
    const token = req.cookies?.[COOKIE];
    const deny = () => res.status(401).json({ error: { code: "unauthorized", message: "Connexion requise." } });
    if (!token) return deny();
    let payload;
    try {
      payload = jwt.verify(token, cfg.jwtSecret, { algorithms: ["HS256"] });
    } catch {
      return deny();
    }
    const [admin] = await query("SELECT id, email, name FROM admins WHERE id = ?", [Number(payload.sub)]);
    if (!admin) return deny();
    req.admin = admin;
    next();
  };
}

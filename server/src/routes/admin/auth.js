/* Connexion / déconnexion administrateur */
import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { query } from "../../db.js";
import { loginInput } from "../../validation.js";
import { COOKIE, cookieOptions, signSession, requireAdmin } from "../../middleware/auth.js";

// Hash factice : même temps de réponse que l'e-mail existe ou non
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", 12);

export function adminAuthRouter(cfg) {
  const r = Router();

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { error: { code: "rate_limited", message: "Trop de tentatives. Réessaie dans 15 minutes." } },
  });

  r.post("/login", loginLimiter, async (req, res) => {
    const { email, password } = loginInput.parse(req.body);
    const [admin] = await query("SELECT id, email, name, password_hash FROM admins WHERE email = ?", [email]);
    const ok = await bcrypt.compare(password, admin ? admin.password_hash : DUMMY_HASH);
    if (!admin || !ok) {
      return res.status(401).json({ error: { code: "bad_credentials", message: "E-mail ou mot de passe incorrect." } });
    }
    await query("UPDATE admins SET last_login_at = UTC_TIMESTAMP() WHERE id = ?", [admin.id]);
    res.cookie(COOKIE, signSession(cfg, admin), cookieOptions(cfg));
    res.json({ admin: { id: admin.id, email: admin.email, name: admin.name } });
  });

  r.post("/logout", (req, res) => {
    const { maxAge, ...opts } = cookieOptions(cfg);
    res.clearCookie(COOKIE, opts);
    res.json({ ok: true });
  });

  r.get("/me", requireAdmin(cfg), (req, res) => res.json({ admin: req.admin }));

  return r;
}

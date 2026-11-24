/* Assemblage de l'application Express */
import fs from "node:fs";
import path from "node:path";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./errors.js";
import { requireAdmin, sameOrigin } from "./middleware/auth.js";
import { shopRouter } from "./routes/shop.js";
import { adminAuthRouter } from "./routes/admin/auth.js";
import { dashboardRouter } from "./routes/admin/dashboard.js";
import { productsRouter } from "./routes/admin/products.js";
import { ordersRouter } from "./routes/admin/orders.js";
import { settingsRouter } from "./routes/admin/settings.js";

export function createApp(cfg) {
  const app = express();
  app.disable("x-powered-by");
  if (cfg.trustProxy) app.set("trust proxy", 1);   // derrière Nginx / un hébergeur : IP réelle pour la limite anti-abus

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", "blob:"],
        "media-src": ["'self'", "https:"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "script-src": ["'self'"],
        "connect-src": ["'self'"],
        "frame-ancestors": ["'none'"],
        // https forcé seulement quand le site tourne en HTTPS (sinon le test en local http:// casserait)
        "upgrade-insecure-requests": cfg.cookieSecure ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.get("/api/health", (req, res) => res.json({ ok: true }));

  /* API publique */
  app.use("/api/shop", sameOrigin, shopRouter());

  /* API admin : connexion libre, tout le reste protégé */
  app.use("/api/admin", sameOrigin, (req, res, next) => { res.set("Cache-Control", "no-store"); next(); });
  app.use("/api/admin/auth", adminAuthRouter(cfg));
  const guard = requireAdmin(cfg);
  app.use("/api/admin/dashboard", guard, dashboardRouter());
  app.use("/api/admin/products", guard, productsRouter(cfg));
  app.use("/api/admin/orders", guard, ordersRouter());
  app.use("/api/admin/settings", guard, settingsRouter());
  app.use("/api", (req, res) => res.status(404).json({ error: { code: "not_found", message: "Route API inconnue." } }));

  /* Photos envoyées depuis l'admin */
  app.use("/uploads", express.static(cfg.uploadsDir, { fallthrough: false, maxAge: "7d", index: false, dotfiles: "deny" }));

  /* En production : sert aussi le site React compilé (client/dist) */
  if (fs.existsSync(path.join(cfg.clientDist, "index.html"))) {
    app.use(express.static(cfg.clientDist, { index: false, maxAge: "1h" }));
    app.get("/{*splat}", (req, res) => res.sendFile(path.join(cfg.clientDist, "index.html")));
  }

  app.use(errorHandler);
  return app;
}

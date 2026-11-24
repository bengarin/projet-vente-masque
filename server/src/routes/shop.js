/* API publique de la boutique */
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { publicCatalog } from "../services/catalog.js";
import { createOrder } from "../services/orders.js";
import { orderInput } from "../validation.js";

export function shopRouter() {
  const r = Router();

  r.get("/catalog", async (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(await publicCatalog());
  });

  // Limite anti-abus : 10 commandes / 15 min par adresse IP
  const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false,
    message: { error: { code: "rate_limited", message: "Trop de commandes envoyées. Réessaie dans quelques minutes." } },
  });

  r.post("/orders", orderLimiter, async (req, res) => {
    const input = orderInput.parse(req.body);
    const order = await createOrder(input);
    res.status(201).json({ order });
  });

  return r;
}

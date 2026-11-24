/* Erreurs « prévues » renvoyées proprement au client, et gestionnaire global. */
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (msg, details) => new HttpError(400, "bad_request", msg, details);
export const notFound = (msg = "Introuvable") => new HttpError(404, "not_found", msg);
export const conflict = (code, msg, details) => new HttpError(409, code, msg, details);

/* Transforme les erreurs de validation zod en { champ: message } lisible par les formulaires */
export function zodFields(err) {
  const fields = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: { code: "validation", message: "Certaines données sont invalides.", fields: zodFields(err) } });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message, ...(err.details ? { details: err.details } : {}) } });
  }
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ error: { code: "bad_json", message: "Requête illisible (JSON invalide)." } });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: { code: "too_large", message: "Requête trop volumineuse." } });
  }
  if (err?.name === "MulterError") {
    const msg = err.code === "LIMIT_FILE_SIZE" ? "Image trop lourde." : "Envoi de fichier refusé.";
    return res.status(400).json({ error: { code: "upload", message: msg } });
  }
  if (err?.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: { code: "duplicate", message: "Cette valeur existe déjà (doublon)." } });
  }
  console.error("[erreur serveur]", err);
  res.status(500).json({ error: { code: "server", message: "Erreur interne du serveur. Réessaie plus tard." } });
}

/* Appels à l'API (même domaine). Renvoie le JSON, ou lance une ApiError lisible. */
export class ApiError extends Error {
  constructor(status, body) {
    const e = body?.error || {};
    super(e.message || (status === 0 ? "Connexion au serveur impossible." : `Erreur ${status}`));
    this.status = status;
    this.code = e.code || (status === 0 ? "network" : "http");
    this.fields = e.fields || {};
    this.details = e.details;
  }
}

export async function api(path, { method = "GET", body, form, signal } = {}) {
  const opts = { method, credentials: "same-origin", headers: { Accept: "application/json" }, signal };
  if (form) opts.body = form;
  else if (body !== undefined) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
  let res;
  try {
    res = await fetch(path, opts);
  } catch (e) {
    if (e.name === "AbortError") throw e;
    throw new ApiError(0, null);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

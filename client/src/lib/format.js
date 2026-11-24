/* Montant en dirhams (ou devise configurée dans l'admin) — null = pas de prix */
export const fmt = (v, currency = "") => v == null ? null
  : `${Number(v).toLocaleString("fr-MA", { minimumFractionDigits: Number(v) % 1 ? 2 : 0, maximumFractionDigits: 2 })}${currency ? " " + currency : ""}`;

/* Isole « 2/4 » ou un nom latin dans une phrase arabe */
export const iso = s => "⁦" + s + "⁩";
export const isoName = s => "⁨" + s + "⁩";

export const fmtDate = d => d ? new Date(d).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "";

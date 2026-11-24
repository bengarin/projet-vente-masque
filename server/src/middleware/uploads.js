/* Envoi de photos produit : JPEG, PNG ou WebP uniquement, taille limitée.
   Le type est vérifié sur le CONTENU du fichier (signature), pas seulement sur son nom. */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import multer from "multer";
import { badRequest } from "../errors.js";

const SIGNATURES = [
  { ext: "jpg", test: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: "png", test: b => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { ext: "webp", test: b => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
];

export function imageUpload(cfg) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: cfg.maxUploadMb * 1024 * 1024, files: 10 },
  }).array("images", 10);
}

/* Écrit les fichiers validés dans server/uploads et renvoie leurs URL publiques (/uploads/…) */
export async function saveImages(cfg, files = []) {
  if (!files.length) throw badRequest("Aucune image reçue.");
  const kinds = files.map(f => SIGNATURES.find(s => s.test(f.buffer)));
  if (kinds.some(k => !k)) throw badRequest("Format refusé : seules les images JPEG, PNG et WebP sont acceptées.");
  await fs.mkdir(cfg.uploadsDir, { recursive: true });
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const name = `${crypto.randomBytes(12).toString("hex")}.${kinds[i].ext}`;
    await fs.writeFile(path.join(cfg.uploadsDir, name), files[i].buffer, { flag: "wx" });
    urls.push(`/uploads/${name}`);
  }
  return urls;
}

/* Supprime le fichier d'une image envoyée via l'admin (les photos d'origine dans /images ne sont jamais effacées) */
export async function removeUploaded(cfg, url) {
  const m = /^\/uploads\/([a-f0-9]{24}\.(jpg|png|webp))$/.exec(url || "");
  if (!m) return;
  await fs.unlink(path.join(cfg.uploadsDir, m[1])).catch(() => {});
}

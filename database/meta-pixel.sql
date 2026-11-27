-- =====================================================================
-- Meta Pixel (27/11/2026) : identifiant fourni par la boutique.
-- Ajouté SEULEMENT s'il n'existe pas encore : une valeur saisie dans l'admin (Paramètres) est conservée.
-- Vide dans l'admin = pixel désactivé. L'identifiant est public (visible dans le navigateur), ce n'est pas un secret.
-- Appliqué par : npm run db:migrate, npm run db:seed, npm run db:fiches.
-- =====================================================================

-- fiche: reglage-meta-pixel | Meta Pixel (identifiant 1665012938525216) | 
INSERT IGNORE INTO settings (`key`, `value`) VALUES ('meta_pixel_id', '1665012938525216');

-- =====================================================================
-- 005 — Introduction de la fiche produit (FR / AR / EN)
--   Petit texte affiché en premier : ce que le produit apporte et comment il s'intègre au moment de soin.
--   Vide = bloc masqué sur la boutique.
-- =====================================================================
ALTER TABLE products ADD COLUMN intro_fr TEXT NULL AFTER name;
ALTER TABLE products ADD COLUMN intro_ar TEXT NULL AFTER intro_fr;
ALTER TABLE products ADD COLUMN intro_en TEXT NULL AFTER intro_ar;

-- =====================================================================
-- 003 — Fiche produit détaillée : type, contenance, points clés, précautions (FR / AR / EN)
-- NULL = information à confirmer (la boutique l'affiche clairement, sans rien inventer).
-- =====================================================================
ALTER TABLE products
  ADD COLUMN product_type_fr VARCHAR(200) NULL AFTER name,
  ADD COLUMN product_type_ar VARCHAR(200) NULL AFTER product_type_fr,
  ADD COLUMN product_type_en VARCHAR(200) NULL AFTER product_type_ar,
  ADD COLUMN content_fr VARCHAR(200) NULL COMMENT 'Contenance / quantité telle qu imprimée' AFTER product_type_en,
  ADD COLUMN content_ar VARCHAR(200) NULL AFTER content_fr,
  ADD COLUMN content_en VARCHAR(200) NULL AFTER content_ar,
  ADD COLUMN highlights_fr TEXT NULL COMMENT 'Points clés visibles sur l emballage, un par ligne' AFTER usage_en,
  ADD COLUMN highlights_ar TEXT NULL AFTER highlights_fr,
  ADD COLUMN highlights_en TEXT NULL AFTER highlights_ar,
  ADD COLUMN precautions_fr TEXT NULL AFTER highlights_en,
  ADD COLUMN precautions_ar TEXT NULL AFTER precautions_fr,
  ADD COLUMN precautions_en TEXT NULL AFTER precautions_ar;

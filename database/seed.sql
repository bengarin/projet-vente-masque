-- =====================================================================
-- Données de départ — reprises de l'ancien fichier assets/products.js
-- AUCUN prix, stock, frais de livraison ou mode de paiement n'est inventé :
--   price = NULL, stock = NULL (non suivi), aucune livraison / aucun paiement.
--   → À compléter depuis l'administration avant d'ouvrir les ventes.
-- Ré-exécutable sans doublon (INSERT IGNORE sur des clés uniques).
-- Appliqué par : npm run db:seed  (dossier server/)
-- =====================================================================

INSERT IGNORE INTO settings (`key`, `value`) VALUES
  ('store_name', 'mapetitecoree.ma'),
  ('currency', 'DH'),
  ('orders_enabled', '1'),
  ('low_stock_threshold', '3');

-- Tailles de pack prévues par le parcours. Prix du pack NULL = somme des prix unitaires.
INSERT IGNORE INTO pack_sizes (size, price, is_active) VALUES (3, NULL, 1), (4, NULL, 1), (6, NULL, 1);

-- [HYPOTHÈSE] une seule catégorie : les 6 produits sont des masques en tissu (« sheet mask » sur l'emballage).
INSERT IGNORE INTO categories (slug, name_fr, name_ar, name_en, sort_order) VALUES
  ('masques-tissu', 'Masques en tissu', 'ماسكات القماش', 'Sheet masks', 1);

SET @cat := (SELECT id FROM categories WHERE slug = 'masques-tissu');

INSERT IGNORE INTO products (slug, category_id, brand, name, pack_mentions, price, stock, is_active, tape, sort_order) VALUES
  ('collagen', @cat, 'MEDIHEAL', 'Collagen',
   'Core Firming\nMediheal Dermatology', NULL, NULL, 1, 'ging', 1),
  ('vitc', @cat, '7th Heaven', 'Nutriactive Vitamin C Advanced Serum Sheet Mask',
   'Vitamin C — 5% Active Complex*\nAnti-Fatigue — Brightening + Re-Energising\nFor all skin types\nVegan — Vegetarian Society Approved\n1 biodegradable sheet mask', NULL, NULL, 1, 'dots', 2),
  ('green', @cat, 'look AT ME', 'Green Blend Tea Tree + Cucumber Face Mask',
   'Revitalizing & Soothing\nTencel sheet\nMade in Korea', NULL, NULL, 1, 'grid', 3),
  ('hazel', @cat, 'IDC Institute', 'One Week Treatment — Hazel + Lavender',
   'Wednesday (3)\nHamamélis et Lavande\nNettoie les pores et élimine la fatigue de la peau\nFacial mask — 22 g / 0.73 fl.oz\nCruelty free', NULL, NULL, 1, 'ydots', 4),
  ('gluta', @cat, 'SOME BY MI', 'Real Glutathione Brightening Care Mask',
   'Moisturizing | Radiance\nClinical Solution — Dermatologist Tested\nA 100% plant-based biodegradable sheet mask formulated with Real Glutathione that revitalizes dull skin and promotes a brighter, more even skin tone.\nNet 20 g – 0.70 oz', NULL, NULL, 1, 'checkl', 5),
  ('rosegold', @cat, 'masque BAR', 'Rose Gold Foil Sheet Mask',
   'Unmasque Beauty\nMasqueBAR Rose Gold Foil Sheet Mask is enriched with extracts that help nourish and hydrate your skin.\nContains: Soybean Extract, Mushroom Extract, Witch Hazel Water\n1 complete mask — 30 ml / 1.01 US fl oz', NULL, NULL, 1, 'ging', 6);

-- Photos (servies par le frontend depuis client/public/images/produits/)
INSERT INTO product_images (product_id, url, sort_order)
SELECT p.id, v.url, 0 FROM products p
JOIN (
  SELECT 'collagen' AS slug, '/images/produits/mediheal-collagen.webp' AS url UNION ALL
  SELECT 'vitc',     '/images/produits/7th-heaven-vitamin-c.webp' UNION ALL
  SELECT 'green',    '/images/produits/lookatme-green-blend.webp' UNION ALL
  SELECT 'hazel',    '/images/produits/idc-hazel-lavender.webp' UNION ALL
  SELECT 'gluta',    '/images/produits/some-by-mi-glutathione.jpg' UNION ALL
  SELECT 'rosegold', '/images/produits/masquebar-rose-gold-foil.webp'
) v ON v.slug = p.slug
WHERE NOT EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = p.id);

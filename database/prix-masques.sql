-- =====================================================================
-- Prix unitaires des 6 masques (27/11/2026) : prix de vente choisis par la boutique (pas des prix du marché).
-- Posés SEULEMENT si le prix du masque est vide : un prix déjà saisi dans l'admin n'est JAMAIS écrasé.
-- Ne touche ni aux prix des packs, ni aux soins vendus à l'unité, ni à aucune autre donnée.
-- Appliqué par : npm run db:migrate, npm run db:seed, npm run db:fiches.
-- =====================================================================

-- fiche: prix-collagen | MEDIHEAL — Collagen : 40 DH | 
UPDATE products SET price = 40.00
WHERE price IS NULL AND sale_mode = 'pack' AND (slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%'));

-- fiche: prix-vitc | 7th Heaven — Nutriactive Vitamin C : 27 DH | 
UPDATE products SET price = 27.00
WHERE price IS NULL AND sale_mode = 'pack' AND (slug = 'vitc'
   OR (TRIM(brand) = '7th Heaven' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Nutriactive Vitamin C Advanced Serum Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%7th-heaven-vitamin-c%'));

-- fiche: prix-green | look AT ME — Green Blend Tea Tree + Cucumber : 29 DH | 
UPDATE products SET price = 29.00
WHERE price IS NULL AND sale_mode = 'pack' AND (slug = 'green'
   OR (TRIM(brand) = 'look AT ME' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Green Blend Tea Tree + Cucumber Face Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%lookatme-green-blend%'));

-- fiche: prix-hazel | IDC Institute — Hazel + Lavender : 29 DH | 
UPDATE products SET price = 29.00
WHERE price IS NULL AND sale_mode = 'pack' AND (slug = 'hazel'
   OR (TRIM(brand) = 'IDC Institute' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'One Week Treatment - Hazel + Lavender')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%idc-hazel-lavender%'));

-- fiche: prix-gluta | SOME BY MI — Real Glutathione : 40 DH | 
UPDATE products SET price = 40.00
WHERE price IS NULL AND sale_mode = 'pack' AND (slug = 'gluta'
   OR (TRIM(brand) = 'SOME BY MI' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Real Glutathione Brightening Care Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%some-by-mi-glutathione%'));

-- fiche: prix-rosegold | masque BAR — Rose Gold Foil : 35 DH | 
UPDATE products SET price = 35.00
WHERE price IS NULL AND sale_mode = 'pack' AND (slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%'));


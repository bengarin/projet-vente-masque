-- =====================================================================
-- Visuels d'ambiance (fournis le 25/11/2026) ajoutés à la galerie de chaque fiche produit.
-- La photo principale (sachet, utilisée sur les cartes) ne change pas : les visuels passent APRÈS.
-- Vérifiés : textes et illustrations conformes aux emballages (voir docs/photos-ambiance.md).
-- 4 visuels NON publiés (allégations non vérifiées / erreurs) : client/public/images/produits/ambiance/a-valider/
-- Ajout sans doublon ; produit reconnu par identifiant, marque + nom, ou photo d'origine.
-- Appliqué par : npm run db:migrate, npm run db:seed, npm run db:fiches.
-- =====================================================================

-- fiche: photo-collagen-1 | MEDIHEAL — Collagen (visuel d'ambiance 1) | /images/produits/ambiance/collagen-1.webp
INSERT INTO product_images (product_id, url, sort_order)
SELECT products.id, '/images/produits/ambiance/collagen-1.webp',
       (SELECT COALESCE(MAX(x.sort_order), 0) + 1 FROM product_images x WHERE x.product_id = products.id)
FROM products
WHERE (slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%'))
  AND NOT EXISTS (SELECT 1 FROM product_images j WHERE j.product_id = products.id AND j.url = '/images/produits/ambiance/collagen-1.webp');

-- fiche: photo-vitc-1 | 7th Heaven — Nutriactive Vitamin C (visuel d'ambiance 1) | /images/produits/ambiance/vitc-1.webp
INSERT INTO product_images (product_id, url, sort_order)
SELECT products.id, '/images/produits/ambiance/vitc-1.webp',
       (SELECT COALESCE(MAX(x.sort_order), 0) + 1 FROM product_images x WHERE x.product_id = products.id)
FROM products
WHERE (slug = 'vitc'
   OR (TRIM(brand) = '7th Heaven' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Nutriactive Vitamin C Advanced Serum Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%7th-heaven-vitamin-c%'))
  AND NOT EXISTS (SELECT 1 FROM product_images j WHERE j.product_id = products.id AND j.url = '/images/produits/ambiance/vitc-1.webp');

-- fiche: photo-vitc-2 | 7th Heaven — Nutriactive Vitamin C (visuel d'ambiance 2) | /images/produits/ambiance/vitc-2.webp
INSERT INTO product_images (product_id, url, sort_order)
SELECT products.id, '/images/produits/ambiance/vitc-2.webp',
       (SELECT COALESCE(MAX(x.sort_order), 0) + 1 FROM product_images x WHERE x.product_id = products.id)
FROM products
WHERE (slug = 'vitc'
   OR (TRIM(brand) = '7th Heaven' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Nutriactive Vitamin C Advanced Serum Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%7th-heaven-vitamin-c%'))
  AND NOT EXISTS (SELECT 1 FROM product_images j WHERE j.product_id = products.id AND j.url = '/images/produits/ambiance/vitc-2.webp');

-- fiche: photo-green-1 | look AT ME — Green Blend (visuel d'ambiance 1) | /images/produits/ambiance/green-1.webp
INSERT INTO product_images (product_id, url, sort_order)
SELECT products.id, '/images/produits/ambiance/green-1.webp',
       (SELECT COALESCE(MAX(x.sort_order), 0) + 1 FROM product_images x WHERE x.product_id = products.id)
FROM products
WHERE (slug = 'green'
   OR (TRIM(brand) = 'look AT ME' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Green Blend Tea Tree + Cucumber Face Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%lookatme-green-blend%'))
  AND NOT EXISTS (SELECT 1 FROM product_images j WHERE j.product_id = products.id AND j.url = '/images/produits/ambiance/green-1.webp');

-- fiche: photo-hazel-1 | IDC Institute — Hazel + Lavender (visuel d'ambiance 1) | /images/produits/ambiance/hazel-1.webp
INSERT INTO product_images (product_id, url, sort_order)
SELECT products.id, '/images/produits/ambiance/hazel-1.webp',
       (SELECT COALESCE(MAX(x.sort_order), 0) + 1 FROM product_images x WHERE x.product_id = products.id)
FROM products
WHERE (slug = 'hazel'
   OR (TRIM(brand) = 'IDC Institute' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'One Week Treatment - Hazel + Lavender')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%idc-hazel-lavender%'))
  AND NOT EXISTS (SELECT 1 FROM product_images j WHERE j.product_id = products.id AND j.url = '/images/produits/ambiance/hazel-1.webp');

-- fiche: photo-gluta-1 | SOME BY MI — Real Glutathione (visuel d'ambiance 1) | /images/produits/ambiance/gluta-1.webp
INSERT INTO product_images (product_id, url, sort_order)
SELECT products.id, '/images/produits/ambiance/gluta-1.webp',
       (SELECT COALESCE(MAX(x.sort_order), 0) + 1 FROM product_images x WHERE x.product_id = products.id)
FROM products
WHERE (slug = 'gluta'
   OR (TRIM(brand) = 'SOME BY MI' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Real Glutathione Brightening Care Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%some-by-mi-glutathione%'))
  AND NOT EXISTS (SELECT 1 FROM product_images j WHERE j.product_id = products.id AND j.url = '/images/produits/ambiance/gluta-1.webp');

-- fiche: photo-rosegold-1 | masque BAR — Rose Gold Foil (visuel d'ambiance 1) | /images/produits/ambiance/rosegold-1.webp
INSERT INTO product_images (product_id, url, sort_order)
SELECT products.id, '/images/produits/ambiance/rosegold-1.webp',
       (SELECT COALESCE(MAX(x.sort_order), 0) + 1 FROM product_images x WHERE x.product_id = products.id)
FROM products
WHERE (slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%'))
  AND NOT EXISTS (SELECT 1 FROM product_images j WHERE j.product_id = products.id AND j.url = '/images/produits/ambiance/rosegold-1.webp');

-- fiche: photo-rosegold-2 | masque BAR — Rose Gold Foil (visuel d'ambiance 2) | /images/produits/ambiance/rosegold-2.webp
INSERT INTO product_images (product_id, url, sort_order)
SELECT products.id, '/images/produits/ambiance/rosegold-2.webp',
       (SELECT COALESCE(MAX(x.sort_order), 0) + 1 FROM product_images x WHERE x.product_id = products.id)
FROM products
WHERE (slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%'))
  AND NOT EXISTS (SELECT 1 FROM product_images j WHERE j.product_id = products.id AND j.url = '/images/produits/ambiance/rosegold-2.webp');


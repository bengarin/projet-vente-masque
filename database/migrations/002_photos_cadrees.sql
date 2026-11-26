-- =====================================================================
-- 002 — Photos produit recadrées (même marge autour de chaque sachet)
-- Les versions de client/public/images/produits/carte/ ne changent rien au produit :
-- seul le fond blanc en trop est retiré, sans déformation. Les originaux restent dans images/produits/.
-- Ne touche QUE les 6 photos d'origine : les photos ajoutées depuis l'admin ne sont pas modifiées.
-- =====================================================================
UPDATE product_images SET url = '/images/produits/carte/mediheal-collagen.webp'       WHERE url = '/images/produits/mediheal-collagen.webp';
UPDATE product_images SET url = '/images/produits/carte/7th-heaven-vitamin-c.webp'    WHERE url = '/images/produits/7th-heaven-vitamin-c.webp';
UPDATE product_images SET url = '/images/produits/carte/lookatme-green-blend.webp'    WHERE url = '/images/produits/lookatme-green-blend.webp';
UPDATE product_images SET url = '/images/produits/carte/idc-hazel-lavender.webp'      WHERE url = '/images/produits/idc-hazel-lavender.webp';
UPDATE product_images SET url = '/images/produits/carte/some-by-mi-glutathione.webp'  WHERE url = '/images/produits/some-by-mi-glutathione.jpg';
UPDATE product_images SET url = '/images/produits/carte/masquebar-rose-gold-foil.webp' WHERE url = '/images/produits/masquebar-rose-gold-foil.webp';

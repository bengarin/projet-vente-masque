-- =====================================================================
-- 004 — Soins vendus à l'unité (hors packs de masques)
--   products.sale_mode : 'pack' = masque choisi dans un pack (3/4/6) ; 'unit' = soin acheté à l'unité
--   orders.pack_size   : NULL quand la commande ne contient que des soins
--   order_items.in_pack: 1 = ligne du pack, 0 = soin à l'unité
-- Les produits existants restent en 'pack' : rien ne change pour eux.
-- =====================================================================
ALTER TABLE products ADD COLUMN sale_mode ENUM('pack','unit') NOT NULL DEFAULT 'pack' AFTER category_id;
ALTER TABLE orders MODIFY pack_size TINYINT UNSIGNED NULL;
ALTER TABLE orders ADD COLUMN extras_total DECIMAL(10,2) NULL COMMENT 'Total des soins à l unité' AFTER pack_price;
ALTER TABLE order_items ADD COLUMN in_pack TINYINT(1) NOT NULL DEFAULT 1 AFTER product_id;

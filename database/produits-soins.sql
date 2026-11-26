-- =====================================================================
-- Soins vendus À L'UNITÉ (hors packs de masques) — ajoutés le 25/11/2026
-- Sources : visuels fournis par la propriétaire ; mode d'emploi confirmé par elle comme texte officiel ;
-- prix confirmés par elle (179 DH et 199 DH). Précautions et ingrédients : non visibles → vides.
-- Création seulement si le produit n'existe pas encore (même identifiant, ou même marque + nom) :
-- un produit déjà présent (et modifié dans l'admin) n'est JAMAIS écrasé. Ré-exécutable sans risque.
-- Appliqué par : npm run db:migrate, npm run db:seed, npm run db:fiches.
-- =====================================================================

-- fiche: categorie-soins | Catégorie « Soins du visage » | slug=soins-visage
INSERT IGNORE INTO categories (slug, name_fr, name_ar, name_en, sort_order) VALUES ('soins-visage', 'Soins du visage', 'العناية بالوجه', 'Face care', 2);

-- fiche: produit-orjena-power-collagen-emulsion | ORJENA — Power Collagen Emulsion (soin à l'unité) | slug=orjena-power-collagen-emulsion
INSERT INTO products (slug, category_id, sale_mode, brand, name, product_type_fr, content_fr, description_fr, usage_fr, highlights_fr, product_type_ar, content_ar, description_ar, usage_ar, highlights_ar, product_type_en, content_en, description_en, usage_en, highlights_en, pack_mentions, price, stock, is_active, tape, sort_order)
SELECT 'orjena-power-collagen-emulsion',
       (SELECT id FROM categories WHERE slug = 'soins-visage'),
       'unit',
       'ORJENA',
       'Power Collagen Emulsion',
       'Émulsion (soin du visage)',
       '100 ml / 3.38 fl oz',
       'Un flacon bordeaux chic et une émulsion au collagène : Power Collagen Emulsion d''ORJENA a tout pour te plaire ! Elle convient à tous les types de peau et se glisse facilement dans ta routine, juste après le nettoyage et le tonique. 100 ml à garder à portée de main.',
       '1. Nettoyez et tonifiez la peau.\n2. Versez l''émulsion dans la paume de la main.\n3. Appliquez par pressions douces.',
       'Au collagène : le collagène est mis en avant dès le nom de l''émulsion.\nPour toutes les peaux : indiquée pour tous les types de peau.\nFacile à intégrer : s''applique juste après le nettoyage et le tonique.\nFlacon de 100 ml : un grand format à garder à portée de main.',
       'مستحلب (عناية بالوجه)',
       '⁨100 ml / 3.38 fl oz⁩',
       'قارورة عنابية أنيقة ومستحلب بالكولاجين: ⁨Power Collagen Emulsion⁩ من ⁨ORJENA⁩ فيها كل ما يعجبك! مناسبة لجميع أنواع البشرة، وتندمج بسهولة في روتينك مباشرة بعد التنظيف والتونر. 100 مل لتبقى دائماً في متناول يدك.',
       '1. نظّفي البشرة ثم استعملي التونر.\n2. ضعي المستحلب في راحة يدك.\n3. طبّقيه بالضغط بلطف.',
       'بالكولاجين: يبرز الكولاجين منذ اسم المستحلب.\nلكل أنواع البشرة: مناسب لجميع أنواع البشرة.\nسهل الإدماج في روتينك: يُطبَّق مباشرة بعد التنظيف والتونر.\nقارورة 100 مل: حجم كبير يبقى دائماً في متناول يدك.',
       'Emulsion (face care)',
       '100 ml / 3.38 fl oz',
       'A chic burgundy bottle and a collagen emulsion: ORJENA''s Power Collagen Emulsion has everything to win you over! Suitable for all skin types, it slips easily into your routine, right after cleansing and toning. 100 ml to keep close at hand.',
       '1. Cleanse and tone your skin.\n2. Pour the emulsion into your palm.\n3. Apply by gently pressing it in.',
       'With collagen: collagen is featured right in the emulsion''s name.\nFor every skin type: suitable for all skin types.\nEasy to add: applied right after cleansing and toning.\n100 ml bottle: a large size to keep close at hand.',
       'ORJENA\nPower Collagen Emulsion\nSkin Elasticity\nSkin Nutrition\nRefresh\nFor all skin types\n100ml / 3.38 fl oz',
       179.00,
       NULL,
       1,
       'checkl',
       101
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products x WHERE x.slug = 'orjena-power-collagen-emulsion' OR (TRIM(x.brand) = 'ORJENA' AND TRIM(x.name) = 'Power Collagen Emulsion'));

-- fiche: photo-orjena-power-collagen-emulsion-0 | ORJENA — Power Collagen Emulsion (photo 1) | /images/produits/soins/orjena-power-collagen-emulsion.webp
INSERT INTO product_images (product_id, url, sort_order)
SELECT products.id, '/images/produits/soins/orjena-power-collagen-emulsion.webp', 0
FROM products
WHERE (products.slug = 'orjena-power-collagen-emulsion' OR (TRIM(products.brand) = 'ORJENA' AND TRIM(products.name) = 'Power Collagen Emulsion'))
  AND NOT EXISTS (SELECT 1 FROM product_images j WHERE j.product_id = products.id AND j.url = '/images/produits/soins/orjena-power-collagen-emulsion.webp');

-- fiche: photo-orjena-power-collagen-emulsion-1 | ORJENA — Power Collagen Emulsion (photo 2) | /images/produits/soins/orjena-power-collagen-emulsion-etapes.webp
INSERT INTO product_images (product_id, url, sort_order)
SELECT products.id, '/images/produits/soins/orjena-power-collagen-emulsion-etapes.webp', 1
FROM products
WHERE (products.slug = 'orjena-power-collagen-emulsion' OR (TRIM(products.brand) = 'ORJENA' AND TRIM(products.name) = 'Power Collagen Emulsion'))
  AND NOT EXISTS (SELECT 1 FROM product_images j WHERE j.product_id = products.id AND j.url = '/images/produits/soins/orjena-power-collagen-emulsion-etapes.webp');

-- fiche: produit-somebymi-yuja-niacin-anti-blemish-cream | SOME BY MI — Yuja Niacin Anti Blemish Cream (soin à l'unité) | slug=somebymi-yuja-niacin-anti-blemish-cream
INSERT INTO products (slug, category_id, sale_mode, brand, name, product_type_fr, content_fr, description_fr, usage_fr, highlights_fr, product_type_ar, content_ar, description_ar, usage_ar, highlights_ar, product_type_en, content_en, description_en, usage_en, highlights_en, pack_mentions, price, stock, is_active, tape, sort_order)
SELECT 'somebymi-yuja-niacin-anti-blemish-cream',
       (SELECT id FROM categories WHERE slug = 'soins-visage'),
       'unit',
       'SOME BY MI',
       'Yuja Niacin Anti Blemish Cream',
       'Crème (soin du visage)',
       'Net 60 g – 2.11 oz',
       'Un pot jaune soleil qui donne le sourire ! La crème Yuja Niacin de SOME BY MI associe l''extrait de yuja, un agrume coréen, à 5 % de niacinamide. Testée non comédogène selon la marque, elle s''applique en couche fine dans ta routine. Un pot de 60 g plein de peps.',
       '1. Nettoyez et tonifiez la peau.\n2. Prélevez une petite quantité de crème.\n3. Appliquez en couche fine.\nLe matin, terminez par une protection solaire.',
       'Extrait de yuja : un agrume coréen, ingrédient phare de la crème.\nNiacinamide à 5 % : un pourcentage affiché clairement sur la boîte.\nApplication simple : en couche fine, après le nettoyage et le tonique.\nPot de 60 g : un format pratique pour ta routine.',
       'كريم (عناية بالوجه)',
       'الوزن الصافي ⁨60 g – 2.11 oz⁩',
       'علبة صفراء مشرقة تبعث على الابتسامة! يجمع كريم ⁨Yuja Niacin⁩ من ⁨SOME BY MI⁩ بين مستخلص اليوجا، وهو حمضيات كورية، و5% من النياسيناميد. مختبَر بأنه لا يسدّ المسام حسب العلامة، ويُطبَّق بطبقة رقيقة ضمن روتينك. علبة بوزن 60 غرام مليئة بالحيوية.',
       '1. نظّفي البشرة ثم استعملي التونر.\n2. خذي كمية صغيرة من الكريم.\n3. طبّقيه بطبقة رقيقة.\nفي الصباح، اختمي باستعمال واقٍ من الشمس.',
       'مستخلص اليوجا: حمضيات كورية، المكوّن الأبرز في الكريم.\nنياسيناميد بنسبة 5%: نسبة مكتوبة بوضوح على العلبة.\nتطبيق سهل: بطبقة رقيقة بعد التنظيف والتونر.\nعلبة 60 غرام: حجم عملي لروتينك.',
       'Cream (face care)',
       'Net 60 g – 2.11 oz',
       'A sunny yellow jar that makes you smile! SOME BY MI''s Yuja Niacin cream pairs yuja extract, a Korean citrus fruit, with 5% niacinamide. Tested non-comedogenic according to the brand, it goes on in a thin layer as part of your routine. A cheerful 60 g jar.',
       '1. Cleanse and tone your skin.\n2. Take a small amount of cream.\n3. Apply in a thin layer.\nIn the morning, finish with sun protection.',
       'Yuja extract: a Korean citrus fruit, the cream''s signature ingredient.\n5% niacinamide: a percentage shown clearly on the box.\nSimple to apply: in a thin layer, after cleansing and toning.\n60 g jar: a handy size for your routine.',
       'YUJA NIACIN\nANTI BLEMISH CREAM\nYUJA EXTRACT\nNIACINAMIDE 5 %\nCLINICAL SOLUTION\nNon-Comedogenic Tested(*)\nNET 60 G – 2.11 OZ\nSOME BY MI',
       199.00,
       NULL,
       1,
       'ydots',
       102
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products x WHERE x.slug = 'somebymi-yuja-niacin-anti-blemish-cream' OR (TRIM(x.brand) = 'SOME BY MI' AND TRIM(x.name) = 'Yuja Niacin Anti Blemish Cream'));

-- fiche: photo-somebymi-yuja-niacin-anti-blemish-cream-0 | SOME BY MI — Yuja Niacin Anti Blemish Cream (photo 1) | /images/produits/soins/somebymi-yuja-niacin-cream.webp
INSERT INTO product_images (product_id, url, sort_order)
SELECT products.id, '/images/produits/soins/somebymi-yuja-niacin-cream.webp', 0
FROM products
WHERE (products.slug = 'somebymi-yuja-niacin-anti-blemish-cream' OR (TRIM(products.brand) = 'SOME BY MI' AND TRIM(products.name) = 'Yuja Niacin Anti Blemish Cream'))
  AND NOT EXISTS (SELECT 1 FROM product_images j WHERE j.product_id = products.id AND j.url = '/images/produits/soins/somebymi-yuja-niacin-cream.webp');

-- fiche: photo-somebymi-yuja-niacin-anti-blemish-cream-1 | SOME BY MI — Yuja Niacin Anti Blemish Cream (photo 2) | /images/produits/soins/somebymi-yuja-niacin-cream-ambiance.webp
INSERT INTO product_images (product_id, url, sort_order)
SELECT products.id, '/images/produits/soins/somebymi-yuja-niacin-cream-ambiance.webp', 1
FROM products
WHERE (products.slug = 'somebymi-yuja-niacin-anti-blemish-cream' OR (TRIM(products.brand) = 'SOME BY MI' AND TRIM(products.name) = 'Yuja Niacin Anti Blemish Cream'))
  AND NOT EXISTS (SELECT 1 FROM product_images j WHERE j.product_id = products.id AND j.url = '/images/produits/soins/somebymi-yuja-niacin-cream-ambiance.webp');


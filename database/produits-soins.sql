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
       'Dans son flacon bordeaux au bouchon argenté, Power Collagen Emulsion d''ORJENA est une émulsion qui met le collagène à l''honneur dès son nom. La marque la présente autour de trois mentions imprimées sur l''emballage — « Skin Elasticity », « Skin Nutrition » et « Refresh » — et l''indique pour tous les types de peau. Un geste tout en douceur à glisser dans ta routine, juste après le nettoyage et la tonification.',
       '1. Nettoyez et tonifiez la peau.\n2. Versez l''émulsion dans la paume de la main.\n3. Appliquez par pressions douces.',
       '« Skin Elasticity » (élasticité de la peau) — mention de l''emballage\n« Skin Nutrition » (nutrition de la peau) — mention de l''emballage\n« Refresh » (fraîcheur) — mention de l''emballage\nPour tous les types de peau (« For all skin types »)',
       'مستحلب (عناية بالوجه)',
       '⁨100 ml / 3.38 fl oz⁩',
       'في قارورتها العنابية ذات الغطاء الفضي، تضع ⁨Power Collagen Emulsion⁩ من ⁨ORJENA⁩ الكولاجين في الواجهة منذ اسمها. تقدّمها العلامة من خلال ثلاث عبارات مطبوعة على العلبة — «⁨Skin Elasticity⁩» و«⁨Skin Nutrition⁩» و«⁨Refresh⁩» — وهي مناسبة لجميع أنواع البشرة. خطوة لطيفة تضيفينها إلى روتينك مباشرة بعد التنظيف واستعمال التونر.',
       '1. نظّفي البشرة ثم استعملي التونر.\n2. ضعي المستحلب في راحة يدك.\n3. طبّقيه بالضغط بلطف.',
       '«⁨Skin Elasticity⁩» (مرونة البشرة) — عبارة مطبوعة على العلبة\n«⁨Skin Nutrition⁩» (تغذية البشرة) — عبارة مطبوعة على العلبة\n«⁨Refresh⁩» (الانتعاش) — عبارة مطبوعة على العلبة\nلجميع أنواع البشرة («⁨For all skin types⁩»)',
       'Emulsion (face care)',
       '100 ml / 3.38 fl oz',
       'In its burgundy bottle with a silver cap, ORJENA''s Power Collagen Emulsion puts collagen in the spotlight right from its name. The brand presents it with three mentions printed on the packaging — “Skin Elasticity”, “Skin Nutrition” and “Refresh” — and recommends it for all skin types. A gentle step to add to your routine, right after cleansing and toning.',
       '1. Cleanse and tone your skin.\n2. Pour the emulsion into your palm.\n3. Apply by gently pressing it in.',
       '“Skin Elasticity” — printed on the packaging\n“Skin Nutrition” — printed on the packaging\n“Refresh” — printed on the packaging\nFor all skin types',
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
       'Dans sa boîte jaune soleil, Yuja Niacin Anti Blemish Cream de SOME BY MI associe l''extrait de yuja — un agrume coréen — à 5 % de niacinamide, comme l''indique l''emballage. Son nom la présente comme une crème « Anti Blemish » (anti-imperfections) et la marque précise qu''elle a été testée non comédogène. Un pot de 60 g plein de peps à ajouter à ta routine.',
       '1. Nettoyez et tonifiez la peau.\n2. Prélevez une petite quantité de crème.\n3. Appliquez en couche fine.\nLe matin, terminez par une protection solaire.',
       'Niacinamide 5 % — écrit sur l''emballage\nExtrait de yuja (« Yuja Extract »), un agrume coréen\n« Non-Comedogenic Tested(*) » : testée non comédogène, selon la marque (*précision de l''astérisque à confirmer)\n« Clinical Solution » — mention de l''emballage',
       'كريم (عناية بالوجه)',
       'الوزن الصافي ⁨60 g – 2.11 oz⁩',
       'في علبتها الصفراء المشرقة، يجمع ⁨Yuja Niacin Anti Blemish Cream⁩ من ⁨SOME BY MI⁩ بين مستخلص اليوجا — وهو حمضيات كورية — و5% من النياسيناميد، كما هو مكتوب على العلبة. يقدّمه اسمه ككريم «⁨Anti Blemish⁩» (مضادّ للشوائب)، وتوضّح العلامة أنه مختبَر بأنه لا يسدّ المسام. علبة بوزن 60 غرام مليئة بالحيوية تضيفينها إلى روتينك.',
       '1. نظّفي البشرة ثم استعملي التونر.\n2. خذي كمية صغيرة من الكريم.\n3. طبّقيه بطبقة رقيقة.\nفي الصباح، اختمي باستعمال واقٍ من الشمس.',
       'نياسيناميد بنسبة 5% — مكتوب على العلبة\nمستخلص اليوجا («⁨Yuja Extract⁩»)، وهو حمضيات كورية\n«⁨Non-Comedogenic Tested(*)⁩»: مختبَر بأنه لا يسدّ المسام حسب العلامة (*توضيح النجمة في انتظار التأكيد)\n«⁨Clinical Solution⁩» — عبارة مطبوعة على العلبة',
       'Cream (face care)',
       'Net 60 g – 2.11 oz',
       'In its sunny yellow box, SOME BY MI''s Yuja Niacin Anti Blemish Cream pairs yuja extract — a Korean citrus fruit — with 5% niacinamide, as stated on the packaging. Its name presents it as an “Anti Blemish” cream, and the brand states that it has been tested non-comedogenic. A cheerful 60 g jar to add to your routine.',
       '1. Cleanse and tone your skin.\n2. Take a small amount of cream.\n3. Apply in a thin layer.\nIn the morning, finish with sun protection.',
       'Niacinamide 5% — printed on the packaging\nYuja Extract (yuja is a Korean citrus fruit)\n“Non-Comedogenic Tested(*)”, according to the brand (*asterisk footnote to be confirmed)\n“Clinical Solution” — printed on the packaging',
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


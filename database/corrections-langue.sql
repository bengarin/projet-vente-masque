-- =====================================================================
-- Corrections de langue (27/11/2026) : arabe standard (« الباك » → « باقتك »), tournures plus naturelles,
-- modes d'emploi FR au tutoiement comme le reste du site. Sens inchangé, aucune information ajoutée.
-- Remplace SEULEMENT la version générée exacte : un texte modifié dans l'admin n'est JAMAIS écrasé.
-- Appliqué par : npm run db:migrate, npm run db:seed, npm run db:fiches.
-- =====================================================================

-- fiche: langue-collagen-description_ar | collagen (description_ar) | 
UPDATE products SET description_ar = CASE WHEN description_ar = 'يضع قناع ⁨Collagen⁩ من ⁨MEDIHEAL⁩ الكولاجين في الواجهة: نقاوة 98% كما هو مذكور على الكيس. مختبَر جلدياً، ويأتي في عبوة فردية جاهزة للاستعمال. أضيفيه إلى الباك للحظة خاصة بك.'
  THEN 'يضع قناع ⁨Collagen⁩ من ⁨MEDIHEAL⁩ الكولاجين في الواجهة: نقاوة 98% كما هو مذكور على الكيس. مختبَر جلدياً، ويأتي في عبوة فردية جاهزة للاستعمال. أضيفيه إلى باقتك لتمنحي نفسك لحظة خاصة.' ELSE description_ar END
WHERE slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%');

-- fiche: langue-gluta-description_ar | gluta (description_ar) | 
UPDATE products SET description_ar = CASE WHEN description_ar = 'قناع أنيق يضع الغلوتاثيون في الواجهة! قناع ⁨Real Glutathione⁩ من ⁨SOME BY MI⁩ مختبَر جلدياً، ويأتي على ورقة نباتية 100% وقابلة للتحلل الحيوي. وسيجد كيسه المزيّن بالفقاعات الوردية مكانه بسرعة في الباك.'
  THEN 'قناع أنيق يضع الغلوتاثيون في الواجهة! قناع ⁨Real Glutathione⁩ من ⁨SOME BY MI⁩ مختبَر جلدياً، ويأتي على ورقة نباتية 100% وقابلة للتحلل الحيوي. وسيجد كيسه المزيّن بالفقاعات الوردية مكانه بسرعة في باقتك.' ELSE description_ar END
WHERE slug = 'gluta'
   OR (TRIM(brand) = 'SOME BY MI' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Real Glutathione Brightening Care Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%some-by-mi-glutathione%');

-- fiche: langue-rosegold-description_ar | rosegold (description_ar) | 
UPDATE products SET description_ar = CASE WHEN description_ar = 'لمسة فخامة في الباك! يجمع قناع ⁨Rose Gold Foil Sheet Mask⁩ من ⁨masque BAR⁩ ثلاثة مستخلصات: فول الصويا والفطر وماء الهماميليس. هو قناع كامل بحجم 30 مل، في كيس لامع بلون الذهب الوردي. مثالي لسهرة دلال مع الصديقات… أو بمفردك.'
  THEN 'لمسة فخامة في باقتك! يجمع قناع ⁨Rose Gold Foil Sheet Mask⁩ من ⁨masque BAR⁩ ثلاثة مستخلصات: فول الصويا والفطر وماء الهماميليس. هو قناع كامل بحجم 30 مل، في كيس لامع بلون الذهب الوردي. مثالي لسهرة دلال مع الصديقات… أو بمفردك.' ELSE description_ar END
WHERE slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%');

-- fiche: langue-gluta-highlights_ar | gluta (highlights_ar) | 
UPDATE products SET highlights_ar = CASE WHEN highlights_ar = 'الغلوتاثيون في الواجهة: المكوّن النجم، منذ اسم القناع.\nمختبَر جلدياً: عبارة ظاهرة على الكيس.\nورقة نباتية 100%: من أصل نباتي وقابلة للتحلل الحيوي.\nجاهز للاستعمال: قناع قماشي فردي بوزن 20 غرام.'
  THEN 'الغلوتاثيون في الواجهة: المكوّن النجم الذي يحمل القناع اسمه.\nمختبَر جلدياً: عبارة ظاهرة على الكيس.\nورقة نباتية 100%: من أصل نباتي وقابلة للتحلل الحيوي.\nجاهز للاستعمال: قناع قماشي فردي بوزن 20 غرام.' ELSE highlights_ar END
WHERE slug = 'gluta'
   OR (TRIM(brand) = 'SOME BY MI' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Real Glutathione Brightening Care Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%some-by-mi-glutathione%');

-- fiche: langue-gluta-highlights_fr | gluta (highlights_fr) | 
UPDATE products SET highlights_fr = CASE WHEN highlights_fr = 'Le glutathion à l''honneur : l''ingrédient vedette, dès le nom du masque.\nTesté dermatologiquement : une mention affichée sur le sachet.\nFeuille 100 % végétale : d''origine végétale et biodégradable.\nPrêt à l''emploi : un masque en tissu individuel de 20 g.'
  THEN 'Le glutathion à l''honneur : l''ingrédient vedette, qui donne son nom au masque.\nTesté dermatologiquement : une mention affichée sur le sachet.\nFeuille 100 % végétale : d''origine végétale et biodégradable.\nPrêt à l''emploi : un masque en tissu individuel de 20 g.' ELSE highlights_fr END
WHERE slug = 'gluta'
   OR (TRIM(brand) = 'SOME BY MI' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Real Glutathione Brightening Care Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%some-by-mi-glutathione%');

-- fiche: langue-gluta-highlights_en | gluta (highlights_en) | 
UPDATE products SET highlights_en = CASE WHEN highlights_en = 'Glutathione in the spotlight: the star ingredient, right in the mask''s name.\nDermatologically tested: a mention shown on the sachet.\n100% plant-based sheet: plant-based and biodegradable.\nReady to use: a single 20 g sheet mask.'
  THEN 'Glutathione in the spotlight: the star ingredient that gives the mask its name.\nDermatologically tested: a mention shown on the sachet.\n100% plant-based sheet: plant-based and biodegradable.\nReady to use: a single 20 g sheet mask.' ELSE highlights_en END
WHERE slug = 'gluta'
   OR (TRIM(brand) = 'SOME BY MI' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Real Glutathione Brightening Care Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%some-by-mi-glutathione%');

-- fiche: langue-orjena-power-collagen-emulsion-highlights_ar | orjena-power-collagen-emulsion (highlights_ar) | 
UPDATE products SET highlights_ar = CASE WHEN highlights_ar = 'لكل أنواع البشرة: مستحلب مناسب لجميع أنواع البشرة.\nالكولاجين في الواجهة: يبرز منذ اسم المستحلب.\nسهل الاستعمال: يُطبَّق مباشرة بعد التنظيف والتونر.\nحجم كبير: قارورة 100 مل تبقى في متناول يدك.'
  THEN 'لكل أنواع البشرة: مستحلب مناسب لجميع أنواع البشرة.\nالكولاجين في الواجهة: يبرز في اسم المستحلب نفسه.\nسهل الاستعمال: يُطبَّق مباشرة بعد التنظيف والتونر.\nحجم كبير: قارورة 100 مل تبقى في متناول يدك.' ELSE highlights_ar END
WHERE slug = 'orjena-power-collagen-emulsion' OR (TRIM(brand) = 'ORJENA' AND TRIM(name) = 'Power Collagen Emulsion');

-- fiche: langue-orjena-power-collagen-emulsion-usage_fr | orjena-power-collagen-emulsion (usage_fr) | 
UPDATE products SET usage_fr = CASE WHEN usage_fr = '1. Nettoyez et tonifiez la peau.\n2. Versez l''émulsion dans la paume de la main.\n3. Appliquez par pressions douces.'
  THEN '1. Nettoie ta peau, puis applique ton tonique.\n2. Verse l''émulsion dans le creux de ta main.\n3. Applique-la en pressant doucement.' ELSE usage_fr END
WHERE slug = 'orjena-power-collagen-emulsion' OR (TRIM(brand) = 'ORJENA' AND TRIM(name) = 'Power Collagen Emulsion');

-- fiche: langue-somebymi-yuja-niacin-anti-blemish-cream-usage_fr | somebymi-yuja-niacin-anti-blemish-cream (usage_fr) | 
UPDATE products SET usage_fr = CASE WHEN usage_fr = '1. Nettoyez et tonifiez la peau.\n2. Prélevez une petite quantité de crème.\n3. Appliquez en couche fine.\nLe matin, terminez par une protection solaire.'
  THEN '1. Nettoie ta peau, puis applique ton tonique.\n2. Prélève une petite quantité de crème.\n3. Applique-la en couche fine.\nLe matin, termine par une protection solaire.' ELSE usage_fr END
WHERE slug = 'somebymi-yuja-niacin-anti-blemish-cream' OR (TRIM(brand) = 'SOME BY MI' AND TRIM(name) = 'Yuja Niacin Anti Blemish Cream');

-- fiche: langue-categorie | Catégorie « Masques en tissu » (nom arabe) | 
UPDATE categories SET name_ar = CASE WHEN name_ar = 'ماسكات القماش' THEN 'الأقنعة القماشية' ELSE name_ar END WHERE slug = 'masques-tissu';


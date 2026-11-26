-- =====================================================================
-- Points forts v2 (26/11/2026) : phrases courtes et commerciales, uniquement des caractéristiques vérifiées, aucune allégation.
-- Pour les bases déjà installées : remplace l'ancienne version générée par la nouvelle,
-- SEULEMENT si le texte actuel est vide ou identique à l'ancienne version.
-- Un texte modifié dans l'admin n'est JAMAIS écrasé. Ne touche à aucune autre donnée.
-- Appliqué par : npm run db:migrate, npm run db:seed, npm run db:fiches.
-- =====================================================================

-- fiche: pf-collagen | MEDIHEAL — Collagen (points forts) | 
UPDATE products SET
  highlights_fr = CASE WHEN highlights_fr IS NULL OR TRIM(highlights_fr) = '' OR highlights_fr = 'Texte coréen : « 콜라겐 에센셜 마스크 » (« Collagen Essential Mask »)\nCollagène d''une pureté de 98 % (« Purity 98% Collagen »)\nMention « Core Firming » imprimée sur le sachet\n« Dermatology Test Completed » (testé dermatologiquement, selon l''emballage)\nGamme « Mediheal Dermatology » — « Our solution for all »'
                        THEN 'Collagène pur à 98 % : un taux de pureté affiché clairement sur le sachet.\nSigné MEDIHEAL : un soin de la gamme Mediheal Dermatology, testé dermatologiquement.\nFormat individuel : un masque dans son sachet, facile à glisser dans ton pack.' ELSE highlights_fr END,
  highlights_ar = CASE WHEN highlights_ar IS NULL OR TRIM(highlights_ar) = '' OR highlights_ar = 'النص الكوري: «⁨콜라겐 에센셜 마스크⁩» («⁨Collagen Essential Mask⁩»)\nكولاجين بنقاوة 98% («⁨Purity 98% Collagen⁩»)\nعبارة «⁨Core Firming⁩» مطبوعة على الغلاف\n«⁨Dermatology Test Completed⁩»: تم اختباره جلدياً حسب الغلاف\nمن مجموعة «⁨Mediheal Dermatology⁩» — «⁨Our solution for all⁩»'
                        THEN 'كولاجين بنقاوة 98%: نسبة النقاوة مذكورة بوضوح على الكيس.\nمن توقيع ⁨MEDIHEAL⁩: ضمن مجموعة ⁨Mediheal Dermatology⁩، ومختبَر جلدياً.\nعبوة فردية: قناع في كيسه الخاص، يسهل إضافته إلى الباك.' ELSE highlights_ar END,
  highlights_en = CASE WHEN highlights_en IS NULL OR TRIM(highlights_en) = '' OR highlights_en = 'Korean text: “콜라겐 에센셜 마스크” (“Collagen Essential Mask”)\n98% purity collagen (“Purity 98% Collagen”)\n“Core Firming” printed on the sachet\n“Dermatology Test Completed”, as stated on the packaging\n“Mediheal Dermatology” line — “Our solution for all”'
                        THEN '98% pure collagen: the purity level is shown clearly on the sachet.\nSigned MEDIHEAL: part of the Mediheal Dermatology line, dermatologically tested.\nSingle format: one mask in its own sachet, easy to slip into your pack.' ELSE highlights_en END
WHERE slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%');

-- fiche: pf-vitc | 7th Heaven — Nutriactive Vitamin C Advanced Serum Sheet Mask (points forts) | 
UPDATE products SET
  highlights_fr = CASE WHEN highlights_fr IS NULL OR TRIM(highlights_fr) = '' OR highlights_fr = 'Vitamine C — complexe actif à 5 %* (*précision de l''astérisque à confirmer, non lisible sur la photo)\n« Anti-Fatigue » : « Brightening + Re-Energising », selon la marque\nPour tous les types de peau\nVegan — approuvé par la Vegetarian Society\nFeuille biodégradable'
                        THEN 'Sérum à la vitamine C : un masque en tissu associé à un sérum à la vitamine C.\nPour toutes les peaux : indiqué pour tous les types de peau.\nVegan : approuvé par la Vegetarian Society.\nFeuille biodégradable : le masque est conçu avec une feuille biodégradable.' ELSE highlights_fr END,
  highlights_ar = CASE WHEN highlights_ar IS NULL OR TRIM(highlights_ar) = '' OR highlights_ar = 'فيتامين ⁨C⁩ — مركّب نشط بنسبة 5%* (*توضيح النجمة في انتظار التأكيد، غير مقروء في الصورة)\n«⁨Anti-Fatigue⁩»: «⁨Brightening + Re-Energising⁩» حسب العلامة\nلجميع أنواع البشرة\nنباتي (⁨Vegan⁩) — معتمد من ⁨Vegetarian Society⁩\nورقة قابلة للتحلل الحيوي'
                        THEN 'سيروم بفيتامين ⁨C⁩: قناع قماشي مرفق بسيروم بفيتامين ⁨C⁩.\nلكل أنواع البشرة: مناسب لجميع أنواع البشرة.\nنباتي (⁨Vegan⁩): معتمد من ⁨Vegetarian Society⁩.\nورقة قابلة للتحلل الحيوي: القناع مصنوع من ورقة قابلة للتحلل الحيوي.' ELSE highlights_ar END,
  highlights_en = CASE WHEN highlights_en IS NULL OR TRIM(highlights_en) = '' OR highlights_en = 'Vitamin C — 5% Active Complex* (*asterisk footnote to be confirmed, not legible on the photo)\n“Anti-Fatigue”: “Brightening + Re-Energising”, according to the brand\nFor all skin types\nVegan — Vegetarian Society Approved\nBiodegradable sheet'
                        THEN 'Vitamin C serum: a sheet mask paired with a vitamin C serum.\nFor every skin type: suitable for all skin types.\nVegan: approved by the Vegetarian Society.\nBiodegradable sheet: the mask is made with a biodegradable sheet.' ELSE highlights_en END
WHERE slug = 'vitc'
   OR (TRIM(brand) = '7th Heaven' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Nutriactive Vitamin C Advanced Serum Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%7th-heaven-vitamin-c%');

-- fiche: pf-green | look AT ME — Green Blend Tea Tree + Cucumber Face Mask (points forts) | 
UPDATE products SET
  highlights_fr = CASE WHEN highlights_fr IS NULL OR TRIM(highlights_fr) = '' OR highlights_fr = 'Arbre à thé + concombre (« Tea Tree + Cucumber »)\n« Revitalizing & Soothing », selon la marque\nFeuille en Tencel (« Tencel sheet »)\nFabriqué en Corée (« Made in Korea »)'
                        THEN 'Arbre à thé & concombre : un duo d''ingrédients mis en avant dès le nom.\nFeuille en Tencel : un masque visage sur une feuille en Tencel.\nFabriqué en Corée : un masque coréen au sachet illustré plein de charme.\nFormat 25 ml : un masque individuel, prêt à l''emploi.' ELSE highlights_fr END,
  highlights_ar = CASE WHEN highlights_ar IS NULL OR TRIM(highlights_ar) = '' OR highlights_ar = 'شجرة الشاي + الخيار («⁨Tea Tree + Cucumber⁩»)\n«⁨Revitalizing & Soothing⁩» حسب العلامة\nورقة من ألياف ⁨Tencel⁩\nصُنع في كوريا («⁨Made in Korea⁩»)'
                        THEN 'شجرة الشاي والخيار: ثنائي من المكوّنات يبرز منذ اسم المنتج.\nورقة من ألياف ⁨Tencel⁩: قناع للوجه على ورقة من ألياف ⁨Tencel⁩.\nصُنع في كوريا: قناع كوري بكيس مرسوم مليء بالسحر.\nعبوة 25 مل: قناع فردي جاهز للاستعمال.' ELSE highlights_ar END,
  highlights_en = CASE WHEN highlights_en IS NULL OR TRIM(highlights_en) = '' OR highlights_en = 'Tea Tree + Cucumber\n“Revitalizing & Soothing”, according to the brand\nTencel sheet\nMade in Korea'
                        THEN 'Tea tree & cucumber: a duo of ingredients featured right in the name.\nTencel sheet: a face mask on a Tencel sheet.\nMade in Korea: a Korean mask with a charming illustrated sachet.\n25 ml format: a single mask, ready to use.' ELSE highlights_en END
WHERE slug = 'green'
   OR (TRIM(brand) = 'look AT ME' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Green Blend Tea Tree + Cucumber Face Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%lookatme-green-blend%');

-- fiche: pf-hazel | IDC Institute — One Week Treatment — Hazel + Lavender (points forts) | 
UPDATE products SET
  highlights_fr = CASE WHEN highlights_fr IS NULL OR TRIM(highlights_fr) = '' OR highlights_fr = 'Gamme « One Week Treatment » — masque n°3, « Wednesday » (mercredi)\nHamamélis + lavande (« Hazel + Lavender »)\n« Nettoie les pores et élimine la fatigue de la peau » — texte imprimé par la marque\nLogo « Cruelty free »'
                        THEN 'Gamme One Week Treatment : le masque n°3, celui du mercredi (« Wednesday »).\nHamamélis & lavande : deux ingrédients mis en avant sur le sachet.\nCruelty free : le logo est affiché sur l''emballage.\nFormat 22 g : un masque visage individuel.' ELSE highlights_fr END,
  highlights_ar = CASE WHEN highlights_ar IS NULL OR TRIM(highlights_ar) = '' OR highlights_ar = 'مجموعة «⁨One Week Treatment⁩» — القناع رقم 3، «⁨Wednesday⁩» (الأربعاء)\nالهماميليس واللافندر («⁨Hazel + Lavender⁩»)\n«ينظّف مسام البشرة ويزيل عنها التعب» — نص مطبوع من العلامة\nشعار «⁨Cruelty free⁩»'
                        THEN 'مجموعة ⁨One Week Treatment⁩: القناع رقم 3، قناع يوم الأربعاء («⁨Wednesday⁩»).\nالهماميليس واللافندر: مكوّنان بارزان على الكيس.\n⁨Cruelty free⁩: الشعار ظاهر على الغلاف.\nعبوة 22 غرام: قناع فردي للوجه.' ELSE highlights_ar END,
  highlights_en = CASE WHEN highlights_en IS NULL OR TRIM(highlights_en) = '' OR highlights_en = '“One Week Treatment” line — mask no. 3, “Wednesday”\nHazel + Lavender (witch hazel and lavender)\n“Clean the pore of skin and remove fatique from your face” — text printed by the brand (spelling as printed)\n“Cruelty free” logo'
                        THEN 'One Week Treatment line: mask no. 3, the Wednesday one.\nWitch hazel & lavender: two ingredients featured on the sachet.\nCruelty free: the logo is shown on the packaging.\n22 g format: a single facial mask.' ELSE highlights_en END
WHERE slug = 'hazel'
   OR (TRIM(brand) = 'IDC Institute' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'One Week Treatment - Hazel + Lavender')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%idc-hazel-lavender%');

-- fiche: pf-gluta | SOME BY MI — Real Glutathione Brightening Care Mask (points forts) | 
UPDATE products SET
  highlights_fr = CASE WHEN highlights_fr IS NULL OR TRIM(highlights_fr) = '' OR highlights_fr = 'Formulé avec du « Real Glutathione » (glutathion)\n« Moisturizing | Radiance », selon la marque\n« Clinical Solution — Dermatologist Tested »\nFeuille 100 % d''origine végétale et biodégradable'
                        THEN 'Au glutathion : l''ingrédient vedette, mis en avant dès le nom.\nFeuille 100 % végétale : d''origine végétale et biodégradable.\nTesté dermatologiquement : une mention affichée sur le sachet.\nFormat 20 g : un masque en tissu individuel.' ELSE highlights_fr END,
  highlights_ar = CASE WHEN highlights_ar IS NULL OR TRIM(highlights_ar) = '' OR highlights_ar = 'مركّب بالغلوتاثيون («⁨Real Glutathione⁩»)\n«⁨Moisturizing | Radiance⁩» حسب العلامة\n«⁨Clinical Solution — Dermatologist Tested⁩»\nورقة نباتية 100% وقابلة للتحلل الحيوي'
                        THEN 'بالغلوتاثيون: المكوّن النجم، يبرز منذ اسم المنتج.\nورقة نباتية 100%: من أصل نباتي وقابلة للتحلل الحيوي.\nمختبَر جلدياً: عبارة ظاهرة على الكيس.\nعبوة 20 غرام: قناع قماشي فردي.' ELSE highlights_ar END,
  highlights_en = CASE WHEN highlights_en IS NULL OR TRIM(highlights_en) = '' OR highlights_en = 'Formulated with Real Glutathione\n“Moisturizing | Radiance”, according to the brand\n“Clinical Solution — Dermatologist Tested”\n100% plant-based biodegradable sheet'
                        THEN 'With glutathione: the star ingredient, featured right in the name.\n100% plant-based sheet: plant-based and biodegradable.\nDermatologically tested: a mention shown on the sachet.\n20 g format: a single sheet mask.' ELSE highlights_en END
WHERE slug = 'gluta'
   OR (TRIM(brand) = 'SOME BY MI' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Real Glutathione Brightening Care Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%some-by-mi-glutathione%');

-- fiche: pf-rosegold | masque BAR — Rose Gold Foil Sheet Mask (points forts) | 
UPDATE products SET
  highlights_fr = CASE WHEN highlights_fr IS NULL OR TRIM(highlights_fr) = '' OR highlights_fr = 'Contient : extrait de soja, extrait de champignon, eau d''hamamélis (ingrédients mis en avant sur l''emballage — liste complète à confirmer)\n« Enrichi d''extraits qui aident à nourrir et hydrater la peau » — texte de la marque\nLigne « Unmasque Beauty »'
                        THEN 'Soja, champignon & hamamélis : trois extraits mis en avant sur le sachet.\nMasque complet de 30 ml : un format individuel, prêt à l''emploi.\nStyle rose doré : un sachet élégant de la ligne Unmasque Beauty.' ELSE highlights_fr END,
  highlights_ar = CASE WHEN highlights_ar IS NULL OR TRIM(highlights_ar) = '' OR highlights_ar = 'يحتوي على: مستخلص فول الصويا، مستخلص الفطر، ماء الهماميليس (مكوّنات بارزة على الغلاف — القائمة الكاملة في انتظار التأكيد)\n«غني بمستخلصات تساعد على تغذية البشرة وترطيبها» — نص العلامة\nخط «⁨Unmasque Beauty⁩»'
                        THEN 'الصويا والفطر والهماميليس: ثلاثة مستخلصات بارزة على الكيس.\nقناع كامل بحجم 30 مل: عبوة فردية جاهزة للاستعمال.\nلمسة الذهب الوردي: كيس أنيق من خط ⁨Unmasque Beauty⁩.' ELSE highlights_ar END,
  highlights_en = CASE WHEN highlights_en IS NULL OR TRIM(highlights_en) = '' OR highlights_en = 'Contains: Soybean Extract, Mushroom Extract, Witch Hazel Water (ingredients highlighted on the packaging — full list to be confirmed)\n“Enriched with extracts that help nourish and hydrate your skin” — brand text\n“Unmasque Beauty” line'
                        THEN 'Soybean, mushroom & witch hazel: three extracts featured on the sachet.\nComplete 30 ml mask: a single format, ready to use.\nRose-gold style: an elegant sachet from the Unmasque Beauty line.' ELSE highlights_en END
WHERE slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%');

-- fiche: pf-orjena-power-collagen-emulsion | ORJENA — Power Collagen Emulsion (points forts) | 
UPDATE products SET
  highlights_fr = CASE WHEN highlights_fr IS NULL OR TRIM(highlights_fr) = '' OR highlights_fr = '« Skin Elasticity » (élasticité de la peau) — mention de l''emballage\n« Skin Nutrition » (nutrition de la peau) — mention de l''emballage\n« Refresh » (fraîcheur) — mention de l''emballage\nPour tous les types de peau (« For all skin types »)'
                        THEN 'Au collagène : le collagène est mis en avant dès le nom de l''émulsion.\nPour toutes les peaux : indiquée pour tous les types de peau.\nFacile à intégrer : s''applique juste après le nettoyage et le tonique.\nFlacon de 100 ml : un grand format à garder à portée de main.' ELSE highlights_fr END,
  highlights_ar = CASE WHEN highlights_ar IS NULL OR TRIM(highlights_ar) = '' OR highlights_ar = '«⁨Skin Elasticity⁩» (مرونة البشرة) — عبارة مطبوعة على العلبة\n«⁨Skin Nutrition⁩» (تغذية البشرة) — عبارة مطبوعة على العلبة\n«⁨Refresh⁩» (الانتعاش) — عبارة مطبوعة على العلبة\nلجميع أنواع البشرة («⁨For all skin types⁩»)'
                        THEN 'بالكولاجين: يبرز الكولاجين منذ اسم المستحلب.\nلكل أنواع البشرة: مناسب لجميع أنواع البشرة.\nسهل الإدماج في روتينك: يُطبَّق مباشرة بعد التنظيف والتونر.\nقارورة 100 مل: حجم كبير يبقى دائماً في متناول يدك.' ELSE highlights_ar END,
  highlights_en = CASE WHEN highlights_en IS NULL OR TRIM(highlights_en) = '' OR highlights_en = '“Skin Elasticity” — printed on the packaging\n“Skin Nutrition” — printed on the packaging\n“Refresh” — printed on the packaging\nFor all skin types'
                        THEN 'With collagen: collagen is featured right in the emulsion''s name.\nFor every skin type: suitable for all skin types.\nEasy to add: applied right after cleansing and toning.\n100 ml bottle: a large size to keep close at hand.' ELSE highlights_en END
WHERE slug = 'orjena-power-collagen-emulsion' OR (TRIM(brand) = 'ORJENA' AND TRIM(name) = 'Power Collagen Emulsion');

-- fiche: pf-somebymi-yuja-niacin-anti-blemish-cream | SOME BY MI — Yuja Niacin Anti Blemish Cream (points forts) | 
UPDATE products SET
  highlights_fr = CASE WHEN highlights_fr IS NULL OR TRIM(highlights_fr) = '' OR highlights_fr = 'Niacinamide 5 % — écrit sur l''emballage\nExtrait de yuja (« Yuja Extract »), un agrume coréen\n« Non-Comedogenic Tested(*) » : testée non comédogène, selon la marque (*précision de l''astérisque à confirmer)\n« Clinical Solution » — mention de l''emballage'
                        THEN 'Extrait de yuja : un agrume coréen, ingrédient phare de la crème.\nNiacinamide à 5 % : un pourcentage affiché clairement sur la boîte.\nApplication simple : en couche fine, après le nettoyage et le tonique.\nPot de 60 g : un format pratique pour ta routine.' ELSE highlights_fr END,
  highlights_ar = CASE WHEN highlights_ar IS NULL OR TRIM(highlights_ar) = '' OR highlights_ar = 'نياسيناميد بنسبة 5% — مكتوب على العلبة\nمستخلص اليوجا («⁨Yuja Extract⁩»)، وهو حمضيات كورية\n«⁨Non-Comedogenic Tested(*)⁩»: مختبَر بأنه لا يسدّ المسام حسب العلامة (*توضيح النجمة في انتظار التأكيد)\n«⁨Clinical Solution⁩» — عبارة مطبوعة على العلبة'
                        THEN 'مستخلص اليوجا: حمضيات كورية، المكوّن الأبرز في الكريم.\nنياسيناميد بنسبة 5%: نسبة مكتوبة بوضوح على العلبة.\nتطبيق سهل: بطبقة رقيقة بعد التنظيف والتونر.\nعلبة 60 غرام: حجم عملي لروتينك.' ELSE highlights_ar END,
  highlights_en = CASE WHEN highlights_en IS NULL OR TRIM(highlights_en) = '' OR highlights_en = 'Niacinamide 5% — printed on the packaging\nYuja Extract (yuja is a Korean citrus fruit)\n“Non-Comedogenic Tested(*)”, according to the brand (*asterisk footnote to be confirmed)\n“Clinical Solution” — printed on the packaging'
                        THEN 'Yuja extract: a Korean citrus fruit, the cream''s signature ingredient.\n5% niacinamide: a percentage shown clearly on the box.\nSimple to apply: in a thin layer, after cleansing and toning.\n60 g jar: a handy size for your routine.' ELSE highlights_en END
WHERE slug = 'somebymi-yuja-niacin-anti-blemish-cream' OR (TRIM(brand) = 'SOME BY MI' AND TRIM(name) = 'Yuja Niacin Anti Blemish Cream');


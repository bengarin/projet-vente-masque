-- =====================================================================
-- Fiches sobres (27/11/2026) : descriptions sans situation inventée ni question marketing,
-- et 3 lignes « Pourquoi le choisir ? » rendues factuelles (MEDIHEAL, ORJENA, masque BAR).
-- Remplace SEULEMENT la version générée exacte : un texte modifié dans l'admin n'est JAMAIS écrasé.
-- Appliqué par : npm run db:migrate, npm run db:seed, npm run db:fiches.
-- =====================================================================

-- fiche: sobre-desc-collagen | collagen (description) | 
UPDATE products SET
  description_fr = CASE WHEN description_fr IS NULL OR TRIM(description_fr) = '' OR description_fr = 'Le masque Collagen de MEDIHEAL met le collagène à l''honneur : 98 % de pureté, annoncés sur le sachet. Testé dermatologiquement, il se présente en format individuel, prêt à l''emploi. Glisse-le dans ton pack pour un moment rien qu''à toi.'
      THEN 'Masque de la gamme Mediheal Dermatology, présenté dans un sachet individuel rose et blanc.' ELSE description_fr END,
  description_ar = CASE WHEN description_ar IS NULL OR TRIM(description_ar) = '' OR description_ar = 'يضع قناع ⁨Collagen⁩ من ⁨MEDIHEAL⁩ الكولاجين في الواجهة: نقاوة 98% كما هو مذكور على الكيس. مختبَر جلدياً، ويأتي في عبوة فردية جاهزة للاستعمال. أضيفيه إلى باقتك لتمنحي نفسك لحظة خاصة.'
      THEN 'قناع من مجموعة ⁨Mediheal Dermatology⁩، في كيس فردي باللونين الوردي والأبيض.' ELSE description_ar END,
  description_en = CASE WHEN description_en IS NULL OR TRIM(description_en) = '' OR description_en = 'MEDIHEAL''s Collagen mask puts collagen in the spotlight: 98% purity, as stated on the sachet. Dermatologically tested, it comes as a single mask, ready to use. Slip it into your pack for a moment just for you.'
      THEN 'A mask from the Mediheal Dermatology line, in an individual pink and white sachet.' ELSE description_en END
WHERE slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%');

-- fiche: sobre-desc-vitc | vitc (description) | 
UPDATE products SET
  description_fr = CASE WHEN description_fr IS NULL OR TRIM(description_fr) = '' OR description_fr = 'Un masque qui convient à toutes les peaux : un choix facile ! Ce masque en tissu 7th Heaven associe un sérum à la vitamine C et une feuille biodégradable. Il est végan, approuvé par la Vegetarian Society, et arrive dans un sachet orange tout pétillant.'
      THEN 'Masque de la gamme Nutriactive de 7th Heaven, présenté dans un sachet individuel orange.' ELSE description_fr END,
  description_ar = CASE WHEN description_ar IS NULL OR TRIM(description_ar) = '' OR description_ar = 'قناع يناسب جميع أنواع البشرة: اختيار سهل! يجمع هذا القناع القماشي من ⁨7th Heaven⁩ بين سيروم بفيتامين سي وورقة قابلة للتحلل الحيوي. وهو نباتي، معتمد من ⁨Vegetarian Society⁩، ويأتي في كيس برتقالي مشرق.'
      THEN 'قناع من مجموعة ⁨Nutriactive⁩ من ⁨7th Heaven⁩، في كيس فردي برتقالي.' ELSE description_ar END,
  description_en = CASE WHEN description_en IS NULL OR TRIM(description_en) = '' OR description_en = 'A mask that suits every skin type: an easy pick! This 7th Heaven sheet mask pairs a vitamin C serum with a biodegradable sheet. It''s vegan, approved by the Vegetarian Society, and comes in a bright orange sachet.'
      THEN 'A mask from 7th Heaven''s Nutriactive line, in an individual orange sachet.' ELSE description_en END
WHERE slug = 'vitc'
   OR (TRIM(brand) = '7th Heaven' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Nutriactive Vitamin C Advanced Serum Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%7th-heaven-vitamin-c%');

-- fiche: sobre-desc-green | green (description) | 
UPDATE products SET
  description_fr = CASE WHEN description_fr IS NULL OR TRIM(description_fr) = '' OR description_fr = 'Un masque coréen tout en vert, avec un duo végétal : l''arbre à thé et le concombre. Fabriqué en Corée, il se présente sur une feuille en Tencel, dans un sachet illustré plein de bonne humeur. Un petit plaisir à partager… ou à garder pour toi.'
      THEN 'Masque de la marque look AT ME, présenté dans un sachet individuel vert et illustré.' ELSE description_fr END,
  description_ar = CASE WHEN description_ar IS NULL OR TRIM(description_ar) = '' OR description_ar = 'قناع كوري باللون الأخضر يجمع ثنائياً نباتياً: شجرة الشاي والخيار. صُنع في كوريا، ويأتي على ورقة من ألياف ⁨Tencel⁩ في كيس مرسوم مليء بالمرح. متعة صغيرة تتشاركينها… أو تحتفظين بها لنفسك.'
      THEN 'قناع من علامة ⁨look AT ME⁩، في كيس فردي أخضر مزيَّن برسوم.' ELSE description_ar END,
  description_en = CASE WHEN description_en IS NULL OR TRIM(description_en) = '' OR description_en = 'An all-green Korean mask with a plant duo: tea tree and cucumber. Made in Korea, it comes on a Tencel sheet, in a cheerful illustrated sachet. A little treat to share… or keep all to yourself.'
      THEN 'A mask from look AT ME, in an individual green illustrated sachet.' ELSE description_en END
WHERE slug = 'green'
   OR (TRIM(brand) = 'look AT ME' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Green Blend Tea Tree + Cucumber Face Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%lookatme-green-blend%');

-- fiche: sobre-desc-hazel | hazel (description) | 
UPDATE products SET
  description_fr = CASE WHEN description_fr IS NULL OR TRIM(description_fr) = '' OR description_fr = 'Un rendez-vous beauté chaque mercredi ? Ce masque visage IDC Institute est le n°3 de la gamme One Week Treatment : celui du mercredi. Il réunit l''hamamélis et la lavande dans un joli sachet violet et argent. Et il n''est pas testé sur les animaux.'
      THEN 'Masque n°3 de la gamme One Week Treatment d''IDC Institute, présenté dans un sachet individuel violet et argent.' ELSE description_fr END,
  description_ar = CASE WHEN description_ar IS NULL OR TRIM(description_ar) = '' OR description_ar = 'موعد جمال كل أربعاء؟ هذا القناع من ⁨IDC Institute⁩ هو الرقم 3 في مجموعة ⁨One Week Treatment⁩: قناع يوم الأربعاء. يجمع بين الهماميليس واللافندر في كيس أنيق بلونَي البنفسجي والفضي، وهو غير مختبَر على الحيوانات.'
      THEN 'القناع رقم 3 من مجموعة ⁨One Week Treatment⁩ من ⁨IDC Institute⁩، في كيس فردي بلونَي البنفسجي والفضي.' ELSE description_ar END,
  description_en = CASE WHEN description_en IS NULL OR TRIM(description_en) = '' OR description_en = 'Fancy a Wednesday beauty date? This IDC Institute facial mask is no. 3 in the One Week Treatment line: the Wednesday one. It brings together witch hazel and lavender in a pretty purple and silver sachet. And it''s cruelty free.'
      THEN 'Mask no. 3 in IDC Institute''s One Week Treatment line, in an individual purple and silver sachet.' ELSE description_en END
WHERE slug = 'hazel'
   OR (TRIM(brand) = 'IDC Institute' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'One Week Treatment - Hazel + Lavender')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%idc-hazel-lavender%');

-- fiche: sobre-desc-gluta | gluta (description) | 
UPDATE products SET
  description_fr = CASE WHEN description_fr IS NULL OR TRIM(description_fr) = '' OR description_fr = 'Un masque élégant qui met le glutathion à l''honneur ! Le Real Glutathione de SOME BY MI est testé dermatologiquement et se présente sur une feuille 100 % végétale et biodégradable. Son sachet tout en bulles roses trouvera vite sa place dans ton pack.'
      THEN 'Masque de la marque SOME BY MI, présenté dans un sachet individuel blanc et rose.' ELSE description_fr END,
  description_ar = CASE WHEN description_ar IS NULL OR TRIM(description_ar) = '' OR description_ar = 'قناع أنيق يضع الغلوتاثيون في الواجهة! قناع ⁨Real Glutathione⁩ من ⁨SOME BY MI⁩ مختبَر جلدياً، ويأتي على ورقة نباتية 100% وقابلة للتحلل الحيوي. وسيجد كيسه المزيّن بالفقاعات الوردية مكانه بسرعة في باقتك.'
      THEN 'قناع من علامة ⁨SOME BY MI⁩، في كيس فردي باللونين الأبيض والوردي.' ELSE description_ar END,
  description_en = CASE WHEN description_en IS NULL OR TRIM(description_en) = '' OR description_en = 'An elegant mask that puts glutathione in the spotlight! SOME BY MI''s Real Glutathione is dermatologically tested and comes on a 100% plant-based, biodegradable sheet. Its pink-bubble sachet will soon find its place in your pack.'
      THEN 'A mask from SOME BY MI, in an individual white and pink sachet.' ELSE description_en END
WHERE slug = 'gluta'
   OR (TRIM(brand) = 'SOME BY MI' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Real Glutathione Brightening Care Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%some-by-mi-glutathione%');

-- fiche: sobre-desc-rosegold | rosegold (description) | 
UPDATE products SET
  description_fr = CASE WHEN description_fr IS NULL OR TRIM(description_fr) = '' OR description_fr = 'Une touche de glamour dans ton pack ! Le Rose Gold Foil Sheet Mask de masque BAR réunit trois extraits : soja, champignon et eau d''hamamélis. C''est un masque complet de 30 ml, dans un sachet rose doré qui brille. Idéal pour une soirée douceur entre copines… ou en solo.'
      THEN 'Masque de la ligne Unmasque Beauty de masque BAR, présenté dans un sachet individuel rose doré.' ELSE description_fr END,
  description_ar = CASE WHEN description_ar IS NULL OR TRIM(description_ar) = '' OR description_ar = 'لمسة فخامة في باقتك! يجمع قناع ⁨Rose Gold Foil Sheet Mask⁩ من ⁨masque BAR⁩ ثلاثة مستخلصات: فول الصويا والفطر وماء الهماميليس. هو قناع كامل بحجم 30 مل، في كيس لامع بلون الذهب الوردي. مثالي لسهرة دلال مع الصديقات… أو بمفردك.'
      THEN 'قناع من خط ⁨Unmasque Beauty⁩ من ⁨masque BAR⁩، في كيس فردي بلون الذهب الوردي.' ELSE description_ar END,
  description_en = CASE WHEN description_en IS NULL OR TRIM(description_en) = '' OR description_en = 'A touch of glam for your pack! masque BAR''s Rose Gold Foil Sheet Mask brings together three extracts: soybean, mushroom and witch hazel water. It''s one complete 30 ml mask, in a shiny rose-gold sachet. Ideal for a cosy night in with friends… or solo.'
      THEN 'A mask from masque BAR''s Unmasque Beauty line, in an individual rose-gold sachet.' ELSE description_en END
WHERE slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%');

-- fiche: sobre-desc-orjena-power-collagen-emulsion | orjena-power-collagen-emulsion (description) | 
UPDATE products SET
  description_fr = CASE WHEN description_fr IS NULL OR TRIM(description_fr) = '' OR description_fr = 'Une émulsion qui convient à tous les types de peau, avec le collagène à l''honneur ! Power Collagen Emulsion d''ORJENA se glisse facilement dans ta routine, juste après le nettoyage et le tonique. Son flacon bordeaux chic de 100 ml se garde à portée de main.'
      THEN 'Émulsion ORJENA présentée dans un flacon bordeaux, dans sa boîte.' ELSE description_fr END,
  description_ar = CASE WHEN description_ar IS NULL OR TRIM(description_ar) = '' OR description_ar = 'مستحلب يناسب جميع أنواع البشرة، والكولاجين في الواجهة! يندمج ⁨Power Collagen Emulsion⁩ من ⁨ORJENA⁩ بسهولة في روتينك، مباشرة بعد التنظيف والتونر. وتبقى قارورته العنابية الأنيقة بحجم 100 مل دائماً في متناول يدك.'
      THEN 'مستحلب من ⁨ORJENA⁩ في قارورة عنابية داخل علبتها.' ELSE description_ar END,
  description_en = CASE WHEN description_en IS NULL OR TRIM(description_en) = '' OR description_en = 'An emulsion that suits all skin types, with collagen in the spotlight! ORJENA''s Power Collagen Emulsion slips easily into your routine, right after cleansing and toning. Its chic 100 ml burgundy bottle stays close at hand.'
      THEN 'An ORJENA emulsion in a burgundy bottle, in its box.' ELSE description_en END
WHERE slug = 'orjena-power-collagen-emulsion' OR (TRIM(brand) = 'ORJENA' AND TRIM(name) = 'Power Collagen Emulsion');

-- fiche: sobre-desc-somebymi-yuja-niacin-anti-blemish-cream | somebymi-yuja-niacin-anti-blemish-cream (description) | 
UPDATE products SET
  description_fr = CASE WHEN description_fr IS NULL OR TRIM(description_fr) = '' OR description_fr = 'Un pot jaune soleil qui donne le sourire ! La crème Yuja Niacin de SOME BY MI associe l''extrait de yuja, un agrume coréen, à 5 % de niacinamide. Elle s''applique en couche fine, après le nettoyage et le tonique. Un pot de 60 g plein de peps.'
      THEN 'Crème SOME BY MI présentée dans une boîte jaune.' ELSE description_fr END,
  description_ar = CASE WHEN description_ar IS NULL OR TRIM(description_ar) = '' OR description_ar = 'علبة صفراء مشرقة تبعث على الابتسامة! يجمع كريم ⁨Yuja Niacin⁩ من ⁨SOME BY MI⁩ بين مستخلص اليوجا، وهو حمضيات كورية، و5% من النياسيناميد. يُطبَّق بطبقة رقيقة بعد التنظيف والتونر. علبة بوزن 60 غرام مليئة بالحيوية.'
      THEN 'كريم من ⁨SOME BY MI⁩ في علبة صفراء.' ELSE description_ar END,
  description_en = CASE WHEN description_en IS NULL OR TRIM(description_en) = '' OR description_en = 'A sunny yellow jar that makes you smile! SOME BY MI''s Yuja Niacin cream pairs yuja extract, a Korean citrus fruit, with 5% niacinamide. It goes on in a thin layer, after cleansing and toning. A cheerful 60 g jar.'
      THEN 'A SOME BY MI cream in a yellow box.' ELSE description_en END
WHERE slug = 'somebymi-yuja-niacin-anti-blemish-cream' OR (TRIM(brand) = 'SOME BY MI' AND TRIM(name) = 'Yuja Niacin Anti Blemish Cream');

-- fiche: sobre-hl-collagen-fr | collagen (points forts FR) | 
UPDATE products SET highlights_fr = CASE WHEN highlights_fr = 'Le collagène à l''honneur : un collagène pur à 98 %, indiqué sur le sachet.\nTesté dermatologiquement : un masque de la gamme Mediheal Dermatology.\nPrêt en un geste : un masque individuel, facile à emporter ou à offrir.'
  THEN 'Le collagène à l''honneur : un collagène pur à 98 %, indiqué sur le sachet.\nTesté dermatologiquement : un masque de la gamme Mediheal Dermatology.\nFormat individuel : un masque par sachet.' ELSE highlights_fr END
WHERE slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%');

-- fiche: sobre-hl-collagen-en | collagen (points forts EN) | 
UPDATE products SET highlights_en = CASE WHEN highlights_en = 'Collagen in the spotlight: 98% pure collagen, as stated on the sachet.\nDermatologically tested: a mask from the Mediheal Dermatology line.\nReady in one step: a single mask, easy to take along or give as a gift.'
  THEN 'Collagen in the spotlight: 98% pure collagen, as stated on the sachet.\nDermatologically tested: a mask from the Mediheal Dermatology line.\nSingle format: one mask per sachet.' ELSE highlights_en END
WHERE slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%');

-- fiche: sobre-hl-collagen-ar | collagen (points forts AR) | 
UPDATE products SET highlights_ar = CASE WHEN highlights_ar = 'الكولاجين في الواجهة: كولاجين بنقاوة 98% كما هو مذكور على الكيس.\nمختبَر جلدياً: قناع من مجموعة ⁨Mediheal Dermatology⁩.\nجاهز في خطوة واحدة: قناع فردي يسهل حمله أو تقديمه هدية.'
  THEN 'الكولاجين في الواجهة: كولاجين بنقاوة 98% كما هو مذكور على الكيس.\nمختبَر جلدياً: قناع من مجموعة ⁨Mediheal Dermatology⁩.\nعبوة فردية: قناع واحد في كل كيس.' ELSE highlights_ar END
WHERE slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%');

-- fiche: sobre-hl-orjena-power-collagen-emulsion-fr | orjena-power-collagen-emulsion (points forts FR) | 
UPDATE products SET highlights_fr = CASE WHEN highlights_fr = 'Pour toutes les peaux : une émulsion indiquée pour tous les types de peau.\nLe collagène à l''honneur : mis en avant dès le nom de l''émulsion.\nFacile à adopter : s''applique juste après le nettoyage et le tonique.\nGrand format : un flacon de 100 ml à garder à portée de main.'
  THEN 'Pour toutes les peaux : une émulsion indiquée pour tous les types de peau.\nLe collagène à l''honneur : mis en avant dès le nom de l''émulsion.\nFacile à adopter : s''applique juste après le nettoyage et le tonique.\nContenance : un flacon de 100 ml.' ELSE highlights_fr END
WHERE slug = 'orjena-power-collagen-emulsion' OR (TRIM(brand) = 'ORJENA' AND TRIM(name) = 'Power Collagen Emulsion');

-- fiche: sobre-hl-orjena-power-collagen-emulsion-en | orjena-power-collagen-emulsion (points forts EN) | 
UPDATE products SET highlights_en = CASE WHEN highlights_en = 'For every skin type: an emulsion suitable for all skin types.\nCollagen in the spotlight: featured right in the emulsion''s name.\nEasy to adopt: applied right after cleansing and toning.\nLarge size: a 100 ml bottle to keep close at hand.'
  THEN 'For every skin type: an emulsion suitable for all skin types.\nCollagen in the spotlight: featured right in the emulsion''s name.\nEasy to adopt: applied right after cleansing and toning.\nSize: a 100 ml bottle.' ELSE highlights_en END
WHERE slug = 'orjena-power-collagen-emulsion' OR (TRIM(brand) = 'ORJENA' AND TRIM(name) = 'Power Collagen Emulsion');

-- fiche: sobre-hl-orjena-power-collagen-emulsion-ar | orjena-power-collagen-emulsion (points forts AR) | 
UPDATE products SET highlights_ar = CASE WHEN highlights_ar = 'لكل أنواع البشرة: مستحلب مناسب لجميع أنواع البشرة.\nالكولاجين في الواجهة: يبرز في اسم المستحلب نفسه.\nسهل الاستعمال: يُطبَّق مباشرة بعد التنظيف والتونر.\nحجم كبير: قارورة 100 مل تبقى في متناول يدك.'
  THEN 'لكل أنواع البشرة: مستحلب مناسب لجميع أنواع البشرة.\nالكولاجين في الواجهة: يبرز في اسم المستحلب نفسه.\nسهل الاستعمال: يُطبَّق مباشرة بعد التنظيف والتونر.\nالحجم: قارورة بحجم 100 مل.' ELSE highlights_ar END
WHERE slug = 'orjena-power-collagen-emulsion' OR (TRIM(brand) = 'ORJENA' AND TRIM(name) = 'Power Collagen Emulsion');

-- fiche: sobre-hl-rosegold-fr | rosegold (points forts FR) | 
UPDATE products SET highlights_fr = CASE WHEN highlights_fr = 'Trois extraits : soja, champignon et hamamélis, mis en avant sur le sachet.\nUn masque complet : un format individuel de 30 ml, prêt à l''emploi.\nUne touche chic : un sachet rose doré de la ligne Unmasque Beauty.'
  THEN 'Trois extraits : soja, champignon et hamamélis, mis en avant sur le sachet.\nUn masque complet : un format individuel de 30 ml, prêt à l''emploi.\nLigne Unmasque Beauty : un sachet individuel rose doré.' ELSE highlights_fr END
WHERE slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%');

-- fiche: sobre-hl-rosegold-en | rosegold (points forts EN) | 
UPDATE products SET highlights_en = CASE WHEN highlights_en = 'Three extracts: soybean, mushroom and witch hazel, featured on the sachet.\nA complete mask: a single 30 ml format, ready to use.\nA chic touch: a rose-gold sachet from the Unmasque Beauty line.'
  THEN 'Three extracts: soybean, mushroom and witch hazel, featured on the sachet.\nA complete mask: a single 30 ml format, ready to use.\nUnmasque Beauty line: an individual rose-gold sachet.' ELSE highlights_en END
WHERE slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%');

-- fiche: sobre-hl-rosegold-ar | rosegold (points forts AR) | 
UPDATE products SET highlights_ar = CASE WHEN highlights_ar = 'ثلاثة مستخلصات: الصويا والفطر والهماميليس، بارزة على الكيس.\nقناع كامل: عبوة فردية بحجم 30 مل جاهزة للاستعمال.\nلمسة أنيقة: كيس بلون الذهب الوردي من خط ⁨Unmasque Beauty⁩.'
  THEN 'ثلاثة مستخلصات: الصويا والفطر والهماميليس، بارزة على الكيس.\nقناع كامل: عبوة فردية بحجم 30 مل جاهزة للاستعمال.\nخط ⁨Unmasque Beauty⁩: كيس فردي بلون الذهب الوردي.' ELSE highlights_ar END
WHERE slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%');


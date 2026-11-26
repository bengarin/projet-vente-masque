-- =====================================================================
-- Fiches détaillées des 6 produits d'origine (FR / AR / EN)
-- Rédigées UNIQUEMENT à partir des textes lisibles sur les photos des emballages (voir docs/fiches-produits.md).
-- Les phrases de la marque sont citées entre « » et attribuées.
-- Mode d'emploi et précautions : NON visibles sur les photos → laissés vides (la boutique affiche « Information à confirmer »).
-- Un champ déjà rempli (par exemple depuis l'admin) n'est JAMAIS écrasé ; un champ vide ('' ou NULL) est complété.
-- Produit reconnu par : identifiant d'origine, OU marque + nom officiels, OU photo d'origine.
-- Appliqué automatiquement par : npm run db:migrate, npm run db:seed et npm run db:fiches (compte rendu détaillé).
-- Ne touche ni aux prix, ni au stock, ni aux photos. Ré-exécutable sans risque.
-- =====================================================================

-- fiche: collagen | MEDIHEAL — Collagen
UPDATE products SET
  product_type_fr = COALESCE(NULLIF(TRIM(product_type_fr), ''), 'Masque — format exact (tissu, gel…) à confirmer'),
  product_type_ar = COALESCE(NULLIF(TRIM(product_type_ar), ''), 'قناع — نوعه بالتحديد (قماشي، جل…) في انتظار التأكيد'),
  product_type_en = COALESCE(NULLIF(TRIM(product_type_en), ''), 'Mask — exact format (sheet, gel…) to be confirmed'),
  content_fr = COALESCE(NULLIF(TRIM(content_fr), ''), NULL),
  content_ar = COALESCE(NULLIF(TRIM(content_ar), ''), NULL),
  content_en = COALESCE(NULLIF(TRIM(content_en), ''), NULL),
  highlights_fr = COALESCE(NULLIF(TRIM(highlights_fr), ''), 'Collagène pur à 98 % : un taux de pureté affiché clairement sur le sachet.\nSigné MEDIHEAL : un soin de la gamme Mediheal Dermatology, testé dermatologiquement.\nFormat individuel : un masque dans son sachet, facile à glisser dans ton pack.'),
  highlights_ar = COALESCE(NULLIF(TRIM(highlights_ar), ''), 'كولاجين بنقاوة 98%: نسبة النقاوة مذكورة بوضوح على الكيس.\nمن توقيع ⁨MEDIHEAL⁩: ضمن مجموعة ⁨Mediheal Dermatology⁩، ومختبَر جلدياً.\nعبوة فردية: قناع في كيسه الخاص، يسهل إضافته إلى الباك.'),
  highlights_en = COALESCE(NULLIF(TRIM(highlights_en), ''), '98% pure collagen: the purity level is shown clearly on the sachet.\nSigned MEDIHEAL: part of the Mediheal Dermatology line, dermatologically tested.\nSingle format: one mask in its own sachet, easy to slip into your pack.'),
  description_fr = COALESCE(NULLIF(TRIM(description_fr), ''), 'Envie d''un moment douceur ? Le masque Collagen de MEDIHEAL t''attend dans son joli sachet rose et blanc. Sa star, c''est le collagène, avec une pureté de 98 % annoncée sur l''emballage. Glisse-le dans ton pack pour une pause rien qu''à toi.'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'هل تبحثين عن لحظة دلال؟ يأتيك قناع ⁨Collagen⁩ من ⁨MEDIHEAL⁩ في كيس جميل باللونين الوردي والأبيض. نجمه هو الكولاجين، بنقاوة 98% كما هو مذكور على الغلاف. أضيفيه إلى الباك لاستراحة صغيرة خاصة بك.'),
  description_en = COALESCE(NULLIF(TRIM(description_en), ''), 'In the mood for a cosy moment? MEDIHEAL''s Collagen mask comes in a pretty pink-and-white sachet. Its star is collagen, with 98% purity stated on the packaging. Slip it into your pack for a little break just for you.'),
  pack_mentions = COALESCE(NULLIF(TRIM(pack_mentions), ''), 'Core Firming\nMediheal Dermatology\n콜라겐 에센셜 마스크\nPurity 98% Collagen\nDermatology Test Completed\nOur solution for all')
WHERE slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%');

-- fiche: vitc | 7th Heaven — Nutriactive Vitamin C Advanced Serum Sheet Mask
UPDATE products SET
  product_type_fr = COALESCE(NULLIF(TRIM(product_type_fr), ''), 'Masque en tissu (« sheet mask ») au sérum'),
  product_type_ar = COALESCE(NULLIF(TRIM(product_type_ar), ''), 'قناع قماشي بالسيروم'),
  product_type_en = COALESCE(NULLIF(TRIM(product_type_en), ''), 'Serum sheet mask'),
  content_fr = COALESCE(NULLIF(TRIM(content_fr), ''), '1 masque en tissu biodégradable'),
  content_ar = COALESCE(NULLIF(TRIM(content_ar), ''), 'قناع قماشي واحد قابل للتحلل الحيوي'),
  content_en = COALESCE(NULLIF(TRIM(content_en), ''), '1 biodegradable sheet mask'),
  highlights_fr = COALESCE(NULLIF(TRIM(highlights_fr), ''), 'Sérum à la vitamine C : un masque en tissu associé à un sérum à la vitamine C.\nPour toutes les peaux : indiqué pour tous les types de peau.\nVegan : approuvé par la Vegetarian Society.\nFeuille biodégradable : le masque est conçu avec une feuille biodégradable.'),
  highlights_ar = COALESCE(NULLIF(TRIM(highlights_ar), ''), 'سيروم بفيتامين ⁨C⁩: قناع قماشي مرفق بسيروم بفيتامين ⁨C⁩.\nلكل أنواع البشرة: مناسب لجميع أنواع البشرة.\nنباتي (⁨Vegan⁩): معتمد من ⁨Vegetarian Society⁩.\nورقة قابلة للتحلل الحيوي: القناع مصنوع من ورقة قابلة للتحلل الحيوي.'),
  highlights_en = COALESCE(NULLIF(TRIM(highlights_en), ''), 'Vitamin C serum: a sheet mask paired with a vitamin C serum.\nFor every skin type: suitable for all skin types.\nVegan: approved by the Vegetarian Society.\nBiodegradable sheet: the mask is made with a biodegradable sheet.'),
  description_fr = COALESCE(NULLIF(TRIM(description_fr), ''), 'Un rayon de soleil dans ton pack ! Ce masque en tissu 7th Heaven arrive dans un sachet orange tout pétillant. Il associe un sérum à la vitamine C et une feuille biodégradable. Il convient à tous les types de peau et il est vegan : facile à adopter !'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'شعاع شمس صغير في الباك! يأتي هذا القناع القماشي من ⁨7th Heaven⁩ في كيس برتقالي مشرق، ويجمع بين سيروم بفيتامين ⁨C⁩ وورقة قابلة للتحلل الحيوي. مناسب لجميع أنواع البشرة ونباتي (⁨Vegan⁩): اختيار سهل وممتع!'),
  description_en = COALESCE(NULLIF(TRIM(description_en), ''), 'A ray of sunshine for your pack! This 7th Heaven sheet mask comes in a bright, zesty orange sachet. It pairs a vitamin C serum with a biodegradable sheet. Suitable for all skin types and vegan: easy to love!'),
  pack_mentions = COALESCE(NULLIF(TRIM(pack_mentions), ''), 'Vitamin C — 5% Active Complex*\nAnti-Fatigue — Brightening + Re-Energising\nFor all skin types\nVegan — Vegetarian Society Approved\n1 biodegradable sheet mask')
WHERE slug = 'vitc'
   OR (TRIM(brand) = '7th Heaven' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Nutriactive Vitamin C Advanced Serum Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%7th-heaven-vitamin-c%');

-- fiche: green | look AT ME — Green Blend Tea Tree + Cucumber Face Mask
UPDATE products SET
  product_type_fr = COALESCE(NULLIF(TRIM(product_type_fr), ''), 'Masque visage en tissu — feuille en Tencel'),
  product_type_ar = COALESCE(NULLIF(TRIM(product_type_ar), ''), 'قناع قماشي للوجه — ورقة من ألياف ⁨Tencel⁩'),
  product_type_en = COALESCE(NULLIF(TRIM(product_type_en), ''), 'Face sheet mask — Tencel sheet'),
  content_fr = COALESCE(NULLIF(TRIM(content_fr), ''), '25 ml / 0.84 fl oz'),
  content_ar = COALESCE(NULLIF(TRIM(content_ar), ''), '⁨25 ml / 0.84 fl oz⁩'),
  content_en = COALESCE(NULLIF(TRIM(content_en), ''), '25 ml / 0.84 fl oz'),
  highlights_fr = COALESCE(NULLIF(TRIM(highlights_fr), ''), 'Arbre à thé & concombre : un duo d''ingrédients mis en avant dès le nom.\nFeuille en Tencel : un masque visage sur une feuille en Tencel.\nFabriqué en Corée : un masque coréen au sachet illustré plein de charme.\nFormat 25 ml : un masque individuel, prêt à l''emploi.'),
  highlights_ar = COALESCE(NULLIF(TRIM(highlights_ar), ''), 'شجرة الشاي والخيار: ثنائي من المكوّنات يبرز منذ اسم المنتج.\nورقة من ألياف ⁨Tencel⁩: قناع للوجه على ورقة من ألياف ⁨Tencel⁩.\nصُنع في كوريا: قناع كوري بكيس مرسوم مليء بالسحر.\nعبوة 25 مل: قناع فردي جاهز للاستعمال.'),
  highlights_en = COALESCE(NULLIF(TRIM(highlights_en), ''), 'Tea tree & cucumber: a duo of ingredients featured right in the name.\nTencel sheet: a face mask on a Tencel sheet.\nMade in Korea: a Korean mask with a charming illustrated sachet.\n25 ml format: a single mask, ready to use.'),
  description_fr = COALESCE(NULLIF(TRIM(description_fr), ''), 'Tout en vert et plein de bonne humeur ! Le masque Green Blend de look AT ME réunit un joli duo : l''arbre à thé et le concombre. Avec sa feuille en Tencel et son sachet illustré, c''est un petit plaisir à partager… ou à garder pour toi. Fabriqué en Corée, 25 ml.'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'أخضر بالكامل ومليء بالمرح! يجمع قناع ⁨Green Blend⁩ من ⁨look AT ME⁩ بين ثنائي جميل: شجرة الشاي والخيار. بورقته من ألياف ⁨Tencel⁩ وكيسه المرسوم، هو متعة صغيرة تتشاركينها… أو تحتفظين بها لنفسك. صُنع في كوريا، 25 مل.'),
  description_en = COALESCE(NULLIF(TRIM(description_en), ''), 'All green and full of good vibes! look AT ME''s Green Blend mask brings together a lovely duo: tea tree and cucumber. With its Tencel sheet and illustrated sachet, it''s a little treat to share… or keep all to yourself. Made in Korea, 25 ml.'),
  pack_mentions = COALESCE(NULLIF(TRIM(pack_mentions), ''), 'Revitalizing & Soothing\nTencel sheet\nMade in Korea\n25 ml / 0.84 fl oz')
WHERE slug = 'green'
   OR (TRIM(brand) = 'look AT ME' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Green Blend Tea Tree + Cucumber Face Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%lookatme-green-blend%');

-- fiche: hazel | IDC Institute — One Week Treatment — Hazel + Lavender
UPDATE products SET
  product_type_fr = COALESCE(NULLIF(TRIM(product_type_fr), ''), 'Masque visage (« Facial Mask »)'),
  product_type_ar = COALESCE(NULLIF(TRIM(product_type_ar), ''), 'قناع للوجه («⁨Facial Mask⁩»)'),
  product_type_en = COALESCE(NULLIF(TRIM(product_type_en), ''), 'Facial mask'),
  content_fr = COALESCE(NULLIF(TRIM(content_fr), ''), '22 g / 0.73 fl.oz'),
  content_ar = COALESCE(NULLIF(TRIM(content_ar), ''), '⁨22 g / 0.73 fl.oz⁩'),
  content_en = COALESCE(NULLIF(TRIM(content_en), ''), '22 g / 0.73 fl.oz'),
  highlights_fr = COALESCE(NULLIF(TRIM(highlights_fr), ''), 'Gamme One Week Treatment : le masque n°3, celui du mercredi (« Wednesday »).\nHamamélis & lavande : deux ingrédients mis en avant sur le sachet.\nCruelty free : le logo est affiché sur l''emballage.\nFormat 22 g : un masque visage individuel.'),
  highlights_ar = COALESCE(NULLIF(TRIM(highlights_ar), ''), 'مجموعة ⁨One Week Treatment⁩: القناع رقم 3، قناع يوم الأربعاء («⁨Wednesday⁩»).\nالهماميليس واللافندر: مكوّنان بارزان على الكيس.\n⁨Cruelty free⁩: الشعار ظاهر على الغلاف.\nعبوة 22 غرام: قناع فردي للوجه.'),
  highlights_en = COALESCE(NULLIF(TRIM(highlights_en), ''), 'One Week Treatment line: mask no. 3, the Wednesday one.\nWitch hazel & lavender: two ingredients featured on the sachet.\nCruelty free: the logo is shown on the packaging.\n22 g format: a single facial mask.'),
  description_fr = COALESCE(NULLIF(TRIM(description_fr), ''), 'Mercredi, c''est son jour ! Ce masque visage IDC Institute porte le n°3 de la gamme One Week Treatment, « Wednesday ». Il réunit l''hamamélis et la lavande dans un joli sachet violet et argent. Et en plus, il est cruelty free.'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'الأربعاء هو يومه! يحمل هذا القناع من ⁨IDC Institute⁩ الرقم 3 في مجموعة ⁨One Week Treatment⁩، «⁨Wednesday⁩». يجمع بين الهماميليس واللافندر في كيس أنيق بلونَي البنفسجي والفضي، وهو أيضاً ⁨Cruelty free⁩.'),
  description_en = COALESCE(NULLIF(TRIM(description_en), ''), 'Wednesday is its day! This IDC Institute facial mask is no. 3 in the One Week Treatment line, “Wednesday”. It brings together witch hazel and lavender in a pretty purple and silver sachet. And it''s cruelty free, too.'),
  pack_mentions = COALESCE(NULLIF(TRIM(pack_mentions), ''), 'Wednesday (3)\nHamamélis et Lavande\nNettoie les pores et élimine la fatigue de la peau\nFacial mask — 22 g / 0.73 fl.oz\nCruelty free')
WHERE slug = 'hazel'
   OR (TRIM(brand) = 'IDC Institute' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'One Week Treatment - Hazel + Lavender')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%idc-hazel-lavender%');

-- fiche: gluta | SOME BY MI — Real Glutathione Brightening Care Mask
UPDATE products SET
  product_type_fr = COALESCE(NULLIF(TRIM(product_type_fr), ''), 'Masque en tissu — feuille 100 % d''origine végétale et biodégradable'),
  product_type_ar = COALESCE(NULLIF(TRIM(product_type_ar), ''), 'قناع قماشي — ورقة نباتية 100% وقابلة للتحلل الحيوي'),
  product_type_en = COALESCE(NULLIF(TRIM(product_type_en), ''), 'Sheet mask — 100% plant-based biodegradable sheet'),
  content_fr = COALESCE(NULLIF(TRIM(content_fr), ''), 'Net 20 g – 0.70 oz'),
  content_ar = COALESCE(NULLIF(TRIM(content_ar), ''), 'الوزن الصافي ⁨20 g – 0.70 oz⁩'),
  content_en = COALESCE(NULLIF(TRIM(content_en), ''), 'Net 20 g – 0.70 oz'),
  highlights_fr = COALESCE(NULLIF(TRIM(highlights_fr), ''), 'Au glutathion : l''ingrédient vedette, mis en avant dès le nom.\nFeuille 100 % végétale : d''origine végétale et biodégradable.\nTesté dermatologiquement : une mention affichée sur le sachet.\nFormat 20 g : un masque en tissu individuel.'),
  highlights_ar = COALESCE(NULLIF(TRIM(highlights_ar), ''), 'بالغلوتاثيون: المكوّن النجم، يبرز منذ اسم المنتج.\nورقة نباتية 100%: من أصل نباتي وقابلة للتحلل الحيوي.\nمختبَر جلدياً: عبارة ظاهرة على الكيس.\nعبوة 20 غرام: قناع قماشي فردي.'),
  highlights_en = COALESCE(NULLIF(TRIM(highlights_en), ''), 'With glutathione: the star ingredient, featured right in the name.\n100% plant-based sheet: plant-based and biodegradable.\nDermatologically tested: a mention shown on the sachet.\n20 g format: a single sheet mask.'),
  description_fr = COALESCE(NULLIF(TRIM(description_fr), ''), 'Simple, élégant et tout en bulles roses ! Le masque Real Glutathione de SOME BY MI est formulé avec du glutathion, sur une feuille 100 % végétale et biodégradable. Testé dermatologiquement, il trouvera vite sa place dans ton pack.'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'بسيط وأنيق ومليء بالفقاعات الوردية! قناع ⁨Real Glutathione⁩ من ⁨SOME BY MI⁩ مركّب بالغلوتاثيون، على ورقة نباتية 100% وقابلة للتحلل الحيوي. مختبَر جلدياً، وسيجد مكانه بسرعة في الباك.'),
  description_en = COALESCE(NULLIF(TRIM(description_en), ''), 'Simple, elegant and full of pink bubbles! SOME BY MI''s Real Glutathione mask is formulated with glutathione, on a 100% plant-based, biodegradable sheet. Dermatologist tested, it will soon find its place in your pack.'),
  pack_mentions = COALESCE(NULLIF(TRIM(pack_mentions), ''), 'Moisturizing | Radiance\nClinical Solution — Dermatologist Tested\nA 100% plant-based biodegradable sheet mask formulated with Real Glutathione that revitalizes dull skin and promotes a brighter, more even skin tone.\nNet 20 g – 0.70 oz')
WHERE slug = 'gluta'
   OR (TRIM(brand) = 'SOME BY MI' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Real Glutathione Brightening Care Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%some-by-mi-glutathione%');

-- fiche: rosegold | masque BAR — Rose Gold Foil Sheet Mask
UPDATE products SET
  product_type_fr = COALESCE(NULLIF(TRIM(product_type_fr), ''), 'Masque en tissu (« sheet mask »)'),
  product_type_ar = COALESCE(NULLIF(TRIM(product_type_ar), ''), 'قناع قماشي'),
  product_type_en = COALESCE(NULLIF(TRIM(product_type_en), ''), 'Sheet mask'),
  content_fr = COALESCE(NULLIF(TRIM(content_fr), ''), '1 masque complet — 30 ml / 1.01 US fl oz'),
  content_ar = COALESCE(NULLIF(TRIM(content_ar), ''), 'قناع كامل واحد — ⁨30 ml / 1.01 US fl oz⁩'),
  content_en = COALESCE(NULLIF(TRIM(content_en), ''), '1 complete mask — 30 ml / 1.01 US fl oz'),
  highlights_fr = COALESCE(NULLIF(TRIM(highlights_fr), ''), 'Soja, champignon & hamamélis : trois extraits mis en avant sur le sachet.\nMasque complet de 30 ml : un format individuel, prêt à l''emploi.\nStyle rose doré : un sachet élégant de la ligne Unmasque Beauty.'),
  highlights_ar = COALESCE(NULLIF(TRIM(highlights_ar), ''), 'الصويا والفطر والهماميليس: ثلاثة مستخلصات بارزة على الكيس.\nقناع كامل بحجم 30 مل: عبوة فردية جاهزة للاستعمال.\nلمسة الذهب الوردي: كيس أنيق من خط ⁨Unmasque Beauty⁩.'),
  highlights_en = COALESCE(NULLIF(TRIM(highlights_en), ''), 'Soybean, mushroom & witch hazel: three extracts featured on the sachet.\nComplete 30 ml mask: a single format, ready to use.\nRose-gold style: an elegant sachet from the Unmasque Beauty line.'),
  description_fr = COALESCE(NULLIF(TRIM(description_fr), ''), 'Une touche de glamour dans ton pack ! Le Rose Gold Foil Sheet Mask de masque BAR brille dans son sachet rose doré. À l''intérieur : un masque complet de 30 ml, avec extrait de soja, extrait de champignon et eau d''hamamélis. Idéal pour une soirée cocooning entre copines… ou en solo.'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'لمسة فخامة في الباك! يتألق قناع ⁨Rose Gold Foil Sheet Mask⁩ من ⁨masque BAR⁩ في كيسه بلون الذهب الوردي. في الداخل: قناع كامل بحجم 30 مل، بمستخلص فول الصويا ومستخلص الفطر وماء الهماميليس. مثالي لسهرة دلال مع الصديقات… أو بمفردك.'),
  description_en = COALESCE(NULLIF(TRIM(description_en), ''), 'A touch of glam for your pack! masque BAR''s Rose Gold Foil Sheet Mask shines in its rose-gold sachet. Inside: one complete 30 ml mask with soybean extract, mushroom extract and witch hazel water. Ideal for a cosy night in with friends… or solo.'),
  pack_mentions = COALESCE(NULLIF(TRIM(pack_mentions), ''), 'Unmasque Beauty\nMasqueBAR Rose Gold Foil Sheet Mask is enriched with extracts that help nourish and hydrate your skin.\nContains: Soybean Extract, Mushroom Extract, Witch Hazel Water\n1 complete mask — 30 ml / 1.01 US fl oz')
WHERE slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%');

-- fiche: collagen-mentions | MEDIHEAL : petits textes lus en agrandissant la photo, ajoutés au texte imprimé s'ils sont absents
UPDATE products SET pack_mentions = CONCAT(pack_mentions, '\n콜라겐 에센셜 마스크\nPurity 98% Collagen\nDermatology Test Completed\nOur solution for all')
WHERE (slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%')) AND pack_mentions NOT LIKE '%Purity 98%%';

-- fiche: green-mentions | look AT ME : contenance lue sur l'emballage, ajoutée au texte imprimé si absente
UPDATE products SET pack_mentions = CONCAT(pack_mentions, '\n25 ml / 0.84 fl oz')
WHERE (slug = 'green'
   OR (TRIM(brand) = 'look AT ME' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Green Blend Tea Tree + Cucumber Face Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%lookatme-green-blend%')) AND pack_mentions NOT LIKE '%25 ml%';


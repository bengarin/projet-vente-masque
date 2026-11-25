-- =====================================================================
-- Fiches détaillées des 6 produits d'origine (FR / AR / EN)
-- Rédigées UNIQUEMENT à partir des textes lisibles sur les photos des emballages (voir docs/fiches-produits.md).
-- Les phrases de la marque sont citées entre « » et attribuées. Mode d'emploi et précautions : non visibles → NULL
-- (la boutique affiche « Information à confirmer »).
-- COALESCE : un champ déjà rempli (par exemple depuis l'admin) n'est JAMAIS écrasé. Ré-exécutable sans risque.
-- Appliqué par : npm run db:seed. Ne touche ni aux prix, ni au stock, ni aux photos.
-- =====================================================================

UPDATE products SET
  product_type_fr = COALESCE(product_type_fr, 'Masque — format exact (tissu, gel…) à confirmer'),
  product_type_ar = COALESCE(product_type_ar, 'قناع — نوعه بالتحديد (قماشي، جل…) في انتظار التأكيد'),
  product_type_en = COALESCE(product_type_en, 'Mask — exact format (sheet, gel…) to be confirmed'),
  content_fr = COALESCE(content_fr, NULL),
  content_ar = COALESCE(content_ar, NULL),
  content_en = COALESCE(content_en, NULL),
  highlights_fr = COALESCE(highlights_fr, 'Texte coréen : « 콜라겐 에센셜 마스크 » (« Collagen Essential Mask »)\nCollagène d''une pureté de 98 % (« Purity 98% Collagen »)\nMention « Core Firming » imprimée sur le sachet\n« Dermatology Test Completed » (testé dermatologiquement, selon l''emballage)\nGamme « Mediheal Dermatology » — « Our solution for all »'),
  highlights_ar = COALESCE(highlights_ar, 'النص الكوري: «⁨콜라겐 에센셜 마스크⁩» («⁨Collagen Essential Mask⁩»)\nكولاجين بنقاوة 98% («⁨Purity 98% Collagen⁩»)\nعبارة «⁨Core Firming⁩» مطبوعة على الغلاف\n«⁨Dermatology Test Completed⁩»: تم اختباره جلدياً حسب الغلاف\nمن مجموعة «⁨Mediheal Dermatology⁩» — «⁨Our solution for all⁩»'),
  highlights_en = COALESCE(highlights_en, 'Korean text: “콜라겐 에센셜 마스크” (“Collagen Essential Mask”)\n98% purity collagen (“Purity 98% Collagen”)\n“Core Firming” printed on the sachet\n“Dermatology Test Completed”, as stated on the packaging\n“Mediheal Dermatology” line — “Our solution for all”'),
  description_fr = COALESCE(description_fr, 'Signé MEDIHEAL, Collagen se présente dans un sachet individuel rose et blanc, orné d''une illustration de flacon de sérum. Le collagène est la star de ce soin : l''emballage annonce un collagène d''une pureté de 98 % et la mention « Core Firming ». Il appartient à la gamme Mediheal Dermatology et porte la mention « Dermatology Test Completed ».'),
  description_ar = COALESCE(description_ar, 'من ⁨MEDIHEAL⁩، يأتي ⁨Collagen⁩ في كيس فردي باللونين الوردي والأبيض، مزيَّن برسم لقارورة سيروم. الكولاجين هو نجم هذا المنتج: يشير الغلاف إلى كولاجين بنقاوة 98% وإلى عبارة «⁨Core Firming⁩». ينتمي إلى مجموعة ⁨Mediheal Dermatology⁩، ويحمل عبارة «⁨Dermatology Test Completed⁩».'),
  description_en = COALESCE(description_en, 'By MEDIHEAL, Collagen comes in an individual pink-and-white sachet decorated with a serum bottle illustration. Collagen is the star here: the packaging announces 98% purity collagen and the words “Core Firming”. It belongs to the Mediheal Dermatology line and carries the mention “Dermatology Test Completed”.')
WHERE slug = 'collagen';

UPDATE products SET
  product_type_fr = COALESCE(product_type_fr, 'Masque en tissu (« sheet mask ») au sérum'),
  product_type_ar = COALESCE(product_type_ar, 'قناع قماشي بالسيروم'),
  product_type_en = COALESCE(product_type_en, 'Serum sheet mask'),
  content_fr = COALESCE(content_fr, '1 masque en tissu biodégradable'),
  content_ar = COALESCE(content_ar, 'قناع قماشي واحد قابل للتحلل الحيوي'),
  content_en = COALESCE(content_en, '1 biodegradable sheet mask'),
  highlights_fr = COALESCE(highlights_fr, 'Vitamine C — complexe actif à 5 %* (*précision de l''astérisque à confirmer, non lisible sur la photo)\n« Anti-Fatigue » : « Brightening + Re-Energising », selon la marque\nPour tous les types de peau\nVegan — approuvé par la Vegetarian Society\nFeuille biodégradable'),
  highlights_ar = COALESCE(highlights_ar, 'فيتامين ⁨C⁩ — مركّب نشط بنسبة 5%* (*توضيح النجمة في انتظار التأكيد، غير مقروء في الصورة)\n«⁨Anti-Fatigue⁩»: «⁨Brightening + Re-Energising⁩» حسب العلامة\nلجميع أنواع البشرة\nنباتي (⁨Vegan⁩) — معتمد من ⁨Vegetarian Society⁩\nورقة قابلة للتحلل الحيوي'),
  highlights_en = COALESCE(highlights_en, 'Vitamin C — 5% Active Complex* (*asterisk footnote to be confirmed, not legible on the photo)\n“Anti-Fatigue”: “Brightening + Re-Energising”, according to the brand\nFor all skin types\nVegan — Vegetarian Society Approved\nBiodegradable sheet'),
  description_fr = COALESCE(description_fr, 'Dans son sachet orange vitaminé, le masque Nutriactive Vitamin C de 7th Heaven associe un « Advanced Serum » à la vitamine C (complexe actif à 5 %*) et une feuille biodégradable. La marque le présente comme un soin « Anti-Fatigue » — « Brightening + Re-Energising » — pour tous les types de peau. Il porte aussi le label Vegan de la Vegetarian Society. Une touche d''orange pleine de peps à glisser dans ton pack.'),
  description_ar = COALESCE(description_ar, 'في كيسه البرتقالي المفعم بالحيوية، يجمع قناع ⁨Nutriactive Vitamin C⁩ من ⁨7th Heaven⁩ بين «⁨Advanced Serum⁩» بفيتامين ⁨C⁩ (مركّب نشط بنسبة 5%*) وورقة قابلة للتحلل الحيوي. تقدّمه العلامة كعناية «⁨Anti-Fatigue⁩» — «⁨Brightening + Re-Energising⁩» — لجميع أنواع البشرة، كما يحمل شعار ⁨Vegan⁩ المعتمد من ⁨Vegetarian Society⁩. لمسة برتقالية مبهجة لإضافتها إلى الباك.'),
  description_en = COALESCE(description_en, 'In its zesty orange sachet, 7th Heaven''s Nutriactive Vitamin C mask pairs an “Advanced Serum” with vitamin C (5% Active Complex*) and a biodegradable sheet. The brand presents it as an “Anti-Fatigue” treatment — “Brightening + Re-Energising” — for all skin types. It also carries the Vegetarian Society Vegan label. A bright splash of orange to add to your pack.')
WHERE slug = 'vitc';

UPDATE products SET
  product_type_fr = COALESCE(product_type_fr, 'Masque visage en tissu — feuille en Tencel'),
  product_type_ar = COALESCE(product_type_ar, 'قناع قماشي للوجه — ورقة من ألياف ⁨Tencel⁩'),
  product_type_en = COALESCE(product_type_en, 'Face sheet mask — Tencel sheet'),
  content_fr = COALESCE(content_fr, '25 ml / 0.84 fl oz'),
  content_ar = COALESCE(content_ar, '⁨25 ml / 0.84 fl oz⁩'),
  content_en = COALESCE(content_en, '25 ml / 0.84 fl oz'),
  highlights_fr = COALESCE(highlights_fr, 'Arbre à thé + concombre (« Tea Tree + Cucumber »)\n« Revitalizing & Soothing », selon la marque\nFeuille en Tencel (« Tencel sheet »)\nFabriqué en Corée (« Made in Korea »)'),
  highlights_ar = COALESCE(highlights_ar, 'شجرة الشاي + الخيار («⁨Tea Tree + Cucumber⁩»)\n«⁨Revitalizing & Soothing⁩» حسب العلامة\nورقة من ألياف ⁨Tencel⁩\nصُنع في كوريا («⁨Made in Korea⁩»)'),
  highlights_en = COALESCE(highlights_en, 'Tea Tree + Cucumber\n“Revitalizing & Soothing”, according to the brand\nTencel sheet\nMade in Korea'),
  description_fr = COALESCE(description_fr, 'Avec son sachet illustré tout en vert, Green Blend de look AT ME a un vrai charme coréen. Ce masque visage réunit l''arbre à thé et le concombre sur une feuille en Tencel, et il est fabriqué en Corée. La marque le décrit comme « Revitalizing & Soothing ». Un masque frais et ludique à ajouter à ton pack.'),
  description_ar = COALESCE(description_ar, 'بغلافه الأخضر المرسوم، يحمل ⁨Green Blend⁩ من ⁨look AT ME⁩ لمسة كورية مميّزة. يجمع هذا القناع للوجه بين شجرة الشاي والخيار على ورقة من ألياف ⁨Tencel⁩، وهو مصنوع في كوريا. تصفه العلامة بعبارة «⁨Revitalizing & Soothing⁩». قناع منعش ومرح لإضافته إلى الباك.'),
  description_en = COALESCE(description_en, 'With its all-green illustrated sachet, look AT ME''s Green Blend has real Korean charm. This face mask brings together tea tree and cucumber on a Tencel sheet, and it is made in Korea. The brand describes it as “Revitalizing & Soothing”. A fresh, playful mask to add to your pack.')
WHERE slug = 'green';

UPDATE products SET
  product_type_fr = COALESCE(product_type_fr, 'Masque visage (« Facial Mask »)'),
  product_type_ar = COALESCE(product_type_ar, 'قناع للوجه («⁨Facial Mask⁩»)'),
  product_type_en = COALESCE(product_type_en, 'Facial mask'),
  content_fr = COALESCE(content_fr, '22 g / 0.73 fl.oz'),
  content_ar = COALESCE(content_ar, '⁨22 g / 0.73 fl.oz⁩'),
  content_en = COALESCE(content_en, '22 g / 0.73 fl.oz'),
  highlights_fr = COALESCE(highlights_fr, 'Gamme « One Week Treatment » — masque n°3, « Wednesday » (mercredi)\nHamamélis + lavande (« Hazel + Lavender »)\n« Nettoie les pores et élimine la fatigue de la peau » — texte imprimé par la marque\nLogo « Cruelty free »'),
  highlights_ar = COALESCE(highlights_ar, 'مجموعة «⁨One Week Treatment⁩» — القناع رقم 3، «⁨Wednesday⁩» (الأربعاء)\nالهماميليس واللافندر («⁨Hazel + Lavender⁩»)\n«ينظّف مسام البشرة ويزيل عنها التعب» — نص مطبوع من العلامة\nشعار «⁨Cruelty free⁩»'),
  highlights_en = COALESCE(highlights_en, '“One Week Treatment” line — mask no. 3, “Wednesday”\nHazel + Lavender (witch hazel and lavender)\n“Clean the pore of skin and remove fatique from your face” — text printed by the brand (spelling as printed)\n“Cruelty free” logo'),
  description_fr = COALESCE(description_fr, 'Ce masque fait partie de la gamme « One Week Treatment » d''IDC Institute : c''est le n°3, « Wednesday » (mercredi), dans un sachet violet et argent. Il associe l''hamamélis et la lavande, et la marque l''accompagne du texte « Nettoie les pores et élimine la fatigue de la peau ». L''emballage affiche le logo Cruelty free.'),
  description_ar = COALESCE(description_ar, 'ينتمي هذا القناع إلى مجموعة «⁨One Week Treatment⁩» من ⁨IDC Institute⁩: إنه القناع رقم 3، «⁨Wednesday⁩» (الأربعاء)، في كيس بلونَي البنفسجي والفضي. يجمع بين الهماميليس واللافندر، وترفقه العلامة بعبارة «ينظّف مسام البشرة ويزيل عنها التعب». ويحمل الغلاف شعار ⁨Cruelty free⁩.'),
  description_en = COALESCE(description_en, 'This mask belongs to IDC Institute''s “One Week Treatment” line: it is no. 3, “Wednesday”, in a purple and silver sachet. It combines witch hazel and lavender, and the brand adds the text “Clean the pore of skin and remove fatique from your face”. The packaging displays the Cruelty free logo.')
WHERE slug = 'hazel';

UPDATE products SET
  product_type_fr = COALESCE(product_type_fr, 'Masque en tissu — feuille 100 % d''origine végétale et biodégradable'),
  product_type_ar = COALESCE(product_type_ar, 'قناع قماشي — ورقة نباتية 100% وقابلة للتحلل الحيوي'),
  product_type_en = COALESCE(product_type_en, 'Sheet mask — 100% plant-based biodegradable sheet'),
  content_fr = COALESCE(content_fr, 'Net 20 g – 0.70 oz'),
  content_ar = COALESCE(content_ar, 'الوزن الصافي ⁨20 g – 0.70 oz⁩'),
  content_en = COALESCE(content_en, 'Net 20 g – 0.70 oz'),
  highlights_fr = COALESCE(highlights_fr, 'Formulé avec du « Real Glutathione » (glutathion)\n« Moisturizing | Radiance », selon la marque\n« Clinical Solution — Dermatologist Tested »\nFeuille 100 % d''origine végétale et biodégradable'),
  highlights_ar = COALESCE(highlights_ar, 'مركّب بالغلوتاثيون («⁨Real Glutathione⁩»)\n«⁨Moisturizing | Radiance⁩» حسب العلامة\n«⁨Clinical Solution — Dermatologist Tested⁩»\nورقة نباتية 100% وقابلة للتحلل الحيوي'),
  highlights_en = COALESCE(highlights_en, 'Formulated with Real Glutathione\n“Moisturizing | Radiance”, according to the brand\n“Clinical Solution — Dermatologist Tested”\n100% plant-based biodegradable sheet'),
  description_fr = COALESCE(description_fr, 'Dans un sachet épuré aux bulles roses, Real Glutathione Brightening Care Mask de SOME BY MI est un masque à feuille 100 % d''origine végétale et biodégradable, formulé avec du glutathion. D''après le texte de l''emballage, il « redonne de la vitalité aux peaux ternes et favorise un teint plus lumineux et plus uniforme ». La marque l''accompagne des mentions « Moisturizing | Radiance » et « Dermatologist Tested ».'),
  description_ar = COALESCE(description_ar, 'في كيس أنيق تزيّنه فقاعات وردية، يأتي ⁨Real Glutathione Brightening Care Mask⁩ من ⁨SOME BY MI⁩: قناع بورقة نباتية 100% وقابلة للتحلل الحيوي، مركّب بالغلوتاثيون. وبحسب النص المطبوع على الغلاف، فهو «يُنعش البشرة الباهتة ويساعد على الحصول على بشرة أكثر إشراقاً وتجانساً في اللون». وترفقه العلامة بعبارتي «⁨Moisturizing | Radiance⁩» و«⁨Dermatologist Tested⁩».'),
  description_en = COALESCE(description_en, 'In a clean sachet with pink bubbles, SOME BY MI''s Real Glutathione Brightening Care Mask is a 100% plant-based biodegradable sheet mask formulated with Real Glutathione. According to the packaging, it “revitalizes dull skin and promotes a brighter, more even skin tone”. The brand adds the mentions “Moisturizing | Radiance” and “Dermatologist Tested”.')
WHERE slug = 'gluta';

UPDATE products SET
  product_type_fr = COALESCE(product_type_fr, 'Masque en tissu (« sheet mask »)'),
  product_type_ar = COALESCE(product_type_ar, 'قناع قماشي'),
  product_type_en = COALESCE(product_type_en, 'Sheet mask'),
  content_fr = COALESCE(content_fr, '1 masque complet — 30 ml / 1.01 US fl oz'),
  content_ar = COALESCE(content_ar, 'قناع كامل واحد — ⁨30 ml / 1.01 US fl oz⁩'),
  content_en = COALESCE(content_en, '1 complete mask — 30 ml / 1.01 US fl oz'),
  highlights_fr = COALESCE(highlights_fr, 'Contient : extrait de soja, extrait de champignon, eau d''hamamélis (ingrédients mis en avant sur l''emballage — liste complète à confirmer)\n« Enrichi d''extraits qui aident à nourrir et hydrater la peau » — texte de la marque\nLigne « Unmasque Beauty »'),
  highlights_ar = COALESCE(highlights_ar, 'يحتوي على: مستخلص فول الصويا، مستخلص الفطر، ماء الهماميليس (مكوّنات بارزة على الغلاف — القائمة الكاملة في انتظار التأكيد)\n«غني بمستخلصات تساعد على تغذية البشرة وترطيبها» — نص العلامة\nخط «⁨Unmasque Beauty⁩»'),
  highlights_en = COALESCE(highlights_en, 'Contains: Soybean Extract, Mushroom Extract, Witch Hazel Water (ingredients highlighted on the packaging — full list to be confirmed)\n“Enriched with extracts that help nourish and hydrate your skin” — brand text\n“Unmasque Beauty” line'),
  description_fr = COALESCE(description_fr, 'Avec son sachet élégant aux reflets rose doré, le Rose Gold Foil Sheet Mask de masque BAR (Unmasque Beauty) apporte une touche chic à ton pack. D''après l''emballage, il est « enrichi d''extraits qui aident à nourrir et hydrater la peau » et met en avant l''extrait de soja, l''extrait de champignon et l''eau d''hamamélis.'),
  description_ar = COALESCE(description_ar, 'بكيسه الأنيق بلون الذهب الوردي، يضيف ⁨Rose Gold Foil Sheet Mask⁩ من ⁨masque BAR⁩ (⁨Unmasque Beauty⁩) لمسة راقية إلى الباك. وبحسب الغلاف، فهو «غني بمستخلصات تساعد على تغذية البشرة وترطيبها»، ويبرز مستخلص فول الصويا ومستخلص الفطر وماء الهماميليس.'),
  description_en = COALESCE(description_en, 'With its elegant rose-gold sachet, masque BAR''s Rose Gold Foil Sheet Mask (Unmasque Beauty) brings a chic touch to your pack. According to the packaging, it is “enriched with extracts that help nourish and hydrate your skin” and highlights soybean extract, mushroom extract and witch hazel water.')
WHERE slug = 'rosegold';

-- MEDIHEAL : petits textes lus en agrandissant la photo, ajoutés au texte original s'ils sont absents
UPDATE products SET pack_mentions = CONCAT(pack_mentions, '\n콜라겐 에센셜 마스크\nPurity 98% Collagen\nDermatology Test Completed\nOur solution for all') WHERE slug = 'collagen' AND pack_mentions NOT LIKE '%Purity 98%%';
-- Contenance lue sur l'emballage look AT ME, ajoutée aux mentions si absente
UPDATE products SET pack_mentions = CONCAT(pack_mentions, '\n25 ml / 0.84 fl oz') WHERE slug = 'green' AND pack_mentions NOT LIKE '%25 ml%';

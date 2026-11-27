-- =====================================================================
-- Introductions des fiches (27/11/2026) : ce que le produit apporte et comment il s'intègre au moment de soin.
-- Les effets cités viennent de l'emballage et sont présentés comme la description de la marque, jamais comme un résultat garanti.
-- Version 2 : bénéfice d'abord, mots simples (« aide à », « conçu pour », « selon la marque »).
-- Remplit une introduction vide ou remplace la 1re version exacte : un texte saisi dans l'admin n'est JAMAIS écrasé.
-- Appliqué par : npm run db:migrate, npm run db:seed, npm run db:fiches.
-- =====================================================================

-- fiche: intro-collagen | collagen (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Un moment rien qu''à toi : tu poses ce masque sur ton visage et tu t''accordes une vraie pause. MEDIHEAL le présente comme un soin fermeté au collagène pur à 98 %, testé dermatologiquement.'
      THEN 'Envie de prendre soin de la fermeté de ta peau ? Ce masque au collagène pur à 98 % est conçu pour aider à raffermir la peau, selon MEDIHEAL. Et il est testé dermatologiquement.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'لحظة خاصة بك: ضعي هذا القناع على وجهك وامنحي نفسك استراحة حقيقية. تقدّمه ⁨MEDIHEAL⁩ كعناية لتماسك البشرة بكولاجين نقي بنسبة 98%، وهو مختبَر جلدياً.'
      THEN 'تريدين العناية بتماسك بشرتك؟ هذا القناع بكولاجين نقي بنسبة 98% مصمَّم للمساعدة على شدّ البشرة، بحسب ⁨MEDIHEAL⁩. وهو مختبَر جلدياً.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'A moment just for you: lay this mask on your face and give yourself a real break. MEDIHEAL presents it as a firming care with 98% pure collagen, and it is dermatologically tested.'
      THEN 'Want to care for your skin''s firmness? This 98% pure collagen mask is designed to help firm the skin, according to MEDIHEAL. And it''s dermatologically tested.' ELSE intro_en END
WHERE slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%');

-- fiche: intro-vitc | vitc (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Ta pause vitaminée : tu poses sur ton visage ce masque en tissu imprégné d''un sérum à la vitamine C. 7th Heaven le décrit comme un masque anti-fatigue, qui apporte éclat et énergie à la peau.'
      THEN 'Teint fatigué ? Ce masque au sérum à la vitamine C aide à raviver l''éclat de ta peau et à lui redonner de l''énergie, selon 7th Heaven. Il convient à tous les types de peau.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'استراحتك بالفيتامين: ضعي على وجهك هذا القناع القماشي المشبّع بسيروم فيتامين سي. تصفه ⁨7th Heaven⁩ بأنه قناع لمظاهر التعب، يمنح البشرة إشراقاً وحيوية.'
      THEN 'بشرتك تبدو متعبة؟ يساعد هذا القناع بسيروم فيتامين سي على إعادة الإشراق والحيوية إلى بشرتك، بحسب ⁨7th Heaven⁩. وهو مناسب لجميع أنواع البشرة.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'Your vitamin break: lay this sheet mask, soaked in a vitamin C serum, on your face. 7th Heaven describes it as an anti-fatigue mask that brightens and re-energises the skin.'
      THEN 'Tired-looking skin? This vitamin C serum mask helps brighten your skin and give it fresh energy, according to 7th Heaven. It suits all skin types.' ELSE intro_en END
WHERE slug = 'vitc'
   OR (TRIM(brand) = '7th Heaven' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Nutriactive Vitamin C Advanced Serum Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%7th-heaven-vitamin-c%');

-- fiche: intro-green | green (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Une bulle de verdure : tu poses ce masque sur ton visage et tu profites d''un moment de détente. Avec son duo arbre à thé et concombre, look AT ME le présente comme un soin revitalisant et apaisant.'
      THEN 'Ta peau a besoin de douceur ? Avec l''arbre à thé et le concombre, ce masque aide à apaiser et à revitaliser la peau, selon look AT ME. Il est fabriqué en Corée.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'لمسة خضراء: ضعي هذا القناع على وجهك واستمتعي بلحظة استرخاء. بثنائي شجرة الشاي والخيار، تقدّمه ⁨look AT ME⁩ كعناية منعشة ومهدّئة للبشرة.'
      THEN 'بشرتك تحتاج إلى بعض الراحة؟ بشجرة الشاي والخيار، يساعد هذا القناع على تهدئة البشرة وإنعاشها، بحسب ⁨look AT ME⁩. وهو مصنوع في كوريا.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'A little green escape: lay this mask on your face and enjoy a relaxing moment. With its tea tree and cucumber duo, look AT ME presents it as a revitalising and soothing care.'
      THEN 'Does your skin need some comfort? With tea tree and cucumber, this mask helps soothe and revitalise the skin, according to look AT ME. It''s made in Korea.' ELSE intro_en END
WHERE slug = 'green'
   OR (TRIM(brand) = 'look AT ME' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Green Blend Tea Tree + Cucumber Face Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%lookatme-green-blend%');

-- fiche: intro-hazel | hazel (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Ton rendez-vous du mercredi : tu poses ce masque sur ton visage et tu t''offres une pause en milieu de semaine. Avec l''hamamélis et la lavande, IDC Institute le présente comme un masque qui nettoie les pores et chasse la fatigue de la peau.'
      THEN 'Pores encombrés, mine fatiguée en milieu de semaine ? À l''hamamélis et à la lavande, ce masque est conçu pour nettoyer les pores et chasser les signes de fatigue, selon IDC Institute.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'موعدك يوم الأربعاء: ضعي هذا القناع على وجهك وامنحي نفسك استراحة في منتصف الأسبوع. بالهماميليس واللافندر، تقدّمه ⁨IDC Institute⁩ كقناع ينظّف المسام ويزيل مظاهر التعب عن البشرة.'
      THEN 'مسام مسدودة ووجه يبدو متعباً في منتصف الأسبوع؟ بالهماميليس واللافندر، صُمّم هذا القناع لتنظيف المسام وإزالة مظاهر التعب، بحسب ⁨IDC Institute⁩.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'Your Wednesday date: lay this mask on your face and treat yourself to a midweek break. With witch hazel and lavender, IDC Institute presents it as a mask that cleanses the pores and removes tiredness from the skin.'
      THEN 'Clogged pores and a tired-looking face midweek? With witch hazel and lavender, this mask is designed to cleanse the pores and chase away signs of tiredness, according to IDC Institute.' ELSE intro_en END
WHERE slug = 'hazel'
   OR (TRIM(brand) = 'IDC Institute' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'One Week Treatment - Hazel + Lavender')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%idc-hazel-lavender%');

-- fiche: intro-gluta | gluta (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Un moment douceur tout en rose : tu poses ce masque sur ton visage et tu te détends. SOME BY MI le décrit comme un masque hydratant au glutathion, pensé pour raviver l''éclat des peaux ternes.'
      THEN 'Peau terne ? Ce masque au glutathion aide à hydrater ta peau et à raviver son éclat, pour un teint plus lumineux et plus uniforme, selon SOME BY MI. Il est testé dermatologiquement.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'لحظة رقيقة بلون الورد: ضعي هذا القناع على وجهك واسترخي. تصفه ⁨SOME BY MI⁩ بأنه قناع مرطّب بالغلوتاثيون، مصمَّم لإعادة الإشراق إلى البشرة الباهتة.'
      THEN 'بشرتك باهتة؟ يساعد هذا القناع بالغلوتاثيون على ترطيب بشرتك وإعادة إشراقها، لبشرة أكثر إشراقاً وتوحّداً، بحسب ⁨SOME BY MI⁩. وهو مختبَر جلدياً.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'A soft, pink moment: lay this mask on your face and unwind. SOME BY MI describes it as a moisturising glutathione mask, designed to revive radiance in dull-looking skin.'
      THEN 'Dull skin? This glutathione mask helps moisturise your skin and revive its radiance, for a brighter, more even-looking tone, according to SOME BY MI. It''s dermatologist tested.' ELSE intro_en END
WHERE slug = 'gluta'
   OR (TRIM(brand) = 'SOME BY MI' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Real Glutathione Brightening Care Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%some-by-mi-glutathione%');

-- fiche: intro-rosegold | rosegold (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Une soirée chic à la maison : tu poses ce masque sur ton visage, en solo ou entre copines. Avec ses extraits de soja et de champignon et son eau d''hamamélis, masque BAR le présente comme un masque qui aide à nourrir et hydrater la peau.'
      THEN 'Ta peau a soif ? Enrichi en extraits de soja et de champignon et en eau d''hamamélis, ce masque aide à nourrir et hydrater ta peau, selon masque BAR. Parfait pour une soirée entre copines.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'سهرة أنيقة في البيت: ضعي هذا القناع على وجهك، بمفردك أو مع صديقاتك. بمستخلص الصويا ومستخلص الفطر وماء الهماميليس، تقدّمه ⁨masque BAR⁩ كقناع يساعد على تغذية البشرة وترطيبها.'
      THEN 'بشرتك عطشى؟ بمستخلص الصويا ومستخلص الفطر وماء الهماميليس، يساعد هذا القناع على تغذية بشرتك وترطيبها، بحسب ⁨masque BAR⁩. مثالي لسهرة مع الصديقات.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'A chic night in: lay this mask on your face, solo or with friends. With soybean and mushroom extracts and witch hazel water, masque BAR presents it as a mask that helps nourish and hydrate the skin.'
      THEN 'Thirsty skin? Enriched with soybean and mushroom extracts and witch hazel water, this mask helps nourish and hydrate your skin, according to masque BAR. Perfect for a girls'' night in.' ELSE intro_en END
WHERE slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%');

-- fiche: intro-orjena-power-collagen-emulsion | orjena-power-collagen-emulsion (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Un petit rituel après le nettoyage et le tonique : tu verses un peu d''émulsion dans le creux de ta main, puis tu l''appliques en pressant doucement. ORJENA la présente comme un soin au collagène pour l''élasticité, la nutrition et la fraîcheur de la peau.'
      THEN 'Envie d''un soin simple pour ta routine ? Cette émulsion au collagène est conçue pour soutenir l''élasticité de ta peau, la nourrir et lui apporter une sensation de fraîcheur, selon ORJENA. Elle convient à tous les types de peau.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'طقس صغير بعد التنظيف والتونر: اسكبي قليلاً من المستحلب في راحة يدك، ثم طبّقيه بضغطات خفيفة. تقدّمه ⁨ORJENA⁩ كعناية بالكولاجين لمرونة البشرة وتغذيتها وانتعاشها.'
      THEN 'تبحثين عن عناية بسيطة لروتينك؟ صُمّم هذا المستحلب بالكولاجين لدعم مرونة بشرتك وتغذيتها ومنحها إحساساً بالانتعاش، بحسب ⁨ORJENA⁩. وهو مناسب لجميع أنواع البشرة.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'A little ritual after cleansing and toning: pour a little emulsion into your palm, then apply it by gently pressing it in. ORJENA presents it as a collagen care for skin elasticity, nourishment and freshness.'
      THEN 'Looking for an easy step in your routine? This collagen emulsion is designed to support your skin''s elasticity, nourish it and leave a refreshing feel, according to ORJENA. It suits all skin types.' ELSE intro_en END
WHERE slug = 'orjena-power-collagen-emulsion' OR (TRIM(brand) = 'ORJENA' AND TRIM(name) = 'Power Collagen Emulsion');

-- fiche: intro-somebymi-yuja-niacin-anti-blemish-cream | somebymi-yuja-niacin-anti-blemish-cream (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Un geste tout simple : après le nettoyage et le tonique, tu appliques une fine couche de crème. SOME BY MI la présente comme une crème anti-imperfections, à l''extrait de yuja et à 5 % de niacinamide.'
      THEN 'De petites imperfections ? Avec l''extrait de yuja et 5 % de niacinamide, cette crème est conçue pour aider à cibler les imperfections, selon SOME BY MI. Elle s''applique en fine couche, après ton tonique.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'خطوة بسيطة جداً: بعد التنظيف والتونر، ضعي طبقة رقيقة من الكريم. تقدّمه ⁨SOME BY MI⁩ ككريم مضاد للشوائب، بمستخلص اليوجا و5% من النياسيناميد.'
      THEN 'تعانين من بعض الشوائب؟ بمستخلص اليوجا و5% من النياسيناميد، صُمّم هذا الكريم للمساعدة على استهداف الشوائب، بحسب ⁨SOME BY MI⁩. ويُطبَّق بطبقة رقيقة بعد التونر.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'One simple step: after cleansing and toning, smooth on a thin layer of cream. SOME BY MI presents it as an anti-blemish cream with yuja extract and 5% niacinamide.'
      THEN 'A few blemishes? With yuja extract and 5% niacinamide, this cream is designed to help target blemishes, according to SOME BY MI. Smooth on a thin layer after your toner.' ELSE intro_en END
WHERE slug = 'somebymi-yuja-niacin-anti-blemish-cream' OR (TRIM(brand) = 'SOME BY MI' AND TRIM(name) = 'Yuja Niacin Anti Blemish Cream');


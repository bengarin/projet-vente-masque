-- =====================================================================
-- Introductions des fiches — version 3 (27/11/2026) : présentation sobre et vérifiée sur les photos des emballages.
-- Ce que c'est, ingrédients / caractéristiques confirmés, ce que dit l'emballage (« selon l'emballage », « la marque le présente comme »).
-- Aucune question, aucune situation d'utilisation inventée, aucun résultat garanti.
-- Remplit une introduction vide ou remplace une version générée précédente (v1, v2) : un texte saisi dans l'admin n'est JAMAIS écrasé.
-- Appliqué par : npm run db:migrate, npm run db:seed, npm run db:fiches.
-- =====================================================================

-- fiche: intro-collagen | collagen (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Envie de prendre soin de la fermeté de ta peau ? Ce masque au collagène pur à 98 % est conçu pour aider à raffermir la peau, selon MEDIHEAL. Et il est testé dermatologiquement.' OR intro_fr = 'Un moment rien qu''à toi : tu poses ce masque sur ton visage et tu t''accordes une vraie pause. MEDIHEAL le présente comme un soin fermeté au collagène pur à 98 %, testé dermatologiquement.'
      THEN 'Masque visage MEDIHEAL au collagène, d''une pureté de 98 % selon l''emballage. La marque le présente comme un soin destiné à la fermeté de la peau. Il est testé dermatologiquement (gamme Mediheal Dermatology).' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'تريدين العناية بتماسك بشرتك؟ هذا القناع بكولاجين نقي بنسبة 98% مصمَّم للمساعدة على شدّ البشرة، بحسب ⁨MEDIHEAL⁩. وهو مختبَر جلدياً.' OR intro_ar = 'لحظة خاصة بك: ضعي هذا القناع على وجهك وامنحي نفسك استراحة حقيقية. تقدّمه ⁨MEDIHEAL⁩ كعناية لتماسك البشرة بكولاجين نقي بنسبة 98%، وهو مختبَر جلدياً.'
      THEN 'قناع للوجه من ⁨MEDIHEAL⁩ بالكولاجين، بنقاوة 98% حسب الغلاف. تقدّمه العلامة كعناية موجّهة لتماسك البشرة. وهو مختبَر جلدياً (مجموعة ⁨Mediheal Dermatology⁩).' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'A moment just for you: lay this mask on your face and give yourself a real break. MEDIHEAL presents it as a firming care with 98% pure collagen, and it is dermatologically tested.' OR intro_en = 'Want to care for your skin''s firmness? This 98% pure collagen mask is designed to help firm the skin, according to MEDIHEAL. And it''s dermatologically tested.'
      THEN 'MEDIHEAL face mask with collagen, 98% pure according to the packaging. The brand presents it as a care for skin firmness. It is dermatologically tested (Mediheal Dermatology line).' ELSE intro_en END
WHERE slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%');

-- fiche: intro-vitc | vitc (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Ta pause vitaminée : tu poses sur ton visage ce masque en tissu imprégné d''un sérum à la vitamine C. 7th Heaven le décrit comme un masque anti-fatigue, qui apporte éclat et énergie à la peau.' OR intro_fr = 'Teint fatigué ? Ce masque au sérum à la vitamine C aide à raviver l''éclat de ta peau et à lui redonner de l''énergie, selon 7th Heaven. Il convient à tous les types de peau.'
      THEN 'Masque en tissu imprégné d''un sérum à la vitamine C, adapté à tous les types de peau. Selon l''emballage, c''est un masque anti-fatigue qui aide à illuminer et à redynamiser la peau. Il est végan (approuvé par la Vegetarian Society) et le sachet contient un masque en tissu biodégradable.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'استراحتك بالفيتامين: ضعي على وجهك هذا القناع القماشي المشبّع بسيروم فيتامين سي. تصفه ⁨7th Heaven⁩ بأنه قناع لمظاهر التعب، يمنح البشرة إشراقاً وحيوية.' OR intro_ar = 'بشرتك تبدو متعبة؟ يساعد هذا القناع بسيروم فيتامين سي على إعادة الإشراق والحيوية إلى بشرتك، بحسب ⁨7th Heaven⁩. وهو مناسب لجميع أنواع البشرة.'
      THEN 'قناع قماشي مشبّع بسيروم فيتامين سي، مناسب لجميع أنواع البشرة. حسب الغلاف، هو قناع لمظاهر التعب يساعد على إشراق البشرة وتنشيطها. وهو نباتي (معتمد من ⁨Vegetarian Society⁩)، ويحتوي الكيس على قناع قماشي واحد قابل للتحلل الحيوي.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'Tired-looking skin? This vitamin C serum mask helps brighten your skin and give it fresh energy, according to 7th Heaven. It suits all skin types.' OR intro_en = 'Your vitamin break: lay this sheet mask, soaked in a vitamin C serum, on your face. 7th Heaven describes it as an anti-fatigue mask that brightens and re-energises the skin.'
      THEN 'Sheet mask soaked in a vitamin C serum, suitable for all skin types. According to the packaging, it is an anti-fatigue mask that helps brighten and re-energise the skin. It is vegan (approved by the Vegetarian Society) and the sachet contains one biodegradable sheet mask.' ELSE intro_en END
WHERE slug = 'vitc'
   OR (TRIM(brand) = '7th Heaven' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Nutriactive Vitamin C Advanced Serum Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%7th-heaven-vitamin-c%');

-- fiche: intro-green | green (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Ta peau a besoin de douceur ? Avec l''arbre à thé et le concombre, ce masque aide à apaiser et à revitaliser la peau, selon look AT ME. Il est fabriqué en Corée.' OR intro_fr = 'Une bulle de verdure : tu poses ce masque sur ton visage et tu profites d''un moment de détente. Avec son duo arbre à thé et concombre, look AT ME le présente comme un soin revitalisant et apaisant.'
      THEN 'Masque visage en tissu à l''arbre à thé et au concombre, sur une feuille en Tencel. Selon l''emballage, il aide à revitaliser et à apaiser la peau. Le sachet contient un masque à usage unique de 25 ml, fabriqué en Corée.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'بشرتك تحتاج إلى بعض الراحة؟ بشجرة الشاي والخيار، يساعد هذا القناع على تهدئة البشرة وإنعاشها، بحسب ⁨look AT ME⁩. وهو مصنوع في كوريا.' OR intro_ar = 'لمسة خضراء: ضعي هذا القناع على وجهك واستمتعي بلحظة استرخاء. بثنائي شجرة الشاي والخيار، تقدّمه ⁨look AT ME⁩ كعناية منعشة ومهدّئة للبشرة.'
      THEN 'قناع قماشي للوجه بشجرة الشاي والخيار، على ورقة من ألياف ⁨Tencel⁩. حسب الغلاف، يساعد على إنعاش البشرة وتهدئتها. يحتوي الكيس على قناع واحد للاستعمال مرة واحدة بحجم 25 مل، مصنوع في كوريا.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'A little green escape: lay this mask on your face and enjoy a relaxing moment. With its tea tree and cucumber duo, look AT ME presents it as a revitalising and soothing care.' OR intro_en = 'Does your skin need some comfort? With tea tree and cucumber, this mask helps soothe and revitalise the skin, according to look AT ME. It''s made in Korea.'
      THEN 'Face sheet mask with tea tree and cucumber, on a Tencel sheet. According to the packaging, it helps revitalise and soothe the skin. The sachet contains one single-use 25 ml mask, made in Korea.' ELSE intro_en END
WHERE slug = 'green'
   OR (TRIM(brand) = 'look AT ME' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Green Blend Tea Tree + Cucumber Face Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%lookatme-green-blend%');

-- fiche: intro-hazel | hazel (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Pores encombrés, mine fatiguée en milieu de semaine ? À l''hamamélis et à la lavande, ce masque est conçu pour nettoyer les pores et chasser les signes de fatigue, selon IDC Institute.' OR intro_fr = 'Ton rendez-vous du mercredi : tu poses ce masque sur ton visage et tu t''offres une pause en milieu de semaine. Avec l''hamamélis et la lavande, IDC Institute le présente comme un masque qui nettoie les pores et chasse la fatigue de la peau.'
      THEN 'Masque visage à l''hamamélis et à la lavande, n°3 (mercredi) de la gamme One Week Treatment d''IDC Institute. Selon l''emballage, il nettoie les pores et élimine la fatigue de la peau. Il n''est pas testé sur les animaux et le sachet contient un masque de 22 g.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'مسام مسدودة ووجه يبدو متعباً في منتصف الأسبوع؟ بالهماميليس واللافندر، صُمّم هذا القناع لتنظيف المسام وإزالة مظاهر التعب، بحسب ⁨IDC Institute⁩.' OR intro_ar = 'موعدك يوم الأربعاء: ضعي هذا القناع على وجهك وامنحي نفسك استراحة في منتصف الأسبوع. بالهماميليس واللافندر، تقدّمه ⁨IDC Institute⁩ كقناع ينظّف المسام ويزيل مظاهر التعب عن البشرة.'
      THEN 'قناع للوجه بالهماميليس واللافندر، رقم 3 (الأربعاء) من مجموعة ⁨One Week Treatment⁩ من ⁨IDC Institute⁩. حسب الغلاف، ينظّف المسام ويزيل مظاهر التعب عن البشرة. وهو غير مختبَر على الحيوانات، ويحتوي الكيس على قناع واحد بوزن 22 غرام.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'Clogged pores and a tired-looking face midweek? With witch hazel and lavender, this mask is designed to cleanse the pores and chase away signs of tiredness, according to IDC Institute.' OR intro_en = 'Your Wednesday date: lay this mask on your face and treat yourself to a midweek break. With witch hazel and lavender, IDC Institute presents it as a mask that cleanses the pores and removes tiredness from the skin.'
      THEN 'Face mask with witch hazel and lavender, no. 3 (Wednesday) in IDC Institute''s One Week Treatment line. According to the packaging, it cleans the pores and removes tiredness from the face. It is cruelty free and the sachet contains one 22 g mask.' ELSE intro_en END
WHERE slug = 'hazel'
   OR (TRIM(brand) = 'IDC Institute' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'One Week Treatment - Hazel + Lavender')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%idc-hazel-lavender%');

-- fiche: intro-gluta | gluta (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Peau terne ? Ce masque au glutathion aide à hydrater ta peau et à raviver son éclat, pour un teint plus lumineux et plus uniforme, selon SOME BY MI. Il est testé dermatologiquement.' OR intro_fr = 'Un moment douceur tout en rose : tu poses ce masque sur ton visage et tu te détends. SOME BY MI le décrit comme un masque hydratant au glutathion, pensé pour raviver l''éclat des peaux ternes.'
      THEN 'Masque en tissu au glutathion, sur une feuille 100 % végétale et biodégradable. Selon l''emballage, il hydrate, ravive les peaux ternes et favorise un teint plus lumineux et plus uniforme. Il est testé dermatologiquement ; poids net : 20 g.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'بشرتك باهتة؟ يساعد هذا القناع بالغلوتاثيون على ترطيب بشرتك وإعادة إشراقها، لبشرة أكثر إشراقاً وتوحّداً، بحسب ⁨SOME BY MI⁩. وهو مختبَر جلدياً.' OR intro_ar = 'لحظة رقيقة بلون الورد: ضعي هذا القناع على وجهك واسترخي. تصفه ⁨SOME BY MI⁩ بأنه قناع مرطّب بالغلوتاثيون، مصمَّم لإعادة الإشراق إلى البشرة الباهتة.'
      THEN 'قناع قماشي بالغلوتاثيون، على ورقة نباتية 100% وقابلة للتحلل الحيوي. حسب الغلاف، يرطّب البشرة وينعش البشرة الباهتة ويساعد على لون بشرة أكثر إشراقاً وتوحّداً. وهو مختبَر جلدياً، ووزنه الصافي 20 غرام.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'A soft, pink moment: lay this mask on your face and unwind. SOME BY MI describes it as a moisturising glutathione mask, designed to revive radiance in dull-looking skin.' OR intro_en = 'Dull skin? This glutathione mask helps moisturise your skin and revive its radiance, for a brighter, more even-looking tone, according to SOME BY MI. It''s dermatologist tested.'
      THEN 'Sheet mask with glutathione, on a 100% plant-based, biodegradable sheet. According to the packaging, it moisturises, revitalises dull skin and promotes a brighter, more even skin tone. It is dermatologist tested; net weight: 20 g.' ELSE intro_en END
WHERE slug = 'gluta'
   OR (TRIM(brand) = 'SOME BY MI' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Real Glutathione Brightening Care Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%some-by-mi-glutathione%');

-- fiche: intro-rosegold | rosegold (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Ta peau a soif ? Enrichi en extraits de soja et de champignon et en eau d''hamamélis, ce masque aide à nourrir et hydrater ta peau, selon masque BAR. Parfait pour une soirée entre copines.' OR intro_fr = 'Une soirée chic à la maison : tu poses ce masque sur ton visage, en solo ou entre copines. Avec ses extraits de soja et de champignon et son eau d''hamamélis, masque BAR le présente comme un masque qui aide à nourrir et hydrater la peau.'
      THEN 'Masque en tissu Rose Gold Foil de masque BAR, contenant des extraits de soja et de champignon ainsi que de l''eau d''hamamélis. Selon l''emballage, ces extraits aident à nourrir et hydrater la peau. Le sachet contient un masque complet de 30 ml.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'بشرتك عطشى؟ بمستخلص الصويا ومستخلص الفطر وماء الهماميليس، يساعد هذا القناع على تغذية بشرتك وترطيبها، بحسب ⁨masque BAR⁩. مثالي لسهرة مع الصديقات.' OR intro_ar = 'سهرة أنيقة في البيت: ضعي هذا القناع على وجهك، بمفردك أو مع صديقاتك. بمستخلص الصويا ومستخلص الفطر وماء الهماميليس، تقدّمه ⁨masque BAR⁩ كقناع يساعد على تغذية البشرة وترطيبها.'
      THEN 'قناع قماشي ⁨Rose Gold Foil⁩ من ⁨masque BAR⁩، يحتوي على مستخلص الصويا ومستخلص الفطر وماء الهماميليس. حسب الغلاف، تساعد هذه المستخلصات على تغذية البشرة وترطيبها. يحتوي الكيس على قناع كامل بحجم 30 مل.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'A chic night in: lay this mask on your face, solo or with friends. With soybean and mushroom extracts and witch hazel water, masque BAR presents it as a mask that helps nourish and hydrate the skin.' OR intro_en = 'Thirsty skin? Enriched with soybean and mushroom extracts and witch hazel water, this mask helps nourish and hydrate your skin, according to masque BAR. Perfect for a girls'' night in.'
      THEN 'masque BAR Rose Gold Foil sheet mask, containing soybean and mushroom extracts as well as witch hazel water. According to the packaging, these extracts help nourish and hydrate the skin. The sachet contains one complete 30 ml mask.' ELSE intro_en END
WHERE slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%');

-- fiche: intro-orjena-power-collagen-emulsion | orjena-power-collagen-emulsion (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'Envie d''un soin simple pour ta routine ? Cette émulsion au collagène est conçue pour soutenir l''élasticité de ta peau, la nourrir et lui apporter une sensation de fraîcheur, selon ORJENA. Elle convient à tous les types de peau.' OR intro_fr = 'Un petit rituel après le nettoyage et le tonique : tu verses un peu d''émulsion dans le creux de ta main, puis tu l''appliques en pressant doucement. ORJENA la présente comme un soin au collagène pour l''élasticité, la nutrition et la fraîcheur de la peau.'
      THEN 'Émulsion pour le visage au collagène, adaptée à tous les types de peau. Selon l''emballage, elle est destinée à l''élasticité, à la nutrition et à la fraîcheur de la peau. Elle s''applique après le nettoyage et le tonique, par pressions douces. Flacon de 100 ml.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'تبحثين عن عناية بسيطة لروتينك؟ صُمّم هذا المستحلب بالكولاجين لدعم مرونة بشرتك وتغذيتها ومنحها إحساساً بالانتعاش، بحسب ⁨ORJENA⁩. وهو مناسب لجميع أنواع البشرة.' OR intro_ar = 'طقس صغير بعد التنظيف والتونر: اسكبي قليلاً من المستحلب في راحة يدك، ثم طبّقيه بضغطات خفيفة. تقدّمه ⁨ORJENA⁩ كعناية بالكولاجين لمرونة البشرة وتغذيتها وانتعاشها.'
      THEN 'مستحلب للوجه بالكولاجين، مناسب لجميع أنواع البشرة. حسب الغلاف، هو موجّه لمرونة البشرة وتغذيتها وانتعاشها. يُطبَّق بعد التنظيف والتونر بضغطات خفيفة. قارورة بحجم 100 مل.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'A little ritual after cleansing and toning: pour a little emulsion into your palm, then apply it by gently pressing it in. ORJENA presents it as a collagen care for skin elasticity, nourishment and freshness.' OR intro_en = 'Looking for an easy step in your routine? This collagen emulsion is designed to support your skin''s elasticity, nourish it and leave a refreshing feel, according to ORJENA. It suits all skin types.'
      THEN 'Collagen face emulsion, suitable for all skin types. According to the packaging, it is designed for skin elasticity, nourishment and freshness. Apply after cleansing and toning, with gentle pressing motions. 100 ml bottle.' ELSE intro_en END
WHERE slug = 'orjena-power-collagen-emulsion' OR (TRIM(brand) = 'ORJENA' AND TRIM(name) = 'Power Collagen Emulsion');

-- fiche: intro-somebymi-yuja-niacin-anti-blemish-cream | somebymi-yuja-niacin-anti-blemish-cream (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' OR intro_fr = 'De petites imperfections ? Avec l''extrait de yuja et 5 % de niacinamide, cette crème est conçue pour aider à cibler les imperfections, selon SOME BY MI. Elle s''applique en fine couche, après ton tonique.' OR intro_fr = 'Un geste tout simple : après le nettoyage et le tonique, tu appliques une fine couche de crème. SOME BY MI la présente comme une crème anti-imperfections, à l''extrait de yuja et à 5 % de niacinamide.'
      THEN 'Crème pour le visage à l''extrait de yuja (un agrume coréen) et à 5 % de niacinamide. La marque la présente comme une crème anti-imperfections. Elle s''applique en fine couche, après le nettoyage et le tonique. Pot de 60 g.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' OR intro_ar = 'تعانين من بعض الشوائب؟ بمستخلص اليوجا و5% من النياسيناميد، صُمّم هذا الكريم للمساعدة على استهداف الشوائب، بحسب ⁨SOME BY MI⁩. ويُطبَّق بطبقة رقيقة بعد التونر.' OR intro_ar = 'خطوة بسيطة جداً: بعد التنظيف والتونر، ضعي طبقة رقيقة من الكريم. تقدّمه ⁨SOME BY MI⁩ ككريم مضاد للشوائب، بمستخلص اليوجا و5% من النياسيناميد.'
      THEN 'كريم للوجه بمستخلص اليوجا (حمضيات كورية) و5% من النياسيناميد. تقدّمه العلامة ككريم مضاد للشوائب. يُطبَّق بطبقة رقيقة بعد التنظيف والتونر. علبة بوزن 60 غرام.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' OR intro_en = 'A few blemishes? With yuja extract and 5% niacinamide, this cream is designed to help target blemishes, according to SOME BY MI. Smooth on a thin layer after your toner.' OR intro_en = 'One simple step: after cleansing and toning, smooth on a thin layer of cream. SOME BY MI presents it as an anti-blemish cream with yuja extract and 5% niacinamide.'
      THEN 'Face cream with yuja extract (a Korean citrus fruit) and 5% niacinamide. The brand presents it as an anti-blemish cream. Apply a thin layer after cleansing and toning. 60 g jar.' ELSE intro_en END
WHERE slug = 'somebymi-yuja-niacin-anti-blemish-cream' OR (TRIM(brand) = 'SOME BY MI' AND TRIM(name) = 'Yuja Niacin Anti Blemish Cream');


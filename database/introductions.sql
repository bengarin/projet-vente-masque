-- =====================================================================
-- Introductions des fiches (27/11/2026) : ce que le produit apporte et comment il s'intègre au moment de soin.
-- Les effets cités viennent de l'emballage et sont présentés comme la description de la marque, jamais comme un résultat garanti.
-- Remplit SEULEMENT une introduction vide : un texte saisi dans l'admin n'est JAMAIS écrasé.
-- Appliqué par : npm run db:migrate, npm run db:seed, npm run db:fiches.
-- =====================================================================

-- fiche: intro-collagen | collagen (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' THEN 'Un moment rien qu''à toi : tu poses ce masque sur ton visage et tu t''accordes une vraie pause. MEDIHEAL le présente comme un soin fermeté au collagène pur à 98 %, testé dermatologiquement.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' THEN 'لحظة خاصة بك: ضعي هذا القناع على وجهك وامنحي نفسك استراحة حقيقية. تقدّمه ⁨MEDIHEAL⁩ كعناية لتماسك البشرة بكولاجين نقي بنسبة 98%، وهو مختبَر جلدياً.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' THEN 'A moment just for you: lay this mask on your face and give yourself a real break. MEDIHEAL presents it as a firming care with 98% pure collagen, and it is dermatologically tested.' ELSE intro_en END
WHERE slug = 'collagen'
   OR (TRIM(brand) = 'MEDIHEAL' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Collagen')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%mediheal-collagen%');

-- fiche: intro-vitc | vitc (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' THEN 'Ta pause vitaminée : tu poses sur ton visage ce masque en tissu imprégné d''un sérum à la vitamine C. 7th Heaven le décrit comme un masque anti-fatigue, qui apporte éclat et énergie à la peau.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' THEN 'استراحتك بالفيتامين: ضعي على وجهك هذا القناع القماشي المشبّع بسيروم فيتامين سي. تصفه ⁨7th Heaven⁩ بأنه قناع لمظاهر التعب، يمنح البشرة إشراقاً وحيوية.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' THEN 'Your vitamin break: lay this sheet mask, soaked in a vitamin C serum, on your face. 7th Heaven describes it as an anti-fatigue mask that brightens and re-energises the skin.' ELSE intro_en END
WHERE slug = 'vitc'
   OR (TRIM(brand) = '7th Heaven' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Nutriactive Vitamin C Advanced Serum Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%7th-heaven-vitamin-c%');

-- fiche: intro-green | green (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' THEN 'Une bulle de verdure : tu poses ce masque sur ton visage et tu profites d''un moment de détente. Avec son duo arbre à thé et concombre, look AT ME le présente comme un soin revitalisant et apaisant.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' THEN 'لمسة خضراء: ضعي هذا القناع على وجهك واستمتعي بلحظة استرخاء. بثنائي شجرة الشاي والخيار، تقدّمه ⁨look AT ME⁩ كعناية منعشة ومهدّئة للبشرة.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' THEN 'A little green escape: lay this mask on your face and enjoy a relaxing moment. With its tea tree and cucumber duo, look AT ME presents it as a revitalising and soothing care.' ELSE intro_en END
WHERE slug = 'green'
   OR (TRIM(brand) = 'look AT ME' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Green Blend Tea Tree + Cucumber Face Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%lookatme-green-blend%');

-- fiche: intro-hazel | hazel (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' THEN 'Ton rendez-vous du mercredi : tu poses ce masque sur ton visage et tu t''offres une pause en milieu de semaine. Avec l''hamamélis et la lavande, IDC Institute le présente comme un masque qui nettoie les pores et chasse la fatigue de la peau.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' THEN 'موعدك يوم الأربعاء: ضعي هذا القناع على وجهك وامنحي نفسك استراحة في منتصف الأسبوع. بالهماميليس واللافندر، تقدّمه ⁨IDC Institute⁩ كقناع ينظّف المسام ويزيل مظاهر التعب عن البشرة.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' THEN 'Your Wednesday date: lay this mask on your face and treat yourself to a midweek break. With witch hazel and lavender, IDC Institute presents it as a mask that cleanses the pores and removes tiredness from the skin.' ELSE intro_en END
WHERE slug = 'hazel'
   OR (TRIM(brand) = 'IDC Institute' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'One Week Treatment - Hazel + Lavender')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%idc-hazel-lavender%');

-- fiche: intro-gluta | gluta (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' THEN 'Un moment douceur tout en rose : tu poses ce masque sur ton visage et tu te détends. SOME BY MI le décrit comme un masque hydratant au glutathion, pensé pour raviver l''éclat des peaux ternes.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' THEN 'لحظة رقيقة بلون الورد: ضعي هذا القناع على وجهك واسترخي. تصفه ⁨SOME BY MI⁩ بأنه قناع مرطّب بالغلوتاثيون، مصمَّم لإعادة الإشراق إلى البشرة الباهتة.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' THEN 'A soft, pink moment: lay this mask on your face and unwind. SOME BY MI describes it as a moisturising glutathione mask, designed to revive radiance in dull-looking skin.' ELSE intro_en END
WHERE slug = 'gluta'
   OR (TRIM(brand) = 'SOME BY MI' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Real Glutathione Brightening Care Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%some-by-mi-glutathione%');

-- fiche: intro-rosegold | rosegold (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' THEN 'Une soirée chic à la maison : tu poses ce masque sur ton visage, en solo ou entre copines. Avec ses extraits de soja et de champignon et son eau d''hamamélis, masque BAR le présente comme un masque qui aide à nourrir et hydrater la peau.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' THEN 'سهرة أنيقة في البيت: ضعي هذا القناع على وجهك، بمفردك أو مع صديقاتك. بمستخلص الصويا ومستخلص الفطر وماء الهماميليس، تقدّمه ⁨masque BAR⁩ كقناع يساعد على تغذية البشرة وترطيبها.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' THEN 'A chic night in: lay this mask on your face, solo or with friends. With soybean and mushroom extracts and witch hazel water, masque BAR presents it as a mask that helps nourish and hydrate the skin.' ELSE intro_en END
WHERE slug = 'rosegold'
   OR (TRIM(brand) = 'masque BAR' AND REPLACE(REPLACE(TRIM(name), '—', '-'), '–', '-') = 'Rose Gold Foil Sheet Mask')
   OR EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = products.id AND i.url LIKE '%masquebar-rose-gold-foil%');

-- fiche: intro-orjena-power-collagen-emulsion | orjena-power-collagen-emulsion (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' THEN 'Un petit rituel après le nettoyage et le tonique : tu verses un peu d''émulsion dans le creux de ta main, puis tu l''appliques en pressant doucement. ORJENA la présente comme un soin au collagène pour l''élasticité, la nutrition et la fraîcheur de la peau.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' THEN 'طقس صغير بعد التنظيف والتونر: اسكبي قليلاً من المستحلب في راحة يدك، ثم طبّقيه بضغطات خفيفة. تقدّمه ⁨ORJENA⁩ كعناية بالكولاجين لمرونة البشرة وتغذيتها وانتعاشها.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' THEN 'A little ritual after cleansing and toning: pour a little emulsion into your palm, then apply it by gently pressing it in. ORJENA presents it as a collagen care for skin elasticity, nourishment and freshness.' ELSE intro_en END
WHERE slug = 'orjena-power-collagen-emulsion' OR (TRIM(brand) = 'ORJENA' AND TRIM(name) = 'Power Collagen Emulsion');

-- fiche: intro-somebymi-yuja-niacin-anti-blemish-cream | somebymi-yuja-niacin-anti-blemish-cream (introduction) | 
UPDATE products SET
  intro_fr = CASE WHEN intro_fr IS NULL OR TRIM(intro_fr) = '' THEN 'Un geste tout simple : après le nettoyage et le tonique, tu appliques une fine couche de crème. SOME BY MI la présente comme une crème anti-imperfections, à l''extrait de yuja et à 5 % de niacinamide.' ELSE intro_fr END,
  intro_ar = CASE WHEN intro_ar IS NULL OR TRIM(intro_ar) = '' THEN 'خطوة بسيطة جداً: بعد التنظيف والتونر، ضعي طبقة رقيقة من الكريم. تقدّمه ⁨SOME BY MI⁩ ككريم مضاد للشوائب، بمستخلص اليوجا و5% من النياسيناميد.' ELSE intro_ar END,
  intro_en = CASE WHEN intro_en IS NULL OR TRIM(intro_en) = '' THEN 'One simple step: after cleansing and toning, smooth on a thin layer of cream. SOME BY MI presents it as an anti-blemish cream with yuja extract and 5% niacinamide.' ELSE intro_en END
WHERE slug = 'somebymi-yuja-niacin-anti-blemish-cream' OR (TRIM(brand) = 'SOME BY MI' AND TRIM(name) = 'Yuja Niacin Anti Blemish Cream');


# Fiches produit — 25/11/2026

Rédigées **uniquement** à partir des textes lisibles sur les photos des emballages (face avant), traduites en français, arabe et anglais.
Les phrases de la marque sont citées entre « » et attribuées (« selon la marque », « texte de la marque »). Aucune promesse médicale, aucun résultat garanti.
Prix, stock et photos : **non modifiés**.

Source des textes : `database/fiches-produits.sql`, appliqué automatiquement par `npm run db:migrate` et `npm run db:seed`, et à la demande par `npm run db:fiches` (avec compte rendu). Ne remplit que les champs vides ; reconnaît le produit par identifiant, marque + nom, ou photo d'origine.
Modifiable ensuite dans l'admin : **Produits → fiche → « Fiche détaillée »** (onglets FR / AR / EN).

## Les 6 produits traités

| # | Marque | Nom officiel (inchangé) | Type | Contenance |
|---|---|---|---|---|
| 1 | MEDIHEAL | Collagen | Masque (format exact à confirmer, non affiché) | à confirmer (ligne masquée) |
| 2 | 7th Heaven | Nutriactive Vitamin C Advanced Serum Sheet Mask | Masque en tissu au sérum | 1 masque en tissu biodégradable |
| 3 | look AT ME | Green Blend Tea Tree + Cucumber Face Mask | Masque visage en tissu — feuille en Tencel | 25 ml |
| 4 | IDC Institute | One Week Treatment — Hazel + Lavender | Masque visage | 22 g |
| 5 | SOME BY MI | Real Glutathione Brightening Care Mask | Masque en tissu — feuille 100 % végétale et biodégradable | Poids net : 20 g |
| 6 | masque BAR | Rose Gold Foil Sheet Mask | Masque en tissu | 1 masque complet — 30 ml |

Chaque fiche contient : **Les points forts** (phrases courtes « Titre : phrase », reformulées), description, fiche technique (marque, nom, type, contenance).
Le texte brut de l'emballage n'est plus affiché aux clientes (il reste consultable dans l'admin, champ « Mentions de l'emballage »).

**Points forts v2 (26/11/2026)** : uniquement des caractéristiques vérifiées (ingrédients nommés, format, matière, labels). Écartés : allégations de la marque (Anti-Fatigue, Revitalizing & Soothing, Skin Elasticity / Nutrition / Refresh, « nettoie les pores », « aide à nourrir et hydrater »…) et mentions à astérisque non lisible (5 %* de 7th Heaven, Non-Comedogenic Tested(*)). Mise à jour des bases existantes : `database/points-forts-v2.sql` (un texte modifié dans l'admin est conservé).
Les sections **Mode d'emploi** et **Précautions** ne s'affichent que si elles sont confirmées (aucun texte provisoire).

**Descriptions v2 (26/11/2026)** : réécrites dans un style simple, chaleureux et vendeur, avec uniquement des faits de l'emballage (ingrédients nommés, format, sachet, mentions) — aucun résultat promis. Mise à jour des bases existantes : `database/descriptions-v2.sql` (ne remplace que l'ancienne version exacte ; un texte modifié dans l'admin est conservé).

**Contenu v3 (26/11/2026)** : le bloc **« Pourquoi le choisir ? »** (AR « لماذا تختارينه؟ », EN « Why choose it? ») s'affiche en premier, juste après le nom et le prix : avantages courts, tirés uniquement de l'emballage (pour toutes les peaux, ingrédient mis en avant, testé dermatologiquement, végan, non testé sur les animaux, format prêt à l'emploi). Aucun résultat promis.
Règle des langues, vérifiée automatiquement sur les 24 fiches affichées (8 produits × 3 langues) :
- FR : uniquement du français (« vegan » → « végan », « cruelty free » → « non testé sur les animaux », « cocooning » → « soirée douceur », « sheet mask » / « Facial Mask » / « Wednesday » retirés, contenances en ml / g) ;
- AR : uniquement de l'arabe ; seuls les noms de marque, de produit, de gamme, d'organisation (Vegetarian Society) et la matière Tencel restent en lettres latines ; « فيتامين سي », « نباتي », « غير مختبَر على الحيوانات », unités « مل » / « غرام », prix en « درهم » ;
- EN : uniquement de l'anglais (unités impériales conservées).
Retiré : « testée non comédogène selon la marque » (Yuja Niacin), car l'astérisque n'est pas lisible. Les lignes Type / Contenance vides sont masquées (plus de « Information à confirmer »).
Mise à jour des bases existantes : `database/contenu-v3.sql` (remplace seulement les versions générées v1/v2 ; un texte modifié dans l'admin est conservé).

**Introductions (27/11/2026)** : bloc **« Ton moment de soin »** (AR « لحظة العناية بك », EN « Your care moment ») affiché en premier, avant « Pourquoi le choisir ? ». 2 phrases : le geste (poser le masque sur le visage ; pour les 2 soins, le mode d'emploi confirmé) puis l'effet **annoncé par l'emballage**, toujours attribué à la marque (« MEDIHEAL le présente comme… », « 7th Heaven le décrit comme… »). Aucune promesse de résultat.
Source des effets cités : Core Firming (MEDIHEAL), Anti-Fatigue / Brightening + Re-Energising (7th Heaven), Revitalizing & Soothing (look AT ME), « Nettoie les pores et élimine la fatigue de la peau » (IDC Institute), Moisturizing / Radiance + « revitalizes dull skin » (SOME BY MI Glutathione), « help nourish and hydrate » (masque BAR), Skin Elasticity / Nutrition / Refresh (ORJENA), Anti Blemish (nom du produit SOME BY MI Yuja).
Fichiers : colonne `intro_fr/ar/en` (`database/migrations/005_introduction_produit.sql`), textes `database/introductions.sql` (remplit seulement une introduction vide). Modifiable dans l'admin : **Produits → fiche → « Introduction (ton moment de soin) »**.

## Informations manquantes (sections masquées tant qu'elles ne sont pas confirmées)

| Information | Produits concernés | Ce qu'il faut fournir |
|---|---|---|
| Mode d'emploi | les 6 | Photo nette du **dos** de chaque emballage |
| Précautions d'emploi | les 6 | Photo du dos (ou notice) |
| Liste complète des ingrédients | les 6 (masque BAR n'indique que 3 extraits mis en avant) | Photo du dos |
| Type exact (tissu, gel, hydrogel…) | MEDIHEAL Collagen | Photo du dos ou fiche fournisseur |
| Contenance | MEDIHEAL Collagen | Photo du dos ou fiche fournisseur |
| Nom complet officiel | MEDIHEAL Collagen (texte coréen « Collagen Essential Mask », nom conservé : « Collagen ») | Confirmation fournisseur |
| Détail de l'astérisque « 5 % Active Complex* » | 7th Heaven | Photo du dos |
| Prix, stock | les 6 | À saisir dans l'admin (non modifiés ici) |

## Points d'attention
- **Arabe** : arabe standard simple (plus professionnel pour des fiches produit) ; noms de marques et de produits gardés en caractères latins, isolés pour un affichage RTL correct. Relecture par une personne native conseillée [HYPOTHÈSE : naturel mais non relu par un natif].
- **IDC Institute** : la phrase anglaise de l'emballage contient une faute (« fatique ») ; elle est citée telle qu'imprimée dans la version anglaise.
- **MEDIHEAL** : les petits textes (98 % purity, Dermatology Test Completed, texte coréen) ont été lus en agrandissant la photo ; les valeurs PPM / Dalton / peptides, illisibles, n'ont pas été reprises.

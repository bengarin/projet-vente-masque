# Fiches produit — 25/11/2026

Rédigées **uniquement** à partir des textes lisibles sur les photos des emballages (face avant), traduites en français, arabe et anglais.
Les phrases de la marque sont citées entre « » et attribuées (« selon la marque », « texte de la marque »). Aucune promesse médicale, aucun résultat garanti.
Prix, stock et photos : **non modifiés**.

Source des textes : `database/fiches-produits.sql`, appliqué automatiquement par `npm run db:migrate` et `npm run db:seed`, et à la demande par `npm run db:fiches` (avec compte rendu). Ne remplit que les champs vides ; reconnaît le produit par identifiant, marque + nom, ou photo d'origine.
Modifiable ensuite dans l'admin : **Produits → fiche → « Fiche détaillée »** (onglets FR / AR / EN).

## Les 6 produits traités

| # | Marque | Nom officiel (inchangé) | Type | Contenance |
|---|---|---|---|---|
| 1 | MEDIHEAL | Collagen | Masque — **format exact à confirmer** | **à confirmer** |
| 2 | 7th Heaven | Nutriactive Vitamin C Advanced Serum Sheet Mask | Masque en tissu au sérum | 1 masque en tissu biodégradable |
| 3 | look AT ME | Green Blend Tea Tree + Cucumber Face Mask | Masque visage en tissu — feuille en Tencel | 25 ml / 0.84 fl oz |
| 4 | IDC Institute | One Week Treatment — Hazel + Lavender | Masque visage (« Facial Mask ») | 22 g / 0.73 fl.oz |
| 5 | SOME BY MI | Real Glutathione Brightening Care Mask | Masque en tissu — feuille 100 % végétale et biodégradable | Net 20 g – 0.70 oz |
| 6 | masque BAR | Rose Gold Foil Sheet Mask | Masque en tissu | 1 masque complet — 30 ml / 1.01 US fl oz |

Chaque fiche contient : points clés relevés sur l'emballage, description, fiche technique (marque, nom, type, contenance), texte original de l'emballage.
Les sections **Mode d'emploi** et **Précautions** ne s'affichent que si elles sont confirmées (aucun texte provisoire).

**Descriptions v2 (26/11/2026)** : réécrites dans un style simple, chaleureux et vendeur, avec uniquement des faits de l'emballage (ingrédients nommés, format, sachet, mentions) — aucun résultat promis. Mise à jour des bases existantes : `database/descriptions-v2.sql` (ne remplace que l'ancienne version exacte ; un texte modifié dans l'admin est conservé).

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

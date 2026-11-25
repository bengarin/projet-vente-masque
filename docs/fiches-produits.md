# Fiches produit — 25/11/2026

Rédigées **uniquement** à partir des textes lisibles sur les photos des emballages (face avant), traduites en français, arabe et anglais.
Les phrases de la marque sont citées entre « » et attribuées (« selon la marque », « texte de la marque »). Aucune promesse médicale, aucun résultat garanti.
Prix, stock et photos : **non modifiés**.

Source des textes : `database/fiches-produits.sql` (appliqué par `npm run db:seed`, ne remplit que les champs vides).
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

Chaque fiche contient : points clés relevés sur l'emballage, description, fiche technique (marque, nom, type, contenance), mode d'emploi, précautions, texte original de l'emballage.

## Informations manquantes (affichées « Information à confirmer »)

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

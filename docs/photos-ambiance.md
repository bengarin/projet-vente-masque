# Visuels d'ambiance — 25/11/2026

12 visuels reçus (3 archives, PNG 2048 px, 4 à 8 Mo chacun) → convertis en WebP 1200 px (50 à 140 Ko).
Ajoutés à la **galerie de la fiche produit**, après la photo du sachet. Les **cartes** gardent la photo du sachet (présentation uniforme).
Enregistrement en base : `database/photos-produits.sql` (via `npm run db:migrate`, `db:seed` ou `db:fiches`, sans doublon).

## Publiés (8) — textes et illustrations conformes aux emballages

| Produit | Fichier | Contrôle |
|---|---|---|
| MEDIHEAL — Collagen | `ambiance/collagen-1.webp` | aucun texte ajouté |
| 7th Heaven — Vitamin C | `ambiance/vitc-1.webp` | « Complexe actif Vitamine C 5 % », « Éclat + Re-énergisant », « Approuvé végétalien » = mentions de l'emballage |
| 7th Heaven — Vitamin C | `ambiance/vitc-2.webp` | aucun texte ajouté |
| look AT ME — Green Blend | `ambiance/green-1.webp` | aucun texte ajouté |
| IDC Institute — Hazel + Lavender | `ambiance/hazel-1.webp` | « Hamamélis de Virginie », « Lavande », « Nettoie les pores » = emballage |
| SOME BY MI — Real Glutathione | `ambiance/gluta-1.webp` | aucun texte ajouté |
| masque BAR — Rose Gold Foil | `ambiance/rosegold-1.webp` | aucun texte ajouté |
| masque BAR — Rose Gold Foil | `ambiance/rosegold-2.webp` | « Extrait de soja », « Extrait de champignon », « Eau d'hamamélis » = emballage |

## Mis de côté (4) — dans `client/public/images/produits/ambiance/a-valider/`, NON affichés

| Produit | Problème | Pour le publier |
|---|---|---|
| SOME BY MI (gluta-2) | « Complexe antioxydant puissant » et « Hydratation intense et durable » : absents de l'emballage (allégations non vérifiées) | Refaire le visuel sans ces deux phrases, ou fournir une source officielle de la marque |
| MEDIHEAL (collagen-2) | « Collagène à faible poids moléculaire », « 7 types de peptides » : illisibles sur la photo réelle | Photo nette du sachet (dos et bas de face) ou fiche officielle MEDIHEAL |
| look AT ME (green-2) | « Théier » est faux : « tea tree » = **arbre à thé** (Melaleuca), pas le théier | Remplacer l'étiquette par « Arbre à thé » |
| IDC Institute (hazel-2) | Des **noisettes** sont représentées ; « Hazel » = **hamamélis** (witch hazel) → visuel trompeur | Refaire le visuel avec de l'hamamélis (fleurs jaunes) au lieu des noisettes |

## À savoir
- Visuels générés par IA : les petits textes imprimés sur les sachets peuvent être déformés. La photo du sachet reste la référence (1re photo de chaque fiche).
- Supprimer un visuel depuis l'admin, puis relancer `npm run db:fiches`, le remet en place : retire-le aussi de `database/photos-produits.sql` si tu ne le veux plus.

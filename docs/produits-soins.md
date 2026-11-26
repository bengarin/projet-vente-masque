# Soins vendus à l'unité — 25/11/2026

Nouvelle page **« Soins »** (`/soins`) : produits achetés à l'unité, seuls ou avec un pack de masques dans la même commande.
Le parcours des packs de masques (3 / 4 / 6) ne change pas : un soin ne peut pas entrer dans un pack (contrôlé par le serveur).

## Produits ajoutés

| Produit | Prix | Type | Contenance | Source |
|---|---|---|---|---|
| ORJENA — Power Collagen Emulsion | 179 DH | Émulsion (soin du visage) | 100 ml (EN : 100 ml / 3.38 fl oz) | visuels fournis ; prix confirmé |
| SOME BY MI — Yuja Niacin Anti Blemish Cream | 199 DH | Crème (soin du visage) | Poids net : 60 g (EN : Net 60 g – 2.11 oz) | visuels fournis ; prix confirmé |

- **Mode d'emploi** : repris des visuels, confirmé par la propriétaire comme texte officiel de la marque.
- **Points clés** : uniquement les mentions lisibles sur l'emballage (Skin Elasticity / Skin Nutrition / Refresh / For all skin types ; Niacinamide 5 % / Yuja Extract / Non-Comedogenic Tested(*) / Clinical Solution).
- **Données** : `database/produits-soins.sql` (via `npm run db:migrate`, `db:seed` ou `db:fiches`). Création seulement si le produit n'existe pas : rien n'est écrasé.
- **Admin** : champ « Mode de vente » (Masque — dans les packs / Soin — vendu à l'unité) sur chaque fiche.

## Visuels
| Visuel reçu | Utilisation |
|---|---|
| ORJENA « 3 étapes » | photo de carte (flacon recadré) + galerie |
| SOME BY MI yuja sur podium | photo de carte (boîte recadrée) + galerie |
| ORJENA affiche 179 DH | **non publié** : prix et bouton « Commander maintenant » dessinés dans l'image (deviendraient faux si le prix change) → réservé aux réseaux sociaux |
| SOME BY MI affiche 199 DH | **non publié**, même raison |
| SOME BY MI 4 étiquettes | **non publié** : « (soin quotidien) » non vérifié |

## Informations manquantes / à confirmer
- **Précautions d'emploi** et **liste des ingrédients** : non visibles → « Information à confirmer ».
- **Visuels générés par IA** : les petits textes du flacon ORJENA (3ᵉ visuel) sont illisibles et la boîte SOME BY MI indique « NET 60 6 » au lieu de « 60 G » → une **vraie photo** de chaque produit est recommandée.
- **Astérisque** de « Non-Comedogenic Tested(*) » : précision à confirmer.
- **ORJENA Power Collagen Emulsion** : existence et référence exacte non vérifiées par moi [NON VÉRIFIÉ] ; « collagène hydrolysé » (affiche) non repris.
- **Stock** : non suivi (à saisir dans l'admin si besoin).

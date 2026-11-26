# Audit des produits — 25/11/2026

Sources comparées : photo de chaque produit (`client/public/images/produits/`), base MySQL, `database/seed.sql`, ancien `legacy/assets/products.js`.

Légende : ✅ vérifié sur la photo · ❓ manquant (à compléter dans l'admin) · ⚠️ point d'attention

## Constats communs aux 6 produits

| Information | État |
|---|---|
| Prix unitaire | ❓ **aucun prix réel** dans le projet. Les prix de test (99,90 DH et 45 DH) et le stock de test (7) venaient de mes essais : remis à vide. |
| Prix des packs 3 / 4 / 6 | ❓ non définis |
| Stock | ❓ non renseigné (= « non suivi ») |
| Description FR / AR / EN | ❓ vide pour les 6 produits |
| Mode d'emploi FR / AR / EN | ❓ vide pour les 6 produits (non visible sur les photos) |
| Vidéo | ❓ aucune |
| Catégorie « Masques en tissu » | ⚠️ [HYPOTHÈSE] : déduite des emballages (« sheet mask », « facial mask ») |
| Une seule photo par produit | ⚠️ seule la face avant ; dos de l'emballage (ingrédients, mode d'emploi) absent |

## Produit par produit

### 1. MEDIHEAL — Collagen
- ✅ Marque « MEDIHEAL », nom « COLLAGEN » imprimés en gros.
- ✅ Mentions : « Core Firming », « Mediheal Dermatology ».
- ⚠️ Nom complet officiel [NON VÉRIFIÉ] : le petit texte coréen semble indiquer une gamme « … essential mask », illisible avec certitude → nom conservé : « Collagen ».
- ⚠️ Petits textes (« 98 % purity », dalton, peptides) trop petits pour être recopiés sans risque → non ajoutés.
- Photo : nette, mais beaucoup de marge blanche → le produit paraissait plus petit que les autres.

### 2. 7th Heaven — Nutriactive Vitamin C Advanced Serum Sheet Mask
- ✅ Marque et nom conformes à l'emballage.
- ✅ Mentions : Vitamin C 5 % Active Complex*, Anti-Fatigue (Brightening + Re-Energising), For all skin types, Vegan (Vegetarian Society Approved), 1 biodegradable sheet mask.
- ⚠️ « 7th Heaven » est une marque britannique, pas coréenne : à garder en tête pour la communication « soins coréens ».

### 3. look AT ME — Green Blend Tea Tree + Cucumber Face Mask
- ✅ Marque (logo « look AT ME ») et nom conformes.
- ✅ Mentions : Revitalizing & Soothing, Tencel sheet, Made in Korea.
- ✅ Ajouté : « 25 ml / 0.84 fl oz », lisible sur la photo.
- Photo : source la plus petite (700 px), mais nette.

### 4. IDC Institute — One Week Treatment — Hazel + Lavender
- ✅ Marque, nom et mentions conformes (Wednesday (3), Hamamélis et Lavande, Nettoie les pores…, 22 g / 0.73 fl.oz, Cruelty free).

### 5. SOME BY MI — Real Glutathione Brightening Care Mask
- ✅ Marque, nom et mentions conformes (Moisturizing | Radiance, Clinical Solution — Dermatologist Tested, texte descriptif imprimé, Net 20 g – 0.70 oz).
- Photo : très grande marge blanche (le sachet occupe ~45 % de l'image) → corrigé par recadrage.

### 6. masque BAR — Rose Gold Foil Sheet Mask
- ✅ Marque, nom et mentions conformes (Unmasque Beauty, texte descriptif, Contains: Soybean Extract, Mushroom Extract, Witch Hazel Water, 1 complete mask — 30 ml / 1.01 US fl oz).

## Défauts d'affichage relevés
1. Marques affichées en MAJUSCULES forcées (« LOOK AT ME », « MASQUE BAR ») → ne respectait pas l'orthographe exacte.
2. Photos de tailles visuelles très différentes (marges blanches inégales).
3. Mention « Prix à renseigner » formulée comme une consigne interne, peu claire pour une cliente.
4. Fiche détaillée : la section « Description » disparaissait quand elle était vide, au lieu de signaler l'information manquante.

## Ce qu'il te faut fournir
- Prix réel de chaque masque, et/ou prix fixe des packs 3 / 4 / 6.
- Stock disponible (si tu veux un suivi).
- Photo du dos de chaque emballage (mode d'emploi, ingrédients), pour remplir les fiches sans inventer.
- Descriptions et modes d'emploi validés, puis traduits en arabe (relecture par une personne native) et en anglais.

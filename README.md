# mapetitecoree.ma — boutique de packs de masques coréens

Application complète : **boutique React** (design scrapbook d'origine, FR / AR / EN avec RTL) + **API Node.js / Express** + **base MySQL** + **espace d'administration** sécurisé.

```
Navigateur ──► React (client/)  ──/api──►  API Express (server/)  ──►  MySQL
                boutique + /admin             vérifie et calcule tout       produits, commandes…
```

> **Important** : aucun prix, frais de livraison, stock ou mode de paiement n'a été inventé.
> Après l'installation, la boutique affiche « Prix à renseigner » et **refuse les commandes** tant que tu n'as pas rempli ces informations dans l'administration (voir « Avant d'ouvrir les ventes »).

---

## 1. Ce qu'il faut installer

| Outil | Version | Rôle |
|---|---|---|
| [Node.js](https://nodejs.org) | 20 ou plus | fait tourner l'API et compile le site |
| MySQL | 8.0 ou plus (MariaDB 10.6+ marche aussi) | stocke les données |

## 2. Installer le projet

```bash
npm run install:all
```

(installe les dépendances de `server/` et de `client/`)

## 3. Créer la base MySQL

Connecte-toi à MySQL en administrateur (`mysql -u root -p`) puis colle ceci, **en remplaçant le mot de passe** par un mot de passe long et unique :

```sql
CREATE DATABASE mapetitecoree CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mapetitecoree_app'@'localhost' IDENTIFIED BY 'METS-ICI-UN-MOT-DE-PASSE-LONG';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES, DROP ON mapetitecoree.* TO 'mapetitecoree_app'@'localhost';
```

L'application utilise ce compte limité à sa propre base (jamais `root`).

## 4. Configurer le fichier `.env`

```bash
cp server/.env.example server/.env
```

Ouvre `server/.env` et remplis :

- `DB_PASSWORD` : le mot de passe choisi à l'étape 3 ;
- `JWT_SECRET` : une longue valeur aléatoire. Pour en générer une :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Le fichier `.env` contient tes secrets : il est exclu de Git (`.gitignore`). **Ne le partage jamais et ne le mets pas dans le code.**

## 5. Créer les tables et les données de départ

```bash
npm run db:migrate
```

```bash
npm run db:seed
```

- `db:migrate` crée toutes les tables (fichiers `database/migrations/*.sql`, suivis dans la table `schema_migrations` : on peut le relancer sans risque).
- `db:seed` ajoute les 6 masques de l'ancienne version (marque, nom, mentions d'emballage, photo), la catégorie « Masques en tissu » et les tailles de pack 3 / 4 / 6 — **sans prix ni stock** — puis complète leurs fiches détaillées FR / AR / EN (`database/fiches-produits.sql`, voir `docs/fiches-produits.md`). Relancer `db:seed` ne crée aucun doublon et n'écrase jamais un champ déjà rempli.
- `db:migrate` complète aussi automatiquement les fiches des produits déjà présents, et ajoute les soins vendus à l'unité (`database/produits-soins.sql`, voir `docs/produits-soins.md`), puis met à jour les descriptions et les points forts (`database/descriptions-v2.sql`, `database/points-forts-v2.sql`, `database/contenu-v3.sql`, `database/corrections-langue.sql`, sans écraser un texte modifié dans l'admin). Pour voir ce qui est rempli produit par produit (FR/AR/EN) :

```bash
npm run db:fiches
```

**Prix unitaires des 6 masques** (prix de vente choisis par la boutique, `database/prix-masques.sql`) : MEDIHEAL Collagen 40 DH · 7th Heaven Vitamin C 27 DH · look AT ME Green Blend 29 DH · IDC Institute Hazel + Lavender 29 DH · SOME BY MI Real Glutathione 40 DH · masque BAR Rose Gold Foil 35 DH. Ils ne sont posés **que si le prix du masque est vide** : un prix déjà saisi dans l'admin est conservé (le compte rendu de `db:fiches` l'indique). Les prix des packs et des soins à l'unité ne sont pas touchés.

Les produits sont reconnus par leur identifiant d'origine, **ou** leur marque + nom officiels, **ou** leur photo d'origine : un identifiant modifié (ex. `hazel1`) ne bloque donc pas la mise à jour.

## 6. Créer le premier compte administrateur

```bash
npm run create-admin
```

Le script demande l'e-mail et le mot de passe (12 caractères minimum, masqué à la saisie). Relancer la commande avec le même e-mail **réinitialise** le mot de passe.

### Mettre à jour une installation existante (Windows, PowerShell)

Arrête d'abord les serveurs (Ctrl+C), puis depuis le dossier du projet :

```powershell
git pull origin claude/wizardly-faraday-lo4vvm
npm run install:all
npm run db:migrate
npm run db:fiches
```

Relance ensuite l'API et le site (étape 7) et recharge la page avec **Ctrl+F5**. En mode production, refais `npm run build` avant `npm start`.
Si PowerShell refuse `npm` (« l'exécution de scripts est désactivée »), utilise `npm.cmd` à la place de `npm`, ou l'Invite de commandes (cmd).

## 7. Lancer en développement (2 terminaux)

Terminal 1 — l'API (port 4000) :

```bash
npm run dev:api
```

Terminal 2 — le site React (port 5173) :

```bash
npm run dev:web
```

- Boutique : http://localhost:5173
- Administration : http://localhost:5173/admin

## 8. Mettre en production

```bash
npm run build
```

```bash
npm start
```

L'API sert alors aussi le site compilé (`client/dist`) sur un seul port. Dans `server/.env` en production : `NODE_ENV=production`, `COOKIE_SECURE=true` (site en **HTTPS obligatoire**), et `TRUST_PROXY=true` si un proxy (Nginx, hébergeur) est devant. Sauvegarde régulièrement la base MySQL **et** le dossier `server/uploads/` (photos envoyées depuis l'admin).

---

## Avant d'ouvrir les ventes (dans /admin)

1. **Produits** → pour chaque masque : vérifier le prix (pré-rempli, voir étape 5), stock (ou vide = non suivi), description / mode d'emploi si tu as des infos vérifiées.
2. **Paramètres → Tailles et prix des packs** → prix fixe par pack (ou vide = somme des prix unitaires).
3. **Paramètres → Modes de livraison** → au moins un mode actif avec ses frais réels.
4. **Paramètres → Modes de paiement** → au moins un mode actif (ex. paiement à la livraison).
5. Passe une commande test, puis vérifie-la dans **Commandes**.

## Fonctionnement

### Boutique (React)
- Parcours d'origine conservé : langue → taille du pack (3, 4, 6 ou ce que tu configures) → choix des masques → commande.
- Panier latéral, remplacement d'un masque quand le pack est plein, fiche produit, animations, mémoire du pack dans le navigateur.
- Produits, prix, stocks, livraison et paiement **chargés depuis MySQL**. Un produit inactif disparaît de la boutique.
- Stock : si un stock est renseigné, la cliente ne peut pas dépasser la quantité disponible (« Épuisé » à 0).

### Commande — sécurité
Le navigateur n'envoie **que** les identifiants des produits et les quantités. Le serveur, dans une transaction :
vérifie le pack complet, les produits actifs, le stock (et le décompte), le mode de livraison et de paiement, le téléphone marocain ; **recalcule tous les montants** ; enregistre une copie des noms et prix (l'historique reste exact si un prix change). Limite anti-abus : 10 commandes / 15 min par IP.

### Administration
- Connexion par e-mail + mot de passe (hash bcrypt), session dans un cookie `httpOnly` + `SameSite=Strict`, contrôle d'origine (anti-CSRF), 10 essais / 15 min.
- Tableau de bord : nombre de commandes, ventes (hors annulées, ce mois-ci, livrées), produits actifs/inactifs, stock bas, dernières commandes.
- Produits : ajouter, modifier (nom, marque, description FR/AR/EN, mode d'emploi, prix, stock, catégorie…), activer/désactiver, supprimer, photos (envoi, ordre, suppression ; JPEG/PNG/WebP vérifiés).
- Commandes : recherche par numéro, cliente (nom / téléphone / ville), statut, dates ; détail complet ; statut nouvelle → confirmée → en préparation → expédiée → livrée, ou annulée (remet le stock, statut définitif) ; historique des changements ; note interne ; lien appel / WhatsApp.
- Paramètres : nom de la boutique, devise, ouverture/pause des commandes, seuil de stock bas, packs, livraison, paiement, catégories.

## Meta Pixel (suivi publicitaire)
- Identifiant réglé dans **Admin → Paramètres → Suivi publicitaire** (pré-rempli : `1665012938525216` via `database/meta-pixel.sql`, ajouté seulement s'il n'existe pas). Vide = pixel désactivé.
- Chargé par la boutique uniquement (jamais sur `/admin`), avec un événement **PageView** à chaque écran (le site ne recharge pas la page entre les étapes).
- La sécurité du site (CSP) autorise seulement `connect.facebook.net` et `www.facebook.com`.
- Seul **PageView** est envoyé. Les événements de vente (AddToCart, InitiateCheckout, Purchase) ne sont **pas** branchés.
- À vérifier avec l'extension **Meta Pixel Helper** ou le « Test des événements » du Gestionnaire d'événements, sur le site en ligne.

## Arborescence

```
client/                 Site React (Vite)
  public/images/        Logo, décors, photos produit d'origine
  src/shop/             Boutique : pages (Langue, Pack, Masques, Commande), en-tête, panier, état partagé
  src/admin/            Administration : connexion, tableau de bord, produits, commandes, paramètres
  src/ui/ src/lib/      Décor scrapbook (papier déchiré, stickers), API, langues, villes
  src/styles/           CSS d'origine (style.css) + styles de chaque ancienne page
server/                 API Express
  src/routes/           shop.js (public) + admin/ (protégé)
  src/services/         catalogue, calcul des prix, création de commande
  scripts/              migrate.js, seed.js, create-admin.js
  test/                 tests du calcul des prix
  uploads/              photos envoyées depuis l'admin (non versionnées)
database/
  migrations/           structure SQL
  seed.sql              données de départ (prix des masques : prix-masques.sql)
legacy/                 ancienne maquette HTML statique (archive)
```

## Tests

```bash
npm test
```

## Ce qui n'est PAS fait (volontairement)

- **Paiement en ligne** : non intégré. Les « modes de paiement » sont des libellés (ex. paiement à la livraison). Une carte bancaire (CMI, Stripe…) demanderait un contrat et une intégration dédiée.
- **Notifications** (e-mail / WhatsApp à chaque commande) : non branchées.
- **Traductions arabes** : toute la boutique est en arabe standard simple (voir `docs/corrections-langue.md`) ; relecture par une personne native conseillée.
- **Admin** : en français uniquement ; un seul niveau d'accès (tous les admins ont tous les droits).

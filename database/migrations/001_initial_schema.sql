-- =====================================================================
-- 001 — Structure initiale de la boutique mapetitecoree.ma
-- Compatible MySQL 8.0+ et MariaDB 10.6+ (utf8mb4 pour l'arabe et les emojis)
-- Appliqué automatiquement par : npm run db:migrate  (dossier server/)
-- =====================================================================

-- Comptes administrateur (mot de passe stocké uniquement en hash bcrypt)
CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(190) NOT NULL,
  name          VARCHAR(120) NULL,
  password_hash VARCHAR(255) NOT NULL,
  last_login_at DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catégories (noms traduits)
CREATE TABLE IF NOT EXISTS categories (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug       VARCHAR(80)  NOT NULL,
  name_fr    VARCHAR(120) NOT NULL,
  name_ar    VARCHAR(120) NULL,
  name_en    VARCHAR(120) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Produits
--   price NULL = prix pas encore renseigné  → le produit ne peut pas être commandé
--   stock NULL = stock non suivi (pas de limite) ; un nombre = stock suivi et décompté à chaque commande
CREATE TABLE IF NOT EXISTS products (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug           VARCHAR(120) NOT NULL,
  category_id    INT UNSIGNED NULL,
  brand          VARCHAR(120) NOT NULL,
  name           VARCHAR(255) NOT NULL,
  description_fr TEXT NULL,
  description_ar TEXT NULL,
  description_en TEXT NULL,
  usage_fr       TEXT NULL,
  usage_ar       TEXT NULL,
  usage_en       TEXT NULL,
  pack_mentions  TEXT NULL COMMENT 'Mentions imprimées sur l emballage, une par ligne',
  price          DECIMAL(10,2) NULL,
  stock          INT NULL,
  is_active      TINYINT(1) NOT NULL DEFAULT 1,
  tape           VARCHAR(20) NOT NULL DEFAULT 'ging' COMMENT 'Ruban décoratif de la carte produit',
  video_url      VARCHAR(500) NULL,
  sort_order     INT NOT NULL DEFAULT 0,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_products_slug (slug),
  KEY ix_products_active (is_active, sort_order),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT ck_products_price CHECK (price IS NULL OR price >= 0),
  CONSTRAINT ck_products_stock CHECK (stock IS NULL OR stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Photos produit (la plus petite sort_order = photo principale)
CREATE TABLE IF NOT EXISTS product_images (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  url        VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_product_images_product (product_id, sort_order),
  CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tailles de pack proposées (3, 4, 6…). price NULL = prix du pack = somme des prix unitaires
CREATE TABLE IF NOT EXISTS pack_sizes (
  size       TINYINT UNSIGNED PRIMARY KEY,
  price      DECIMAL(10,2) NULL,
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT ck_pack_sizes_size CHECK (size BETWEEN 1 AND 12),
  CONSTRAINT ck_pack_sizes_price CHECK (price IS NULL OR price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Modes de livraison (frais et seuil de gratuité configurables depuis l'admin)
CREATE TABLE IF NOT EXISTS shipping_methods (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  label_fr   VARCHAR(150) NOT NULL,
  label_ar   VARCHAR(150) NULL,
  label_en   VARCHAR(150) NULL,
  delay_fr   VARCHAR(150) NULL,
  delay_ar   VARCHAR(150) NULL,
  delay_en   VARCHAR(150) NULL,
  fee        DECIMAL(10,2) NOT NULL,
  free_from  DECIMAL(10,2) NULL COMMENT 'Gratuit à partir de ce total produits (NULL = jamais)',
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT ck_shipping_fee CHECK (fee >= 0),
  CONSTRAINT ck_shipping_free CHECK (free_from IS NULL OR free_from >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Modes de paiement proposés (ex. paiement à la livraison). Aucun paiement en ligne n'est intégré.
CREATE TABLE IF NOT EXISTS payment_methods (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  label_fr   VARCHAR(150) NOT NULL,
  label_ar   VARCHAR(150) NULL,
  label_en   VARCHAR(150) NULL,
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paramètres simples clé/valeur (nom de la boutique, devise, commandes ouvertes…)
CREATE TABLE IF NOT EXISTS settings (
  `key`      VARCHAR(80) PRIMARY KEY,
  `value`    TEXT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Commandes : les infos de livraison, les libellés et les prix sont COPIÉS au moment de la commande
-- (si un prix change plus tard, l'historique reste exact).
CREATE TABLE IF NOT EXISTS orders (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  number             VARCHAR(32) NOT NULL,
  status             ENUM('nouvelle','confirmee','en_preparation','expediee','livree','annulee') NOT NULL DEFAULT 'nouvelle',
  lang               CHAR(2) NOT NULL DEFAULT 'fr',
  pack_size          TINYINT UNSIGNED NOT NULL,
  -- Livraison client
  customer_name      VARCHAR(120) NOT NULL,
  customer_phone     VARCHAR(20)  NOT NULL,
  address            VARCHAR(500) NOT NULL,
  city               VARCHAR(120) NOT NULL,
  city_is_other      TINYINT(1) NOT NULL DEFAULT 0,
  area               VARCHAR(120) NULL,
  -- Livraison / paiement (copie)
  shipping_method_id INT UNSIGNED NULL,
  shipping_label     VARCHAR(150) NOT NULL,
  shipping_fee       DECIMAL(10,2) NOT NULL,
  payment_method_id  INT UNSIGNED NULL,
  payment_label      VARCHAR(150) NOT NULL,
  -- Montants (calculés par le serveur)
  items_total        DECIMAL(10,2) NULL     COMMENT 'Somme des prix unitaires x quantités (NULL si un prix unitaire manque et qu un prix de pack fixe est utilisé)',
  pack_price         DECIMAL(10,2) NULL     COMMENT 'Prix fixe du pack si configuré',
  products_total     DECIMAL(10,2) NOT NULL COMMENT 'Montant produits facturé (pack_price sinon items_total)',
  total              DECIMAL(10,2) NOT NULL COMMENT 'products_total + shipping_fee',
  currency           VARCHAR(10) NOT NULL,
  admin_note         TEXT NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_orders_number (number),
  KEY ix_orders_status (status, created_at),
  KEY ix_orders_created (created_at),
  KEY ix_orders_phone (customer_phone),
  CONSTRAINT fk_orders_shipping FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE SET NULL,
  CONSTRAINT fk_orders_payment  FOREIGN KEY (payment_method_id)  REFERENCES payment_methods(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lignes de commande (copie marque / nom / prix au moment de l'achat)
CREATE TABLE IF NOT EXISTS order_items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id    INT UNSIGNED NOT NULL,
  product_id  INT UNSIGNED NULL,
  brand       VARCHAR(120) NOT NULL,
  name        VARCHAR(255) NOT NULL,
  image_url   VARCHAR(500) NULL,
  unit_price  DECIMAL(10,2) NULL,
  quantity    INT UNSIGNED NOT NULL,
  line_total  DECIMAL(10,2) NULL,
  KEY ix_order_items_order (order_id),
  CONSTRAINT fk_order_items_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  CONSTRAINT ck_order_items_qty CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Historique des changements de statut (qui, quand)
CREATE TABLE IF NOT EXISTS order_status_history (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id    INT UNSIGNED NOT NULL,
  from_status VARCHAR(20) NULL,
  to_status   VARCHAR(20) NOT NULL,
  admin_id    INT UNSIGNED NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_osh_order (order_id, created_at),
  CONSTRAINT fk_osh_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_osh_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

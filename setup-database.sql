-- ============================================================
-- Galaxy Link Computers — MySQL Database Schema
-- Run this in cPanel → phpMyAdmin BEFORE uploading PHP files.
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Categories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id`          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(255)    NOT NULL,
  `slug`        VARCHAR(255)    NOT NULL,
  `description` TEXT,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Products
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id`                INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`              VARCHAR(255)    NOT NULL,
  `category_id`       INT UNSIGNED    NOT NULL,
  `description`       TEXT,
  `short_description` VARCHAR(500),
  `price`             DECIMAL(12,2)   DEFAULT NULL,
  `price_kes`         DECIMAL(10,2)   DEFAULT NULL,
  `image_url`         VARCHAR(600)    DEFAULT NULL,
  `specifications`    TEXT            COMMENT 'JSON array',
  `badge`             VARCHAR(100)    DEFAULT NULL  COMMENT 'e.g. Popular, New, Best Seller',
  `is_featured`       TINYINT(1)      NOT NULL DEFAULT 0,
  `is_popular`        TINYINT(1)      NOT NULL DEFAULT 0,
  `stock_status`      ENUM('in_stock','out_of_stock','on_order') NOT NULL DEFAULT 'in_stock',
  `created_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_category` (`category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Admin Users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(100)    NOT NULL,
  `password_hash` VARCHAR(255)    NOT NULL,
  `email`         VARCHAR(255)    NOT NULL,
  `full_name`     VARCHAR(255)    DEFAULT NULL,
  `role`          VARCHAR(50)     NOT NULL DEFAULT 'admin',
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login`    TIMESTAMP       NULL     DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_username` (`username`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Inquiries
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id`               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`             VARCHAR(255)    NOT NULL,
  `email`            VARCHAR(255)    NOT NULL,
  `phone`            VARCHAR(60)     DEFAULT NULL,
  `message`          TEXT            NOT NULL,
  `product_interest` VARCHAR(255)    DEFAULT NULL,
  `status`           ENUM('new','read','responded','closed') NOT NULL DEFAULT 'new',
  `created_at`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `responded_at`     TIMESTAMP       NULL     DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Site Content (editable text sections)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_content` (
  `id`         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `section`    VARCHAR(100)    NOT NULL COMMENT 'e.g. hero, about, contact_cta',
  `key_name`   VARCHAR(100)    NOT NULL COMMENT 'e.g. heading, subheading, body',
  `value`      TEXT            NOT NULL,
  `updated_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_section_key` (`section`,`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Categories
INSERT INTO `categories` (`slug`,`name`,`description`) VALUES
('laptops-desktops', 'Laptops & Desktops',   'Business and personal computers'),
('servers-storage',  'Servers & Storage',     'Enterprise servers and storage solutions'),
('printers-copiers', 'Printers & Copiers',    'Office printing solutions'),
('networking',       'Networking Equipment',  'Network infrastructure'),
('cctv-security',    'CCTV & Security',       'Surveillance and security systems'),
('accessories',      'Accessories & Parts',   'Computer peripherals and components')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Default admin user  (username: admin  |  password: Admin@2026!)
-- Generated with: password_hash('Admin@2026!', PASSWORD_BCRYPT, ['cost'=>12])
-- ⚠ CHANGE THIS PASSWORD immediately after first login!
INSERT INTO `admin_users` (`username`,`password_hash`,`email`,`full_name`) VALUES
('admin','$2y$12$6g5RLVmGm4T4oTM4L5eaKOy7yN0VpNZ0yKVLJVQrU8KzGqMqBxkAO','admin@galaxylinkcomputers.co.ke','Administrator')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- Default site content
INSERT INTO `site_content` (`section`,`key_name`,`value`) VALUES
('hero',        'heading',    'Kenya''s Premier IT Solutions Provider'),
('hero',        'subheading', 'Computers, Networking, CCTV & IT Services'),
('about',       'heading',    'About Galaxy Link Computers'),
('about',       'body',       'Galaxy Link Computers is Kenya''s leading supplier of IT products and solutions, serving businesses of all sizes with quality hardware, software, and support services.'),
('contact_cta', 'heading',    'Ready to upgrade your IT infrastructure?'),
('contact_cta', 'subheading', 'Contact us for quotes, consultations, or product inquiries.')
ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);

-- ============================================================
-- IMAGE REFERENCE MAP
-- Upload your images to: /uploads/images/
-- The filenames below must match exactly (case-sensitive on Linux).
-- ============================================================
-- laptops-desktops page:
--   Dell Latitude 5420          → Dell AIO.PNG
--   HP EliteBook 840 G8         → HP Elitebook 840 g11.jpg
--   Lenovo ThinkPad T14         → lenovo t14 gen6.PNG
--   HP ProDesk 600 G6           → hp prodesk 600 gen 6.PNG
--   Dell OptiPlex 7090          → Dell AIO.PNG
--   Lenovo ThinkCentre M720     → Lenovo ThinkCentre M90s Gen 6.PNG
-- servers-storage page:
--   Dell PowerEdge R450         → Dell PowerEdge R450.PNG
--   HPE ProLiant DL380 Gen10    → HP Prolint DL 380 GEN 10 Plus.PNG
--   Lenovo ThinkSystem ST250    → Lenovo ThinkCentre M90s Gen 6.PNG
--   Synology RackStation RS2421+→ Synology RackStation RS2421+.PNG
--   Dell EMC Unity XT 380       → Dell EMC Unity XT 380.PNG
--   QNAP TS-873AU-RP            → QNAP TS-873AU-RP.PNG
--   HPE BladeSystem c7000       → HP BladeSystem c7000.PNG
--   Buffalo TeraStation 5820DN  → Buffalo TeraStation 5820DN.png
--   HPE ProLiant MicroServer    → Microserver-gen10.png
-- (see all mappings in HTML files — every <img> now uses /uploads/images/)

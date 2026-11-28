-- ShopEasy Database Schema
-- Database: shopeasy_db
-- DBMS: MySQL
-- Engine: InnoDB
-- Character set: utf8mb4

CREATE TABLE `products` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `price` DECIMAL(12,2) NOT NULL,
    `rating` DECIMAL(2,1) DEFAULT '5.0',
    `reviews` INT DEFAULT '0',
    `image` VARCHAR(500) DEFAULT NULL,
    `tag` VARCHAR(50) DEFAULT NULL,
    `stock` INT NOT NULL DEFAULT '0',
    `description` TEXT,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `discount_percent` DECIMAL(5,2) NOT NULL DEFAULT '0.00',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `order_code` VARCHAR(30) NOT NULL,
    `customer_name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `address` TEXT NOT NULL,
    `total_amount` DECIMAL(12,2) NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `status` VARCHAR(30) DEFAULT 'Pending',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `order_code` (`order_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `order_id` INT NOT NULL,
    `product_id` INT DEFAULT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(12,2) NOT NULL,
    `quantity` INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `order_id` (`order_id`),
    KEY `product_id` (`product_id`),
    CONSTRAINT `order_items_ibfk_1`
        FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
    CONSTRAINT `order_items_ibfk_2`
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payments` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `order_id` INT NOT NULL,
    `amount` DECIMAL(12,2) NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` VARCHAR(30) DEFAULT 'Pending',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `order_id` (`order_id`),
    CONSTRAINT `payments_ibfk_1`
        FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

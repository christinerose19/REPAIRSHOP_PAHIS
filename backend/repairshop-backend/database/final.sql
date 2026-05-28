-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for repairshop_db
CREATE DATABASE IF NOT EXISTS `repairshop_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `repairshop_db`;

-- Dumping structure for table repairshop_db.bookings
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_number` varchar(20) NOT NULL,
  `user_id` int DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `motorcycle_model` varchar(100) NOT NULL,
  `service_type` varchar(120) NOT NULL,
  `description` text,
  `preferred_date` date NOT NULL,
  `preferred_time` varchar(50) NOT NULL,
  `contact_number` varchar(50) NOT NULL,
  `status` enum('Pending','Approved','Rejected','Cancelled') NOT NULL DEFAULT 'Pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_number` (`booking_number`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table repairshop_db.bookings: ~2 rows (approximately)
INSERT INTO `bookings` (`id`, `booking_number`, `user_id`, `customer_name`, `motorcycle_model`, `service_type`, `description`, `preferred_date`, `preferred_time`, `contact_number`, `status`, `created_at`, `updated_at`) VALUES
	(1, 'BK-9901', 2, 'Jane Customer', 'Honda CBR 600', 'Engine Tune-up (Service)', 'Tune up and engine calibration check.', '2026-06-02', 'Morning (8 AM - 12 PM)', '(555) 019-2834', 'Approved', '2026-05-28 08:00:02', '2026-05-28 08:00:02'),
	(2, 'BK-9902', 2, 'Jane Customer', 'Honda CBR 600', 'Oil Change Service', 'Engine oil and filter renewal.', '2026-06-10', 'Afternoon (1 PM - 5 PM)', '(555) 019-2834', 'Pending', '2026-05-28 08:00:02', '2026-05-28 08:00:02');

-- Dumping structure for table repairshop_db.inventory
CREATE TABLE IF NOT EXISTS `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_code` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('Low Stock','In Stock') NOT NULL DEFAULT 'In Stock',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `item_code` (`item_code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table repairshop_db.inventory: ~5 rows (approximately)
INSERT INTO `inventory` (`id`, `item_code`, `name`, `category`, `quantity`, `price`, `status`, `created_at`, `updated_at`) VALUES
	(1, 'INV-001', 'Engine Oil 10W-40', 'Oil & Lubricants', 5, 200.00, 'Low Stock', '2026-05-28 08:00:02', '2026-05-28 08:00:02'),
	(2, 'INV-002', 'Brake Pads (Front)', 'Brake Parts', 3, 95.00, 'Low Stock', '2026-05-28 08:00:02', '2026-05-28 08:00:02'),
	(3, 'INV-003', 'Chain Lubricant', 'Oil & Lubricants', 7, 150.00, 'Low Stock', '2026-05-28 08:00:02', '2026-05-28 08:00:02'),
	(5, 'INV-005', 'Spark Plugs (Set of 4)', 'Engine Parts', 20, 30.00, 'In Stock', '2026-05-28 08:00:02', '2026-05-28 08:00:02');

-- Dumping structure for table repairshop_db.repair_jobs
CREATE TABLE IF NOT EXISTS `repair_jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_number` varchar(20) NOT NULL,
  `user_id` int DEFAULT NULL,
  `customer_code` varchar(20) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `problem` text NOT NULL,
  `status` enum('Pending','In Progress','Completed') NOT NULL DEFAULT 'Pending',
  `estimated_cost` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_number` (`job_number`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `repair_jobs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table repairshop_db.repair_jobs: ~2 rows (approximately)
INSERT INTO `repair_jobs` (`id`, `job_number`, `user_id`, `customer_code`, `customer_name`, `model`, `problem`, `status`, `estimated_cost`, `image_url`, `created_at`, `updated_at`) VALUES
	(1, 'R-1045', 2, 'C-002', 'Jane Customer', 'XRM 125', 'Engine oil change and brake inspection', 'In Progress', '150', NULL, '2026-05-28 08:00:02', '2026-05-28 08:00:02'),
	(2, 'R-1044', 2, 'C-002', 'Jane Customer', 'Raider fi 150', 'Chain replacement', 'Pending', '200', NULL, '2026-05-28 08:00:02', '2026-05-28 08:00:02');

-- Dumping structure for table repairshop_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table repairshop_db.users: ~4 rows (approximately)
INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
	(1, 'Admin User', 'admin@example.com', '$2b$10$s.n.fz8qUBBSHaw6R2ElB.Z8FjnAl.lWBbti5gkgCsOiNPnFN7hVu', 'admin', '2026-05-27 00:00:00', NULL),
	(2, 'Jane Customer', 'jane@example.com', '$2b$10$3aeZkvjr7iKPkRbZsznv1uk91RAGwsuDx707j/EOPK8RgGCMwmIay', 'customer', '2026-05-27 00:00:00', NULL),
	(3, 'Raymark Jay Acierto', 'raymarkjayacierto-it@srcb.edu.ph', '$2y$12$thbypaNKC2B2j1BEJoZ5ueWuPVCqNY4tCufLWMALkWPKgE6FZ7ZBG', 'customer', '2026-05-28 08:15:41', NULL),
	(4, 'MacMac Admin', 'admin@macmac.com', '$2y$12$xAeAwhL/MR2i.BtRLq4rBOpL2jLNgLC/sqPp1.c0im1m4cUngrzEC', 'admin', '2026-05-28 08:18:49', '2026-05-28 08:18:49');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

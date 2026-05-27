CREATE DATABASE IF NOT EXISTS repairshop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE repairshop_db;

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventory (
  id INT NOT NULL AUTO_INCREMENT,
  item_code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('Low Stock', 'In Stock') NOT NULL DEFAULT 'In Stock',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bookings (
  id INT NOT NULL AUTO_INCREMENT,
  booking_number VARCHAR(20) NOT NULL UNIQUE,
  user_id INT NULL,
  customer_name VARCHAR(100) NOT NULL,
  motorcycle_model VARCHAR(100) NOT NULL,
  service_type VARCHAR(120) NOT NULL,
  description TEXT NULL,
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(50) NOT NULL,
  contact_number VARCHAR(50) NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') NOT NULL DEFAULT 'Pending',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS repair_jobs (
  id INT NOT NULL AUTO_INCREMENT,
  job_number VARCHAR(20) NOT NULL UNIQUE,
  user_id INT NULL,
  customer_code VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  problem TEXT NOT NULL,
  status ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
  estimated_cost VARCHAR(50) NULL,
  image_url VARCHAR(255) NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (full_name, email, password_hash, role, created_at) VALUES
('Admin User', 'admin@example.com', '$2b$10$s.n.fz8qUBBSHaw6R2ElB.Z8FjnAl.lWBbti5gkgCsOiNPnFN7hVu', 'admin', '2026-05-27 00:00:00'),
('Jane Customer', 'jane@example.com', '$2b$10$3aeZkvjr7iKPkRbZsznv1uk91RAGwsuDx707j/EOPK8RgGCMwmIay', 'customer', '2026-05-27 00:00:00');

INSERT INTO inventory (item_code, name, category, quantity, price, status, created_at, updated_at) VALUES
('INV-001', 'Engine Oil 10W-40', 'Oil & Lubricants', 5, 200.00, 'Low Stock', NOW(), NOW()),
('INV-002', 'Brake Pads (Front)', 'Brake Parts', 3, 95.00, 'Low Stock', NOW(), NOW()),
('INV-003', 'Chain Lubricant', 'Oil & Lubricants', 7, 150.00, 'Low Stock', NOW(), NOW()),
('INV-004', 'Air Filter', 'Engine Parts', 15, 60.00, 'In Stock', NOW(), NOW()),
('INV-005', 'Spark Plugs (Set of 4)', 'Engine Parts', 20, 30.00, 'In Stock', NOW(), NOW());

INSERT INTO bookings (booking_number, user_id, customer_name, motorcycle_model, service_type, description, preferred_date, preferred_time, contact_number, status, created_at, updated_at) VALUES
('BK-9901', 2, 'Jane Customer', 'Honda CBR 600', 'Engine Tune-up (Service)', 'Tune up and engine calibration check.', '2026-06-02', 'Morning (8 AM - 12 PM)', '(555) 019-2834', 'Approved', NOW(), NOW()),
('BK-9902', 2, 'Jane Customer', 'Honda CBR 600', 'Oil Change Service', 'Engine oil and filter renewal.', '2026-06-10', 'Afternoon (1 PM - 5 PM)', '(555) 019-2834', 'Pending', NOW(), NOW());

INSERT INTO repair_jobs (job_number, user_id, customer_code, customer_name, model, problem, status, estimated_cost, image_url, created_at, updated_at) VALUES
('R-1045', 2, 'C-002', 'Jane Customer', 'XRM 125', 'Engine oil change and brake inspection', 'In Progress', '150', NULL, NOW(), NOW()),
('R-1044', 2, 'C-002', 'Jane Customer', 'Raider fi 150', 'Chain replacement', 'Pending', '200', NULL, NOW(), NOW());

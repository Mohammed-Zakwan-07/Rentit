-- =============================================
-- Rentit - Vehicle Rental Management System
-- Database Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS rentit_db;
USE rentit_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  status ENUM('available', 'booked', 'maintenance') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  availability ENUM('available', 'unavailable') DEFAULT 'available'
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  driver_id INT NULL,
  pickup_date DATE NOT NULL,
  dropoff_date DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

-- Insert a default admin user (password: admin123)
-- The hashed password below is bcrypt hash of 'admin123'
-- You can also register a new admin via the app and manually update the role in DB
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@rentit.com', '$2b$10$8KzQz8Z8Z8Z8Z8Z8Z8Z8ZuYJGQJQJQJQJQJQJQJQJQJQJQJQJQJQ', 'admin');
-- NOTE: The above hash is a placeholder. Run the app, register as a user,
-- then run: UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

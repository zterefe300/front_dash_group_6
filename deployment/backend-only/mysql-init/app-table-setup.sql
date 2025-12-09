-- app-table-setup.sql
-- Database schema for FrontDash application
-- This file sets up the tables for the FrontDash database

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS frontdash_db;

-- Use the database
USE frontdash_db;

-- ==========================================================
-- TABLE CREATION SECTION
-- ==========================================================

-- Common Table: Address
CREATE TABLE IF NOT EXISTS Address (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    street_address VARCHAR(255) NOT NULL,
    bldg VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL
);

-- Restaurant Section
CREATE TABLE IF NOT EXISTS Restaurant (
    restaurant_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    cuisine_type VARCHAR(100),
    picture_url VARCHAR(500),
    address_id INT,
    phone_number VARCHAR(20),
    contact_person_name VARCHAR(255),
    email_address VARCHAR(255),
    status ENUM('NEW_REG', 'ACTIVE', 'WITHDRAW_REQ') DEFAULT 'NEW_REG',
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);

CREATE INDEX idx_restaurant_name ON Restaurant(name);

CREATE TABLE IF NOT EXISTS RestaurantLogin (
    user_name VARCHAR(255) PRIMARY KEY,
    restaurant_id INT UNIQUE,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id)
);

CREATE INDEX idx_restaurant_login_user ON RestaurantLogin(user_name);

CREATE TABLE IF NOT EXISTS MenuCategory (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT,
    category_name VARCHAR(255),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id),
    UNIQUE (restaurant_id, category_name)
);

CREATE INDEX idx_menu_category_restaurant ON MenuCategory(restaurant_id);

CREATE TABLE IF NOT EXISTS MenuItem (
    menu_item_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    item_name VARCHAR(255),
    picture_url VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    availability ENUM('AVAILABLE', 'UNAVAILABLE') DEFAULT 'AVAILABLE',
    FOREIGN KEY (category_id) REFERENCES MenuCategory(category_id),
    UNIQUE (category_id, item_name)
);

CREATE INDEX idx_menu_item_category ON MenuItem(category_id);

CREATE TABLE IF NOT EXISTS OperatingHour (
    operating_hour_id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT,
    week_day VARCHAR(20),
    open_time TIME,
    close_time TIME,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id),
    UNIQUE (restaurant_id, week_day)
);

CREATE INDEX idx_operating_hour_restaurant ON OperatingHour(restaurant_id);

-- Employee Portal
CREATE TABLE IF NOT EXISTS EmployeeLogin (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    employeeType ENUM('ADMIN', 'STAFF') NOT NULL,
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastLogin DATETIME NULL
);

CREATE INDEX idx_employee_login_username ON EmployeeLogin(username);

CREATE TABLE IF NOT EXISTS StaffUsers (
    username VARCHAR(255) PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    FOREIGN KEY (username) REFERENCES EmployeeLogin(username)
);

CREATE INDEX idx_staff_users_username ON StaffUsers(username);

CREATE TABLE IF NOT EXISTS Driver (
    driver_id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    availability_status ENUM('BUSY', 'AVAILABLE') DEFAULT 'AVAILABLE'
);

-- Customer Section
CREATE TABLE IF NOT EXISTS Orders (
    order_id VARCHAR(10) PRIMARY KEY,
    restaurant_id INT,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    address_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_time DATETIME NOT NULL,
    assigned_driver_id INT,
    estimated_delivery_time DATETIME,
    order_status ENUM('PENDING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'NOT_DELIVERED') DEFAULT 'PENDING',
    tips DECIMAL(10, 2) DEFAULT 0.00,
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_time DATETIME,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id),
    FOREIGN KEY (assigned_driver_id) REFERENCES Driver(driver_id),
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);

CREATE INDEX idx_orders_restaurant ON Orders(restaurant_id);
CREATE INDEX idx_orders_driver ON Orders(assigned_driver_id);

CREATE TABLE IF NOT EXISTS OrderItem (
    order_id VARCHAR(10),
    menu_item_id INT,
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, menu_item_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (menu_item_id) REFERENCES MenuItem(menu_item_id)
);

CREATE INDEX idx_order_item_order ON OrderItem(order_id);

-- Service Charge
CREATE TABLE IF NOT EXISTS ServiceCharge (
    service_charge_id INT PRIMARY KEY AUTO_INCREMENT,
    percentage DECIMAL(5, 2) NOT NULL DEFAULT 8.25
);

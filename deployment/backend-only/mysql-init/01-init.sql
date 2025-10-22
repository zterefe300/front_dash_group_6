-- FrontDash Database Initialization
-- This file runs automatically when the MySQL container starts for the first time

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS frontdash_db;

-- Use the database
USE frontdash_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index on username for faster lookups
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);

-- Insert sample data
INSERT INTO users (username, email) VALUES
('john_doe', 'john.doe@example.com'),
('jane_smith', 'jane.smith@example.com'),
('admin_user', 'admin@example.com'),
('test_user', 'test@example.com')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

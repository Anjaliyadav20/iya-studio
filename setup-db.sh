#!/bin/bash

# IYA Database Setup Script

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  IYA Database Setup Script             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL is not installed or not in PATH${NC}"
    exit 1
fi

echo -e "${GREEN}✓ MySQL found${NC}"

# Database connection details
MYSQL_USER="root"
MYSQL_PASSWORD=""  # Empty for local setup
MYSQL_HOST="localhost"
DB_NAME="iya_studio"

echo -e "\n${BLUE}Connecting to MySQL...${NC}"

# Create database and tables
mysql -h"$MYSQL_HOST" -u"$MYSQL_USER" << EOF

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS $DB_NAME;
USE $DB_NAME;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  location VARCHAR(200) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  preferred_date DATE,
  preferred_time_slot VARCHAR(50),
  event_details TEXT,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_url VARCHAR(500) NOT NULL,
  media_type ENUM('image', 'video') DEFAULT 'image',
  service_type VARCHAR(100),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  service_type VARCHAR(100) NOT NULL,
  price_range VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database and tables created successfully${NC}"
else
    echo -e "${RED}❌ Failed to create database${NC}"
    exit 1
fi

echo -e "${BLUE}Setup complete!${NC}"
echo -e "${GREEN}Database: $DB_NAME${NC}"
echo -e "${GREEN}Host: $MYSQL_HOST${NC}"
echo -e "${GREEN}User: $MYSQL_USER${NC}"

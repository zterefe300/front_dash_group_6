#!/bin/bash

# FrontDash Local MySQL Setup Script
# This script sets up the local MySQL database for development

set -e

# Configuration
DB_NAME="frontdash_db"
DB_USER="root"
DB_PASSWORD=""  # Set your MySQL root password here if needed

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 FrontDash Local MySQL Setup${NC}"
echo -e "${BLUE}================================${NC}"

# Check if MySQL is running
echo -e "${YELLOW}Checking MySQL connection...${NC}"
MYSQL_CMD="mysqladmin ping -h localhost -u $DB_USER"
if [ -n "$DB_PASSWORD" ]; then
    MYSQL_CMD="$MYSQL_CMD -p$DB_PASSWORD"
fi

if ! $MYSQL_CMD >/dev/null 2>&1; then
    echo -e "${RED}❌ MySQL is not running or connection failed.${NC}"
    echo -e "${YELLOW}Please ensure MySQL is installed and running.${NC}"
    echo -e "${YELLOW}On macOS: brew services start mysql${NC}"
    echo -e "${YELLOW}On Linux: sudo systemctl start mysql${NC}"
    echo -e "${YELLOW}Command tried: $MYSQL_CMD${NC}"
    exit 1
fi

echo -e "${GREEN}✅ MySQL is running${NC}"

# Check if database exists and drop it if it does
echo -e "${YELLOW}Setting up database...${NC}"
mysql -h localhost -u $DB_USER ${DB_PASSWORD:+-p$DB_PASSWORD} -e "
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
" 2>/dev/null || {
    echo -e "${RED}❌ Failed to create database. Please check your MySQL credentials.${NC}"
    exit 1
}

echo -e "${GREEN}✅ Database '$DB_NAME' created${NC}"

# Get the absolute path of the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Paths to SQL files
TABLE_SETUP="$PROJECT_ROOT/deployment/backend-only/mysql-init/app-table-setup.sql"
DEMO_DATA="$PROJECT_ROOT/backend/src/main/resources/demo_data.sql"

# Check if SQL files exist
if [ ! -f "$TABLE_SETUP" ]; then
    echo -e "${RED}❌ Table setup file not found: $TABLE_SETUP${NC}"
    exit 1
fi

if [ ! -f "$DEMO_DATA" ]; then
    echo -e "${RED}❌ Demo data file not found: $DEMO_DATA${NC}"
    exit 1
fi

# Run table setup
echo -e "${YELLOW}Creating database tables...${NC}"
mysql -h localhost -u $DB_USER ${DB_PASSWORD:+-p$DB_PASSWORD} $DB_NAME < "$TABLE_SETUP"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database tables created successfully${NC}"
else
    echo -e "${RED}❌ Failed to create database tables${NC}"
    exit 1
fi

# Run demo data
echo -e "${YELLOW}Inserting demo data...${NC}"
mysql -h localhost -u $DB_USER ${DB_PASSWORD:+-p$DB_PASSWORD} $DB_NAME < "$DEMO_DATA"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Demo data inserted successfully${NC}"
else
    echo -e "${RED}❌ Failed to insert demo data${NC}"
    exit 1
fi

# Verify setup
echo -e "${YELLOW}Verifying database setup...${NC}"
TABLE_COUNT=$(mysql -h localhost -u $DB_USER ${DB_PASSWORD:+-p$DB_PASSWORD} $DB_NAME -e "SHOW TABLES;" | wc -l)
TABLE_COUNT=$((TABLE_COUNT - 1))  # Subtract header row

echo -e "${GREEN}✅ Database setup complete!${NC}"
echo -e "${BLUE}📊 Database Summary:${NC}"
echo -e "   Database: $DB_NAME"
echo -e "   Tables: $TABLE_COUNT"
echo -e "   Location: localhost:3306"

echo -e "${BLUE}🔐 Test Accounts:${NC}"
echo -e "   Admin: administrator / admin123"
echo -e "   Staff: richard01 / staff123 (and others)"
echo -e "   Restaurant: restaurant1 / password (and others)"

echo -e "${GREEN}🎉 Ready to run the Spring Boot application!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "   1. cd ../../backend"
echo -e "   2. mvn spring-boot:run"
echo -e "   3. Visit http://localhost:8080"

#!/bin/bash

# FrontDash Database Reset Script
# WARNING: This script DROPS and RECREATES the database, destroying ALL data

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

echo -e "${RED}⚠️  WARNING: This will DELETE ALL DATA in the database!${NC}"
echo -e "${RED}===================================================${NC}"
echo -e "${YELLOW}Database: $DB_NAME${NC}"
echo ""

# Ask for confirmation
read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirm
if [ "$confirm" != "yes" ]; then
    echo -e "${BLUE}Operation cancelled.${NC}"
    exit 0
fi

echo -e "${BLUE}🔄 Resetting FrontDash Database${NC}"
echo -e "${BLUE}=================================${NC}"

# Check if MySQL is running
echo -e "${YELLOW}Checking MySQL connection...${NC}"
MYSQL_CMD="mysqladmin ping -h localhost -u $DB_USER"
if [ -n "$DB_PASSWORD" ]; then
    MYSQL_CMD="$MYSQL_CMD -p$DB_PASSWORD"
fi

if ! $MYSQL_CMD >/dev/null 2>&1; then
    echo -e "${RED}❌ MySQL is not running or connection failed.${NC}"
    echo -e "${YELLOW}Command tried: $MYSQL_CMD${NC}"
    exit 1
fi

echo -e "${GREEN}✅ MySQL is running${NC}"

# Drop and recreate database
echo -e "${YELLOW}Dropping and recreating database...${NC}"
mysql -h localhost -u $DB_USER ${DB_PASSWORD:+-p$DB_PASSWORD} -e "
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
" 2>/dev/null || {
    echo -e "${RED}❌ Failed to reset database. Please check your MySQL credentials.${NC}"
    exit 1
}

echo -e "${GREEN}✅ Database '$DB_NAME' reset${NC}"

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
    echo -e "${GREEN}✅ Database tables created${NC}"
else
    echo -e "${RED}❌ Failed to create database tables${NC}"
    exit 1
fi

# Run demo data
echo -e "${YELLOW}Inserting demo data...${NC}"
mysql -h localhost -u $DB_USER ${DB_PASSWORD:+-p$DB_PASSWORD} $DB_NAME < "$DEMO_DATA"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Demo data inserted${NC}"
else
    echo -e "${RED}❌ Failed to insert demo data${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Database reset complete!${NC}"
echo -e "${BLUE}📊 Fresh database ready for development${NC}"

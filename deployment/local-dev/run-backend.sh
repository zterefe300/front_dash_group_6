#!/bin/bash

# FrontDash Backend Runner Script
# This script runs the Spring Boot backend application locally

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting FrontDash Backend${NC}"
echo -e "${BLUE}=============================${NC}"

# Load .env.local if exists
ENV_FILE="$PROJECT_ROOT/.env.local"

if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}📄 Loading environment variables from .env.local${NC}"
    export $(grep -v '^#' $ENV_FILE | xargs)
else
    echo -e "${YELLOW}⚠ No .env.local found. Using system environment variables.${NC}"
fi

# Get the absolute path of the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend directory not found: $BACKEND_DIR${NC}"
    exit 1
fi

# Check if Maven wrapper exists, otherwise use system Maven
if [ -f "$BACKEND_DIR/mvnw" ]; then
    MAVEN_CMD="./mvnw"
    echo -e "${YELLOW}Using Maven wrapper...${NC}"
else
    MAVEN_CMD="mvn"
    echo -e "${YELLOW}Using system Maven...${NC}"
fi

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java is not installed or not in PATH${NC}"
    echo -e "${YELLOW}Please install Java 17 or higher${NC}"
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo -e "${RED}❌ Java 17 or higher is required. Current version: $JAVA_VERSION${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Java $JAVA_VERSION detected${NC}"

# Check if Maven is available
if ! command -v $MAVEN_CMD &> /dev/null && [ ! -f "$BACKEND_DIR/mvnw" ]; then
    echo -e "${RED}❌ Maven is not installed or not in PATH${NC}"
    echo -e "${YELLOW}Please install Maven 3.6 or higher${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Maven detected${NC}"

# Navigate to backend directory
cd "$BACKEND_DIR"

echo -e "${YELLOW}Starting Spring Boot application...${NC}"
echo -e "${BLUE}📍 Application will be available at: http://localhost:8080${NC}"
echo -e "${BLUE}📖 Swagger UI: http://localhost:8080/swagger-ui.html${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the application${NC}"
echo ""

# Run the application
if [ -f "mvnw" ]; then
    ./mvnw spring-boot:run
else
    mvn spring-boot:run
fi

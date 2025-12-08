# Local Development Setup - Spring Boot Backend

This folder contains scripts and configurations to run the FrontDash Spring Boot backend application locally on your machine without Docker.

## Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher (running on localhost:3306)
- Maven 3.6 or higher

## MySQL Setup

Before running the setup script, ensure MySQL is running and you have the correct credentials.

**Default Configuration:**
- Username: `root`
- Password: (empty)
- Host: `localhost`
- Port: `3306`

**If you have a MySQL password:**
Edit `setup-mysql.sh` and `reset-db.sh` and change:
```bash
DB_PASSWORD="your_mysql_password_here"
```

**Test MySQL Connection:**
```bash
mysqladmin ping -h localhost -u root -p
```

## Quick Start

### 1. Setup MySQL Database

First, ensure MySQL is running on your local machine. Then run the database setup script:

```bash
# Run the MySQL setup script (requires MySQL root access)
./setup-mysql.sh
```

This script will:
- Create the `frontdash_db` database
- Create database tables
- Insert demo data

### 2. Configure Application Properties (Optional)

The application uses `application.properties` in `backend/src/main/resources/`. For local development, the default configuration should work if you have MySQL running on localhost:3306 with a root user and no password.

If you need to customize the database connection or other settings, copy the provided `application-local.properties` file:

```bash
cp application-local.properties ../../backend/src/main/resources/application-local.properties
```

Then edit the file to match your local MySQL setup:

```properties
# Update these values for your MySQL setup
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

### 3. Run the Application

```bash
# Navigate to the backend directory
cd ../../backend

# Run with Maven
mvn spring-boot:run

# Or run with Maven wrapper (if available)
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

## Available Scripts

- `setup-mysql.sh` - Sets up the local MySQL database
- `run-backend.sh` - Starts the Spring Boot application
- `reset-db.sh` - Drops and recreates the database (WARNING: destroys all data)

## Database Connection

Default connection settings:
- Host: localhost
- Port: 3306
- Database: frontdash_db
- Username: root (or your configured MySQL user)
- Password: (empty or your configured password)

## API Endpoints

Once running, the API will be available at:
- Base URL: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## Test Accounts

The demo data includes these test accounts:

### Admin Account
- Username: `administrator`
- Password: `admin123`
- Role: ADMIN

### Staff Accounts
- Username: `richard01`, `cox02`, `deckon03`, `cox04`, `mullard05`
- Password: `staff123`
- Role: STAFF

### Restaurant Owner Accounts
- Username: `restaurant1`, `restaurant2`, `restaurant3`
- Password: `password`
- Role: OWNER

## Troubleshooting

### MySQL Connection Issues
1. Ensure MySQL is running: `brew services start mysql` (macOS) or `sudo systemctl start mysql` (Linux)
2. Check MySQL credentials in `application.properties`
3. Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use
If port 8080 is busy, change it in `application.properties`:
```properties
server.port=8081
```

### Database Schema Issues
If you encounter schema validation errors, you can recreate the database:
```bash
./reset-db.sh
```

## Development Workflow

1. Make code changes in the `backend/` directory
2. The application will hot-reload automatically with Spring Boot DevTools
3. Test your changes using the API endpoints or Swagger UI
4. Check application logs in the terminal for debugging

## Stopping the Application

Press `Ctrl+C` in the terminal where the application is running.

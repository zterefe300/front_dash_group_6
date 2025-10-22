# FrontDash Deployment Guide

This directory contains Docker deployment configurations for the FrontDash application.

## 🚀 Deployment Options

### Option 1: Full Stack Deployment (Frontend + Backend + Database)

**Location:** `deployment/full-stack/`

This option runs all three services together:
- **Frontend**: React application (port 3000)
- **Backend**: Spring Boot API (port 8080)
- **Database**: MySQL 8.0 (port 3306)

#### Quick Start

```bash
cd deployment/full-stack
docker-compose up -d
```

#### Services Available

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Swagger Documentation**: http://localhost:8080/swagger-ui.html
- **MySQL Database**: localhost:3306

### Option 2: Backend Only Deployment (Backend + Database)

**Location:** `deployment/backend-only/`

This option runs only the backend services:
- **Backend**: Spring Boot API (port 8080)
- **Database**: MySQL 8.0 (port 3306)

#### Quick Start

```bash
cd deployment/backend-only
docker-compose up -d
```

#### Services Available

- **Backend API**: http://localhost:8080/api
- **Swagger Documentation**: http://localhost:8080/swagger-ui.html
- **MySQL Database**: localhost:3306

## 📋 Prerequisites

- Docker and Docker Compose installed
- At least 2GB of available RAM
- Ports 3000, 8080, and 3306 available (or modify port mappings)

## 🔧 Configuration

### Environment Variables

Both deployments use `.env` files for configuration:

#### Full Stack Configuration (`deployment/full-stack/.env`)
```env
# Database
MYSQL_ROOT_PASSWORD=frontdash_password
MYSQL_DATABASE=frontdash_db
MYSQL_USER=frontdash_user
MYSQL_PASSWORD=frontdash_password

# Backend
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/frontdash_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=frontdash_user
SPRING_DATASOURCE_PASSWORD=frontdash_password

# Frontend
VITE_API_URL=http://localhost:8080/api
```

#### Backend Only Configuration (`deployment/backend-only/.env`)
```env
# Database
MYSQL_ROOT_PASSWORD=frontdash_password
MYSQL_DATABASE=frontdash_db
MYSQL_USER=frontdash_user
MYSQL_PASSWORD=frontdash_password

# Backend
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/frontdash_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=frontdash_user
SPRING_DATASOURCE_PASSWORD=frontdash_password
```

## 🛠️ Development Setup

### Building Individual Services

#### Backend Only
```bash
# Build and run backend with database
cd deployment/backend-only
docker-compose up --build -d
```

#### Full Stack
```bash
# Build and run all services
cd deployment/full-stack
docker-compose up --build -d
```

### Database Initialization

The MySQL container automatically:
- Creates the specified database
- Sets up the configured user and password
- Runs initialization scripts from `./mysql-init/` directory (if exists)

### Viewing Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontdash-backend
docker-compose logs frontdash-frontend
docker-compose logs frontdash-mysql

# Follow logs in real-time
docker-compose logs -f
```

## 🔍 Health Checks

All services include health checks:

- **MySQL**: Database connectivity check
- **Backend**: Application health endpoint
- **Frontend**: HTTP response check

Monitor service health:
```bash
docker-compose ps
```

## 🧹 Maintenance

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete database data)
docker-compose down -v
```

### Restarting Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart frontdash-backend
```

### Accessing Database

```bash
# Connect to MySQL container
docker exec -it frontdash-mysql mysql -u frontdash_user -p frontdash_db

# View database logs
docker logs frontdash-mysql
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Change port mappings in `docker-compose.yml`
   - Example: `"3001:80"` instead of `"3000:80"`

2. **Database Connection Issues**
   - Ensure MySQL container is healthy: `docker-compose ps`
   - Check database logs: `docker logs frontdash-mysql`
   - Verify environment variables in `.env` file

3. **Build Failures**
   - Ensure all required files are present
   - Check for syntax errors in configuration files
   - Verify Docker build context paths

### Logs and Debugging

```bash
# Enable debug logging
MYSQL_ROOT_PASSWORD=frontdash_password docker-compose up

# View detailed logs
docker-compose logs --tail=100
```

## 📊 API Endpoints

Once deployed, the following endpoints are available:

### Backend API (Port 8080)
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users/search?username={text}` - Search users

### Swagger Documentation
- **Full Stack**: http://localhost:8080/swagger-ui.html
- **Backend Only**: http://localhost:8080/swagger-ui.html

## 🔒 Security Notes

- Default passwords are for development only
- Change all passwords in production
- Consider using Docker secrets for sensitive data
- MySQL root password should be different in production

## 📝 Production Considerations

For production deployment, consider:

1. **Environment Variables**: Use proper secret management
2. **Database Backups**: Implement regular backup strategies
3. **SSL/TLS**: Enable HTTPS for frontend and backend
4. **Monitoring**: Add logging and monitoring solutions
5. **Scaling**: Configure services for horizontal scaling
6. **Security**: Implement proper authentication and authorization

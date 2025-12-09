# Multi-stage build for Spring Boot application
FROM eclipse-temurin:21-jdk AS BUILDER

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src ./src

# Build the application
RUN apt-get update && apt-get install -y maven && \
    mvn clean package -DskipTests && \
    cp target/*.jar app.jar

# Production stage
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Create non-root user for security
RUN addgroup --system spring && adduser --system spring --ingroup spring

# Create upload directory with correct permissions
RUN mkdir -p /app/upload && chown -R spring:spring /app/upload

# Copy the jar from builder stage
COPY --from=builder /app/app.jar .

# Change ownership to the spring user
RUN chown spring:spring app.jar

# Switch to the spring user
USER spring

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

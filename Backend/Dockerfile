# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /workspace

# Only copy pom first to leverage Docker layer caching when sources change
COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 mvn -q -e -DskipTests dependency:go-offline

# Copy sources and build
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -q -e -DskipTests package

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Create a non-root user
RUN useradd -m -u 1001 appuser

# Copy built jar
COPY --from=builder /workspace/target/*.jar /app/app.jar

# Create a default uploads directory (can be overridden by LLM_UPLOADS_DIR)
RUN mkdir -p /app/uploads && chown -R appuser:appuser /app

# Cloud Run/App Engine provide PORT; Spring Boot reads server.port from env
ENV PORT=8080
EXPOSE 8080

USER appuser

ENTRYPOINT ["java","-jar","/app/app.jar"]

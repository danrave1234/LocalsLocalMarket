# Build stage
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre
RUN groupadd -r appuser && useradd -r -g appuser appuser
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN mkdir -p uploads && chown -R appuser:appuser /app
USER appuser
EXPOSE 8080

# Set the PORT environment variable and ensure proper binding
ENV PORT=8080
ENV SERVER_PORT=8080

ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=${PORT}"]

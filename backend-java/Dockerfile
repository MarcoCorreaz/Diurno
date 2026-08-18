# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
# Baixa as dependências (ajuda no cache do Docker)
RUN mvn dependency:go-offline

COPY src ./src
# Compila o projeto
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copia o JAR do stage de build
COPY --from=build /app/target/backend-java-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta 8080 (padrão Spring Boot e Cloud Run)
EXPOSE 8080

# Comando para rodar a aplicação otimizado para Cloud Run
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

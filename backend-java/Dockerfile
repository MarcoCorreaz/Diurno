# Stage 1: Build com Maven e JDK 21 Alpine
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /build

# Copiar apenas o pom.xml para aproveitar cache de camadas das dependências
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código-fonte e compilar o JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Imagem final leve para execução (JRE 21 Alpine)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Adicionar usuário e grupo não-root para segurança aprimorada no Cloud Run
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copiar o JAR compilado da etapa de build
COPY --from=build /build/target/*.jar /app/app.jar

# Cloud Run utiliza por padrão a porta 8080 (configurável via env $PORT)
EXPOSE 8080

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/app.jar"]

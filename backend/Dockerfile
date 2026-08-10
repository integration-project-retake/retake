FROM maven:3.9-eclipse-temurin-21 AS build
RUN apt-get update && apt-get upgrade -y
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
USER non-root
ENTRYPOINT ["java", "-jar", "app.jar"]

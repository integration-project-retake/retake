to start:
`docker compose up -d --build`


to stop:
`docker compose down -v`

if it says database does not exist:
`docker compose up -d db`

backend:
`./mvnw spring-boot:run`
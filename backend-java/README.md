# Rituno Backend (Java 21 + Spring Boot 3.4)

Este é o microsserviço de backend do Rituno, responsável pelo gerenciamento seguro de tarefas e perfis, conectando-se diretamente ao banco de dados PostgreSQL do Supabase.

## Requisitos
- Java 21
- Maven
- Instância do Supabase (para banco de dados PostgreSQL)

## Variáveis de Ambiente Necessárias
Crie um arquivo `.env` na raiz da pasta `backend-java` baseado no `.env.example`:

```env
SUPABASE_DB_URL=jdbc:postgresql://db.xxxxxx.supabase.co:5432/postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-db-password
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
FRONTEND_URL=http://localhost:5173
```

> **Atenção:** A URL do JDBC deve começar com `jdbc:postgresql://`. Obtenha a URI no painel do Supabase (*Project Settings -> Database*).

## Como Rodar Localmente

1. Na raiz de `backend-java`, compile o projeto:
```bash
mvn clean package -DskipTests
```

2. Execute o projeto usando o perfil local (que lerá as configs de `application-local.yml`):
```bash
export $(grep -v '^#' .env | xargs) && mvn spring-boot:run
```
(No Windows PowerShell):
```powershell
# Dependendo da sua configuração, você pode setar as variáveis de ambiente manualmente 
# ou usar uma IDE como IntelliJ/VSCode configurando as Env Vars no runner.
```

3. O servidor estará rodando em `http://localhost:8080`.

## Testando a API

Você pode testar a rota pública de Health Check:
```bash
curl http://localhost:8080/health
```

Para rotas protegidas (ex: `/api/tasks`), você precisa de um token JWT válido gerado pelo Supabase (obtido ao fazer login no Front-end):
```bash
curl -H "Authorization: Bearer SEU_TOKEN_JWT" http://localhost:8080/api/tasks
```

## Deploy via Docker (Exemplo Cloud Run)

Este projeto contém um `Dockerfile` otimizado para deploy em serviços Serverless como o Google Cloud Run.

```bash
docker build -t rituno-backend .
docker run -p 8080:8080 --env-file .env rituno-backend
```

# Diurno Backend (Java 21 / Spring Boot 3)

Serviço backend desenvolvido em **Java 21 LTS** e **Spring Boot 3.4**, responsável por servir o endpoint da inteligência artificial (Gemini 2.5 Flash), validação de tokens do Firebase Auth, rate limiting por usuário e monitoramento de saúde para o **Diurno** (anteriormente Rotina Inteligente).

---

## 🏗️ Stack e Decisões Técnicas

- **Java 21 LTS + Spring Boot 3.4.x**: Última versão estável e de longo suporte, aproveitando Records nativos para DTOs imutáveis e concisos.
- **Maven**: Gerenciador de dependências e build escolhido por sua previsibilidade em builds multi-stage de containers Docker (Cloud Run) e ausência de problemas com daemon/caching de Gradle em pipelines ci/cd.
- **Spring Web (REST) + RestClient**: Utiliza o cliente HTTP síncrono moderno nativo do Spring Boot 3 (`RestClient`) para comunicação direta e leve com a API REST do Google Gemini (evitando dependências gRPC pesadas e instáveis do SDK GenAI para Java).
- **Spring Security + Firebase Admin SDK (`com.google.firebase:firebase-admin`)**: Implementa um `OncePerRequestFilter` (`FirebaseAuthFilter`) que valida obrigatoriamente o header `Authorization: Bearer <token>` em toda requisição para rotas da API.
- **Rate Limiting em Memória (Bucket4j)**: Implementação leve com cache `ConcurrentHashMap` de buckets limitando cada `userId` autenticado a **20 requisições por minuto**. Acima disso, retorna `429 Too Many Requests`.
- **Spring Boot Actuator**: Exposição pública de `/actuator/health` para verificações de liveness e readiness do Google Cloud Run.
- **CORS Restrito**: Configuração baseada na variável `ALLOWED_ORIGINS`, permitindo em dev `http://localhost:5173` / `http://localhost:3000` sem wildcard (`*`).

---

## 📂 Estrutura do Projeto

```text
backend-java/
├── src/main/java/com/diurno/backend/
│   ├── DiurnoBackendApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java       # Configuração de segurança stateless
│   │   ├── CorsConfig.java           # Configuração de CORS por ALLOWED_ORIGINS
│   │   ├── RateLimitConfig.java      # Configuração Bucket4j (20 req/min/user)
│   │   └── FirebaseAuthFilter.java   # Filtro que valida token ID + Rate Limit
│   ├── controller/
│   │   └── ChatController.java       # Endpoint POST /api/chat
│   ├── service/
│   │   ├── GeminiService.java        # Integração REST com Google Gemini 2.5 Flash
│   │   └── FirebaseAuthService.java  # Validação de token ID com Firebase Admin
│   └── dto/
│       ├── ChatRequest.java          # Record DTO para requisição
│       ├── ChatResponse.java         # Record DTO para resposta de sucesso (200)
│       └── ErrorResponse.java        # Record DTO para respostas de erro
├── src/main/resources/
│   └── application.yml               # Configuração do Spring Boot
├── Dockerfile                        # Dockerfile multi-stage pronto para Cloud Run
├── pom.xml
└── .env.example
```

---

## ⚙️ Configuração Local (Sem Commitar Segredos)

1. Copie o arquivo de exemplo para referência:
   ```bash
   cp .env.example .env
   ```
2. Defina as variáveis no terminal (Bash/Zsh) ou na configuração de execução da sua IDE (IntelliJ/Eclipse/VS Code):
   ```bash
   export GEMINI_API_KEY="sua_chave_do_aistudio"
   export FIREBASE_PROJECT_ID="nome-do-seu-projeto-firebase"
   export GOOGLE_APPLICATION_CREDENTIALS="/caminho/absoluto/para/serviceAccountKey.json"
   export ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
   ```
   > **Dica de Segurança:** O arquivo `.env` deve permanecer no `.gitignore`. Nunca suba chaves da API do Gemini ou arquivos JSON da Service Account para o Git.

---

## 🚀 Como Compilar e Executar Localmente

### Usando o Maven Wrapper ou Maven local
Para executar o serviço localmente na porta `8080`:
```bash
mvn spring-boot:run
```

Para gerar o JAR compilado e executar testes:
```bash
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

---

## 🧪 Testes Manuais via `curl`

### 1. Testar Health Check (Actuator - Público sem Token)
```bash
curl -i http://localhost:8080/actuator/health
```
**Resposta esperada (`200 OK`):**
```json
{"status":"UP"}
```

### 2. Testar Endpoint Protegido Sem Token (Espera-se `401 Unauthorized`)
```bash
curl -i -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Olá, organize minha agenda"}'
```
**Resposta esperada (`401 Unauthorized`):**
```json
{"error":"Token de autenticação ausente ou inválido."}
```

### 3. Testar Endpoint Protegido Com Token Real do Firebase (`200 OK`)
Substitua `<SEU_ID_TOKEN_REAL>` por um token de ID gerado no frontend com seu login (`await auth.currentUser.getIdToken()` no console do navegador):
```bash
curl -i -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SEU_ID_TOKEN_REAL>" \
  -d '{"message":"Me dê 3 ideias para manter foco pela manhã"}'
```
**Resposta esperada (`200 OK`):**
```json
{
  "text": "1. Comece o dia sem redes sociais...\n2. Beba água imediatamente...\n3. Defina 1 meta principal para a manhã..."
}
```

### 4. Testar Rate Limiting (`429 Too Many Requests`)
Ao efetuar **mais de 20 requisições por minuto** com o mesmo usuário/token, o backend responderá com:
```json
{"error":"Muitas requisições. Tente novamente mais tarde."}
```

---

## ☁️ Comandos de Deploy no Google Cloud Run (Para Revisão)

Quando quiser colocar o container em produção no Cloud Run, os comandos são:

### 1. Build da Imagem no Cloud Build
```bash
gcloud builds submit --tag gcr.io/[SEU_PROJECT_ID]/diurno-backend ./backend-java
```

### 2. Deploy no Cloud Run
```bash
gcloud run deploy diurno-backend \
  --image gcr.io/[SEU_PROJECT_ID]/diurno-backend \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=sua_chave,FIREBASE_PROJECT_ID=rotinai-seu-projeto,ALLOWED_ORIGINS=https://seu-dominio.com"
```
> *Nota:* `--allow-unauthenticated` permite que requisições HTTP normais (dos clientes web) alcancem o Cloud Run. A autenticação do usuário e rate limiting continuam sendo rigorosamente protegidas internamente pelo nosso filtro `FirebaseAuthFilter`.

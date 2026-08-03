# ==============================================================================
# Dockerfile Multistage para Diurno (Google Cloud Run / Cloud Build)
# ==============================================================================

# ------------------------------------------------------------------------------
# Estágio 1: Build da Aplicação Frontend e do Servidor (Vite + esbuild)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies necessárias para compilar)
RUN npm ci

# Copia todo o código-fonte do projeto
COPY . .

# Executa o build de produção (gera ./dist e ./dist/server.cjs)
RUN npm run build

# ------------------------------------------------------------------------------
# Estágio 2: Imagem de Produção Leve (Runtime no Google Cloud Run)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS production

WORKDIR /app

# Define ambiente de produção e porta padrão do Google Cloud Run (8080)
ENV NODE_ENV=production
ENV PORT=8080

# Copia package.json para instalar apenas dependências de produção necessárias
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copia os artefatos compilados da etapa de build
COPY --from=build /app/dist ./dist

# Expõe a porta 8080 utilizada pelo Google Cloud Run
EXPOSE 8080

# Comando de inicialização do servidor otimizado em produção
CMD ["node", "dist/server.cjs"]

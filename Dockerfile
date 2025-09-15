# Dockerfile Nourane - Version corrigée pour Yarn 4
# COMMIT: b2187e0 - Pipeline CI/CD corrigé définitivement
FROM node:18-alpine AS base

# Installation des dépendances système
RUN apk add --no-cache libc6-compat

# Configuration Yarn 4
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

WORKDIR /app

# Copie des fichiers de configuration
COPY package.json yarn.lock turbo.json .yarnrc.yml ./

# Vérification de la configuration Yarn
RUN yarn --version

# Installation des dépendances racines
RUN yarn install --network-timeout 300000

# Copie du code source
COPY . .

# Installation explicite des dépendances du backend avec npm
RUN cd apps/backend && npm install

# Vérification que les dépendances de production sont installées
RUN echo "=== Vérification des dépendances ===" && \
    echo "Dépendances racines:" && \
    ls -la node_modules/ | grep -E "(express|mongoose|multer)" || echo "Pas trouvé dans racine" && \
    echo "Dépendances backend:" && \
    ls -la apps/backend/node_modules/ | grep -E "(express|mongoose|multer)" || echo "Pas trouvé dans backend"

# Ajout du dossier node_modules/.bin au PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Build du backend uniquement
RUN cd apps/backend && npm run build

# Stage Backend (Production)
FROM node:18-alpine AS backend-production
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
WORKDIR /app
COPY --from=base /app/package.json ./
COPY --from=base /app/yarn.lock ./
COPY --from=base /app/.yarnrc.yml ./
COPY --from=base /app/turbo.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=base /app/apps/backend/dist ./apps/backend/dist
WORKDIR /app/apps/backend
EXPOSE 5000
CMD ["node", "dist/index.js"]

# Stage Backend (Test)
FROM node:18-alpine AS backend-test
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
WORKDIR /app
COPY --from=base /app/package.json ./
COPY --from=base /app/yarn.lock ./
COPY --from=base /app/.yarnrc.yml ./
COPY --from=base /app/turbo.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=base /app/apps/backend/dist ./apps/backend/dist
WORKDIR /app/apps/backend
EXPOSE 5000
CMD ["sh"]
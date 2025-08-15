# Dockerfile pour le projet Guerlain
# CORRIGÉ: Utilise yarn install --immutable au lieu de --immutable-cache
# Commit: 329f85a - Pipeline CI/CD corrigé
FROM node:18-alpine AS base

# Installer les dépendances système
RUN apk add --no-cache libc6-compat
RUN corepack enable

# Préparer Yarn avec la bonne version
RUN corepack prepare yarn@4.9.2 --activate

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package.json yarn.lock ./
COPY turbo.json ./
COPY .yarnrc.yml ./

# Installer les dépendances avec la bonne version de Yarn
RUN yarn install --immutable

# Copier le code source
COPY . .

# Build du projet
RUN yarn build

# Image de production pour le backend uniquement
FROM node:18-alpine AS backend-production

RUN corepack enable
RUN corepack prepare yarn@4.9.2 --activate

WORKDIR /app

# Copier les dépendances et le build du backend
COPY --from=base /app/package.json ./
COPY --from=base /app/yarn.lock ./
COPY --from=base /app/turbo.json ./
COPY --from=base /app/.yarnrc.yml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/backend ./apps/backend

# Changer vers le répertoire du backend
WORKDIR /app/apps/backend

# Exposer le port du backend
EXPOSE 5000

# Commande de démarrage du backend
CMD ["yarn", "start"]

# Image de production pour le web uniquement
FROM node:18-alpine AS web-production

RUN corepack enable
RUN corepack prepare yarn@4.9.2 --activate

WORKDIR /app

# Copier les dépendances et le build du web
COPY --from=base /app/package.json ./
COPY --from=base /app/yarn.lock ./
COPY --from=base /app/turbo.json ./
COPY --from=base /app/.yarnrc.yml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/web ./apps/web

# Changer vers le répertoire du web
WORKDIR /app/apps/web

# Exposer le port du web
EXPOSE 3000

# Commande de démarrage du web
CMD ["yarn", "start"]

# Image de production pour le mobile uniquement
FROM node:18-alpine AS mobile-production

RUN corepack enable
RUN corepack prepare yarn@4.9.2 --activate

WORKDIR /app

# Copier les dépendances et le build du mobile
COPY --from=base /app/package.json ./
COPY --from=base /app/yarn.lock ./
COPY --from=base /app/turbo.json ./
COPY --from=base /app/.yarnrc.yml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/mobile ./apps/mobile

# Changer vers le répertoire du mobile
WORKDIR /app/apps/mobile

# Exposer le port du mobile
EXPOSE 4000

# Commande de démarrage du mobile
CMD ["yarn", "start"]

# Image de production complète (tous les services)
FROM node:18-alpine AS production

RUN corepack enable
RUN corepack prepare yarn@4.9.2 --activate

WORKDIR /app

# Copier les dépendances et les builds
COPY --from=base /app/package.json ./
COPY --from=base /app/yarn.lock ./
COPY --from=base /app/turbo.json ./
COPY --from=base /app/.yarnrc.yml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/backend/dist ./apps/backend/dist
COPY --from=base /app/apps/web/.next ./apps/web/.next
COPY --from=base /app/apps/mobile/dist ./apps/mobile/dist

# Exposer les ports
EXPOSE 5000 3000 4000

# Commande par défaut
CMD ["yarn", "start"]
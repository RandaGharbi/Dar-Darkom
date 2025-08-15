# Dockerfile pour le projet Guerlain - VERSION CORRIGÉE
# Utilise yarn install standard pour éviter les problèmes de cache
# Date: 2025-01-15

FROM node:18-alpine AS base

# Installer les dépendances système
RUN apk add --no-cache libc6-compat

# Configurer Yarn
RUN corepack enable
RUN corepack prepare yarn@4.9.2 --activate

WORKDIR /app

# Copier les fichiers de configuration du monorepo
COPY package.json yarn.lock ./
COPY turbo.json ./
COPY .yarnrc.yml ./

# Installer toutes les dépendances (sans flags problématiques)
RUN yarn install
    
    # Copier le code source
    COPY . .
    
    # Build du projet
    RUN yarn build
    
    # -------------------------------
    # Backend production
    # -------------------------------
    FROM node:18-alpine AS backend-production
    
    RUN corepack enable
    RUN corepack prepare yarn@4.9.2 --activate
    
    WORKDIR /app
    
    # Copier les dépendances et le build du backend uniquement
    COPY --from=base /app/package.json ./
    COPY --from=base /app/yarn.lock ./
    COPY --from=base /app/.yarnrc.yml ./
    COPY --from=base /app/node_modules ./node_modules
    COPY --from=base /app/apps/backend/dist ./apps/backend/dist
    
    WORKDIR /app/apps/backend
    EXPOSE 5000
    
    CMD ["yarn", "start"]
    
    # -------------------------------
    # Web production
    # -------------------------------
    FROM node:18-alpine AS web-production
    
    RUN corepack enable
    RUN corepack prepare yarn@4.9.2 --activate
    
    WORKDIR /app
    
    # Copier les dépendances et le build du web uniquement
    COPY --from=base /app/package.json ./
    COPY --from=base /app/yarn.lock ./
    COPY --from=base /app/.yarnrc.yml ./
    COPY --from=base /app/node_modules ./node_modules
    COPY --from=base /app/apps/web/.next ./apps/web/.next
    COPY --from=base /app/apps/web/public ./apps/web/public
    
    WORKDIR /app/apps/web
    EXPOSE 3000
    
    CMD ["yarn", "start"]
    
    # -------------------------------
    # Mobile production
    # -------------------------------
    FROM node:18-alpine AS mobile-production
    
    RUN corepack enable
    RUN corepack prepare yarn@4.9.2 --activate
    
    WORKDIR /app
    
    # Copier les dépendances et le build du mobile uniquement
    COPY --from=base /app/package.json ./
    COPY --from=base /app/yarn.lock ./
    COPY --from=base /app/.yarnrc.yml ./
    COPY --from=base /app/node_modules ./node_modules
    COPY --from=base /app/apps/mobile/dist ./apps/mobile/dist
    
    WORKDIR /app/apps/mobile
    EXPOSE 4000
    
    CMD ["yarn", "start"]
    
    # -------------------------------
    # Production multi-services
    # -------------------------------
    FROM node:18-alpine AS production
    
    ARG SERVICE=backend
    RUN corepack enable
    RUN corepack prepare yarn@4.9.2 --activate
    
    WORKDIR /app
    
    # Copier les dépendances communes
    COPY --from=base /app/package.json ./
    COPY --from=base /app/yarn.lock ./
    COPY --from=base /app/.yarnrc.yml ./
    COPY --from=base /app/node_modules ./node_modules
    
    # Copier les builds de chaque service
    COPY --from=base /app/apps/backend/dist ./apps/backend/dist
    COPY --from=base /app/apps/web/.next ./apps/web/.next
    COPY --from=base /app/apps/web/public ./apps/web/public
    COPY --from=base /app/apps/mobile/dist ./apps/mobile/dist
    
    # Exposer tous les ports
    EXPOSE 5000 3000 4000
    
    # Démarrer le service choisi via variable d'environnement SERVICE
    WORKDIR /app/apps/$SERVICE
    CMD ["yarn", "start"]
    
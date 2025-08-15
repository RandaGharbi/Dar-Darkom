# Dockerfile Guerlain - Nouvelle version sans problèmes
FROM node:18-alpine AS base

# Installation des dépendances système
RUN apk add --no-cache libc6-compat

# Configuration Yarn
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

WORKDIR /app

# Copie des fichiers de configuration
COPY package.json yarn.lock turbo.json .yarnrc.yml ./

# Installation des dépendances sans cache
RUN yarn install --network-timeout 300000

# Copie du code source
COPY . .

# Build du projet
RUN yarn build

# Stage Backend
FROM node:18-alpine AS backend-production
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
WORKDIR /app
COPY --from=base /app/package.json ./
COPY --from=base /app/yarn.lock ./
COPY --from=base /app/.yarnrc.yml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/backend/dist ./apps/backend/dist
WORKDIR /app/apps/backend
EXPOSE 5000
CMD ["yarn", "start"]

# Stage Web
FROM node:18-alpine AS web-production
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
WORKDIR /app
COPY --from=base /app/package.json ./
COPY --from=base /app/yarn.lock ./
COPY --from=base /app/.yarnrc.yml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/web/.next ./apps/web/.next
COPY --from=base /app/apps/web/public ./apps/web/public
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["yarn", "start"]

# Stage Mobile
FROM node:18-alpine AS mobile-production
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
WORKDIR /app
COPY --from=base /app/package.json ./
COPY --from=base /app/yarn.lock ./
COPY --from=base /app/.yarnrc.yml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/mobile/dist ./apps/mobile/dist
WORKDIR /app/apps/mobile
EXPOSE 4000
CMD ["yarn", "start"]
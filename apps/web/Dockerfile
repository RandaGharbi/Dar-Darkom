# Dockerfile pour le frontend web Guerlain
FROM node:18-alpine AS base

# Installer les dépendances système
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copier les fichiers de configuration
COPY package.json package-lock.json ./
COPY next.config.js ./
COPY tsconfig.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build Next.js
RUN npm run build

# Image de production
FROM node:18-alpine AS production

WORKDIR /app

# Installer les dépendances de production
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copier les fichiers buildés
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.js ./

# Utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Changer les permissions
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3000

# Commande de démarrage
CMD ["npm", "start"] 
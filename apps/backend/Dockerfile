# Dockerfile pour le backend Nourane
FROM node:18-alpine

# Installation des dépendances système
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# Exposition du port
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "start"]
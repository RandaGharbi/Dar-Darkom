#!/bin/bash

echo "📱 Démarrage de l'application Dar Darkom Driver..."

# Aller dans le répertoire mobile-driver
cd "$(dirname "$0")"

# Nettoyer le cache
echo "🧹 Nettoyage du cache..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf .metro-cache

# Installer les dépendances si nécessaire
echo "📦 Vérification des dépendances..."
npm install

# Démarrer l'application
echo "🚀 Démarrage de l'application..."
npx expo start --clear --tunnel





#!/bin/bash

echo "🧹 Nettoyage complet et démarrage de l'application..."

# Aller dans le répertoire mobile-driver
cd "$(dirname "$0")"

# Arrêter tous les processus Metro/Expo
echo "🛑 Arrêt des processus existants..."
pkill -f "metro" 2>/dev/null || true
pkill -f "expo" 2>/dev/null || true

# Nettoyer complètement
echo "🧹 Nettoyage du cache..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf .metro-cache
rm -rf .expo-shared

# Réinstaller les dépendances si nécessaire
echo "📦 Vérification des dépendances..."
npm install

# Démarrer avec un port spécifique
echo "🚀 Démarrage de l'application sur le port 8083..."
npx expo start --port 8083 --clear --reset-cache





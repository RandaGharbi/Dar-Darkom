#!/bin/bash

# Script pour démarrer le backend avec la configuration réseau appropriée
# Ce script permet d'accéder au backend depuis un iPhone physique

echo "🚀 Démarrage du backend avec configuration réseau..."

# Aller dans le dossier backend
cd apps/backend

# Obtenir l'adresse IP de l'ordinateur
IP_ADDRESS=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo "📍 Adresse IP détectée: $IP_ADDRESS"
echo "🌐 Le backend sera accessible sur: http://$IP_ADDRESS:5000"

# Définir les variables d'environnement pour le réseau
export BASE_URL="http://$IP_ADDRESS:5000"
export HOST="0.0.0.0"
export PORT=5000

echo "⚙️  Configuration:"
echo "   - BASE_URL: $BASE_URL"
echo "   - HOST: $HOST"
echo "   - PORT: $PORT"

# Démarrer le backend
echo "🔥 Démarrage du serveur..."
npm run dev 
#!/bin/bash

echo "🚀 Démarrage et test du backend Dar Darkom..."

# Aller dans le répertoire backend
cd "$(dirname "$0")"

# Démarrer le backend en arrière-plan
echo "🌐 Démarrage du serveur en arrière-plan..."
npm run dev &
BACKEND_PID=$!

# Attendre que le serveur démarre
echo "⏳ Attente du démarrage du serveur..."
sleep 10

# Tester l'endpoint
echo "🧪 Test des endpoints Apple..."
node test-apple-endpoint.js

# Arrêter le backend
echo "🛑 Arrêt du serveur..."
kill $BACKEND_PID

echo "✅ Test terminé !"

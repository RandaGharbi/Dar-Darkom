#!/bin/bash

echo "🚀 Démarrage du backend Dar Darkom..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

# Aller dans le répertoire backend
cd "$(dirname "$0")"

echo "📦 Installation des dépendances..."
npm install

echo "🔧 Compilation TypeScript..."
npm run build

echo "🌐 Démarrage du serveur..."
npm run dev

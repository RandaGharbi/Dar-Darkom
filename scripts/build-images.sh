#!/bin/bash

# Script de construction des images Docker Guerlain
# Usage: ./scripts/build-images.sh [test|production|all]

set -e

echo "🚀 Construction des images Docker Guerlain..."

# Fonction pour construire l'image de test
build_test_image() {
    echo "📦 Construction de l'image de test..."
    docker build --target backend-test -t guerlain-backend-test .
    echo "✅ Image de test construite: guerlain-backend-test"
}

# Fonction pour construire l'image de production
build_production_image() {
    echo "🏭 Construction de l'image de production..."
    docker build --target backend-production -t guerlain-backend-production .
    echo "✅ Image de production construite: guerlain-backend-production"
}

# Fonction pour construire toutes les images
build_all_images() {
    build_test_image
    build_production_image
}

# Fonction pour nettoyer les anciennes images
cleanup_old_images() {
    echo "🧹 Nettoyage des anciennes images..."
    docker rmi guerlain-backend-test guerlain-backend-production guerlain-backend-test-fixed 2>/dev/null || true
    echo "✅ Nettoyage terminé"
}

# Fonction pour lister les images
list_images() {
    echo "📋 Images disponibles:"
    docker images | grep guerlain || echo "Aucune image guerlain trouvée"
}

# Gestion des arguments
case "${1:-all}" in
    "test")
        build_test_image
        ;;
    "production")
        build_production_image
        ;;
    "all")
        build_all_images
        ;;
    "cleanup")
        cleanup_old_images
        ;;
    "list")
        list_images
        ;;
    *)
        echo "Usage: $0 [test|production|all|cleanup|list]"
        echo "  test      - Construire l'image de test"
        echo "  production - Construire l'image de production"
        echo "  all       - Construire toutes les images (défaut)"
        echo "  cleanup   - Nettoyer les anciennes images"
        echo "  list      - Lister les images disponibles"
        exit 1
        ;;
esac

echo "🎉 Construction terminée !"
list_images

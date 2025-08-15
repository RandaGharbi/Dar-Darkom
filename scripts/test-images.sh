#!/bin/bash

# Script de test des images Docker Guerlain
# Usage: ./scripts/test-images.sh [test|production|all]

set -e

echo "🧪 Test des images Docker Guerlain..."

# Fonction pour tester l'image de test
test_test_image() {
    echo "📦 Test de l'image de test..."
    
    # Vérifier qu'Express est installé
    echo "  - Vérification d'Express..."
    if docker run --rm guerlain-backend-test sh -c "ls -la /app/node_modules | grep express" >/dev/null 2>&1; then
        echo "    ✅ Express est installé"
    else
        echo "    ❌ Express n'est pas installé"
        return 1
    fi
    
    # Vérifier que le code compilé existe
    echo "  - Vérification du code compilé..."
    if docker run --rm guerlain-backend-test sh -c "ls -la /app/apps/backend/dist" >/dev/null 2>&1; then
        echo "    ✅ Code compilé présent"
    else
        echo "    ❌ Code compilé manquant"
        return 1
    fi
    
    echo "  ✅ Image de test fonctionne correctement"
}

# Fonction pour tester l'image de production
test_production_image() {
    echo "🏭 Test de l'image de production..."
    
    # Vérifier qu'Express est installé
    echo "  - Vérification d'Express..."
    if docker run --rm guerlain-backend-production sh -c "ls -la /app/node_modules | grep express" >/dev/null 2>&1; then
        echo "    ✅ Express est installé"
    else
        echo "    ❌ Express n'est pas installé"
        return 1
    fi
    
    # Vérifier que le code compilé existe
    echo "  - Vérification du code compilé..."
    if docker run --rm guerlain-backend-production sh -c "ls -la /app/apps/backend/dist" >/dev/null 2>&1; then
        echo "    ✅ Code compilé présent"
    else
        echo "    ❌ Code compilé manquant"
        return 1
    fi
    
    # Test de démarrage rapide
    echo "  - Test de démarrage..."
    CONTAINER_ID=$(docker run -d --name guerlain-test-prod guerlain-backend-production)
    sleep 5
    
    if docker logs $CONTAINER_ID | grep -q "Server running on port 5000"; then
        echo "    ✅ Serveur démarre correctement"
    else
        echo "    ❌ Serveur ne démarre pas"
        docker logs $CONTAINER_ID
        docker stop $CONTAINER_ID >/dev/null 2>&1 || true
        docker rm $CONTAINER_ID >/dev/null 2>&1 || true
        return 1
    fi
    
    # Nettoyage
    docker stop $CONTAINER_ID >/dev/null 2>&1 || true
    docker rm $CONTAINER_ID >/dev/null 2>&1 || true
    
    echo "  ✅ Image de production fonctionne correctement"
}

# Fonction pour tester toutes les images
test_all_images() {
    test_test_image
    test_production_image
}

# Gestion des arguments
case "${1:-all}" in
    "test")
        test_test_image
        ;;
    "production")
        test_production_image
        ;;
    "all")
        test_all_images
        ;;
    *)
        echo "Usage: $0 [test|production|all]"
        echo "  test      - Tester l'image de test"
        echo "  production - Tester l'image de production"
        echo "  all       - Tester toutes les images (défaut)"
        exit 1
        ;;
esac

echo "🎉 Tests terminés avec succès !"

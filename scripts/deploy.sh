#!/bin/bash

# Script de déploiement pour Nourane
set -e

# Configuration
ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.yml"
BACKUP_DIR="./backups"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions de logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    if [ ! -f ".env" ]; then
        log_warning "Fichier .env non trouvé, création d'un template..."
        cp .env.example .env 2>/dev/null || {
            log_error "Impossible de créer le fichier .env"
            exit 1
        }
    fi
    
    log_success "Prérequis vérifiés"
}

# Sauvegarde de la base de données
backup_database() {
    log_info "Sauvegarde de la base de données..."
    
    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="$BACKUP_DIR/mongodb_backup_$TIMESTAMP.gz"
    
    docker-compose exec -T mongodb mongodump --archive --gzip > "$BACKUP_FILE" 2>/dev/null || {
        log_warning "Impossible de sauvegarder la base de données (peut-être pas encore démarrée)"
    }
    
    log_success "Sauvegarde créée: $BACKUP_FILE"
}

# Arrêt des services
stop_services() {
    log_info "Arrêt des services..."
    docker-compose down --remove-orphans
    log_success "Services arrêtés"
}

# Pull des dernières images
pull_images() {
    log_info "Récupération des dernières images..."
    docker-compose pull
    log_success "Images récupérées"
}

# Démarrage des services
start_services() {
    log_info "Démarrage des services..."
    docker-compose up -d
    
    # Attendre que les services soient prêts
    log_info "Attente du démarrage des services..."
    sleep 30
    
    # Vérification de la santé des services
    check_health
}

# Vérification de la santé des services
check_health() {
    log_info "Vérification de la santé des services..."
    
    # Vérifier MongoDB
    if docker-compose exec -T mongodb mongosh --eval "db.runCommand('ping').ok" | grep -q "1"; then
        log_success "MongoDB est opérationnel"
    else
        log_error "MongoDB n'est pas opérationnel"
        exit 1
    fi
    
    # Vérifier le backend
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        log_success "Backend est opérationnel"
    else
        log_warning "Backend n'est pas encore prêt, nouvelle tentative dans 30s..."
        sleep 30
        if curl -f http://localhost:5000/health > /dev/null 2>&1; then
            log_success "Backend est opérationnel"
        else
            log_error "Backend n'est pas opérationnel"
            exit 1
        fi
    fi
    
    # Vérifier le frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_success "Frontend est opérationnel"
    else
        log_warning "Frontend n'est pas encore prêt, nouvelle tentative dans 30s..."
        sleep 30
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            log_success "Frontend est opérationnel"
        else
            log_error "Frontend n'est pas opérationnel"
            exit 1
        fi
    fi
}

# Nettoyage des anciennes images
cleanup() {
    log_info "Nettoyage des anciennes images..."
    docker image prune -f
    docker system prune -f
    log_success "Nettoyage terminé"
}

# Affichage des logs
show_logs() {
    log_info "Logs des services:"
    docker-compose logs --tail=50
}

# Fonction principale
main() {
    log_info "Démarrage du déploiement en environnement: $ENVIRONMENT"
    
    check_prerequisites
    backup_database
    stop_services
    pull_images
    start_services
    cleanup
    
    log_success "Déploiement terminé avec succès!"
    log_info "Services disponibles:"
    log_info "  - Frontend: http://localhost:3000"
    log_info "  - Backend API: http://localhost:5000"
    log_info "  - MongoDB: localhost:27017"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "  - Nginx (HTTPS): https://localhost"
    fi
}

# Gestion des erreurs
trap 'log_error "Erreur lors du déploiement"; exit 1' ERR

# Exécution
main "$@" 
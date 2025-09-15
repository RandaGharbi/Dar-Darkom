# Makefile pour Nourane - Commandes simplifiées

.PHONY: help build up down logs clean test deploy backup restore

# Variables
COMPOSE_FILE = docker-compose.yml
ENVIRONMENT ?= development

# Couleurs pour les logs
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
BLUE = \033[0;34m
NC = \033[0m # No Color

# Aide
help: ## Afficher cette aide
	@echo "$(BLUE)Nourane - Commandes disponibles:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

# Développement
dev: ## Démarrer l'environnement de développement
	@echo "$(BLUE)Démarrage de l'environnement de développement...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)Services démarrés!$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Backend: http://localhost:5000$(NC)"

dev-logs: ## Afficher les logs de développement
	docker-compose -f $(COMPOSE_FILE) logs -f

# Production
build: ## Construire les images Docker
	@echo "$(BLUE)Construction des images Docker...$(NC)"
	docker-compose -f $(COMPOSE_FILE) build --no-cache
	@echo "$(GREEN)Images construites!$(NC)"

up: ## Démarrer les services en production
	@echo "$(BLUE)Démarrage des services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)Services démarrés!$(NC)"

down: ## Arrêter les services
	@echo "$(BLUE)Arrêt des services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down
	@echo "$(GREEN)Services arrêtés!$(NC)"

restart: ## Redémarrer les services
	@echo "$(BLUE)Redémarrage des services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) restart
	@echo "$(GREEN)Services redémarrés!$(NC)"

# Logs et monitoring
logs: ## Afficher les logs de tous les services
	docker-compose -f $(COMPOSE_FILE) logs -f

logs-backend: ## Afficher les logs du backend
	docker-compose -f $(COMPOSE_FILE) logs -f backend

logs-web: ## Afficher les logs du frontend
	docker-compose -f $(COMPOSE_FILE) logs -f web

logs-mongodb: ## Afficher les logs de MongoDB
	docker-compose -f $(COMPOSE_FILE) logs -f mongodb

status: ## Afficher le statut des services
	@echo "$(BLUE)Statut des services:$(NC)"
	docker-compose -f $(COMPOSE_FILE) ps

health: ## Vérifier la santé des services
	@echo "$(BLUE)Vérification de la santé des services...$(NC)"
	@curl -f http://localhost:5000/health > /dev/null 2>&1 && echo "$(GREEN)✓ Backend OK$(NC)" || echo "$(RED)✗ Backend KO$(NC)"
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "$(GREEN)✓ Frontend OK$(NC)" || echo "$(RED)✗ Frontend KO$(NC)"

# Tests
test: ## Lancer tous les tests
	@echo "$(BLUE)Lancement des tests...$(NC)"
	yarn test
	@echo "$(GREEN)Tests terminés!$(NC)"

test-backend: ## Lancer les tests du backend
	@echo "$(BLUE)Lancement des tests backend...$(NC)"
	cd apps/backend && yarn test
	@echo "$(GREEN)Tests backend terminés!$(NC)"

test-web: ## Lancer les tests du frontend
	@echo "$(BLUE)Lancement des tests frontend...$(NC)"
	cd apps/web && yarn test
	@echo "$(GREEN)Tests frontend terminés!$(NC)"

# Base de données
backup: ## Sauvegarder la base de données
	@echo "$(BLUE)Sauvegarde de la base de données...$(NC)"
	@mkdir -p backups
	@docker-compose -f $(COMPOSE_FILE) exec -T mongodb mongodump --archive --gzip > backups/mongodb_backup_$(shell date +%Y%m%d_%H%M%S).gz
	@echo "$(GREEN)Sauvegarde créée!$(NC)"

restore: ## Restaurer la base de données (BACKUP_FILE=backup.gz)
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "$(RED)Erreur: Spécifiez BACKUP_FILE=backup.gz$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Restauration de la base de données...$(NC)"
	@docker-compose -f $(COMPOSE_FILE) exec -T mongodb mongorestore --archive --gzip < $(BACKUP_FILE)
	@echo "$(GREEN)Restauration terminée!$(NC)"

test-mongodb-atlas: ## Tester la connexion MongoDB Atlas
	@echo "$(BLUE)Test de connexion MongoDB Atlas...$(NC)"
	@node scripts/test-mongodb-atlas.js
	@echo "$(GREEN)Test MongoDB Atlas terminé!$(NC)"

# Nettoyage
clean: ## Nettoyer les ressources Docker
	@echo "$(BLUE)Nettoyage des ressources Docker...$(NC)"
	docker system prune -f
	docker volume prune -f
	docker image prune -f
	@echo "$(GREEN)Nettoyage terminé!$(NC)"

clean-all: ## Nettoyer complètement (ATTENTION: supprime tout)
	@echo "$(RED)ATTENTION: Cette commande va supprimer toutes les données!$(NC)"
	@read -p "Êtes-vous sûr? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	docker-compose -f $(COMPOSE_FILE) down -v
	docker system prune -af
	docker volume prune -f
	@echo "$(GREEN)Nettoyage complet terminé!$(NC)"

# Déploiement
deploy: ## Déployer avec le script automatisé
	@echo "$(BLUE)Déploiement automatisé...$(NC)"
	@chmod +x scripts/deploy.sh
	./scripts/deploy.sh $(ENVIRONMENT)
	@echo "$(GREEN)Déploiement terminé!$(NC)"

deploy-prod: ## Déployer en production
	@echo "$(BLUE)Déploiement en production...$(NC)"
	@chmod +x scripts/deploy.sh
	./scripts/deploy.sh production
	@echo "$(GREEN)Déploiement production terminé!$(NC)"

deploy-staging: ## Déployer en staging
	@echo "$(BLUE)Déploiement en staging...$(NC)"
	@chmod +x scripts/deploy.sh
	./scripts/deploy.sh staging
	@echo "$(GREEN)Déploiement staging terminé!$(NC)"

# SSL
ssl-generate: ## Générer des certificats SSL auto-signés
	@echo "$(BLUE)Génération des certificats SSL...$(NC)"
	@mkdir -p nginx/ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout nginx/ssl/key.pem \
		-out nginx/ssl/cert.pem \
		-subj "/C=FR/ST=France/L=Paris/O=Nourane/CN=localhost"
	@echo "$(GREEN)Certificats SSL générés!$(NC)"

# Utilitaires
shell-backend: ## Ouvrir un shell dans le container backend
	docker-compose -f $(COMPOSE_FILE) exec backend sh

shell-mongodb: ## Ouvrir un shell dans le container MongoDB
	docker-compose -f $(COMPOSE_FILE) exec mongodb mongosh

shell-web: ## Ouvrir un shell dans le container frontend
	docker-compose -f $(COMPOSE_FILE) exec web sh

# CI/CD
ci-test: ## Tests pour CI/CD
	@echo "$(BLUE)Lancement des tests CI/CD...$(NC)"
	yarn install --frozen-lockfile
	yarn lint
	yarn type-check
	yarn test
	@echo "$(GREEN)Tests CI/CD terminés!$(NC)"

ci-build: ## Build pour CI/CD
	@echo "$(BLUE)Build CI/CD...$(NC)"
	docker-compose -f $(COMPOSE_FILE) build
	@echo "$(GREEN)Build CI/CD terminé!$(NC)"

# Informations
info: ## Afficher les informations du projet
	@echo "$(BLUE)=== Informations Nourane ===$(NC)"
	@echo "$(YELLOW)Version:$(NC) $(shell git describe --tags --always --dirty)"
	@echo "$(YELLOW)Branch:$(NC) $(shell git branch --show-current)"
	@echo "$(YELLOW)Commit:$(NC) $(shell git rev-parse --short HEAD)"
	@echo "$(YELLOW)Docker:$(NC) $(shell docker --version)"
	@echo "$(YELLOW)Compose:$(NC) $(shell docker-compose --version)"
	@echo "$(YELLOW)Node:$(NC) $(shell node --version)"
	@echo "$(YELLOW)Yarn:$(NC) $(shell yarn --version)"

# Par défaut
.DEFAULT_GOAL := help 
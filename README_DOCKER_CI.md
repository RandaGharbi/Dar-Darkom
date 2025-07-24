# 🐳 Docker & CI/CD - Guide de déploiement Guerlain

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Configuration Docker](#configuration-docker)
- [Déploiement local](#déploiement-local)
- [CI/CD avec GitHub Actions](#cicd-avec-github-actions)
- [Déploiement en production](#déploiement-en-production)
- [Monitoring et maintenance](#monitoring-et-maintenance)

## 🔧 Prérequis

### Logiciels requis
- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Git** (version 2.30+)
- **Node.js** (version 18+) - pour le développement local

### Vérification de l'installation
```bash
# Vérifier Docker
docker --version
docker-compose --version

# Vérifier Git
git --version

# Vérifier Node.js (optionnel)
node --version
```

## 🐳 Configuration Docker

### Structure des fichiers Docker

```
Guerlain/
├── Dockerfile                    # Dockerfile principal (monorepo)
├── docker-compose.yml           # Orchestration des services
├── apps/
│   ├── backend/
│   │   └── Dockerfile          # Dockerfile backend
│   ├── web/
│   │   └── Dockerfile          # Dockerfile frontend
│   └── mobile/
│       └── Dockerfile          # Dockerfile mobile
├── nginx/
│   └── nginx.conf              # Configuration Nginx
└── scripts/
    └── deploy.sh               # Script de déploiement
```

### Services Docker

1. **MongoDB** (Base de données)
   - Port: 27017
   - Volume: `mongodb_data`
   - Authentification: admin/guerlain123

2. **Backend API** (Node.js/Express)
   - Port: 5000
   - Volumes: uploads, exports
   - Dépendances: MongoDB

3. **Frontend Web** (Next.js)
   - Port: 3000
   - Dépendances: Backend

4. **Nginx** (Reverse Proxy)
   - Ports: 80 (HTTP), 443 (HTTPS)
   - SSL/TLS configuré
   - Rate limiting

## 🚀 Déploiement local

### 1. Configuration initiale

```bash
# Cloner le repository
git clone <repository-url>
cd Guerlain

# Copier le fichier d'environnement
cp .env.example .env

# Éditer les variables d'environnement
nano .env
```

### 2. Variables d'environnement requises

```env
# Configuration Email (obligatoire)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-16-characters

# Configuration JWT (changer en production)
JWT_SECRET=your-secret-jwt-key

# Configuration MongoDB (optionnel, valeurs par défaut)
MONGODB_URI=mongodb://admin:guerlain123@mongodb:27017/guerlain?authSource=admin
```

### 3. Démarrage des services

```bash
# Démarrage complet
docker-compose up -d

# Vérification des services
docker-compose ps

# Logs en temps réel
docker-compose logs -f
```

### 4. Accès aux services

- **Frontend Web**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017
- **Nginx (HTTPS)**: https://localhost

### 5. Script de déploiement automatisé

```bash
# Rendre le script exécutable
chmod +x scripts/deploy.sh

# Déploiement en production
./scripts/deploy.sh production

# Déploiement en staging
./scripts/deploy.sh staging
```

## 🔄 CI/CD avec GitHub Actions

### Workflow automatique

Le workflow CI/CD se déclenche sur :
- **Push** sur `main` ou `develop`
- **Pull Request** vers `main` ou `develop`

### Étapes du pipeline

1. **Tests & Linting**
   - Installation des dépendances
   - Linting du code
   - Vérification des types TypeScript
   - Tests unitaires et d'intégration

2. **Build Docker**
   - Construction des images Docker
   - Push vers GitHub Container Registry
   - Cache des layers pour optimisation

3. **Déploiement**
   - **Staging**: Déploiement automatique sur `develop`
   - **Production**: Déploiement manuel sur `main`

### Configuration des secrets GitHub

Dans les paramètres du repository GitHub, ajouter :

```
DOCKER_REGISTRY=ghcr.io
DOCKER_USERNAME=<your-github-username>
DOCKER_PASSWORD=<your-github-token>
```

## 🌐 Déploiement en production

### 1. Préparation du serveur

```bash
# Installation de Docker sur Ubuntu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installation de Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Configuration SSL

```bash
# Créer les certificats SSL
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem
```

### 3. Déploiement

```bash
# Cloner le repository sur le serveur
git clone <repository-url>
cd Guerlain

# Configuration de l'environnement
cp .env.example .env
nano .env

# Déploiement
./scripts/deploy.sh production
```

### 4. Monitoring

```bash
# Vérification des services
docker-compose ps

# Logs des services
docker-compose logs -f

# Métriques système
docker stats

# Sauvegarde de la base de données
docker-compose exec mongodb mongodump --archive --gzip > backup_$(date +%Y%m%d_%H%M%S).gz
```

## 🔧 Maintenance et monitoring

### Commandes utiles

```bash
# Redémarrage des services
docker-compose restart

# Mise à jour des images
docker-compose pull
docker-compose up -d

# Nettoyage des ressources
docker system prune -f
docker volume prune -f

# Sauvegarde automatique
docker-compose exec mongodb mongodump --archive --gzip > backup_$(date +%Y%m%d_%H%M%S).gz

# Restauration
docker-compose exec mongodb mongorestore --archive --gzip < backup_file.gz
```

### Monitoring des performances

```bash
# Utilisation des ressources
docker stats

# Espace disque
df -h

# Logs d'erreurs
docker-compose logs --tail=100 | grep ERROR

# Santé des services
curl -f http://localhost:5000/health
curl -f http://localhost:3000
```

### Troubleshooting

#### Problèmes courants

1. **Ports déjà utilisés**
   ```bash
   # Vérifier les ports utilisés
   netstat -tulpn | grep :5000
   
   # Arrêter les services conflictuels
   sudo systemctl stop <service>
   ```

2. **Problèmes de permissions**
   ```bash
   # Corriger les permissions
   sudo chown -R $USER:$USER .
   chmod +x scripts/deploy.sh
   ```

3. **Problèmes de mémoire**
   ```bash
   # Augmenter la mémoire Docker
   # Éditer /etc/docker/daemon.json
   {
     "default-shm-size": "2G"
   }
   ```

## 📊 Métriques et alertes

### Métriques à surveiller

- **CPU**: < 80%
- **Mémoire**: < 85%
- **Disque**: < 90%
- **Temps de réponse API**: < 2s
- **Taux d'erreur**: < 1%

### Alertes recommandées

- Service down
- Base de données inaccessible
- Espace disque faible
- Taux d'erreur élevé
- Temps de réponse lent

## 🔒 Sécurité

### Bonnes pratiques

1. **Changer les mots de passe par défaut**
2. **Utiliser des secrets pour les variables sensibles**
3. **Mettre à jour régulièrement les images Docker**
4. **Configurer un firewall**
5. **Sauvegarder régulièrement les données**

### Configuration de sécurité

```bash
# Firewall UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Fail2ban pour la protection
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

## 📞 Support

Pour toute question ou problème :

1. **Vérifier les logs**: `docker-compose logs`
2. **Consulter la documentation**: Ce README
3. **Créer une issue**: GitHub Issues
4. **Contacter l'équipe**: [email]

---

**Guerlain** - Système de gestion e-commerce avec CI/CD automatisé 🚀 
# Guerlain - Plateforme E-commerce Guerlain

Une plateforme e-commerce complète pour les produits Guerlain, comprenant une application web, une API backend et une application mobile.

## 🏗️ Architecture

Ce projet utilise une architecture monorepo avec trois applications principales :

- **🌐 Web** (`apps/web`) - Interface d'administration Next.js
- **🔧 Backend** (`apps/backend`) - API REST Node.js/Express
- **📱 Mobile** (`apps/mobile`) - Application mobile React Native/Expo

## 🚀 Installation et démarrage

### Prérequis

- Node.js 18+
- Yarn (recommandé) ou npm
- MongoDB
- Docker (optionnel)

### Installation globale

```bash
# Cloner le repository
git clone <repository-url>
cd Guerlain

# Installer les dépendances
yarn install
```

## 🌐 Application Web (Next.js)

Interface d'administration pour la gestion des produits, commandes et analytics.

### Démarrage

```bash
cd apps/web
yarn dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

### Tests

```bash
# Tests unitaires
yarn test
yarn test:watch

# Tests end-to-end (Cypress)
yarn test:e2e
```

## 🔧 API Backend (Node.js/Express)

API REST pour la gestion des produits, utilisateurs, commandes et authentification.

### Configuration

Créez un fichier `.env` dans `apps/backend/` :

```env
MONGO_URI=mongodb://localhost:27017/guerlain
JWT_SECRET=votre_secret_jwt_super_securise
PORT=5000
NODE_ENV=development
```

### Démarrage

```bash
cd apps/backend

# Mode développement
yarn dev

# Mode production
yarn start
```

L'API sera disponible sur [http://localhost:5000](http://localhost:5000)

### Initialisation de la base de données

```bash
yarn init-db
```

### Tests

```bash
# Tests unitaires
yarn test
yarn test:watch

# Tests end-to-end (Cypress)
yarn test:e2e
```

### Démarrage avec Docker

```bash
cd apps/backend
docker-compose up --build
```

## 📱 Application Mobile (React Native/Expo)

Application mobile pour les clients avec catalogue produits, panier et favoris.

### Démarrage

```bash
cd apps/mobile

# Installer les dépendances
yarn install

# Démarrer l'application
npx expo start
```

### Options de développement

- **Development build** : Pour le développement complet
- **Android emulator** : Simulateur Android
- **iOS simulator** : Simulateur iOS (macOS uniquement)
- **Expo Go** : Application de test limitée

### Tests

```bash
# Tests unitaires
yarn test
yarn test:watch

# Tests end-to-end (Cypress)
yarn test:e2e
```

## 📊 API Endpoints

### Produits

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Récupère tous les produits |
| GET | `/api/products/:id` | Récupère un produit par ID |
| GET | `/api/products/collection/:collection` | Produits par collection |
| GET | `/api/products/type/:typeOfCare` | Produits par type de soin |
| POST | `/api/products` | Ajoute un nouveau produit |
| PUT | `/api/products/:id` | Modifie un produit |
| DELETE | `/api/products/:id` | Supprime un produit |

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription utilisateur |
| POST | `/api/auth/login` | Connexion utilisateur |

### Favoris (authentification requise)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/favorites` | Récupère les favoris |
| POST | `/api/favorites` | Ajoute un favori |
| DELETE | `/api/favorites/:productId` | Supprime un favori |
| POST | `/api/favorites/toggle/:productId` | Bascule l'état favori |

## 🗄️ Structure de la base de données

### Collection Products

```javascript
{
  id: Number,           // ID unique du produit
  title: String,        // Nom du produit
  product_url: String,  // URL du produit
  image_url: String,    // URL de l'image
  price: Number,        // Prix
  customerRating: Number, // Note client
  numberOfReviews: Number, // Nombre d'avis
  productCollection: String, // Collection (ex: "Abeille Royale")
  typeOfCare: String,   // Type de soin (ex: "Serum")
  subtitle: String,     // Sous-titre
  createdAt: Date,      // Date de création
  updatedAt: Date       // Date de modification
}
```

## 🔧 Scripts disponibles

### Scripts globaux (racine)

```bash
yarn dev          # Démarre toutes les applications en mode développement
yarn build        # Build toutes les applications
yarn test         # Lance tous les tests
yarn lint         # Vérification du code
```

### Scripts par application

#### Web
```bash
cd apps/web
yarn dev          # Démarre le serveur de développement
yarn build        # Build pour la production
yarn start        # Démarre en mode production
```

#### Backend
```bash
cd apps/backend
yarn dev          # Démarre avec nodemon
yarn start        # Démarre en mode production
yarn init-db      # Initialise la base de données
```

#### Mobile
```bash
cd apps/mobile
npx expo start    # Démarre l'application Expo
yarn reset-project # Reset le projet (optionnel)
```

## 🐳 Docker

### 🚨 Problème Résolu : Dépendances Manquantes

**Le problème Docker original a été corrigé !** L'image `guerlain-backend-test` ne pouvait pas fonctionner car Express n'était pas installé. Seules les dépendances de développement étaient présentes.

#### Cause Racine
- **Yarn 4** ne gérait pas correctement l'installation des dépendances des workspaces
- Le stage `base` du Dockerfile n'installait que les dépendances de développement
- Le stage `backend-production` copiait des `node_modules` incomplets

#### ✅ Solution Implémentée
- **Dockerfile unifié et corrigé** : Utilise `npm install` directement dans le répertoire backend
- **Vérifications automatiques** : S'assure que toutes les dépendances de production sont installées
- **Scripts automatisés** : Construction et tests des images

### 🚀 Utilisation Docker

#### Construction des Images
```bash
# Construire toutes les images
./scripts/build-images.sh all

# Construire seulement l'image de test
./scripts/build-images.sh test

# Construire seulement l'image de production
./scripts/build-images.sh production
```

#### Test des Images
```bash
# Tester toutes les images
./scripts/test-images.sh all

# Tester seulement l'image de test
./scripts/test-images.sh test

# Tester seulement l'image de production
./scripts/test-images.sh production
```

#### Vérification Manuelle
```bash
# Vérifier qu'Express est installé (test)
docker run --rm guerlain-backend-test sh -c "ls -la /app/node_modules | grep express"

# Vérifier qu'Express est installé (production)
docker run --rm guerlain-backend-production sh -c "ls -la /app/node_modules | grep express"
```

### 📦 Images Disponibles

| Image | Tag | Statut | Usage |
|-------|-----|--------|-------|
| `guerlain-backend-test` | latest | ✅ Fonctionnelle | Tests et développement |
| `guerlain-backend-production` | latest | ✅ Fonctionnelle | Production |

### 🔍 Vérifications Incluses

#### Dépendances Vérifiées
- ✅ **Express** - Framework web
- ✅ **Mongoose** - ODM MongoDB
- ✅ **Multer** - Gestion des uploads
- ✅ **Autres dépendances de production**

#### Tests Automatiques
- ✅ Installation des dépendances
- ✅ Présence du code compilé
- ✅ Démarrage du serveur
- ✅ Réponse sur le port 5000

### 🧹 Nettoyage et Gestion

```bash
# Supprimer les anciennes images
./scripts/build-images.sh cleanup

# Lister les images disponibles
./scripts/build-images.sh list
```

### 📝 Notes Techniques

#### Pourquoi npm au lieu de yarn ?
- **Yarn 4** a des problèmes avec les workspaces dans ce contexte
- **npm** installe correctement toutes les dépendances
- Solution plus stable et prévisible

#### Architecture Unifiée
- **Un seul Dockerfile** contient toutes les corrections
- **Stages multiples** pour différents environnements
- **Scripts automatisés** pour la gestion et les tests

### 🔄 Docker Compose (Legacy)

```bash
cd apps/backend
docker-compose up --build
```

- API : http://localhost:5000
- MongoDB : port 27017

### Arrêt des conteneurs

```bash
# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer les volumes (données)
docker-compose down -v
```

## 🚀 GitHub Actions (CI/CD)

### 🚨 Problème Résolu : Workflow Aligné

**Le workflow GitHub Actions a été corrigé pour être cohérent avec le Dockerfile !** Les erreurs de build global et de stages inexistants ont été éliminées.

#### Problèmes Identifiés et Résolus
- ❌ **web-production** : Stage supprimé du Dockerfile
- ❌ **mobile-production** : Stage supprimé du Dockerfile  
- ❌ **Erreur de build** : `command not found: next` lors du build global
- ❌ **Workflow incohérent** : Tentative de build de stages inexistants

#### ✅ Solutions Implémentées
- **Workflow simplifié** : Focus uniquement sur le backend-production
- **Stages alignés** : Suppression des builds web et mobile inexistants
- **Vérifications adaptées** : Mise à jour pour npm install et npm run build
- **Pipeline cohérent** : Architecture Docker et CI/CD unifiées

### 🔧 Configuration du Workflow

#### Déclencheurs
Le workflow se déclenche automatiquement sur :
- **Push** vers `main` ou `develop`
- **Pull Request** vers `main` ou `develop`

#### Étapes du Pipeline
1. **Tests & Linting** - Validation du code
2. **Build Docker** - Construction de l'image backend uniquement
3. **Push Registry** - Publication vers GitHub Container Registry
4. **Déploiement** - Staging (develop) ou Production (main)

### 🐳 Build Docker dans GitHub Actions

#### Configuration Corrigée
```yaml
- name: Build and push Backend image
  uses: docker/build-push-action@v5
  with:
    context: .
    file: ./Dockerfile
    target: backend-production  # ✅ Stage existant et fonctionnel
    push: true
    tags: ghcr.io/randagharbi/guerlain/backend:${{ github.sha }}
    no-cache: true
    platforms: linux/amd64
```

#### Vérifications Automatiques
```yaml
- name: Verify Dockerfile
  run: |
    echo "=== Dockerfile content ==="
    cat Dockerfile
    echo "=== Checking for npm install command ==="
    grep -n "npm install" Dockerfile
    echo "=== Checking for backend build command ==="
    grep -n "npm run build" Dockerfile
```

### 📦 Images GitHub Container Registry

#### URL de l'Image
```
ghcr.io/randagharbi/guerlain/backend:${{ github.sha }}
```

#### Permissions Requises
- **Settings > Actions > General** : "Read and write permissions"
- **Settings > Actions > General** : "Allow GitHub Actions to create and approve pull requests"
- **Container Registry** : Activé et accessible

### 🔍 Vérification du Workflow

#### Comment Vérifier
1. **Push** vers la branche `main`
2. **Vérifier** l'onglet Actions sur GitHub
3. **Confirmer** que le build backend réussit
4. **Vérifier** qu'aucune erreur de stage inexistant
5. **Confirmer** que l'image est poussée vers le registry

#### Logs de Succès Attendu
```
✅ Build Docker réussi
✅ Image poussée vers ghcr.io/randagharbi/guerlain/backend
✅ Plus d'erreur de dépendances manquantes
✅ Workflow cohérent avec l'architecture Docker
```

### 🚀 Avantages de la Solution

- **Architecture unifiée** : Docker et CI/CD cohérents
- **Build simplifié** : Focus sur le backend uniquement
- **Erreurs éliminées** : Plus de stages inexistants
- **Pipeline robuste** : Tests, build et déploiement automatisés
- **Registry accessible** : Images disponibles pour le déploiement

## 🧪 Tests

### Tests unitaires
```bash
# Par application
cd apps/[web|backend|mobile]
yarn test
yarn test:watch

# Global
yarn test
```

### Tests end-to-end (Cypress)
```bash
# Par application
cd apps/[web|backend|mobile]
yarn test:e2e

# Global
yarn test:e2e
```

## 📝 Notes importantes

1. **CORS** : Configuré pour accepter toutes les origines en développement
2. **JWT** : Authentification par tokens JWT
3. **MongoDB** : Base de données principale
4. **Variables d'environnement** : Utilisez les fichiers `.env` pour les configurations sensibles
5. **Docker** : Images corrigées et fonctionnelles avec scripts automatisés

## 🐛 Dépannage

### Erreur de connexion MongoDB
- Vérifiez que MongoDB est en cours d'exécution
- Vérifiez l'URL de connexion dans le fichier `.env`

### Erreur CORS
- En production, configurez les origines autorisées

### Erreur JWT
- Vérifiez que `JWT_SECRET` est défini dans le fichier `.env`

### Problèmes Expo
- Utilisez `npx expo doctor` pour diagnostiquer les problèmes
- Vérifiez que les dépendances sont à jour

### Problèmes Docker
- **Express non installé** : Utilisez les images corrigées `guerlain-backend-test` ou `guerlain-backend-production`
- **Dépendances manquantes** : Reconstruisez les images avec `./scripts/build-images.sh all`
- **Tests d'images** : Vérifiez le bon fonctionnement avec `./scripts/test-images.sh all`

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📧 Configuration Email

### Configuration Gmail pour les Exports Planifiés

Pour que les exports planifiés puissent envoyer des emails automatiquement, vous devez configurer un compte Gmail avec un mot de passe d'application.

#### 1. Activer l'authentification à 2 facteurs
1. Allez sur votre compte Google
2. Sécurité > Authentification à 2 facteurs
3. Activez l'authentification à 2 facteurs

#### 2. Créer un mot de passe d'application
1. Sécurité > Mots de passe d'application
2. Sélectionnez "Application" > "Autre (nom personnalisé)"
3. Nommez-le "Guerlain Exports"
4. Copiez le mot de passe généré (16 caractères)

#### 3. Configuration dans le fichier .env
Ajoutez ces variables à votre fichier `.env` dans `apps/backend/` :

```env
# Configuration email
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-app-16-caracteres
```

#### 4. Test de la configuration
```bash
cd apps/backend
npm run test-email
```

### Autres fournisseurs d'email

Vous pouvez utiliser d'autres fournisseurs en modifiant le service email dans `src/services/emailService.ts` :

#### Outlook/Hotmail
```typescript
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

#### Yahoo
```typescript
const transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## 📤 Exports Planifiés avec Email

### Fonctionnalités
- **Service d'email complet** avec nodemailer
- **Emails HTML stylisés** avec le design Guerlain
- **Pièces jointes** automatiques (CSV/Excel)
- **Planification automatique** : quotidien, hebdomadaire, mensuel
- **Notifications d'erreur** en cas de problème

### Utilisation
1. Aller dans Analytics > Export Functionality
2. Cliquer sur "Planifier"
3. Remplir le formulaire :
   - **Nom** : Nom descriptif
   - **Type** : Ventes, Produits, Clients, ou Export complet
   - **Format** : CSV ou Excel
   - **Fréquence** : Quotidien, Hebdomadaire, Mensuel
   - **Heure** : Heure d'exécution (HH:MM)
   - **Emails** : Adresses des destinataires

### Format des Emails
- **Email de Succès** : `[Guerlain] Export planifié: [Nom]` avec pièce jointe
- **Email d'Erreur** : `[Guerlain] Erreur - Export planifié: [Nom]` avec détails

## 🎯 Collection Soldes France

### Vue d'ensemble
Fonctionnalité dédiée aux **jours des soldes officielles en France** avec des réductions réglementées.

### Dates des soldes 2025
- **Soldes d'Hiver** : 8 janvier - 4 février 2025 (4 semaines)
- **Soldes d'Été** : 25 juin - 5 août 2025 (6 semaines)

### Installation
```bash
cd apps/backend
npm run import-soldes
```

### Codes de réduction créés
- `SOLDESHIVER2025` : Soldes d'Hiver 2025 -30%
- `SOLDESETE2025` : Soldes d'Été 2025 -25%
- `SOLDESFLASH2025` : Soldes Flash -20%
- `SOLDESVIP2025` : Soldes VIP -35%
- `SOLDESLIVRAISON` : Livraison Gratuite Soldes

### API Endpoints
```bash
# Récupérer tous les discounts
GET /api/discounts

# Récupérer les discounts par collection
GET /api/discounts/collection/soldes_france

# Récupérer un discount par code
GET /api/discounts/code/SOLDESHIVER2025

# Utiliser un code de réduction
POST /api/discounts/use/SOLDESHIVER2025
```

## 📱 Configuration Mobile

### Configuration API
Mettez à jour l'URL de l'API dans `apps/mobile/config/env.ts` :

```typescript
DEV: {
  API_BASE_URL: 'http://YOUR_IP_ADDRESS:5000', // Remplacez par votre IP backend
  DEBUG: true,
},
PROD: {
  API_BASE_URL: 'https://your-production-api.com',
  DEBUG: false,
},
```

### URLs courantes
- **Local Development** : `http://localhost:5000`
- **Network Development** : `http://192.168.1.XXX:5000`
- **Production** : `https://your-domain.com`

## 🔄 React Query (Mobile)

### Configuration
Le projet mobile utilise **React Query (TanStack Query)** pour la gestion des données.

### Hooks disponibles
```typescript
// Récupérer tous les produits
const { data: products } = useProducts();

// Récupérer les produits par type
const { data: ingredients } = useProductsByType('ingredient');

// Récupérer un produit spécifique
const { data: product } = useProduct('123');

// Recherche de produits
const { data: results } = useProductSearch('vitamine c');
```

### Gestion du cache
- **staleTime** : 5 minutes (données considérées fraîches)
- **gcTime** : 10 minutes (données gardées en cache)
- **Retry automatique** : 2 tentatives en cas d'échec

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

# 🗄️ Configuration MongoDB Atlas pour Guerlain

## 📋 Étapes de configuration

### **1. Créer un compte MongoDB Atlas**

1. Allez sur [mongodb.com/atlas](https://mongodb.com/atlas)
2. Cliquez sur **"Try Free"**
3. Créez un compte ou connectez-vous avec GitHub/Google

### **2. Créer un cluster gratuit**

1. **Choisir le plan** :
   - Sélectionnez **"FREE"** (M0 Sandbox)
   - Cliquez sur **"Create"**

2. **Configurer le cluster** :
   - **Provider** : AWS, Google Cloud, ou Azure
   - **Region** : Europe (pour de meilleures performances)
   - **Cluster Name** : `guerlain-cluster`
   - Cliquez sur **"Create Cluster"**

### **3. Configurer la sécurité**

#### **Créer un utilisateur de base de données** :
1. Dans le menu de gauche, cliquez sur **"Database Access"**
2. Cliquez sur **"Add New Database User"**
3. **Username** : `guerlain_admin`
4. **Password** : `Guerlain2024!` (ou un mot de passe sécurisé)
5. **Database User Privileges** : `Atlas admin`
6. Cliquez sur **"Add User"**

#### **Configurer l'accès réseau** :
1. Dans le menu de gauche, cliquez sur **"Network Access"**
2. Cliquez sur **"Add IP Address"**
3. Choisissez **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Cliquez sur **"Confirm"**

### **4. Obtenir l'URI de connexion**

1. Retournez à **"Database"**
2. Cliquez sur **"Connect"**
3. Choisissez **"Connect your application"**
4. **Driver** : Node.js
5. **Version** : 5.0 or later
6. **Copiez l'URI de connexion**

### **5. Configuration dans votre projet**

#### **Créer le fichier .env** :
```bash
# Dans apps/backend/
cp .env.example .env
```

#### **Éditer le fichier .env** :
```env
# Configuration MongoDB Atlas
MONGODB_URI=mongodb+srv://guerlain_admin:Guerlain2024!@cluster0.xxxxx.mongodb.net/guerlain?retryWrites=true&w=majority

# Configuration JWT
JWT_SECRET=guerlain-jwt-secret-2024-change-in-production

# Configuration Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-16-characters

# Configuration du serveur
PORT=5000
NODE_ENV=production

# Configuration CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Configuration des logs
LOG_LEVEL=info

# Configuration de sécurité
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Configuration des uploads
UPLOAD_MAX_FILE_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif

# Configuration des exports
EXPORT_MAX_FILE_SIZE=10485760
EXPORT_RETENTION_DAYS=30
```

### **6. Tester la connexion**

#### **Test local** :
```bash
cd apps/backend
npm run dev
```

#### **Vérifier les logs** :
Vous devriez voir :
```
✅ Connexion à MongoDB Atlas réussie
🚀 Server running on port 5000
```

### **7. Variables d'environnement pour le déploiement**

Pour les plateformes de déploiement, vous devrez configurer ces variables :

#### **Railway** :
- `MONGODB_URI` : Votre URI MongoDB Atlas
- `JWT_SECRET` : Votre secret JWT
- `EMAIL_USER` : Votre email Gmail
- `EMAIL_PASSWORD` : Votre mot de passe d'application Gmail

#### **Render** :
- `MONGODB_URI` : Votre URI MongoDB Atlas
- `JWT_SECRET` : Votre secret JWT
- `EMAIL_USER` : Votre email Gmail
- `EMAIL_PASSWORD` : Votre mot de passe d'application Gmail

### **8. Sécurité recommandée**

#### **Changer le mot de passe par défaut** :
1. Allez dans **"Database Access"**
2. Cliquez sur l'utilisateur `guerlain_admin`
3. Cliquez sur **"Edit"**
4. Changez le mot de passe
5. Mettez à jour votre fichier `.env`

#### **Restreindre l'accès réseau** (optionnel) :
1. Allez dans **"Network Access"**
2. Remplacez `0.0.0.0/0` par l'IP de votre serveur de déploiement

### **9. Monitoring et sauvegarde**

#### **Monitoring** :
- MongoDB Atlas fournit des métriques gratuites
- Surveillez l'utilisation de stockage (512MB gratuit)
- Surveillez les connexions (500 connexions simultanées max)

#### **Sauvegarde** :
- Les sauvegardes automatiques sont incluses dans le plan gratuit
- Vous pouvez aussi faire des sauvegardes manuelles

### **10. Limites du plan gratuit**

- **Stockage** : 512MB
- **RAM** : 512MB
- **Connexions simultanées** : 500
- **Opérations par seconde** : 500
- **Sauvegardes** : 7 jours

### **11. Migration depuis MongoDB local**

Si vous avez déjà des données en local :

```bash
# Exporter les données locales
mongodump --uri="mongodb://localhost:27017/guerlain" --out=./backup

# Importer vers MongoDB Atlas
mongorestore --uri="mongodb+srv://guerlain_admin:password@cluster0.xxxxx.mongodb.net/guerlain" ./backup/guerlain/
```

---

## ✅ Vérification

Une fois configuré, testez avec :

```bash
# Test de connexion
curl http://localhost:5000/health

# Test de l'API
curl http://localhost:5000/api/products
```

**MongoDB Atlas est maintenant configuré et prêt pour le déploiement !** 🚀 
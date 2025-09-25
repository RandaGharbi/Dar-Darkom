# Guide de résolution des problèmes - Dar Darkom Driver

## 🚨 Problèmes courants et solutions

### 1. Erreur InternalBytecode.js

**Symptôme :**
```
Error: ENOENT: no such file or directory, open '/Users/admin/dev/Dar-Darkom/apps/mobile-driver/InternalBytecode.js'
```

**Solution :**
```bash
# Nettoyer le cache Metro
cd apps/mobile-driver
rm -rf .expo
rm -rf node_modules/.cache
rm -rf .metro-cache

# Redémarrer avec cache vidé
npx expo start --clear
```

### 2. Erreur 404 - Endpoint non trouvé

**Symptôme :**
```
⚠️ Endpoint non trouvé: /api/auth/apple/driver
ERROR  Erreur backend Apple Auth Driver: [AxiosError: Request failed with status code 404]
```

**Solution :**
```bash
# 1. Démarrer le backend
cd apps/backend
npm run dev

# 2. Vérifier que le serveur répond
curl http://localhost:5000/api/health

# 3. Tester l'endpoint Apple Driver
curl -X POST http://localhost:5000/api/auth/apple/driver \
  -H "Content-Type: application/json" \
  -d '{"identityToken":"test","user":"test"}'
```

### 3. Erreur httpClient undefined

**Symptôme :**
```
ERROR  Erreur backend Apple Auth Driver: [TypeError: Cannot read property 'post' of undefined]
```

**Solution :**
Vérifier que `httpClient` est correctement exporté dans `services/httpClient.ts` :
```typescript
export const httpClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  // ...
});
```

### 4. Erreur TypeScript - Propriété manquante

**Symptôme :**
```
error TS2339: Property 'isOnline' does not exist on type 'User'
```

**Solution :**
Ajouter la propriété manquante dans le modèle User :
```typescript
// apps/backend/src/models/User.ts
export interface IUser extends Document {
  // ... autres propriétés
  isOnline?: boolean;
  role: 'user' | 'admin' | 'driver';
}
```

## 🔧 Scripts de diagnostic

### Test complet du backend
```bash
cd apps/backend
./start-and-test.sh
```

### Test de l'application mobile
```bash
cd apps/mobile-driver
./start-app.sh
```

### Vérification de la configuration Apple
```bash
cd apps/mobile-driver
node scripts/test-apple-auth.js
```

## 📋 Checklist de résolution

### Backend
- [ ] Serveur démarré sur le port 5000
- [ ] Base de données MongoDB connectée
- [ ] Routes Apple configurées
- [ ] Modèle User mis à jour avec `isOnline` et `driver` role
- [ ] Variables d'environnement configurées

### Mobile
- [ ] Cache Metro nettoyé
- [ ] Dépendances installées
- [ ] Configuration app.json correcte
- [ ] Service Apple Auth configuré
- [ ] Hook useDriverAuth implémenté

### Apple Sign-In
- [ ] Compte Apple Developer configuré
- [ ] App ID avec Apple Sign-In activé
- [ ] Entitlements configurés
- [ ] Bundle ID correct

## 🚀 Démarrage rapide

### 1. Démarrer le backend
```bash
cd apps/backend
npm run dev
```

### 2. Démarrer l'application mobile
```bash
cd apps/mobile-driver
npx expo start --clear
```

### 3. Tester la connexion Apple
1. Ouvrir l'application sur simulateur iOS
2. Appuyer sur "Continuer avec Apple"
3. Utiliser les identifiants de test Apple
4. Vérifier la création du driver dans la base de données

## 📞 Support

### Logs utiles
```bash
# Logs backend
tail -f apps/backend/logs/app.log

# Logs mobile
npx react-native log-ios
```

### Endpoints de test
- Health check: `GET http://localhost:5000/api/health`
- Apple Driver: `POST http://localhost:5000/api/auth/apple/driver`
- Apple User: `POST http://localhost:5000/api/auth/apple`

### Variables d'environnement requises
```env
# Backend
MONGODB_URI=mongodb://localhost:27017/dar-darkom
JWT_SECRET=your-secret-key
APPLE_CLIENT_ID=com.dardarkom.driver
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY=your-private-key
```





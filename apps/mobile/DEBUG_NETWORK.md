# 🔧 Guide de Diagnostic Réseau - Dar Darkom Mobile

## Problème Actuel
- **Erreur** : Timeout de 30 secondes sur `/api/me`
- **Cause** : Problème de connectivité entre l'app mobile et le serveur backend
- **Impact** : L'application ne peut pas charger les données utilisateur

## Solutions à Tester

### 1. Vérifier la Connectivité Réseau

#### Sur Simulateur iOS :
```bash
# Vérifier que le serveur backend est accessible
curl -v http://192.168.1.74:5000/api/me

# Tester la connectivité depuis le simulateur
# Ouvrir Safari dans le simulateur et aller à :
# http://192.168.1.74:5000/api/me
```

#### Sur Appareil Physique :
```bash
# Vérifier l'IP de votre machine de développement
ifconfig | grep "inet " | grep -v 127.0.0.1

# Tester depuis l'appareil mobile
# Ouvrir Safari et aller à : http://[VOTRE_IP]:5000/api/me
```

### 2. Vérifier le Serveur Backend

#### Démarrer le serveur backend :
```bash
cd apps/backend
npm run dev
# ou
yarn dev
```

#### Vérifier que le serveur écoute sur le bon port :
```bash
# Vérifier les ports ouverts
lsof -i :5000
# ou
netstat -an | grep 5000
```

### 3. Configuration IP

#### Mettre à jour l'IP dans la configuration :
1. Ouvrir `apps/mobile/config/api-config.ts`
2. Modifier `FORCE_API_URL` avec votre IP actuelle :
```typescript
export const FORCE_API_URL = 'http://[VOTRE_IP_ACTUELLE]:5000';
```

#### Trouver votre IP :
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr "IPv4"
```

### 4. Solutions de Fallback

#### Utiliser l'URL de fallback automatique :
L'application essaie automatiquement plusieurs IPs. Vérifiez les logs pour voir quelles IPs sont testées.

#### Configuration manuelle :
Si l'auto-détection ne fonctionne pas, forcez une IP spécifique dans `env.ts` :
```typescript
const forcedApiUrl = 'http://192.168.1.XXX:5000'; // Remplacez XXX par votre IP
```

### 5. Tests de Connectivité

#### Test simple de connectivité :
```bash
# Depuis votre machine de développement
curl -X GET http://192.168.1.74:5000/api/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test avec timeout personnalisé :
```bash
curl --max-time 30 http://192.168.1.74:5000/api/me
```

### 6. Debugging Avancé

#### Activer les logs détaillés :
Dans `httpClient.ts`, les logs sont maintenant plus informatifs. Surveillez la console pour :
- 🔧 Messages de configuration IP
- 📱 Détection de plateforme
- 🔄 Tentatives de retry
- ⏰ Erreurs de timeout détaillées

#### Vérifier les variables d'environnement :
```bash
# Dans le terminal de l'app mobile
echo $EXPO_PUBLIC_API_URL
```

### 7. Solutions Rapides

#### Redémarrer l'application :
1. Fermer complètement l'app mobile
2. Redémarrer le serveur backend
3. Relancer l'app mobile

#### Vider le cache :
```bash
# Vider le cache Expo
npx expo start --clear

# Ou redémarrer avec cache vidé
expo start -c
```

### 8. Configuration Réseau

#### Vérifier le pare-feu :
- Assurez-vous que le port 5000 n'est pas bloqué
- Vérifiez les paramètres de pare-feu macOS/Windows

#### Vérifier le réseau :
- L'appareil mobile et l'ordinateur doivent être sur le même réseau WiFi
- Éviter les réseaux d'entreprise qui peuvent bloquer les connexions inter-appareils

## Messages d'Erreur Améliorés

L'application affiche maintenant des messages d'erreur plus informatifs :
- ⏰ **Timeout** : Détails de la requête + suggestions
- 🌐 **Réseau** : Problèmes de connectivité + solutions
- 🔄 **Retry** : Tentatives automatiques avec délais progressifs

## Support

Si le problème persiste :
1. Vérifiez les logs de la console
2. Testez la connectivité manuellement
3. Vérifiez la configuration IP
4. Redémarrez les services






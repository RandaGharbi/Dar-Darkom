# Configuration API pour différents environnements

## Problème
L'URL `http://10.0.2.2:5000` ne fonctionne que sur l'émulateur Android standard et pose des problèmes sur :
- Nox Player
- Appareils physiques Android
- Autres émulateurs

## Solutions

### 1. Configuration automatique (recommandée)
L'application détecte automatiquement l'environnement et utilise l'URL appropriée :
- **Émulateur Android standard** : `http://10.0.2.2:5000`
- **Appareils physiques/autres émulateurs** : `http://192.168.1.100:5000` (à configurer)

### 2. Configuration manuelle avec variable d'environnement
Vous pouvez forcer une URL spécifique en créant un fichier `.env` dans le dossier `apps/mobile/` :

```bash
# Pour Nox Player (remplacez par l'IP de votre PC)
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000

# Pour appareil physique Android
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000

# Pour émulateur Android standard
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000
```

### 3. Comment trouver l'IP de votre PC

#### Sur Windows :
```cmd
ipconfig
```
Cherchez l'adresse IPv4 de votre carte réseau WiFi ou Ethernet.

#### Sur macOS :
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

#### Sur Linux :
```bash
ip addr show
```

### 4. Configuration pour votre équipe

#### Pour votre collègue qui utilise Nox :
1. Trouvez l'IP de son PC Windows
2. Créez un fichier `.env` dans `apps/mobile/` avec :
   ```
   EXPO_PUBLIC_API_URL=http://[IP_DE_SON_PC]:5000
   ```
3. Redémarrez l'application

#### Pour les appareils physiques :
1. Assurez-vous que le PC et l'appareil sont sur le même réseau WiFi
2. Utilisez l'IP du PC dans la configuration
3. Vérifiez que le pare-feu autorise les connexions sur le port 5000

### 5. Test de connexion
Pour vérifier que la configuration fonctionne :
1. Ouvrez un navigateur sur l'appareil/émulateur
2. Essayez d'accéder à `http://[IP]:5000/api/health` (si disponible)
3. Vérifiez les logs dans la console de l'application

### 6. Dépannage
- **Erreur de connexion** : Vérifiez l'IP et que le serveur backend tourne
- **Timeout** : Vérifiez le pare-feu et le réseau
- **CORS** : Assurez-vous que le backend autorise les requêtes depuis l'IP de l'appareil

## Exemple de configuration pour équipe

```bash
# .env pour développeur 1 (émulateur Android)
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000

# .env pour développeur 2 (Nox Player)
EXPO_PUBLIC_API_URL=http://192.168.1.50:5000

# .env pour développeur 3 (appareil physique)
EXPO_PUBLIC_API_URL=http://192.168.1.75:5000
``` 
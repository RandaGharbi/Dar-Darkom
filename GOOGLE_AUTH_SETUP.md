# 🔐 Configuration Google Authentication (GRATUIT)

## 📋 Prérequis
- Compte Google (gratuit)
- Accès à Google Cloud Console (gratuit)

## 🚀 Étapes pour obtenir un Client ID Google

### 1. Aller sur Google Cloud Console
- Visitez : https://console.cloud.google.com/
- Connectez-vous avec votre compte Google

### 2. Créer un nouveau projet (ou utiliser un existant)
- Cliquez sur "Sélectionner un projet" en haut
- Cliquez sur "NOUVEAU PROJET"
- Nom : "Dar-Darkom App" (ou votre choix)
- Cliquez "CRÉER"

### 3. Activer l'API Google+ (gratuite)
- Dans le menu, allez à "APIs & Services" > "Library"
- Recherchez "Google+ API"
- Cliquez dessus et "ENABLE"

### 4. Configurer l'écran de consentement OAuth
- Allez à "APIs & Services" > "OAuth consent screen"
- Choisissez "External" (pour les utilisateurs externes)
- Remplissez les informations obligatoires :
  - Nom de l'application : "Dar-Darkom"
  - Email de support : votre email
  - Email de contact développeur : votre email
- Cliquez "SAVE AND CONTINUE"

### 5. Créer les identifiants OAuth 2.0
- Allez à "APIs & Services" > "Credentials"
- Cliquez "CREATE CREDENTIALS" > "OAuth 2.0 Client IDs"

#### Pour Android :
- Type d'application : "Android"
- Nom : "Dar-Darkom Android"
- Nom du package : `com.yourcompany.dardarkom` (voir dans app.json)
- Empreinte SHA-1 : (voir section ci-dessous)

#### Pour iOS :
- Type d'application : "iOS"
- Nom : "Dar-Darkom iOS"
- ID du bundle : `com.yourcompany.dardarkom` (voir dans app.json)

#### Pour Web (Backend) :
- Type d'application : "Web application"
- Nom : "Dar-Darkom Backend"
- URI de redirection autorisés : `http://localhost:5000` (pour le dev)

### 6. Obtenir l'empreinte SHA-1 pour Android

#### Sur macOS/Linux :
```bash
cd apps/mobile/android
./gradlew signingReport
```

#### Sur Windows :
```bash
cd apps/mobile/android
gradlew signingReport
```

Cherchez la ligne "SHA1:" dans la sortie et copiez la valeur.

### 7. Récupérer les Client IDs
Après création, vous obtiendrez :
- **Android Client ID** : `123456789-abcdef.apps.googleusercontent.com`
- **iOS Client ID** : `123456789-xyz.apps.googleusercontent.com`
- **Web Client ID** : `123456789-web.apps.googleusercontent.com`

## 🔧 Configuration dans le code

### 1. Mobile (AuthContext.tsx)
```typescript
const [, , promptAsync] = Google.useAuthRequest({
  clientId: 'VOTRE_WEB_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'VOTRE_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: 'VOTRE_ANDROID_CLIENT_ID.apps.googleusercontent.com',
});
```

### 2. Backend (authController.ts)
```typescript
const ticket = await client.verifyIdToken({
  idToken: token,
  audience: 'VOTRE_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

## 💰 Coûts
- **Google Cloud Console** : Gratuit (jusqu'à 100 utilisateurs/jour)
- **Google+ API** : Gratuite
- **OAuth 2.0** : Gratuit

## ⚠️ Limites gratuites
- 100 utilisateurs par jour
- 10,000 requêtes API par jour
- Suffisant pour le développement et les petits projets

## 🎯 Prochaines étapes
1. Suivez ce guide pour obtenir vos Client IDs
2. Remplacez les placeholders dans le code
3. Testez la connexion Google

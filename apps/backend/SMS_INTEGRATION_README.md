# 📱 Intégration SMS - Dar-Darkom

Ce document explique l'intégration du service SMS dans l'application Dar-Darkom, utilisant [TextBelt](https://textbelt.com/) comme fournisseur principal.

## 🚀 Fonctionnalités

### ✅ **Notifications automatiques :**
- **SMS de bienvenue** pour les nouveaux employés
- **Confirmation de commande** lors de la création
- **Acceptation de commande** par l'admin
- **Notifications de livraison** (en cours, livré)
- **Messages personnalisés** selon le statut

### 🔧 **Fournisseurs supportés :**
1. **Mode Simulation** (développement)
2. **TextBelt** (gratuit, 1 SMS/jour par IP)
3. **MessageBird** (essai gratuit puis payant)
4. **Vonage/Nexmo** (essai gratuit puis payant)

## ⚙️ Configuration

### 1. Variables d'environnement

```bash
# === OPTION 1: Mode simulation (recommandé pour développement) ===
SMS_SIMULATE=true
SMS_FREE_MODE=false

# === OPTION 2: TextBelt (gratuit mais limité) ===
SMS_SIMULATE=false
SMS_FREE_MODE=true
TEXTBELT_API_KEY=textbelt  # Clé gratuite ou personnalisée

# === OPTION 3: MessageBird ===
SMS_SIMULATE=false
SMS_FREE_MODE=false
SMS_PROVIDER=messagebird
MESSAGEBIRD_API_KEY=your_api_key

# === OPTION 4: Vonage ===
SMS_SIMULATE=false
SMS_FREE_MODE=false
SMS_PROVIDER=vonage
VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret

# Configuration avancée
SUPPORT_PHONE=+33123456789
```

### 2. Configuration TextBelt

#### Mode gratuit (développement) :
- Utilise la clé `textbelt` (gratuite)
- Limité à 1 SMS par jour par IP
- Parfait pour les tests

#### Mode production :
1. Créez un compte sur [TextBelt](https://textbelt.com/)
2. Générez une clé API personnalisée
3. Configurez `TEXTBELT_API_KEY` dans votre `.env`

## 🧪 Test du service

### Script de test automatique :
```bash
cd apps/backend
node test-sms.js
```

### Test manuel avec curl :
```bash
curl -X POST https://textbelt.com/text \
  --data-urlencode phone='+33123456789' \
  --data-urlencode message='Test Dar-Darkom' \
  -d key=textbelt
```

## 📋 Utilisation dans le code

### 1. SMS de bienvenue (employés)
```typescript
import { smsService } from '../services/smsService';

const result = await smsService.sendWelcomeSMS({
  to: '+33123456789',
  userName: 'John Doe',
  companyName: 'Dar-Darkom'
});
```

### 2. Notifications de commande
```typescript
const result = await smsService.sendOrderNotificationSMS({
  to: '+33123456789',
  userName: 'John Doe',
  orderId: '12345678',
  orderTotal: 25.50,
  orderStatus: 'PENDING',
  companyName: 'Dar-Darkom'
});
```

### 3. SMS générique
```typescript
const result = await smsService.sendNotificationSMS(
  '+33123456789',
  'Message personnalisé'
);
```

## 🔄 Gestion des erreurs et retry

### Fonctionnalités automatiques :
- **Retry automatique** (3 tentatives max)
- **Délai progressif** entre les tentatives
- **Détection d'erreurs temporaires**
- **Logs détaillés** pour le debugging

### Types d'erreurs gérées :
- Erreurs de réseau (timeout, connexion)
- Erreurs temporaires du serveur
- Limites de taux (rate limiting)
- Erreurs de validation

## 📊 Monitoring et logs

### Logs automatiques :
```
📱 [SMS LOG] ==================
📞 À: +33123456789
🔧 Provider: textbelt
🔄 Tentative: 1
⏰ Timestamp: 2024-01-15T10:30:00.000Z
💬 Message: Bonjour John, votre commande #12345678...
=====================================
```

### Réponse SMS :
```typescript
interface SMSResponse {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
  provider?: string;
  timestamp?: Date;
  retryCount?: number;
}
```

## 🎯 Points d'intégration

### 1. Création de commande (`orderController.ts`)
- SMS de confirmation automatique
- Validation du numéro de téléphone
- Gestion d'erreurs non-bloquante

### 2. Acceptation de commande (`orderController.ts`)
- SMS de notification d'acceptation
- Information sur le statut "prêt"

### 3. Tracking de livraison (`trackingController.ts`)
- SMS de notification de livraison
- Informations du livreur
- Heure de livraison estimée

### 4. Inscription employé (`employeeController.ts`)
- SMS de bienvenue après confirmation email
- Activation du compte employé

## 🚨 Bonnes pratiques

### 1. Validation des numéros
```typescript
if (smsService.validatePhoneNumber(phoneNumber)) {
  // Envoyer le SMS
}
```

### 2. Formatage des numéros
```typescript
const formattedPhone = smsService.formatPhoneNumber(phoneNumber);
```

### 3. Gestion d'erreurs
```typescript
try {
  const result = await smsService.sendWelcomeSMS(config);
  if (result.success) {
    console.log('SMS envoyé:', result.messageId);
  } else {
    console.error('Erreur SMS:', result.error);
  }
} catch (error) {
  console.error('Erreur inattendue:', error);
}
```

## 📈 Métriques et monitoring

### TextBelt API - Vérification du quota :
```bash
curl https://textbelt.com/quota/your_api_key
```

### Statut de livraison :
```bash
curl https://textbelt.com/status/message_id
```

## 🔧 Dépannage

### Problèmes courants :

1. **"Out of quota"** : Quota TextBelt épuisé
   - Solution : Attendre le lendemain ou créer une clé payante

2. **"Invalid phone number"** : Numéro invalide
   - Solution : Vérifier le format (+33123456789)

3. **"Network timeout"** : Problème de connexion
   - Solution : Le système retry automatiquement

4. **"SMS not sent"** : Erreur inconnue
   - Solution : Vérifier les logs et la configuration

### Debug mode :
```bash
# Activer les logs détaillés
DEBUG=sms* npm start
```

## 🚀 Déploiement en production

### 1. Configuration TextBelt :
- Créer un compte TextBelt
- Générer une clé API
- Configurer les variables d'environnement

### 2. Monitoring :
- Surveiller les quotas
- Configurer des alertes
- Logs centralisés

### 3. Fallback :
- Mode simulation en cas d'échec
- Notifications alternatives (email, push)

---

## 📞 Support

Pour toute question sur l'intégration SMS :
- Documentation TextBelt : https://textbelt.com/
- Logs de l'application : `apps/backend/logs/`
- Test du service : `node test-sms.js`

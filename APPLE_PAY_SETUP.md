# 🍎 Configuration Apple Pay - Guide Complet

## ✅ Ce qui est GRATUIT

- **Apple Pay API** - 100% gratuit
- **Intégration Stripe** - Gratuit pour commencer
- **Développement** - Aucun coût

## 💰 Coûts potentiels

- **Stripe** - 1.4% + 0.25€ par transaction réussie
- **Apple Developer** - 99€/an (déjà nécessaire pour publier sur l'App Store)

## 🚀 Configuration Backend

### 1. Variables d'environnement

Ajoutez dans votre fichier `.env` :

```env
# Configuration Stripe (GRATUIT pour commencer)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2. Obtenir les clés Stripe

1. Allez sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Créez un compte gratuit
3. Récupérez vos clés dans "Developers > API keys"
4. Copiez les clés dans votre `.env`

## 📱 Configuration Frontend

### 1. Clé publique Stripe

Dans `ApplePayButton.tsx`, remplacez :
```typescript
const publishableKey = 'pk_test_your_stripe_publishable_key_here';
```

### 2. Merchant ID Apple

Dans `app.json`, remplacez :
```json
"merchants": ["merchant.com.dar-darkom"]
```

## 🍎 Configuration Apple Developer

### 1. Créer un Merchant ID

1. Allez sur [developer.apple.com](https://developer.apple.com)
2. "Certificates, Identifiers & Profiles"
3. "Identifiers" > "+" > "Merchant IDs"
4. Créez : `merchant.com.dar-darkom`

### 2. Configurer Apple Pay

1. Dans votre App ID, activez "Apple Pay"
2. Associez le Merchant ID à votre App ID

## 🧪 Test en développement

### 1. Simulateur iOS

```bash
# Démarrer le simulateur
npx expo run:ios

# Tester Apple Pay
# Utilisez une carte de test Stripe
```

### 2. Cartes de test Stripe

- **Visa** : 4242 4242 4242 4242
- **Mastercard** : 5555 5555 5555 4444
- **CVV** : N'importe quel code à 3 chiffres
- **Date** : N'importe quelle date future

## 🔧 Dépannage

### Erreur "Apple Pay not available"
- Vérifiez que vous êtes sur un appareil iOS
- Vérifiez la configuration dans `app.json`

### Erreur "Merchant ID not found"
- Vérifiez votre Merchant ID dans Apple Developer
- Vérifiez la configuration dans `app.json`

### Erreur Stripe
- Vérifiez vos clés API
- Vérifiez que vous utilisez les bonnes clés (test vs production)

## 📋 Checklist de déploiement

- [ ] Clés Stripe configurées
- [ ] Merchant ID Apple créé
- [ ] App ID configuré avec Apple Pay
- [ ] Tests effectués en mode test
- [ ] Clés de production configurées
- [ ] Certificats Apple Pay générés

## 🎯 Prochaines étapes

1. **Testez** avec les cartes de test Stripe
2. **Configurez** votre Merchant ID Apple
3. **Déployez** en production avec les vraies clés
4. **Monitorez** les paiements via le dashboard Stripe

## 💡 Conseils

- Commencez toujours en mode test
- Testez sur un vrai appareil iOS
- Gardez vos clés secrètes sécurisées
- Utilisez les webhooks Stripe pour la synchronisation

---

**Résumé : Apple Pay est GRATUIT, seuls Stripe (1.4%) et Apple Developer (99€/an) ont des coûts.**

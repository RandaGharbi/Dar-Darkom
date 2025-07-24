# Tests de l'Application Web

Cette structure de tests couvre tous les aspects de l'application web avec Jest pour les tests unitaires et Cypress pour les tests E2E.

## Structure des Tests

### Tests Unitaires (Jest)

```
__tests__/
├── hooks/                    # Tests des hooks personnalisés
│   ├── useTranslation.test.tsx
│   ├── useAuthGuard.test.tsx
│   ├── useNotifications.test.tsx
│   └── useAnalytics.test.tsx
├── context/                  # Tests des contextes React
│   └── ThemeContext.test.tsx
├── components/               # Tests des composants
│   ├── ThemeToggle.test.tsx
│   ├── LanguageSelector.test.tsx
│   ├── NotificationDropdown.test.tsx
│   └── I18nProvider.test.tsx
├── services/                 # Tests des services API
│   └── api.test.ts
├── utils/                    # Tests des utilitaires
│   └── format.test.ts
└── integration/              # Tests d'intégration
    └── Dashboard.test.tsx
```

### Tests E2E (Cypress)

```
cypress/e2e/
├── navigation/               # Tests de navigation
│   └── navigation.cy.js
├── features/                 # Tests des fonctionnalités
│   ├── theme.cy.js
│   ├── products.cy.js
│   ├── orders.cy.js
│   └── analytics.cy.js
└── components/               # Tests E2E de composants
    └── ThemeToggle.cy.js
```

## Commandes de Test

### Tests Unitaires
```bash
# Lancer tous les tests unitaires
yarn test

# Lancer les tests en mode watch
yarn test:watch

# Lancer les tests avec coverage
yarn test:coverage

# Lancer les tests pour CI/CD
yarn test:ci
```

### Tests E2E
```bash
# Ouvrir Cypress en mode interactif
yarn test:e2e

# Lancer les tests E2E en mode headless
yarn test:e2e:headless

# Lancer les tests E2E avec serveur automatique
yarn test:e2e:ci
```

## Types de Tests

### 1. Tests Unitaires
- **Hooks** : Testent les hooks personnalisés (useTranslation, useAuthGuard, etc.)
- **Contextes** : Testent les contextes React (ThemeContext)
- **Composants** : Testent les composants individuels
- **Services** : Testent les appels API et services
- **Utilitaires** : Testent les fonctions utilitaires

### 2. Tests d'Intégration
- **Dashboard** : Testent l'intégration des composants du dashboard
- **Providers** : Testent l'intégration des providers (Theme, Query, etc.)

### 3. Tests E2E
- **Navigation** : Testent la navigation entre les pages
- **Fonctionnalités** : Testent les fonctionnalités complètes (thème, produits, commandes, analytics)
- **Composants** : Testent les composants dans leur contexte réel

## Configuration

### Jest
- **Environnement** : jsdom pour simuler le DOM
- **Coverage** : Seuil de 70% pour toutes les métriques
- **Mocks** : Configuration automatique des mocks pour Next.js, React Query, etc.

### Cypress
- **Base URL** : http://localhost:3000
- **Viewport** : 1280x720 par défaut
- **Timeouts** : 10 secondes pour les commandes
- **Commandes personnalisées** : login, toggleTheme, checkDarkMode, etc.

## Bonnes Pratiques

1. **Nommage** : Utiliser des noms descriptifs pour les tests
2. **Organisation** : Grouper les tests logiquement
3. **Mocks** : Mocker les dépendances externes
4. **Assertions** : Utiliser des assertions spécifiques
5. **Setup/Teardown** : Nettoyer l'état entre les tests
6. **Coverage** : Maintenir une couverture de code élevée

## Ajout de Nouveaux Tests

### Pour un nouveau composant
1. Créer le fichier dans `__tests__/components/`
2. Importer le composant et testing-library
3. Créer des tests pour les props, événements, et rendu
4. Ajouter des tests E2E si nécessaire

### Pour une nouvelle fonctionnalité
1. Créer les tests unitaires pour les hooks/services
2. Créer les tests d'intégration
3. Créer les tests E2E dans `cypress/e2e/features/`

### Pour un nouveau hook
1. Créer le fichier dans `__tests__/hooks/`
2. Utiliser `renderHook` de testing-library
3. Tester les différents états et comportements 
# Tests Unitaires - Mobile App

## Organisation des tests

Les tests sont organisés en sous-dossiers correspondant à la structure du code source :

### `/components/`
Tests pour les composants réutilisables du dossier `components/`
- ProductCard.test.tsx
- ProductList.test.tsx
- FavoriteButton.test.tsx
- OrderCard.test.tsx
- Banner.test.tsx
- IngredientCard.test.tsx
- CartItemRow.test.tsx
- ContactInfo.test.tsx
- FAQItem.test.tsx
- Header.test.tsx

### `/screens/`
Tests pour les écrans du dossier `components/screens/`
- ContactFormScreen.test.tsx
- IngredientScreen.test.tsx
- featured-products.test.tsx

### `/tabs/`
Tests pour les écrans de navigation du dossier `app/(tabs)/`
- index.test.tsx (Accueil)
- shop.test.tsx (Boutique)
- cart.test.tsx (Panier)
- favorites.test.tsx (Favoris)
- search.test.tsx (Recherche)
- profile.test.tsx (Profil)

## Lancement des tests

```bash
# Tous les tests
yarn test

# Tests en mode watch
yarn test:watch

# Tests d'un dossier spécifique
yarn test components/
yarn test screens/
yarn test tabs/
```

## Couverture

- ✅ Composants réutilisables (10 tests)
- ✅ Écrans de composants (3 tests)
- ✅ Écrans de navigation/tabs (6 tests)
- **Total : 19 tests unitaires** 
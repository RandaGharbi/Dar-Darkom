/* global jest */
// Mock React Native
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  Image: 'Image',
  TouchableOpacity: 'TouchableOpacity',
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) => style,
  },
  Linking: {
    openURL: jest.fn(),
  },
  Dimensions: {
    get: () => ({ width: 375, height: 667 }),
  },
  FlatList: 'FlatList',
  RefreshControl: 'RefreshControl',
  ImageBackground: 'ImageBackground',
  TextInput: 'TextInput',
  ActivityIndicator: 'ActivityIndicator',
  Platform: {
    OS: 'ios',
    select: (obj) => obj.ios,
  },
  KeyboardAvoidingView: 'KeyboardAvoidingView',
}));

// Mock Expo modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: (props) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { 
      testID: props.testID || 'favorite-icon',
      ...props 
    });
  },
}));

// Mock expo-modules-core
jest.mock('expo-modules-core', () => ({
  EventEmitter: jest.fn(),
  NativeModule: jest.fn(),
  SharedObject: jest.fn(),
  SharedRef: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock hooks
jest.mock('./hooks/useProducts', () => ({
  useProductSearch: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
  useProducts: () => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
  useProductsByType: () => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

// Mock components
jest.mock('./components/ProductCard', () => {
  const React = require('react');
  const { Text, View } = require('react-native');
  
  return function ProductCard({ product }) {
    return React.createElement(View, null, [
      React.createElement(Text, { key: 'title' }, product.title),
      React.createElement(Text, { key: 'price' }, `${product.price} €`),
      product.customerRating 
        ? React.createElement(Text, { key: 'rating' }, `${product.customerRating}`)
        : React.createElement(Text, { key: 'no-rating' }, "Pas encore d'avis"),
      product.numberOfReviews 
        ? React.createElement(Text, { key: 'reviews' }, `${product.numberOfReviews} avis`)
        : null,
    ]);
  };
});

// Mock ProductList pour afficher les titres des produits et le titre
jest.mock('./components/ProductList', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function ProductList({ title, products }) {
    return React.createElement(View, null, [
      React.createElement(Text, { key: 'title' }, title),
      ...(products || []).map((p, i) => React.createElement(Text, { key: i }, p.title)),
    ]);
  };
});

// Mock AuthContext et useAuth
jest.mock('./context/AuthContext', () => {
  const React = require('react');
  return {
    AuthContext: React.createContext({ user: { id: 1, name: 'Test' }, login: jest.fn(), logout: jest.fn() }),
    useAuth: () => ({ user: { id: 1, name: 'Test' }, login: jest.fn(), logout: jest.fn() }),
  };
});

// Mock CartContext et useCart pour les imports absolus
jest.mock('apps/mobile/context/CartContext', () => {
  const React = require('react');
  return {
    CartContext: React.createContext({
      cart: { items: [] },
      loading: false,
      fetchCart: jest.fn(),
      addToCart: jest.fn(),
      updateCartItem: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
      checkout: jest.fn(),
    }),
    useCart: () => ({
      cart: { items: [] },
      loading: false,
      fetchCart: jest.fn(),
      addToCart: jest.fn(),
      updateCartItem: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
      checkout: jest.fn(),
    }),
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  Swipeable: ({ children }) => children,
}));

// Mock CartItemRow
jest.mock('./components/CartItemRow', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function CartItemRow({ item }) {
    return React.createElement(View, null, [
      React.createElement(Text, { key: 'name' }, item.name || 'Produit'),
      React.createElement(Text, { key: 'volume' }, item.volume || ''),
      React.createElement(Text, { key: 'quantity' }, item.quantity?.toString() || '0'),
    ]);
  };
});

// Mock des écrans principaux pour afficher le texte attendu
jest.mock('./app/(tabs)/index', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function HomeScreen() {
    return React.createElement(Text, null, 'Accueil');
  };
});

jest.mock('./app/(tabs)/favorites', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function FavoritesScreen() {
    return React.createElement(Text, null, 'Favoris');
  };
});

jest.mock('./app/(tabs)/profile', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function ProfileScreen() {
    return React.createElement(Text, null, 'Profil');
  };
});

jest.mock('./app/(tabs)/shop', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function ShopScreen() {
    return React.createElement(Text, null, 'Boutique');
  };
});

jest.mock('./components/screens/featured-products', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function FeaturedProducts() {
    return React.createElement(Text, null, 'Produits en vedette');
  };
});

jest.mock('./components/screens/IngredientScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function IngredientScreen() {
    return React.createElement(Text, null, 'Ingrédients');
  };
});

jest.mock('./components/screens/ContactFormScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function ContactFormScreen() {
    return React.createElement(Text, null, 'Contact');
  };
});

// Mock components
jest.mock('./components/Header', () => {
  const React = require('react');
  const { View, Image } = require('react-native');
  
  return function Header() {
    return React.createElement(View, { testID: 'header' }, [
      React.createElement(Image, { key: 'logo' }),
    ]);
  };
});

// Mock image assets
jest.mock('./assets/images/Header.png', () => 'Header.png');
jest.mock('./assets/images/phone.png', () => 'phone.png');
jest.mock('./assets/images/contact.png', () => 'contact.png');
jest.mock('./assets/images/chevron.png', () => 'chevron.png');
jest.mock('./assets/images/back.png', () => 'back.png');

// Masquer le warning "react-test-renderer is deprecated"
const originalConsoleError = global.console.error;
global.console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('react-test-renderer is deprecated')
  ) {
    return;
  }
  originalConsoleError(...args);
}; 
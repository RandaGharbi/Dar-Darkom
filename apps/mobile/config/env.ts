// Environment configuration
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Fonction pour détecter si l'appareil est physique ou émulateur
const isPhysicalDevice = () => {
  // Sur iOS, on peut détecter si c'est un simulateur
  if (Platform.OS === 'ios') {
    return !Constants.isDevice;
  }
  
  // Sur Android, on peut détecter si c'est un émulateur
  if (Platform.OS === 'android') {
    // Si on utilise 10.0.2.2, c'est probablement un émulateur
    // On peut aussi vérifier d'autres indicateurs
    return false; // Par défaut, on considère Android comme émulateur pour la compatibilité
  }
  
  return false;
};

// Fonction pour obtenir l'URL de base par défaut
const getDefaultBaseUrl = () => {
  if (Platform.OS === 'android') {
    // Android émulateur utilise 10.0.2.2
    return 'http://10.0.2.2:5000';
  }
  
  if (Platform.OS === 'ios') {
    if (isPhysicalDevice()) {
      // Appareil physique iOS - utiliser l'IP de votre ordinateur
      return 'http://192.168.1.73:5000'; // IP de votre ordinateur
    } else {
      // Simulateur iOS utilise localhost
      return 'http://localhost:5000';
    }
  }
  
  // Fallback
  return 'http://localhost:5000';
};

export const ENV = {
  // Development environment
  DEV: {
    API_BASE_URL: getDefaultBaseUrl(),
    DEBUG: true,
  },
  
  // Production environment
  PROD: {
    API_BASE_URL: 'https://your-production-api.com',
    DEBUG: false,
  },
  
  // Staging environment
  STAGING: {
    API_BASE_URL: 'https://your-staging-api.com',
    DEBUG: true,
  }
};

// Get current environment - defaults to development
export const getCurrentEnv = () => {
  const environment = process.env.NODE_ENV || 'development';
  
  switch (environment) {
    case 'production':
      return ENV.PROD;
    case 'staging':
      return ENV.STAGING;
    case 'development':
    default:
      return ENV.DEV;
  }
};

export const config = getCurrentEnv();
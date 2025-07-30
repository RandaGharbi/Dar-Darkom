// Environment configuration
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { FORCE_API_URL } from './api-config';

// Fonction pour détecter l'environnement d'exécution
const detectEnvironment = () => {
  // Variables d'environnement pour forcer une URL spécifique
  const forcedApiUrl = process.env.EXPO_PUBLIC_API_URL || FORCE_API_URL;
  if (forcedApiUrl) {
    console.log('🔧 URL API forcée:', forcedApiUrl);
    return forcedApiUrl;
  }

  // Détection automatique basée sur la plateforme
  if (Platform.OS === 'android') {
    // Vérifier si on est dans un émulateur Android standard
    const isEmulator = Constants.isDevice === false;
    
    if (isEmulator) {
      // Émulateur Android standard (Android Studio, etc.)
      console.log('📱 Détecté: Émulateur Android standard');
      return 'http://10.0.2.2:5000';
    } else {
      // Appareil physique Android ou émulateur spécial (Nox, etc.)
      console.log('📱 Détecté: Appareil physique Android ou émulateur spécial');
      // Utiliser l'IP de votre ordinateur - à configurer selon votre réseau
      return 'http://192.168.1.100:5000'; // Changez cette IP selon votre réseau
    }
  }
  
  if (Platform.OS === 'ios') {
    if (Constants.isDevice) {
      // Appareil physique iOS
      console.log('📱 Détecté: Appareil physique iOS');
      return 'http://192.168.1.100:5000'; // Changez cette IP selon votre réseau
    } else {
      // Simulateur iOS
      console.log('📱 Détecté: Simulateur iOS');
      return 'http://localhost:5000';
    }
  }
  
  // Fallback
  console.log('📱 Détecté: Environnement par défaut');
  return 'http://localhost:5000';
};

// Fonction pour obtenir l'URL de base par défaut
const getDefaultBaseUrl = () => {
  return detectEnvironment();
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
    case 'development':
    case 'test':
    default:
      return ENV.DEV;
  }
};

export const config = getCurrentEnv();
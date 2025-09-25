// Environment configuration
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { FORCE_API_URL } from './api-config';

// Fonction pour détecter l'environnement d'exécution
const detectEnvironment = () => {
  // Variables d'environnement pour forcer une URL spécifique
  const forcedApiUrl = process.env.EXPO_PUBLIC_API_URL || FORCE_API_URL;
  if (forcedApiUrl) {
    return forcedApiUrl;
  }

  // Détection automatique basée sur la plateforme
  if (Platform.OS === 'android') {
    // Pour tous les émulateurs Android (y compris Nox), utiliser l'IP réseau
    console.log('📱 Détecté: Émulateur Android (incluant Nox Player)');
    return 'http://192.168.1.74:5000';
  }
  
  if (Platform.OS === 'ios') {
    if (Constants.isDevice) {
      // Appareil physique iOS - essayer plusieurs IPs communes
      console.log('📱 Détecté: Appareil physique iOS');
      
      // Essayer d'abord l'IP locale de votre machine de développement
      // Remplacez ces IPs par celles de votre réseau
      const possibleIPs = [
        'http://192.168.1.100:5000',  // Votre IP actuelle
        'http://192.168.1.101:5000',  // Alternative 1
        'http://192.168.1.102:5000',  // Alternative 2
        'http://10.0.0.1:5000',       // Réseau 10.x.x.x
        'http://172.16.0.1:5000',     // Réseau 172.x.x.x
      ];
      
      // Retourner la première IP (vous pouvez changer l'ordre selon votre réseau)
      return possibleIPs[0];
    } else {
      // Simulateur iOS - utiliser l'IP locale au lieu de localhost
      console.log('📱 Détecté: Simulateur iOS - utilisation de l\'IP locale');
      return 'http://192.168.1.100:5000'; // Remplacez par votre IP locale
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

// Fonction pour tester la connectivité réseau
export const testNetworkConnectivity = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes de timeout
    
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log(`❌ Échec de connexion à ${url}:`, error);
    return false;
  }
};

// Fonction pour obtenir l'URL de base avec fallback
export const getBaseUrlWithFallback = async (): Promise<string> => {
  const baseUrl = config.API_BASE_URL;
  
  // Tester d'abord l'URL principale
  if (await testNetworkConnectivity(baseUrl)) {
    console.log('✅ Connexion réussie à:', baseUrl);
    return baseUrl;
  }
  
  // Si l'URL principale échoue, essayer les alternatives pour iOS
  if (Platform.OS === 'ios' && Constants.isDevice) {
    const fallbackIPs = [
      'http://192.168.1.101:5000',
      'http://192.168.1.102:5000',
      'http://10.0.0.1:5000',
      'http://172.16.0.1:5000',
    ];
    
    for (const ip of fallbackIPs) {
      if (await testNetworkConnectivity(ip)) {
        console.log('✅ Connexion de fallback réussie à:', ip);
        return ip;
      }
    }
  }
  
  console.log('⚠️ Aucune connexion réseau trouvée, utilisation de l\'URL par défaut');
  return baseUrl;
};

// Export getBaseUrl function for useApiUrl hook
export const getBaseUrl = async (): Promise<string> => {
  return getBaseUrlWithFallback();
};
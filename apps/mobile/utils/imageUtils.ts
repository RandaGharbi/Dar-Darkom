import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Fonction pour détecter si c'est un appareil physique
 * @returns true si c'est un appareil physique, false si c'est un émulateur/simulateur
 */
const isPhysicalDevice = (): boolean => {
  // Méthode plus fiable pour détecter les simulateurs
  if (Platform.OS === 'ios') {
    // Sur iOS, on peut utiliser plusieurs indicateurs
    // Constants.isDevice est plus fiable sur iOS
    return Constants.isDevice === true;
  }
  return false; // Pour Android, on assume émulateur par défaut
};

/**
 * Fonction pour corriger l'URL d'image selon la plateforme et l'appareil
 * @param imageUrl - L'URL de l'image (peut être relative ou absolue)
 * @returns L'URL corrigée pour l'appareil actuel
 */
export const getCorrectImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  
  // Si l'URL contient localhost ou 10.0.2.2, la corriger selon la plateforme
  if (imageUrl.includes('localhost') || imageUrl.includes('10.0.2.2')) {
    if (Platform.OS === 'android') {
      // Android émulateur utilise l'IP réseau
      return imageUrl.replace(/localhost|10\.0\.2\.2/g, '192.168.43.184');
    } else if (Platform.OS === 'ios') {
      if (isPhysicalDevice()) {
        // iPhone physique - utiliser l'IP de votre ordinateur
        return imageUrl.replace(/localhost|10\.0\.2\.2/g, '192.168.1.73');
      } else {
        // Simulateur iOS utilise localhost
        return imageUrl.replace(/10\.0\.2\.2/g, 'localhost');
      }
    }
  }
  
  // Si l'URL est déjà complète (commence par http) et ne contient pas localhost, la retourner telle quelle
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Si c'est une URL relative, construire l'URL complète
  let baseUrl = '';
  
  if (Platform.OS === 'android') {
    // Android émulateur utilise l'IP réseau
    baseUrl = 'http://192.168.43.184:5000';
  } else if (Platform.OS === 'ios') {
    if (isPhysicalDevice()) {
      // iPhone physique - utiliser l'IP de votre ordinateur
      baseUrl = 'http://192.168.1.73:5000';
    } else {
      // Simulateur iOS utilise localhost
      baseUrl = 'http://localhost:5000';
    }
  }
  
  return `${baseUrl}${imageUrl}`;
};

/**
 * Fonction pour obtenir l'URL de base appropriée selon la plateforme
 * @returns L'URL de base pour l'API
 */
export const getBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    // Android émulateur utilise l'IP réseau
    return 'http://192.168.43.184:5000';
  } else if (Platform.OS === 'ios') {
    if (isPhysicalDevice()) {
      // iPhone physique - utiliser l'IP de votre ordinateur
      return 'http://192.168.1.73:5000';
    } else {
      // Simulateur iOS utilise localhost
      return 'http://localhost:5000';
    }
  }
  
  // Fallback
  return 'http://localhost:5000';
}; 
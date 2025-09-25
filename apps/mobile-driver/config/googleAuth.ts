import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configuration Google Auth pour les différentes plateformes
export const getGoogleConfigForPlatform = () => {
  if (Platform.OS === 'ios') {
    return {
      iosClientId: '374983345955-i49tvob0g5q3c167ljvic8vbtfdj07i1.apps.googleusercontent.com',
      webClientId: '374983345955-i49tvob0g5q3c167ljvic8vbtfdj07i1.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    };
  } else if (Platform.OS === 'android') {
    return {
      webClientId: '374983345955-i49tvob0g5q3c167ljvic8vbtfdj07i1.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    };
  }
  
  return {
    webClientId: '374983345955-i49tvob0g5q3c167ljvic8vbtfdj07i1.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  };
};

// Validation de la configuration Google
export const validateGoogleConfig = (config: any) => {
  if (!config) {
    return false;
  }
  
  if (!config.webClientId) {
    return false;
  }
  
  return true;
};

export default {
  getGoogleConfigForPlatform,
  validateGoogleConfig,
};

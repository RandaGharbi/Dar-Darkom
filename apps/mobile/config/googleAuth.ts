// config/googleAuth.ts
import { Platform } from 'react-native';

export const GOOGLE_AUTH_CONFIG = {
  // Web Client ID (pour le backend)
  webClientId: '374983345955-i49tvob0g5q3c167ljvic8vbtfdj07i1.apps.googleusercontent.com',
  
  // iOS Client ID (vrai Client ID iOS)
  iosClientId: '374983345955-4a24r9tavb2ds75kuiaeu825nnbiskag.apps.googleusercontent.com',
  
  // Android Client ID (utilise le Web Client ID temporairement)
  androidClientId: '374983345955-i49tvob0g5q3c167ljvic8vbtfdj07i1.apps.googleusercontent.com',
  
  scopes: ['openid', 'profile', 'email'],
  additionalParameters: { prompt: 'select_account' },
  isDevelopment: __DEV__,
};

export const validateGoogleConfig = () => {
  const config = GOOGLE_AUTH_CONFIG;
  
  // Vérifier que les Client IDs ne contiennent pas de placeholders
  if (config.webClientId.includes('YOUR_GOOGLE') || 
      config.iosClientId.includes('VOTRE_IOS') || 
      config.androidClientId.includes('ANDROID_CLIENT_ID')) {
    console.error('❌ Client IDs Google non configurés !');
    return false;
  }
  
  console.log('✅ Configuration Google valide');
  return true;
};

export const getGoogleConfigForPlatform = () => {
  const config = GOOGLE_AUTH_CONFIG;
  
  if (Platform.OS === 'ios') {
    return {
      clientId: config.iosClientId,
      scopes: config.scopes,
      additionalParameters: config.additionalParameters,
    };
  } else if (Platform.OS === 'android') {
    return {
      clientId: config.androidClientId,
      scopes: config.scopes,
      additionalParameters: config.additionalParameters,
    };
  } else {
    // Web
    return {
      clientId: config.webClientId,
      scopes: config.scopes,
      additionalParameters: config.additionalParameters,
    };
  }
};
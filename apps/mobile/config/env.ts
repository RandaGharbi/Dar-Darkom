// Environment configuration
import { Platform } from 'react-native';
export const ENV = {
  // Development environment
  DEV: {
    API_BASE_URL:
      Platform.OS === 'android'
        ? 'http://10.0.2.2:5000'
        : 'http://localhost:5000',
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
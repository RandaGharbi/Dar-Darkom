import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import httpClient from '../services/httpClient';
import { default as API_CONFIG } from '../config/api';
import { getGoogleConfigForPlatform, validateGoogleConfig } from '../config/googleAuth';

WebBrowser.maybeCompleteAuthSession();

type User = {
  _id?: string;
  name: string;
  email: string;
  displayEmail?: string;
  profileImage?: string;
  phoneNumber?: string;
  address?: string;
  username?: string;
  appleId?: string;
  googleId?: string;
  createdAt?: string;
  lastLogin?: string;
  status?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, profileImageUrl?: string) => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Configuration Google
  const googleConfig = getGoogleConfigForPlatform();
  const [, , promptAsync] = Google.useAuthRequest(googleConfig);

  // Vérifier l'état d'authentification au démarrage
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (token) {
        setIsAuthenticated(true);
        const res = await httpClient.get(API_CONFIG.ENDPOINTS.ME);
        setUser(res.data.user);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await httpClient.post(API_CONFIG.ENDPOINTS.LOGIN, { email, password });
      
      // Sauvegarder le token
      if (res.data.token) {
        await AsyncStorage.setItem('authToken', res.data.token);
      }
      
      setUser(res.data.user);
      setIsAuthenticated(true);

      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Identifiants invalides';
      Alert.alert('Erreur', errorMessage);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, profileImageUrl?: string) => {
    try {
      const res = await httpClient.post(API_CONFIG.ENDPOINTS.REGISTER, { name, email, password, profileImageUrl });
      
      // Si l'inscription réussit, connecter automatiquement l'utilisateur
      if (res.data.token) {
        console.log('🔐 Setting auth token and user data...');
        console.log('🔐 Signup - User data received:', res.data.user);
        await AsyncStorage.setItem('authToken', res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        console.log('✅ User authenticated after signup');
      }
      
      return true;
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur serveur');
      return false;
    }
  };

  const logout = async () => {
    try {
      // Appel au backend pour logout (optionnel mais propre)
      await httpClient.post(API_CONFIG.ENDPOINTS.LOGOUT);
      await AsyncStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
    } catch {
    }
  };

  const refreshUserData = async () => {
    try {
      const res = await httpClient.get(API_CONFIG.ENDPOINTS.ME);
      setUser(res.data.user);
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement des données:', error);
    }
  };

  const loginWithApple = async () => {
    try {
      if (Platform.OS !== 'ios') {
        Alert.alert('Erreur', 'Sign in with Apple n\'est disponible que sur iOS');
        return false;
      }

      console.log('🍎 Début de l\'authentification Apple...');
      
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('🍎 Credential Apple reçu:', {
        user: credential.user,
        fullName: credential.fullName,
        email: credential.email,
        givenName: credential.fullName?.givenName,
        familyName: credential.fullName?.familyName,
        hasIdentityToken: !!credential.identityToken
      });

      if (credential.identityToken) {
        
        // Essayer de récupérer la photo de profil Apple
        let photoUrl = null;
        
        // Méthode 1: Essayer l'URL standard Apple (peut ne pas fonctionner pour tous)
        if (credential.user) {
          try {
            const testPhotoUrl = `https://appleid.cdn-apple.com/static/bin/cb${credential.user}/avatar_2x.jpeg`;
            
            // Tester si l'URL de photo existe (ne marche pas toujours en dev)
            // On l'envoie quand même au backend pour qu'il teste
            photoUrl = testPhotoUrl;
            console.log('🖼️ URL photo Apple générée:', photoUrl);
          } catch {
            console.log('🖼️ Impossible de générer l\'URL photo Apple');
          }
        }
        
        // Méthode 2: Générer un avatar par défaut basé sur les initiales (fallback)
        let defaultAvatarUrl = null;
        if (credential.fullName?.givenName || credential.fullName?.familyName) {
          const fullName = `${credential.fullName?.givenName || ''} ${credential.fullName?.familyName || ''}`.trim();
          const initials = [
            credential.fullName?.givenName?.[0] || '',
            credential.fullName?.familyName?.[0] || ''
          ].join('').toUpperCase();
          
          if (initials.length > 0) {
            // Utiliser un service de génération d'avatar par initiales avec le nom complet
            defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=200&background=2E86AB&color=ffffff&format=png&bold=true`;
            console.log('🖼️ Avatar par initiales généré:', defaultAvatarUrl);
          }
        }

        const requestData = {
          token: credential.identityToken,
          fullName: credential.fullName,
          email: credential.email,
          photoUrl: photoUrl || defaultAvatarUrl, // Envoyer la photo ou l'avatar par défaut
        };
        
        console.log('🍎 Envoi au backend:', {
          hasToken: !!requestData.token,
          hasFullName: !!requestData.fullName,
          hasEmail: !!requestData.email,
          hasPhotoUrl: !!requestData.photoUrl,
          givenName: requestData.fullName?.givenName,
          familyName: requestData.fullName?.familyName,
          email: requestData.email,
          photoUrl: requestData.photoUrl
        });

        const res = await httpClient.post(API_CONFIG.ENDPOINTS.APPLE, requestData);

        console.log('🍎 Réponse backend:', {
          hasToken: !!res.data.token,
          userName: res.data.user?.name,
          userEmail: res.data.user?.email,
          userPhoto: res.data.user?.profileImage,
          isRealName: res.data.user?.name && !res.data.user.name.includes('Utilisateur'),
          isRealEmail: res.data.user?.email && !res.data.user.email.includes('@privaterelay.appleid.com'),
          hasPhoto: !!res.data.user?.profileImage
        });

        if (res.data.token) {
          await AsyncStorage.setItem('authToken', res.data.token);
          setUser(res.data.user);
          setIsAuthenticated(true);
          
          console.log('🍎 Connexion Apple réussie!');
          console.log('🍎 Utilisateur final:', {
            name: res.data.user.name,
            email: res.data.user.email,
            profileImage: res.data.user.profileImage
          });
          
          return true;
        }
      }
      
      return false;
    } catch (error: any) {
      console.error('🍎 Erreur Apple Sign In:', error);
      if (error.code === 'ERR_REQUEST_CANCELED') {
        return false;
      }
      Alert.alert('Erreur', `Erreur lors de la connexion avec Apple: ${error.message}`);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Valider la configuration Google
      if (!validateGoogleConfig()) {
        Alert.alert(
          'Configuration manquante', 
          'Les Client IDs Google ne sont pas configurés. Suivez le guide GOOGLE_AUTH_SETUP.md'
        );
        return false;
      }

      console.log('🔍 Début de l\'authentification Google...');
      console.log('🔍 Configuration utilisée:', getGoogleConfigForPlatform());
      
      const result = await promptAsync();
      
      console.log('🔍 Résultat Google Auth:', {
        type: result.type,
        hasAuthentication: !!(result as any).authentication,
        hasIdToken: !!(result as any).authentication?.idToken,
        hasAccessToken: !!(result as any).authentication?.accessToken,
        error: (result as any).error,
        errorCode: (result as any).errorCode,
      });
      
      if (result.type === 'success' && (result as any).authentication?.idToken) {
        console.log('🔍 Envoi du token au backend...');
        
        const res = await httpClient.post(API_CONFIG.ENDPOINTS.GOOGLE, {
          token: (result as any).authentication.idToken,
        });

        console.log('🔍 Réponse backend Google:', {
          hasToken: !!res.data.token,
          userName: res.data.user?.name,
          userEmail: res.data.user?.email,
          userPhoto: res.data.user?.profileImage,
        });

        if (res.data.token) {
          await AsyncStorage.setItem('authToken', res.data.token);
          setUser(res.data.user);
          setIsAuthenticated(true);
          
          console.log('✅ Connexion Google réussie!');
          console.log('✅ Utilisateur final:', {
            name: res.data.user.name,
            email: res.data.user.email,
            profileImage: res.data.user.profileImage
          });
          
          return true;
        }
      } else if (result.type === 'cancel') {
        console.log('🔍 Connexion Google annulée par l\'utilisateur');
        return false;
      } else {
        console.log('🔍 Erreur Google Auth:', {
          type: result.type,
          error: (result as any).error,
          errorCode: (result as any).errorCode,
        });
        Alert.alert('Erreur Google', `Type: ${result.type}, Erreur: ${(result as any).error || 'Inconnue'}`);
        return false;
      }
      
      return false;
    } catch (error: any) {
      console.error('❌ Erreur Google Sign In:', error);
      Alert.alert('Erreur', `Erreur lors de la connexion avec Google: ${error.message}`);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      setUser, 
      login, 
      signup, 
      loginWithApple, 
      loginWithGoogle, 
      logout, 
      refreshUserData, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

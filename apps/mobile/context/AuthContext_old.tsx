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

  // Vérifier l'état d'authentification au démarrage
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (token) {
        setIsAuthenticated(true);
        console.log('Token présent, vérification avec le serveur...');
        const res = await httpClient.get(API_CONFIG.ENDPOINTS.ME);
        console.log('Données utilisateur récupérées:', res.data.user);
        setUser(res.data.user);
      }
    } catch (error) {
      console.log('Erreur lors de la vérification du token:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await httpClient.post(API_CONFIG.ENDPOINTS.LOGIN, { email, password });
      
      if (res.data.token) {
        await AsyncStorage.setItem('authToken', res.data.token);
      }
      
      console.log('Connexion réussie - Données utilisateur:', res.data.user);
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
      
      if (res.data.token) {
        console.log('Inscription réussie - Configuration auth...');
        console.log('Données utilisateur:', res.data.user);
        await AsyncStorage.setItem('authToken', res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        console.log('Utilisateur authentifié après inscription');
      }
      
      return true;
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur serveur');
      return false;
    }
  };

  const logout = async () => {
    try {
      await httpClient.post(API_CONFIG.ENDPOINTS.LOGOUT);
      await AsyncStorage.removeItem('authToken');
      
      // Déconnexion Google si connecté
      try {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          await GoogleSignin.signOut();
          console.log('Déconnexion Google effectuée');
        }
      } catch (error) {
        console.log('Erreur déconnexion Google:', error);
      }
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.log('Erreur lors de la déconnexion:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      console.log('Rafraîchissement des données utilisateur...');
      const res = await httpClient.get(API_CONFIG.ENDPOINTS.ME);
      console.log('Nouvelles données utilisateur:', res.data.user);
      setUser(res.data.user);
      console.log('Données utilisateur rafraîchies');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données:', error);
    }
  };

  const loginWithApple = async () => {
    try {
      if (Platform.OS !== 'ios') {
        Alert.alert('Erreur', 'Sign in with Apple n\'est disponible que sur iOS');
        return false;
      }

      console.log('Début de l\'authentification Apple...');
      
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('Credential Apple reçu:', {
        user: credential.user,
        fullName: credential.fullName,
        email: credential.email,
        hasIdentityToken: !!credential.identityToken
      });

      if (credential.identityToken) {
        let photoUrl = null;
        
        if (credential.user) {
          try {
            photoUrl = `https://appleid.cdn-apple.com/static/bin/cb${credential.user}/avatar_2x.jpeg`;
          } catch {
            console.log('Impossible de générer l\'URL photo Apple');
          }
        }
        
        let defaultAvatarUrl = null;
        if (credential.fullName?.givenName || credential.fullName?.familyName) {
          const fullName = `${credential.fullName?.givenName || ''} ${credential.fullName?.familyName || ''}`.trim();
          if (fullName) {
            defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=200&background=2E86AB&color=ffffff&format=png&bold=true`;
          }
        }

        const requestData = {
          token: credential.identityToken,
          fullName: credential.fullName,
          email: credential.email,
          photoUrl: photoUrl || defaultAvatarUrl,
        };

        const res = await httpClient.post(API_CONFIG.ENDPOINTS.APPLE, requestData);

        if (res.data.token) {
          await AsyncStorage.setItem('authToken', res.data.token);
          setUser(res.data.user);
          setIsAuthenticated(true);
          
          console.log('Connexion Apple réussie!');
          return true;
        }
      }
      
      return false;
    } catch (error: any) {
      console.error('Erreur Apple Sign In:', error);
      if (error.code === 'ERR_REQUEST_CANCELED') {
        return false;
      }
      Alert.alert('Erreur', `Erreur lors de la connexion avec Apple: ${error.message}`);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Valider la configuration
      if (!validateGoogleConfig()) {
        Alert.alert(
          'Configuration manquante', 
          'Les Client IDs Google ne sont pas configurés correctement pour iOS.\n\nBundle ID: com.rindaa.Nourane'
        );
        return false;
      }

      console.log('Début de l\'authentification Google...');
      console.log('Platform:', Platform.OS);
      console.log('Bundle ID attendu: com.rindaa.Nourane');
      
      // Vérifier Google Play Services (Android seulement)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }
      
      // Se connecter avec Google
      console.log('Lancement de la connexion Google...');
      const userInfo = await GoogleSignin.signIn();
      console.log('Informations utilisateur Google reçues:', {
        id: userInfo.user.id,
        name: userInfo.user.name,
        email: userInfo.user.email,
        photo: userInfo.user.photo ? 'Présent' : 'Absent'
      });
      
      // Obtenir les tokens
      const tokens = await GoogleSignin.getTokens();
      console.log('Tokens Google obtenus:', {
        hasIdToken: !!tokens.idToken,
        hasAccessToken: !!tokens.accessToken
      });
      
      if (tokens.idToken) {
        console.log('Envoi du token au backend...');
        
        const res = await httpClient.post(API_CONFIG.ENDPOINTS.GOOGLE, {
          token: tokens.idToken,
        });

        console.log('Réponse backend Google:', {
          hasToken: !!res.data.token,
          userName: res.data.user?.name,
          userEmail: res.data.user?.email,
          userPhoto: res.data.user?.profileImage ? 'Présent' : 'Absent'
        });

        if (res.data.token) {
          await AsyncStorage.setItem('authToken', res.data.token);
          setUser(res.data.user);
          setIsAuthenticated(true);
          
          console.log('Connexion Google réussie!');
          console.log('Utilisateur final:', {
            name: res.data.user.name,
            email: res.data.user.email,
            profileImage: res.data.user.profileImage
          });
          
          return true;
        }
      }
      
      console.log('Aucun token ID reçu');
      return false;
    } catch (error: any) {
      console.error('Erreur Google Sign In:', error);
      console.error('Code d\'erreur:', error.code);
      console.error('Message d\'erreur:', error.message);
      
      if (error.code === 'SIGN_IN_CANCELLED') {
        console.log('Connexion Google annulée par l\'utilisateur');
        return false;
      }
      
      let errorMessage = `Erreur lors de la connexion avec Google: ${error.message}`;
      
      // Messages d'erreur spécifiques
      if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        errorMessage = 'Google Play Services n\'est pas disponible sur cet appareil';
      } else if (error.code === 'SIGN_IN_REQUIRED') {
        errorMessage = 'La connexion Google est requise';
      } else if (error.message?.includes('DEVELOPER_ERROR')) {
        errorMessage = 'Erreur de configuration. Vérifiez le Bundle ID: com.rindaa.Nourane';
      }
      
      Alert.alert('Erreur', errorMessage);
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
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavoritesStore } from './FavoritesStore';
import httpClient from '../services/httpClient';
import API_CONFIG from '../config/api';

type User = {
  _id?: string;
  name: string;
  email: string;
  profileImage?: string;
  phoneNumber?: string;
  address?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, profileImageUrl?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const favoritesStore = useFavoritesStore();

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
    } catch (error) {
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

      // --- Fusion des favoris locaux avec le backend ---
      const localFavsRaw = await AsyncStorage.getItem('favorites');
      const localFavs = localFavsRaw ? JSON.parse(localFavsRaw) : [];
      if (Array.isArray(localFavs) && localFavs.length > 0) {
        for (const fav of localFavs) {
          try {
            await favoritesStore.addFavorite(fav, true, res.data.token);
          } catch (e) {
            // Ignore les erreurs (doublons, etc.)
          }
        }
        await AsyncStorage.removeItem('favorites');
      }
      // Hydrate les favoris depuis le backend après fusion
      await favoritesStore.hydrate(true, res.data.token);
      // --- Fin fusion ---

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
        await AsyncStorage.setItem('authToken', res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        console.log('✅ User authenticated after signup');

        // --- Fusion des favoris locaux avec le backend ---
        const localFavsRaw = await AsyncStorage.getItem('favorites');
        const localFavs = localFavsRaw ? JSON.parse(localFavsRaw) : [];
        if (Array.isArray(localFavs) && localFavs.length > 0) {
          for (const fav of localFavs) {
            try {
              await favoritesStore.addFavorite(fav, true, res.data.token);
            } catch (e) {
              // Ignore les erreurs (doublons, etc.)
            }
          }
          await AsyncStorage.removeItem('favorites');
        }
        // Hydrate les favoris depuis le backend après fusion
        await favoritesStore.hydrate(true, res.data.token);
        // --- Fin fusion ---
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
      // delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

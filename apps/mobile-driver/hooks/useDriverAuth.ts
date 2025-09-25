import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuthService, AppleAuthResult } from '../services/appleAuthService';
import { googleAuthService, GoogleAuthResult } from '../services/googleAuthService';

export interface DriverUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isOnline?: boolean;
  profileImage?: string;
  phoneNumber?: string;
  status?: string;
}

interface UseDriverAuthReturn {
  user: DriverUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithApple: () => Promise<AppleAuthResult>;
  loginWithGoogle: () => Promise<GoogleAuthResult>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<DriverUser>) => void;
}

const STORAGE_KEYS = {
  USER_TOKEN: 'driver_user_token',
  USER_DATA: 'driver_user_data',
};

export const useDriverAuth = (): UseDriverAuthReturn => {
  const [user, setUser] = useState<DriverUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données utilisateur au démarrage
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      
      if (storedUserData && storedToken) {
        const userData = JSON.parse(storedUserData);
        setUser(userData);
        console.log('👤 Utilisateur driver chargé depuis le stockage:', userData.name);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async (userData: DriverUser, token: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
      console.log('💾 Données utilisateur driver sauvegardées');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données utilisateur:', error);
    }
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      console.log('🗑️ Données utilisateur driver supprimées');
    } catch (error) {
      console.error('Erreur lors de la suppression des données utilisateur:', error);
    }
  };

  const loginWithApple = useCallback(async (): Promise<AppleAuthResult> => {
    try {
      setIsLoading(true);
      
      const result = await appleAuthService.signInWithApple();
      
      if (result.success && result.user && result.token) {
        const driverUser: DriverUser = {
          id: result.user.id,
          name: result.user.fullName ? 
            `${result.user.fullName.givenName || ''} ${result.user.fullName.familyName || ''}`.trim() : 
            'Livreur Apple',
          email: result.user.email || '',
          role: 'driver',
          isOnline: false,
          status: 'Active'
        };

        setUser(driverUser);
        await saveUserData(driverUser, result.token);
        
        console.log('✅ Connexion Apple driver réussie:', driverUser.name);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Erreur connexion Apple driver:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<GoogleAuthResult> => {
    try {
      setIsLoading(true);
      
      const result = await googleAuthService.signInWithGoogle();
      
      if (result.success && result.user && result.token) {
        const driverUser: DriverUser = {
          id: result.user.id,
          name: result.user.name || 'Livreur Google',
          email: result.user.email || '',
          role: 'driver',
          isOnline: false,
          status: 'Active',
          profileImage: result.user.photo
        };

        setUser(driverUser);
        await saveUserData(driverUser, result.token);
        
        console.log('✅ Connexion Google driver réussie:', driverUser.name);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Erreur connexion Google driver:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Déconnexion Apple et Google (si nécessaire)
      await appleAuthService.signOut();
      await googleAuthService.signOut();
      
      // Supprimer les données locales
      setUser(null);
      await clearUserData();
      
      console.log('👋 Déconnexion driver réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((userData: Partial<DriverUser>) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      
      const updatedUser = { ...prevUser, ...userData };
      
      // Sauvegarder les modifications
      AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN).then(token => {
        if (token) {
          saveUserData(updatedUser, token);
        }
      });
      
      return updatedUser;
    });
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginWithApple,
    loginWithGoogle,
    logout,
    updateUser,
  };
};

export default useDriverAuth;


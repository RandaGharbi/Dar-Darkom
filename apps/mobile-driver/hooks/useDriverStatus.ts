import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../services/httpClient';
import API_CONFIG from '../config/api';

const DRIVER_STATUS_KEY = 'driver_status';

export interface DriverStatus {
  isOnline: boolean;
  lastUpdate: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export const useDriverStatus = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Charger le statut depuis le stockage local au démarrage
  useEffect(() => {
    loadDriverStatus();
  }, []);

  const loadDriverStatus = useCallback(async () => {
    try {
      const storedStatus = await AsyncStorage.getItem(DRIVER_STATUS_KEY);
      if (storedStatus) {
        const status: DriverStatus = JSON.parse(storedStatus);
        setIsOnline(status.isOnline);
        setLastUpdate(status.lastUpdate);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du statut driver:', error);
    }
  }, []);

  const saveDriverStatus = useCallback(async (status: DriverStatus) => {
    try {
      await AsyncStorage.setItem(DRIVER_STATUS_KEY, JSON.stringify(status));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du statut driver:', error);
    }
  }, []);

  const updateDriverStatus = useCallback(async (newStatus: boolean) => {
    setIsLoading(true);
    try {
      const statusData: DriverStatus = {
        isOnline: newStatus,
        lastUpdate: new Date().toISOString(),
      };

      // Mettre à jour le statut sur le serveur
      await httpClient.post(API_CONFIG.ENDPOINTS.DRIVER_UPDATE_STATUS, {
        status: newStatus ? 'online' : 'offline',
        timestamp: statusData.lastUpdate,
      });

      // Sauvegarder localement
      await saveDriverStatus(statusData);
      setIsOnline(newStatus);
      setLastUpdate(statusData.lastUpdate);

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [saveDriverStatus]);

  const toggleStatus = useCallback(async () => {
    const newStatus = !isOnline;
    return await updateDriverStatus(newStatus);
  }, [isOnline, updateDriverStatus]);

  const goOnline = useCallback(async () => {
    return await updateDriverStatus(true);
  }, [updateDriverStatus]);

  const goOffline = useCallback(async () => {
    return await updateDriverStatus(false);
  }, [updateDriverStatus]);

  return {
    isOnline,
    isLoading,
    lastUpdate,
    toggleStatus,
    goOnline,
    goOffline,
    updateDriverStatus,
  };
};

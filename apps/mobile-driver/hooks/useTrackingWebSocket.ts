import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/api';
import { TrackingData } from '../services/trackingService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseTrackingWebSocketProps {
  orderId: string;
  userId: string;
  onTrackingUpdate?: (tracking: TrackingData) => void;
  onDriverLocationUpdate?: (location: { latitude: number; longitude: number; address?: string }) => void;
}

export const useTrackingWebSocket = ({
  orderId,
  userId,
  onTrackingUpdate,
  onDriverLocationUpdate,
}: UseTrackingWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  
  // Utiliser des refs pour les callbacks pour éviter les re-renders
  const onTrackingUpdateRef = useRef(onTrackingUpdate);
  const onDriverLocationUpdateRef = useRef(onDriverLocationUpdate);
  
  // Mettre à jour les refs quand les callbacks changent
  useEffect(() => {
    onTrackingUpdateRef.current = onTrackingUpdate;
  }, [onTrackingUpdate]);
  
  useEffect(() => {
    onDriverLocationUpdateRef.current = onDriverLocationUpdate;
  }, [onDriverLocationUpdate]);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          setError('Token d\'authentification manquant');
          return;
        }

        // Créer la connexion WebSocket
        const socket = io(API_CONFIG.BASE_URL, {
          auth: {
            token,
          },
          transports: ['websocket'],
        });

        socketRef.current = socket;

        // Gérer la connexion
        socket.on('connect', () => {
          console.log('🔌 WebSocket connecté pour le tracking');
          setIsConnected(true);
          setError(null);

          // Rejoindre le tracking de la commande
          socket.emit('join-tracking', { orderId, userId });
        });

        socket.on('disconnect', () => {
          console.log('🔌 WebSocket déconnecté');
          setIsConnected(false);
        });

        socket.on('connect_error', (err) => {
          console.error('❌ Erreur de connexion WebSocket:', err);
          setError(err.message);
          setIsConnected(false);
        });

        // Écouter les mises à jour de tracking
        socket.on('tracking-update', (data) => {
          console.log('📍 Mise à jour de tracking reçue:', data);
          if (data.orderId === orderId && onTrackingUpdateRef.current) {
            onTrackingUpdateRef.current(data.tracking);
          }
        });

        // Écouter les mises à jour de position du driver
        socket.on('driver-location-update', (data) => {
          console.log('📍 Mise à jour de position du driver:', data);
          if (data.orderId === orderId && onDriverLocationUpdateRef.current) {
            onDriverLocationUpdateRef.current(data.location);
          }
        });

      } catch (err) {
        console.error('❌ Erreur lors de l\'initialisation du WebSocket:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    };

    if (orderId && userId) {
      initializeSocket();
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-tracking', { orderId });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [orderId, userId]);

  // Fonction pour envoyer une mise à jour de position (pour les drivers)
  const updateDriverLocation = (location: { latitude: number; longitude: number; address?: string }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('update-driver-location', {
        orderId,
        location,
      });
    }
  };

  // Fonction pour envoyer une notification
  const sendNotification = (notification: { title: string; message?: string }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-notification', {
        userId,
        notification,
      });
    }
  };

  return {
    isConnected,
    error,
    updateDriverLocation,
    sendNotification,
  };
};


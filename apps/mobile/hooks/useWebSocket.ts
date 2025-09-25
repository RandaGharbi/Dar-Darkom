import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import websocketService from '../services/websocketService';

export const useWebSocket = () => {
  const { user } = useAuth();
  const listenersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user?._id) return;

    // Connecter au WebSocket
    websocketService.connect(user._id);

    return () => {
      // Nettoyer les listeners spécifiques à ce hook
      listenersRef.current.forEach(listener => {
        websocketService.removeAllListeners();
      });
      listenersRef.current.clear();
    };
  }, [user?._id]);

  const addOrderStatusListener = (callback: (update: any) => void) => {
    const listenerId = `order-status-${Date.now()}`;
    listenersRef.current.add(listenerId);
    
    websocketService.onOrderStatusUpdate(callback);
    
    return () => {
      listenersRef.current.delete(listenerId);
      websocketService.removeAllListeners();
    };
  };

  const addTrackingListener = (callback: (update: any) => void) => {
    const listenerId = `tracking-${Date.now()}`;
    listenersRef.current.add(listenerId);
    
    websocketService.onTrackingUpdate(callback);
    
    return () => {
      listenersRef.current.delete(listenerId);
      websocketService.removeAllListeners();
    };
  };

  const addDriverLocationListener = (callback: (update: any) => void) => {
    const listenerId = `driver-location-${Date.now()}`;
    listenersRef.current.add(listenerId);
    
    websocketService.onDriverLocationUpdate(callback);
    
    return () => {
      listenersRef.current.delete(listenerId);
      websocketService.removeAllListeners();
    };
  };

  const joinTracking = (orderId: string) => {
    if (user?._id) {
      websocketService.joinTracking(orderId, user._id);
    }
  };

  const leaveTracking = (orderId: string) => {
    websocketService.leaveTracking(orderId);
  };

  return {
    connected: websocketService.connected,
    addOrderStatusListener,
    addTrackingListener,
    addDriverLocationListener,
    joinTracking,
    leaveTracking,
  };
};

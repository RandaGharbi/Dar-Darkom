import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import NotificationToast from './NotificationToast';
import { Notification } from '../types/notifications';
import websocketService from '../services/websocketService';
import { useNotificationSound } from '../hooks/useNotificationSound';
import { useNotificationVibration } from '../hooks/useNotificationVibration';
import pushNotificationService from '../services/pushNotificationService';

interface ToastNotification {
  id: string;
  notification: Notification;
  timestamp: number;
}

interface NotificationToastManagerProps {
  userId: string;
}

const NotificationToastManager: React.FC<NotificationToastManagerProps> = ({ userId }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const { playNotificationSound } = useNotificationSound();
  const { vibrateNotification } = useNotificationVibration();

  useEffect(() => {
    // Connecter au WebSocket
    websocketService.connect(userId);

    // S'abonner aux notifications
    const unsubscribe = websocketService.subscribe((notification) => {
      addToast(notification);
    });

    // Simulation avec vraies données - notifications réalistes
    const simulationInterval = setInterval(() => {
      if (Math.random() < 0.03) { // 3% de chance toutes les 30 secondes (moins fréquent)
        const types: Notification['type'][] = ['order', 'stock', 'user', 'activity', 'product'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        websocketService.simulateNotification(userId, randomType);
      }
    }, 30000);

    return () => {
      unsubscribe();
      websocketService.disconnect();
      clearInterval(simulationInterval);
    };
  }, [userId]);

  const addToast = (notification: Notification) => {
    const toast: ToastNotification = {
      id: `toast-${Date.now()}-${Math.random()}`,
      notification,
      timestamp: Date.now(),
    };

    setToasts(prev => [...prev, toast]);
    
    // Jouer le son et vibrer pour les notifications
    playNotificationSound();
    vibrateNotification();
    
    // Afficher la notification push si autorisée
    pushNotificationService.showNotification(notification);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Nettoyer les toasts anciens (plus de 10 secondes)
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setToasts(prev => prev.filter(toast => now - toast.timestamp < 10000));
    }, 5000);

    return () => clearInterval(cleanupInterval);
  }, []);

  if (typeof window === 'undefined') return null;

  const toastElements = toasts.map((toast, index) => (
    <div
      key={toast.id}
      style={{
        position: 'fixed',
        top: `${20 + index * 80}px`,
        right: '20px',
        zIndex: 10000 + index,
      }}
    >
      <NotificationToast
        notification={toast.notification}
        onClose={() => removeToast(toast.id)}
        duration={5000}
      />
    </div>
  ));

  return createPortal(toastElements, document.body);
};

export default NotificationToastManager; 
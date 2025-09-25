import { useState, useEffect, useCallback } from 'react';
import { Notification } from '../types/notifications';
import notificationService from '../services/notificationService';
import notificationWebSocket from '../services/notificationWebSocket';

interface UseNotificationsProps {
  userId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useNotifications = ({ 
  userId, 
  autoRefresh = true, 
  refreshInterval = 30000 
}: UseNotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les notifications
  const loadNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await notificationService.getUserNotifications(userId, 1, 20, false);
      console.log('🔔 Notifications chargées:', response);
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (err) {
      console.error('Erreur lors du chargement des notifications:', err);
      setError('Erreur lors du chargement des notifications');
      // En cas d'erreur, ne pas afficher de notifications
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erreur lors du marquage de la notification:', err);
    }
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Erreur lors du marquage des notifications:', err);
    }
  }, []);

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      // Décrémenter le compteur si c'était une notification non lue
      const notification = notifications.find(n => n._id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de la notification:', err);
    }
  }, [notifications]);

  // Ajouter une nouvelle notification (pour WebSocket)
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  // Charger les notifications au montage
  useEffect(() => {
    if (userId && userId.trim() !== '') {
      loadNotifications();
    } else {
      // Si pas d'userId valide, réinitialiser les notifications
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [userId, loadNotifications]);

  // Rafraîchissement automatique
  useEffect(() => {
    if (!autoRefresh || !userId || userId.trim() === '') return;

    const interval = setInterval(() => {
      loadNotifications();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, userId, refreshInterval, loadNotifications]);

  // WebSocket pour les notifications en temps réel
  useEffect(() => {
    if (!userId || userId.trim() === '') return;

    // Obtenir le token d'authentification
    const token = localStorage.getItem('authToken');
    if (!token) {
      return;
    }

    // Se connecter au WebSocket
    notificationWebSocket.connect(userId, token);

    // S'abonner aux nouvelles notifications
    const unsubscribeNotification = notificationWebSocket.onNotification((notification) => {
      console.log('Nouvelle notification reçue via WebSocket:', notification);
      addNotification(notification);
    });

    // S'abonner aux changements de connexion
    const unsubscribeConnection = notificationWebSocket.onConnectionChange((connected) => {
      console.log('État de connexion WebSocket:', connected ? 'Connecté' : 'Déconnecté');
    });

    return () => {
      // Nettoyer les abonnements
      unsubscribeNotification();
      unsubscribeConnection();
      
      // Se déconnecter du WebSocket
      notificationWebSocket.disconnect();
    };
  }, [userId, addNotification]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  };
};
import { api } from '../lib/api';
import { Notification, NotificationResponse, CreateNotificationRequest } from '../types/notifications';

class NotificationService {
  // Récupérer toutes les notifications d'un utilisateur
  async getUserNotifications(userId: string): Promise<NotificationResponse> {
    try {
      console.log('Tentative de récupération des notifications pour userId:', userId);
      const response = await api.get(`/notifications/user/${userId}`);
      console.log('Réponse des notifications:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      throw error;
    }
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead(userId: string): Promise<void> {
    try {
      await api.patch(`/notifications/user/${userId}/read-all`);
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error);
      throw error;
    }
  }

  // Créer une nouvelle notification
  async createNotification(data: CreateNotificationRequest): Promise<Notification> {
    try {
      const response = await api.post('/notifications', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de notification:', error);
      throw error;
    }
  }

  // Supprimer une notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de notification:', error);
      throw error;
    }
  }

  // Récupérer le nombre de notifications non lues
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await api.get(`/notifications/user/${userId}/unread-count`);
      return response.data.unreadCount;
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de notifications:', error);
      return 0;
    }
  }
}

export default new NotificationService(); 
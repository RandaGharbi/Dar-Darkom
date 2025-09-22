import { getFullUrl } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationSettings {
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  deliveryUpdates: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: boolean;
  quietStartTime: string;
  quietEndTime: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'order_update' | 'promotion' | 'delivery_update' | 'general' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
}

class NotificationService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Récupérer les notifications de l'utilisateur
   */
  async getNotifications(
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<NotificationsResponse> {
    try {
      const response = await fetch(
        `${getFullUrl('/api/notifications')}?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`,
        {
          method: 'GET',
          headers: await this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  /**
   * Récupérer les paramètres de notification
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await fetch(getFullUrl('/api/notifications/settings'), {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour les paramètres de notification
   */
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      const response = await fetch(getFullUrl('/api/notifications/settings'), {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres:', error);
      throw error;
    }
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await fetch(getFullUrl(`/api/notifications/${notificationId}/read`), {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      throw error;
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(): Promise<{ modifiedCount: number }> {
    try {
      const response = await fetch(getFullUrl('/api/notifications/read-all'), {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
      throw error;
    }
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const response = await fetch(getFullUrl(`/api/notifications/${notificationId}`), {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      throw error;
    }
  }

  /**
   * Supprimer toutes les notifications lues
   */
  async deleteReadNotifications(): Promise<{ deletedCount: number }> {
    try {
      const response = await fetch(getFullUrl('/api/notifications/read'), {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur lors de la suppression des notifications:', error);
      throw error;
    }
  }

  /**
   * Ajouter un token de device pour les notifications push
   */
  async addDeviceToken(token: string): Promise<void> {
    try {
      const response = await fetch(getFullUrl('/api/notifications/device-token'), {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du token:', error);
      throw error;
    }
  }

  /**
   * Supprimer un token de device
   */
  async removeDeviceToken(token: string): Promise<void> {
    try {
      const response = await fetch(getFullUrl('/api/notifications/device-token'), {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
      throw error;
    }
  }

  /**
   * Créer une notification de test (pour le développement)
   */
  async createTestNotification(
    type: 'order_update' | 'promotion' | 'delivery_update' | 'general' | 'system' = 'general',
    title: string = 'Notification de test',
    message: string = 'Ceci est une notification de test'
  ): Promise<Notification> {
    try {
      const response = await fetch(getFullUrl('/api/notifications/test'), {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ type, title, message }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur lors de la création de la notification de test:', error);
      throw error;
    }
  }

  /**
   * Sauvegarder les paramètres localement
   */
  async saveSettingsLocally(settings: NotificationSettings): Promise<void> {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
    }
  }

  /**
   * Charger les paramètres localement
   */
  async loadSettingsLocally(): Promise<NotificationSettings | null> {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Erreur lors du chargement local:', error);
      return null;
    }
  }
}

export default new NotificationService();

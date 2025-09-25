import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from './notificationService';
import socketService from './socketService';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface PushNotificationData {
  title: string;
  body: string;
  data?: any;
  type: 'order_update' | 'promotion' | 'delivery_update' | 'general' | 'system';
}

class PushNotificationService {
  private expoPushToken: string | null = null;
  private isInitialized: boolean = false;

  /**
   * Initialiser le service de notifications push
   */
  async initialize(): Promise<string | null> {
    try {
      if (this.isInitialized) {
        return this.expoPushToken;
      }

      // Vérifier si l'appareil supporte les notifications
      if (!Device.isDevice) {
        console.log('Les notifications push ne fonctionnent que sur un appareil physique');
        return null;
      }

      // Demander les permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission de notification refusée');
        return null;
      }

      // Obtenir le token Expo Push
      this.expoPushToken = await this.getExpoPushToken();
      
      if (this.expoPushToken) {
        // Enregistrer le token sur le serveur
        await this.registerTokenOnServer(this.expoPushToken);
        
        // Configurer les écouteurs de notifications
        this.setupNotificationListeners();
        this.isInitialized = true;
      }

      return this.expoPushToken;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des notifications push:', error);
      return null;
    }
  }

  /**
   * Obtenir le token Expo Push
   */
  private async getExpoPushToken(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      return token.data;
    } catch (error) {
      console.error('Erreur lors de l\'obtention du token Expo Push:', error);
      return null;
    }
  }

  /**
   * Enregistrer le token sur le serveur
   */
  private async registerTokenOnServer(token: string): Promise<void> {
    try {
      await notificationService.addDeviceToken(token);
      console.log('Token enregistré sur le serveur:', token);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du token:', error);
    }
  }

  /**
   * Configurer les écouteurs de notifications
   */
  private setupNotificationListeners(): void {
    // Notification reçue en arrière-plan
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue:', notification);
      this.handleNotificationReceived(notification);
    });

    // Notification tapée par l'utilisateur
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapée:', response);
      this.handleNotificationTapped(response);
    });

    // Écouter les notifications WebSocket
    socketService.onNotification((notification) => {
      this.handleWebSocketNotification(notification);
    });

    // Écouter les mises à jour de commande
    socketService.onOrderUpdate((data) => {
      this.handleOrderUpdate(data);
    });

    // Écouter les mises à jour de livraison
    socketService.onDeliveryUpdate((data) => {
      this.handleDeliveryUpdate(data);
    });

    // Écouter les promotions
    socketService.onPromotion((data) => {
      this.handlePromotion(data);
    });
  }

  /**
   * Gérer une notification reçue
   */
  private handleNotificationReceived(notification: Notifications.Notification): void {
    const { title, body, data } = notification.request.content;
    
    // Créer une notification locale pour l'affichage
    this.createLocalNotification({
      title: title || 'Nouvelle notification',
      body: body || '',
      data: data || {},
      type: data?.type || 'general'
    });
  }

  /**
   * Gérer une notification WebSocket
   */
  private handleWebSocketNotification(notification: any): void {
    this.createLocalNotification({
      title: notification.title,
      body: notification.message,
      type: notification.type,
      data: notification.data
    });
  }

  /**
   * Gérer une mise à jour de commande
   */
  private handleOrderUpdate(data: any): void {
    const statusMessages: { [key: string]: string } = {
      'confirmed': 'Commande confirmée',
      'preparing': 'Commande en préparation',
      'ready': 'Commande prête',
      'out_for_delivery': 'Commande en cours de livraison',
      'delivered': 'Commande livrée',
      'cancelled': 'Commande annulée'
    };

    const title = statusMessages[data.status] || 'Mise à jour de commande';
    const message = data.message || `Votre commande #${data.orderId} a été ${data.status}`;

    this.createLocalNotification({
      title,
      body: message,
      type: 'order_update',
      data: { orderId: data.orderId, status: data.status }
    });
  }

  /**
   * Gérer une mise à jour de livraison
   */
  private handleDeliveryUpdate(data: any): void {
    this.createLocalNotification({
      title: 'Livreur en route',
      body: `${data.driverName} est en route. Livraison estimée dans ${data.estimatedTime}`,
      type: 'delivery_update',
      data: { orderId: data.orderId, driverName: data.driverName }
    });
  }

  /**
   * Gérer une promotion
   */
  private handlePromotion(data: any): void {
    this.createLocalNotification({
      title: data.title || 'Nouvelle promotion',
      body: data.message || 'Découvrez notre nouvelle offre spéciale !',
      type: 'promotion',
      data: { promotionId: data.promotionId }
    });
  }

  /**
   * Gérer une notification tapée
   */
  private handleNotificationTapped(response: Notifications.NotificationResponse): void {
    const { data } = response.notification.request.content;
    
    // Naviguer vers la page appropriée selon le type de notification
    if (data?.type === 'order_update' && data?.orderId) {
      // Naviguer vers la page de commande
      console.log('Navigation vers la commande:', data.orderId);
    } else if (data?.type === 'promotion' && data?.promotionId) {
      // Naviguer vers la page de promotion
      console.log('Navigation vers la promotion:', data.promotionId);
    }
  }

  /**
   * Créer une notification locale
   */
  async createLocalNotification(notificationData: PushNotificationData): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data,
          sound: 'default',
        },
        trigger: null, // Immédiat
      });
    } catch (error) {
      console.error('Erreur lors de la création de la notification locale:', error);
    }
  }

  /**
   * Envoyer une notification de test
   */
  async sendTestNotification(): Promise<void> {
    await this.createLocalNotification({
      title: 'Test de notification',
      body: 'Ceci est une notification de test',
      type: 'general',
      data: { test: true }
    });
  }

  /**
   * Programmer une notification
   */
  async scheduleNotification(
    notificationData: PushNotificationData,
    triggerDate: Date
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data,
          sound: 'default',
        },
        trigger: {
          date: triggerDate,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la programmation de la notification:', error);
    }
  }

  /**
   * Annuler toutes les notifications programmées
   */
  async cancelAllScheduledNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erreur lors de l\'annulation des notifications:', error);
    }
  }

  /**
   * Obtenir le token actuel
   */
  getToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Vérifier si les notifications sont activées
   */
  async areNotificationsEnabled(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Demander les permissions de notification
   */
  async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }
}

export default new PushNotificationService();
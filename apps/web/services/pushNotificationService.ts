import type { Notification } from '../types/notifications';

class PushNotificationService {
  private isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Notifications push non supportées');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }

  async showNotification(notification: Notification): Promise<void> {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return;
    }

    try {
      const pushNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico', // Icône de l'application
        badge: '/favicon.ico',
        tag: notification._id, // Éviter les doublons
        requireInteraction: false,
        silent: false,
        data: notification.metadata,
      });

      // Gérer les clics sur la notification
      pushNotification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        
        // Naviguer vers la page appropriée selon le type de notification
        if (notification.metadata?.orderId) {
          window.location.href = `/orders/${notification.metadata.orderId}`;
        } else if (notification.metadata?.productId) {
          window.location.href = `/products/${notification.metadata.productId}`;
        } else {
          window.location.href = '/'; // Page d'accueil par défaut
        }
        
        pushNotification.close();
      };

      // Auto-fermeture après 5 secondes
      setTimeout(() => {
        pushNotification.close();
      }, 5000);

    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification push:', error);
    }
  }

  async showCustomNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: false,
        silent: false,
        ...options,
      });

      // Auto-fermeture après 5 secondes
      setTimeout(() => {
        notification.close();
      }, 5000);

    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification personnalisée:', error);
    }
  }

  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }
    return Notification.permission;
  }

  async registerServiceWorker(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker enregistré:', registration);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
      return false;
    }
  }
}

export default new PushNotificationService(); 
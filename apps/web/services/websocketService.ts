import { Notification } from '../types/notifications';

type NotificationCallback = (notification: Notification) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private callbacks: NotificationCallback[] = [];

  connect(userId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // Utiliser l'URL de l'API pour le WebSocket
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';
      this.ws = new WebSocket(`${wsUrl}/notifications?userId=${userId}`);

      this.ws.onopen = () => {
        console.log('WebSocket connecté pour les notifications');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            this.notifyCallbacks(data.notification);
          }
        } catch (error) {
          console.error('Erreur parsing message WebSocket:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket déconnecté');
        this.attemptReconnect(userId);
      };

      this.ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
      };
    } catch (error) {
      console.error('Erreur connexion WebSocket:', error);
      this.attemptReconnect(userId);
    }
  }

  private attemptReconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect(userId);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Nombre maximum de tentatives de reconnexion atteint');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(callback: NotificationCallback) {
    this.callbacks.push(callback);
    
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  private notifyCallbacks(notification: Notification) {
    this.callbacks.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Erreur dans callback notification:', error);
      }
    });
  }

  // Méthode pour simuler des notifications (pour le développement)
  simulateNotification(userId: string, type: Notification['type'] = 'activity') {
    const mockNotification: Notification = {
      _id: `sim-${Date.now()}`,
      userId,
      type,
      title: this.getMockTitle(type),
      message: this.getMockMessage(type),
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: this.getMockMetadata(type),
    };

    this.notifyCallbacks(mockNotification);
  }

  private getMockTitle(type: Notification['type']): string {
    switch (type) {
      case 'order':
        return 'Nouvelle commande Guerlain';
      case 'stock':
        return 'Alerte stock produit';
      case 'user':
        return 'Nouveau client Guerlain';
      case 'system':
        return 'Mise à jour boutique';
      case 'payment':
        return 'Paiement reçu';
      case 'product':
        return 'Produit Guerlain mis à jour';
      case 'activity':
        return 'Activité boutique';
      default:
        return 'Notification Guerlain';
    }
  }

  private getMockMessage(type: Notification['type']): string {
    switch (type) {
      case 'order':
        return `Commande #${Math.floor(Math.random() * 90000) + 10000} - Parfum Guerlain`;
      case 'stock':
        return 'Stock faible : Crème Hydratante Guerlain';
      case 'user':
        return 'Nouveau client inscrit sur la boutique';
      case 'system':
        return 'Mise à jour du système boutique';
      case 'payment':
        return 'Paiement sécurisé reçu';
      case 'product':
        return 'Mise à jour : Collection Abeille Royale';
      case 'activity':
        return 'Nouvelle vente enregistrée';
      default:
        return 'Nouvelle notification boutique';
    }
  }

  private getMockMetadata(type: Notification['type']) {
    switch (type) {
      case 'order':
        return { orderId: `order-${Date.now()}` };
      case 'product':
        return { productId: `product-${Date.now()}` };
      case 'user':
        return { userId: `user-${Date.now()}` };
      default:
        return {};
    }
  }
}

export default new WebSocketService(); 
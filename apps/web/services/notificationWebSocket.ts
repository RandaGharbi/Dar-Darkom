import { Notification } from '../types/notifications';

type NotificationCallback = (notification: Notification) => void;
type ConnectionCallback = (connected: boolean) => void;

class NotificationWebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private notificationCallbacks: NotificationCallback[] = [];
  private connectionCallbacks: ConnectionCallback[] = [];
  private isConnecting = false;

  constructor() {
    // Utiliser l'URL WebSocket du backend
    this.url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws/notifications';
  }

  // Se connecter au WebSocket
  connect(userId: string, token: string) {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    
    try {
      // Ajouter l'utilisateur et le token à l'URL
      const wsUrl = `${this.url}?userId=${userId}&token=${token}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connecté pour les notifications');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.notifyConnectionCallbacks(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'notification') {
            const notification: Notification = data.notification;
            this.notifyNotificationCallbacks(notification);
          } else if (data.type === 'ping') {
            // Répondre au ping pour maintenir la connexion
            this.send({ type: 'pong' });
          }
        } catch (error) {
          console.error('Erreur lors du parsing du message WebSocket:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket fermé:', event.code, event.reason);
        this.isConnecting = false;
        this.notifyConnectionCallbacks(false);
        
        // Tentative de reconnexion si ce n'était pas une fermeture volontaire
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect(userId, token);
        }
      };

      this.ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
        this.isConnecting = false;
        this.notifyConnectionCallbacks(false);
      };

    } catch (error) {
      console.error('Erreur lors de la connexion WebSocket:', error);
      this.isConnecting = false;
    }
  }

  // Programmer une reconnexion
  private scheduleReconnect(userId: string, token: string) {
    this.reconnectAttempts++;
    console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${this.reconnectInterval}ms`);
    
    setTimeout(() => {
      this.connect(userId, token);
    }, this.reconnectInterval);
  }

  // Envoyer un message
  private send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  // Se déconnecter
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Déconnexion volontaire');
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Empêcher la reconnexion
  }

  // S'abonner aux nouvelles notifications
  onNotification(callback: NotificationCallback) {
    this.notificationCallbacks.push(callback);
    
    // Retourner une fonction de désabonnement
    return () => {
      const index = this.notificationCallbacks.indexOf(callback);
      if (index > -1) {
        this.notificationCallbacks.splice(index, 1);
      }
    };
  }

  // S'abonner aux changements de connexion
  onConnectionChange(callback: ConnectionCallback) {
    this.connectionCallbacks.push(callback);
    
    // Retourner une fonction de désabonnement
    return () => {
      const index = this.connectionCallbacks.indexOf(callback);
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1);
      }
    };
  }

  // Notifier les callbacks de notification
  private notifyNotificationCallbacks(notification: Notification) {
    this.notificationCallbacks.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Erreur dans le callback de notification:', error);
      }
    });
  }

  // Notifier les callbacks de connexion
  private notifyConnectionCallbacks(connected: boolean) {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Erreur dans le callback de connexion:', error);
      }
    });
  }

  // Vérifier si connecté
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Obtenir l'état de la connexion
  getConnectionState(): string {
    if (!this.ws) return 'CLOSED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'OPEN';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  }
}

// Instance singleton
export default new NotificationWebSocketService();
